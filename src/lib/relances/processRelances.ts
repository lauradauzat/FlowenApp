/**
 * Epic 7: Traitement des relances automatiques (cron).
 * À appeler depuis POST /api/relances/process.
 * Campagnes relanceEnabled=true, status=COMPLETED.
 * Pour chaque destinataire éligible (sans réponse, numRelances < relanceMax, délai dépassé):
 * crée un CampaignSend (sendOrder=numRelances+1), envoie le mail, met à jour SENT/FAILED.
 */

import { prisma } from '@/lib/prisma/client';
import { selectTemplateVariant } from '@/lib/utils/templateVariables';
import { renderTemplate } from '@/lib/utils/templateVariables';
import { buildTemplateData } from '@/lib/campaigns/buildTemplateData';
import { sendEmail } from '@/lib/services/emailService';

function pickSubjectBody(
  template: { subject: string; body: string },
  variants: Array<{ capacityCategory: string | null; region: string | null; style: string | null; subject: string; body: string; order: number }>,
  venue: { capacity: number | null; region: string | null; style: string | null }
): { subject: string; body: string } {
  const v = selectTemplateVariant(
    variants.map((x) => ({ ...x, order: x.order })),
    { capacity: venue.capacity ?? null, region: venue.region, style: venue.style }
  );
  if (v) return { subject: v.subject, body: v.body };
  return { subject: template.subject, body: template.body };
}

export type ProcessRelancesResult = { campaigns: number; sent: number; failed: number; skipped: number };

export async function processRelances(): Promise<ProcessRelancesResult> {
  const out: ProcessRelancesResult = { campaigns: 0, sent: 0, failed: 0, skipped: 0 };

  const campaigns = await prisma.campaign.findMany({
    where: { relanceEnabled: true, status: 'COMPLETED' },
    include: {
      mailTemplate: { include: { variants: { orderBy: { order: 'asc' } } } },
      relanceTemplate: { include: { variants: { orderBy: { order: 'asc' } } } },
      project: true,
      recipients: {
        include: { contact: true, venue: true, sends: true, responses: true },
      },
    },
  });

  const now = new Date();

  for (const c of campaigns) {
    const relanceMax = c.relanceMax ?? Infinity;
    const firstDays = c.relanceFirstDelayDays;
    const nextDays = c.relanceNextDelayDays;
    const t = c.relanceTemplate ?? c.mailTemplate;
    const variants = t.variants.map((x) => ({
      capacityCategory: x.capacityCategory,
      region: x.region,
      style: x.style,
      subject: x.subject,
      body: x.body,
      order: x.order,
    }));

    for (const r of c.recipients) {
      if (r.responses.length > 0) {
        out.skipped += 1;
        continue;
      }
      const numRelances = r.sends.filter((s) => s.sendOrder >= 1).length;
      if (numRelances >= relanceMax) {
        out.skipped += 1;
        continue;
      }
      const delayDays = numRelances === 0 ? firstDays : nextDays;
      if (delayDays == null) {
        out.skipped += 1;
        continue;
      }
      const lastSend = r.sends
        .filter((s) => s.sentAt != null || s.createdAt)
        .sort((a, b) => (b.sentAt ?? b.createdAt).getTime() - (a.sentAt ?? a.createdAt).getTime())[0];
      const lastSendAt = lastSend ? (lastSend.sentAt ?? lastSend.createdAt) : null;
      if (!lastSendAt) {
        out.skipped += 1;
        continue;
      }
      const nextDue = new Date(lastSendAt);
      nextDue.setDate(nextDue.getDate() + delayDays);
      if (now < nextDue) {
        out.skipped += 1;
        continue;
      }
      const email = r.contact.email;
      if (!email?.trim()) {
        out.skipped += 1;
        continue;
      }

      const { subject: s, body: b } = pickSubjectBody(t, variants, r.venue);
      const data = buildTemplateData(r.contact, r.venue, c.project ? { name: c.project.name, type: c.project.type } : undefined);
      const { subject, body } = renderTemplate(s, b, data);

      const result = await sendEmail({ to: email, subject, body });
      await prisma.campaignSend.create({
        data: {
          campaignRecipientId: r.id,
          sendOrder: numRelances + 1,
          status: result.ok ? 'SENT' : 'FAILED',
          subject,
          body,
          sentAt: result.ok ? new Date() : null,
          errorMessage: result.ok ? null : result.error,
        },
      });
      if (result.ok) out.sent += 1;
      else out.failed += 1;
    }
    out.campaigns += 1;
  }

  return out;
}
