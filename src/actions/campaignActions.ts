'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { NotFoundError } from '@/lib/errors';
import {
  createCampaignSchema,
  updateCampaignSchema,
  launchCampaignSchema,
  createCampaignResponseSchema,
  updateCampaignResponseSchema,
  createTourDateSchema,
  deleteTourDateSchema,
  retryCampaignSendSchema,
  sendManualRelancesSchema,
} from '@/lib/validations/campaign';
import { selectTemplateVariant, renderTemplate } from '@/lib/utils/templateVariables';
import { buildTemplateData } from '@/lib/campaigns/buildTemplateData';
import { sendEmail } from '@/lib/services/emailService';

type ActionResult<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

function toError(e: unknown): { code: string; message: string } {
  if (e instanceof Error) {
    if (e.name === 'ZodError') return { code: 'VALIDATION_ERROR', message: e.message };
    if (e instanceof NotFoundError) return { code: 'NOT_FOUND', message: e.message };
    return { code: 'ERROR', message: e.message };
  }
  return { code: 'UNKNOWN', message: 'Une erreur est survenue' };
}

export async function getCampaigns(): Promise<
  ActionResult<{ campaigns: Array<{ id: string; name: string; status: string; createdAt: Date; mailTemplateId: string }> }>
> {
  try {
    const userId = await requireAuth();
    const list = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, status: true, createdAt: true, mailTemplateId: true },
    });
    return { success: true, data: { campaigns: list.map((c) => ({ ...c, status: c.status })) } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export type RecipientClassification = 'repondant' | 'non_repondant' | 'en_attente';

function computeClassification(
  hasResponse: boolean,
  lastSendAt: Date | null,
  numRelances: number,
  relanceFirstDelayDays: number | null,
  relanceNextDelayDays: number | null
): RecipientClassification {
  if (hasResponse) return 'repondant';
  if (lastSendAt == null) return 'en_attente';
  const delayDays = numRelances === 0 ? relanceFirstDelayDays : relanceNextDelayDays;
  if (delayDays == null) return 'en_attente';
  const nextDue = new Date(lastSendAt);
  nextDue.setDate(nextDue.getDate() + delayDays);
  return new Date() >= nextDue ? 'non_repondant' : 'en_attente';
}

export async function getCampaign(
  id: string,
  filters?: { classification?: RecipientClassification }
): Promise<
  ActionResult<{
    id: string;
    name: string;
    status: string;
    mailTemplateId: string;
    projectId: string | null;
    createdAt: Date;
    updatedAt: Date;
    relanceEnabled: boolean;
    relanceFirstDelayDays: number | null;
    relanceNextDelayDays: number | null;
    relanceMax: number | null;
    relanceTemplateId: string | null;
    mailTemplate: { name: string; subject: string; body: string };
    project: { id: string; name: string } | null;
    recipients: Array<{
      id: string;
      contactId: string;
      venueId: string;
      contact: { firstName: string; lastName: string; email: string | null };
      venue: { name: string; region: string | null; capacity: number | null; style: string | null };
      hasResponse: boolean;
      numRelances: number;
      lastSendAt: Date | null;
      lastSendOrder: number;
      classification: RecipientClassification;
    }>;
    stats: { total: number; sent: number; failed: number; pending: number; responses: number };
  }>
> {
  try {
    const userId = await requireAuth();
    const c = await prisma.campaign.findFirst({
      where: { id, userId },
      include: {
        mailTemplate: { select: { name: true, subject: true, body: true } },
        project: { select: { id: true, name: true } },
        recipients: {
          include: {
            contact: { select: { firstName: true, lastName: true, email: true } },
            venue: { select: { name: true, region: true, capacity: true, style: true } },
            sends: { orderBy: { createdAt: 'desc' } },
            responses: true,
          },
        },
      },
    });
    if (!c) throw new NotFoundError('Campagne non trouvée');

    // Stats: count sends by status across all recipients
    const sendCounts = await prisma.campaignSend.groupBy({
      by: ['status'],
      where: { campaignRecipient: { campaignId: id } },
      _count: true,
    });
    const byStatus: Record<string, number> = { PENDING: 0, SENT: 0, FAILED: 0 };
    for (const row of sendCounts) byStatus[row.status] = row._count;

    const responseCount = await prisma.campaignResponse.count({ where: { campaignId: id } });
    const total = c.recipients.length;

    let recipients = c.recipients.map((r) => {
      const hasResponse = r.responses.length > 0;
      const numRelances = r.sends.filter((s) => s.sendOrder >= 1).length;
      const lastSend = r.sends[0] ?? null; // sends triés desc par createdAt
      const lastSendAt = lastSend
        ? lastSend.sentAt ?? lastSend.createdAt
        : null;
      const lastSendOrder = lastSend?.sendOrder ?? 0;
      const classification = computeClassification(
        hasResponse,
        lastSendAt,
        numRelances,
        c.relanceFirstDelayDays,
        c.relanceNextDelayDays
      );
      return {
        id: r.id,
        contactId: r.contactId,
        venueId: r.venueId,
        contact: r.contact,
        venue: r.venue,
        hasResponse,
        numRelances,
        lastSendAt,
        lastSendOrder,
        classification,
      };
    });

    if (filters?.classification) {
      recipients = recipients.filter((r) => r.classification === filters.classification);
    }

    return {
      success: true,
      data: {
        id: c.id,
        name: c.name,
        status: c.status,
        mailTemplateId: c.mailTemplateId,
        projectId: c.projectId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        relanceEnabled: c.relanceEnabled,
        relanceFirstDelayDays: c.relanceFirstDelayDays,
        relanceNextDelayDays: c.relanceNextDelayDays,
        relanceMax: c.relanceMax,
        relanceTemplateId: c.relanceTemplateId,
        mailTemplate: c.mailTemplate,
        project: c.project,
        recipients,
        stats: {
          total,
          sent: byStatus.SENT,
          failed: byStatus.FAILED,
          pending: byStatus.PENDING,
          responses: responseCount,
        },
      },
    };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function createCampaign(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = createCampaignSchema.parse(input);
    const t = await prisma.mailTemplate.findFirst({ where: { id: v.mailTemplateId, userId } });
    if (!t) throw new NotFoundError('Template non trouvé');
    if (v.projectId) {
      const p = await prisma.project.findFirst({ where: { id: v.projectId, userId } });
      if (!p) throw new NotFoundError('Projet non trouvé');
    }
    const campaign = await prisma.campaign.create({
      data: {
        userId,
        name: v.name,
        mailTemplateId: v.mailTemplateId,
        projectId: v.projectId ?? null,
        status: 'DRAFT',
      },
    });
    return { success: true, data: { id: campaign.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function updateCampaign(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = updateCampaignSchema.parse(input);
    const existing = await prisma.campaign.findFirst({ where: { id: v.id, userId } });
    if (!existing) throw new NotFoundError('Campagne non trouvée');
    if (existing.status !== 'DRAFT') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Seules les campagnes en brouillon peuvent être modifiées' } };
    }
    await prisma.campaign.update({
      where: { id: v.id },
      data: {
        ...(v.name != null && { name: v.name }),
        ...(v.mailTemplateId != null && { mailTemplateId: v.mailTemplateId }),
        ...(v.projectId !== undefined && { projectId: v.projectId }),
        ...(v.relanceEnabled !== undefined && { relanceEnabled: v.relanceEnabled }),
        ...(v.relanceFirstDelayDays !== undefined && { relanceFirstDelayDays: v.relanceFirstDelayDays }),
        ...(v.relanceNextDelayDays !== undefined && { relanceNextDelayDays: v.relanceNextDelayDays }),
        ...(v.relanceMax !== undefined && { relanceMax: v.relanceMax }),
        ...(v.relanceTemplateId !== undefined && { relanceTemplateId: v.relanceTemplateId }),
      },
    });
    return { success: true, data: { id: v.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function deleteCampaign(input: { id: string }): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const c = await prisma.campaign.findFirst({ where: { id: input.id, userId } });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    if (c.status === 'RUNNING') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Impossible de supprimer une campagne en cours' } };
    }
    await prisma.campaign.delete({ where: { id: input.id } });
    return { success: true, data: { id: input.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

// Filtres: region[], capacityCategory[] (petite,moyenne,grande), style[]
// Retourne les paires (contact, venue) via ContactVenue, contact avec email, venues qui matchent
export async function getCampaignFilterOptions(): Promise<
  ActionResult<{ regions: string[]; styles: string[] }>
> {
  try {
    const userId = await requireAuth();
    const venues = await prisma.venue.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { region: true, style: true },
    });
    const regions = [...new Set(venues.map((v) => v.region).filter(Boolean))] as string[];
    const styles = [...new Set(venues.map((v) => v.style).filter(Boolean))] as string[];
    regions.sort();
    styles.sort();
    return { success: true, data: { regions, styles } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function computeRecipientsFromFilters(input: {
  userId: string;
  region?: string[];
  capacityCategory?: ('petite' | 'moyenne' | 'grande')[];
  style?: string[];
}): Promise<Array<{ contactId: string; venueId: string; contact: { firstName: string; lastName: string; email: string }; venue: { name: string; region: string | null; capacity: number | null; style: string | null } }>> {
  const { capacityToCategory } = await import('@/lib/utils/templateVariables');
  const cv = await prisma.contactVenue.findMany({
    where: {
      contact: { userId: input.userId, status: 'ACTIVE', email: { not: null } },
      venue: { userId: input.userId, status: 'ACTIVE' },
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      venue: { select: { id: true, name: true, region: true, capacity: true, style: true } },
    },
  });
  let out = cv
    .filter((r) => r.contact.email && r.contact.email.trim() !== '')
    .map((r) => ({
      contactId: r.contact.id,
      venueId: r.venue.id,
      contact: { firstName: r.contact.firstName, lastName: r.contact.lastName, email: r.contact.email! },
      venue: { name: r.venue.name, region: r.venue.region, capacity: r.venue.capacity, style: r.venue.style },
    }));

  if (input.region && input.region.length > 0) {
    const set = new Set(input.region);
    out = out.filter((o) => o.venue.region != null && set.has(o.venue.region));
  }
  if (input.capacityCategory && input.capacityCategory.length > 0) {
    const set = new Set(input.capacityCategory);
    out = out.filter((o) => {
      const cat = capacityToCategory(o.venue.capacity);
      return cat != null && set.has(cat);
    });
  }
  if (input.style && input.style.length > 0) {
    const set = new Set(input.style.map((s) => s.toLowerCase()));
    out = out.filter((o) => o.venue.style != null && set.has(o.venue.style.toLowerCase()));
  }
  return out;
}

export async function setRecipients(input: {
  campaignId: string;
  pairs: Array<{ contactId: string; venueId: string }>;
}): Promise<ActionResult<{ count: number }>> {
  try {
    const userId = await requireAuth();
    const c = await prisma.campaign.findFirst({ where: { id: input.campaignId, userId } });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    if (c.status !== 'DRAFT') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Destinataires modifiables uniquement en brouillon' } };
    }
    await prisma.campaignRecipient.deleteMany({ where: { campaignId: input.campaignId } });
    const seen = new Set<string>();
    for (const p of input.pairs) {
      const k = `${p.contactId}:${p.venueId}`;
      if (seen.has(k)) continue;
      seen.add(k);
      await prisma.campaignRecipient.create({
        data: { campaignId: input.campaignId, contactId: p.contactId, venueId: p.venueId },
      });
    }
    return { success: true, data: { count: seen.size } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function setRecipientsFromFilters(input: {
  campaignId: string;
  region?: string[];
  capacityCategory?: ('petite' | 'moyenne' | 'grande')[];
  style?: string[];
}): Promise<ActionResult<{ count: number }>> {
  try {
    const userId = await requireAuth();
    const c = await prisma.campaign.findFirst({ where: { id: input.campaignId, userId } });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    if (c.status !== 'DRAFT') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Destinataires modifiables uniquement en brouillon' } };
    }
    const list = await computeRecipientsFromFilters({ userId, ...input });
    return setRecipients({
      campaignId: input.campaignId,
      pairs: list.map((x) => ({ contactId: x.contactId, venueId: x.venueId })),
    });
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

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

export async function launchCampaign(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const { id } = launchCampaignSchema.parse(input);
    const c = await prisma.campaign.findFirst({
      where: { id, userId },
      include: {
        mailTemplate: { include: { variants: { orderBy: { order: 'asc' } } } },
        project: true,
        recipients: { include: { contact: true, venue: true } },
      },
    });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    if (c.status !== 'DRAFT') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Seules les campagnes en brouillon peuvent être lancées' } };
    }
    const recipients = c.recipients;
    if (recipients.length === 0) {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Aucun destinataire. Ajoutez des destinataires avant de lancer.' } };
    }
    const t = c.mailTemplate;
    const project = c.project;
    const vars = t.variants.map((x) => ({
      capacityCategory: x.capacityCategory,
      region: x.region,
      style: x.style,
      subject: x.subject,
      body: x.body,
      order: x.order,
    }));
    for (const r of recipients) {
      const { subject: s, body: b } = pickSubjectBody(t, vars, r.venue);
      const data = buildTemplateData(r.contact, r.venue, project ? { name: project.name, type: project.type } : undefined);
      const { subject, body } = renderTemplate(s, b, data);
      await prisma.campaignSend.create({
        data: {
          campaignRecipientId: r.id,
          sendOrder: 0,
          status: 'PENDING',
          subject,
          body,
        },
      });
    }
    await prisma.campaign.update({ where: { id }, data: { status: 'RUNNING' } });
    return { success: true, data: { id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function createCampaignResponse(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = createCampaignResponseSchema.parse(input);
    const camp = await prisma.campaign.findFirst({ where: { id: v.campaignId, userId } });
    if (!camp) throw new NotFoundError('Campagne non trouvée');
    const r = await prisma.campaignResponse.create({
      data: {
        campaignId: v.campaignId,
        campaignRecipientId: v.campaignRecipientId ?? null,
        contactId: v.contactId,
        venueId: v.venueId,
        type: v.type,
        subject: v.subject ?? null,
        content: v.content,
        receivedAt: v.receivedAt,
      },
    });
    return { success: true, data: { id: r.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function updateCampaignResponse(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = updateCampaignResponseSchema.parse(input);
    const r = await prisma.campaignResponse.findFirst({
      where: { id: v.id },
      include: { campaign: true },
    });
    if (!r || r.campaign.userId !== userId) throw new NotFoundError('Réponse non trouvée');
    await prisma.campaignResponse.update({
      where: { id: v.id },
      data: {
        ...(v.type != null && { type: v.type }),
        ...(v.content != null && { content: v.content }),
        ...(v.isDateObtained != null && { isDateObtained: v.isDateObtained }),
      },
    });
    return { success: true, data: { id: v.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getExchangesForContact(contactId: string): Promise<
  ActionResult<
    Array<{
      type: 'send' | 'response';
      id: string;
      date: Date;
      subject: string;
      content: string;
      campaignName: string;
      statusOrType: string;
      venueName: string;
    }>
  >
> {
  try {
    const userId = await requireAuth();
    const contact = await prisma.contact.findFirst({ where: { id: contactId, userId } });
    if (!contact) throw new NotFoundError('Contact non trouvé');
    const [sends, responses] = await Promise.all([
      prisma.campaignSend.findMany({
        where: { campaignRecipient: { contactId } },
        include: { campaignRecipient: { include: { campaign: { select: { name: true } }, venue: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaignResponse.findMany({
        where: { contactId },
        include: { campaign: { select: { name: true } }, venue: { select: { name: true } } },
        orderBy: { receivedAt: 'desc' },
      }),
    ]);
    const items: Array<{ type: 'send' | 'response'; id: string; date: Date; subject: string; content: string; campaignName: string; statusOrType: string; venueName: string }> = [];
    for (const s of sends) {
      items.push({
        type: 'send',
        id: s.id,
        date: s.sentAt ?? s.createdAt,
        subject: s.subject,
        content: s.body.slice(0, 200) + (s.body.length > 200 ? '…' : ''),
        campaignName: s.campaignRecipient.campaign.name,
        statusOrType: s.status,
        venueName: s.campaignRecipient.venue.name,
      });
    }
    for (const r of responses) {
      items.push({
        type: 'response',
        id: r.id,
        date: r.receivedAt,
        subject: r.subject ?? '(sans sujet)',
        content: r.content.slice(0, 200) + (r.content.length > 200 ? '…' : ''),
        campaignName: r.campaign.name,
        statusOrType: r.type,
        venueName: r.venue.name,
      });
    }
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return { success: true, data: items };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getExchangesForVenue(venueId: string): Promise<
  ActionResult<
    Array<{
      type: 'send' | 'response';
      id: string;
      date: Date;
      subject: string;
      content: string;
      campaignName: string;
      statusOrType: string;
      contactName: string;
    }>
  >
> {
  try {
    const userId = await requireAuth();
    const venue = await prisma.venue.findFirst({ where: { id: venueId, userId } });
    if (!venue) throw new NotFoundError('Salle non trouvée');
    const [sends, responses] = await Promise.all([
      prisma.campaignSend.findMany({
        where: { campaignRecipient: { venueId } },
        include: { campaignRecipient: { include: { campaign: { select: { name: true } }, contact: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaignResponse.findMany({
        where: { venueId },
        include: { campaign: { select: { name: true } }, contact: { select: { firstName: true, lastName: true } } },
        orderBy: { receivedAt: 'desc' },
      }),
    ]);
    const items: Array<{ type: 'send' | 'response'; id: string; date: Date; subject: string; content: string; campaignName: string; statusOrType: string; contactName: string }> = [];
    for (const s of sends) {
      items.push({
        type: 'send',
        id: s.id,
        date: s.sentAt ?? s.createdAt,
        subject: s.subject,
        content: s.body.slice(0, 200) + (s.body.length > 200 ? '…' : ''),
        campaignName: s.campaignRecipient.campaign.name,
        statusOrType: s.status,
        contactName: `${s.campaignRecipient.contact.firstName} ${s.campaignRecipient.contact.lastName}`,
      });
    }
    for (const r of responses) {
      items.push({
        type: 'response',
        id: r.id,
        date: r.receivedAt,
        subject: r.subject ?? '(sans sujet)',
        content: r.content.slice(0, 200) + (r.content.length > 200 ? '…' : ''),
        campaignName: r.campaign.name,
        statusOrType: r.type,
        contactName: `${r.contact.firstName} ${r.contact.lastName}`,
      });
    }
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return { success: true, data: items };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getResponsesForContact(contactId: string): Promise<
  ActionResult<Array<{ id: string; campaignId: string; campaignName: string; venueName: string; type: string; subject: string | null; content: string; receivedAt: Date; isDateObtained: boolean }>>
> {
  try {
    const userId = await requireAuth();
    const contact = await prisma.contact.findFirst({ where: { id: contactId, userId } });
    if (!contact) throw new NotFoundError('Contact non trouvé');
    const rows = await prisma.campaignResponse.findMany({
      where: { contactId },
      include: { campaign: { select: { name: true } }, venue: { select: { name: true } } },
      orderBy: { receivedAt: 'desc' },
    });
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        campaignId: r.campaignId,
        campaignName: r.campaign.name,
        venueName: r.venue.name,
        type: r.type,
        subject: r.subject,
        content: r.content,
        receivedAt: r.receivedAt,
        isDateObtained: r.isDateObtained,
      })),
    };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getResponsesForVenue(venueId: string): Promise<
  ActionResult<Array<{ id: string; campaignId: string; campaignName: string; contactName: string; type: string; subject: string | null; content: string; receivedAt: Date; isDateObtained: boolean }>>
> {
  try {
    const userId = await requireAuth();
    const venue = await prisma.venue.findFirst({ where: { id: venueId, userId } });
    if (!venue) throw new NotFoundError('Salle non trouvée');
    const rows = await prisma.campaignResponse.findMany({
      where: { venueId },
      include: { campaign: { select: { name: true } }, contact: { select: { firstName: true, lastName: true } } },
      orderBy: { receivedAt: 'desc' },
    });
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        campaignId: r.campaignId,
        campaignName: r.campaign.name,
        contactName: `${r.contact.firstName} ${r.contact.lastName}`,
        type: r.type,
        subject: r.subject,
        content: r.content,
        receivedAt: r.receivedAt,
        isDateObtained: r.isDateObtained,
      })),
    };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function createTourDate(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = createTourDateSchema.parse(input);
    const [camp, proj] = await Promise.all([
      prisma.campaign.findFirst({ where: { id: v.campaignId, userId } }),
      prisma.project.findFirst({ where: { id: v.projectId, userId } }),
    ]);
    if (!camp) throw new NotFoundError('Campagne non trouvée');
    if (!proj) throw new NotFoundError('Projet non trouvé');
    const td = await prisma.tourDate.create({
      data: {
        userId,
        projectId: v.projectId,
        campaignId: v.campaignId,
        campaignResponseId: v.campaignResponseId ?? null,
        contactId: v.contactId,
        venueId: v.venueId,
        date: v.date,
        notes: v.notes ?? null,
      },
    });
    return { success: true, data: { id: td.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getTourDates(filters?: { projectId?: string; campaignId?: string }): Promise<
  ActionResult<Array<{ id: string; date: Date; venueName: string; contactName: string; campaignName: string; projectName: string }>>
> {
  try {
    const userId = await requireAuth();
    const where: { userId: string; projectId?: string; campaignId?: string } = { userId };
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.campaignId) where.campaignId = filters.campaignId;
    const rows = await prisma.tourDate.findMany({
      where,
      include: { venue: { select: { name: true } }, contact: { select: { firstName: true, lastName: true } }, campaign: { select: { name: true } }, project: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        date: r.date,
        venueName: r.venue.name,
        contactName: `${r.contact.firstName} ${r.contact.lastName}`,
        campaignName: r.campaign.name,
        projectName: r.project.name,
      })),
    };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function deleteTourDate(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = deleteTourDateSchema.parse(input);
    const td = await prisma.tourDate.findFirst({ where: { id: v.id, userId } });
    if (!td) throw new NotFoundError('Date non trouvée');
    await prisma.tourDate.delete({ where: { id: v.id } });
    return { success: true, data: { id: v.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

// Réessayer un envoi en échec: on crée un nouveau CampaignSend et on envoie tout de suite
/** Prévisualise le mail rendu pour un (contact, venue) avec un template. */
export async function previewRenderedMail(input: {
  mailTemplateId: string;
  projectId?: string | null;
  contactId: string;
  venueId: string;
}): Promise<ActionResult<{ subject: string; body: string }>> {
  try {
    const userId = await requireAuth();
    const [t, c, v, proj] = await Promise.all([
      prisma.mailTemplate.findFirst({
        where: { id: input.mailTemplateId, userId },
        include: { variants: { orderBy: { order: 'asc' } } },
      }),
      prisma.contact.findFirst({ where: { id: input.contactId, userId } }),
      prisma.venue.findFirst({ where: { id: input.venueId, userId } }),
      input.projectId ? prisma.project.findFirst({ where: { id: input.projectId, userId } }) : null,
    ]);
    if (!t || !c || !v) throw new NotFoundError('Template, contact ou salle non trouvé');
    const { subject: s, body: b } = pickSubjectBody(t, t.variants, v);
    const data = buildTemplateData(c, v, proj ?? undefined);
    const { subject, body } = renderTemplate(s, b, data);
    return { success: true, data: { subject, body } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function getCampaignSends(
  campaignId: string,
  filters?: { status?: 'PENDING' | 'SENT' | 'FAILED' }
): Promise<
  ActionResult<
    Array<{
      id: string;
      status: string;
      subject: string;
      body: string;
      sentAt: Date | null;
      errorMessage: string | null;
      createdAt: Date;
      contact: { firstName: string; lastName: string; email: string | null };
      venue: { name: string };
    }>
  >
> {
  try {
    const userId = await requireAuth();
    const c = await prisma.campaign.findFirst({ where: { id: campaignId, userId } });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    const where: { campaignRecipient: { campaignId: string }; status?: 'PENDING' | 'SENT' | 'FAILED' } = {
      campaignRecipient: { campaignId },
    };
    if (filters?.status) where.status = filters.status;
    const rows = await prisma.campaignSend.findMany({
      where,
      include: {
        campaignRecipient: {
          include: { contact: { select: { firstName: true, lastName: true, email: true } }, venue: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      data: rows.map((s) => ({
        id: s.id,
        status: s.status,
        subject: s.subject,
        body: s.body,
        sentAt: s.sentAt,
        errorMessage: s.errorMessage,
        createdAt: s.createdAt,
        contact: s.campaignRecipient.contact,
        venue: s.campaignRecipient.venue,
      })),
    };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

export async function retryCampaignSend(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const { campaignSendId } = retryCampaignSendSchema.parse(input);
    const send = await prisma.campaignSend.findFirst({
      where: { id: campaignSendId },
      include: {
        campaignRecipient: {
          include: {
            campaign: true,
            contact: true,
          },
        },
      },
    });
    if (!send || send.campaignRecipient.campaign.userId !== userId) throw new NotFoundError('Envoi non trouvé');
    if (send.status !== 'FAILED') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Seuls les envois en échec peuvent être réessayés' } };
    }
    const email = send.campaignRecipient.contact.email;
    if (!email) {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Contact sans email' } };
    }
    const result = await sendEmail({ to: email, subject: send.subject, body: send.body });
    const newSend = await prisma.campaignSend.create({
      data: {
        campaignRecipientId: send.campaignRecipientId,
        sendOrder: 0,
        status: result.ok ? 'SENT' : 'FAILED',
        subject: send.subject,
        body: send.body,
        sentAt: result.ok ? new Date() : null,
        errorMessage: result.ok ? null : result.error,
      },
    });
    return { success: true, data: { id: newSend.id } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}

/** Epic 7: Envoi de relances manuelles pour des destinataires éligibles (sans réponse, numRelances < relanceMax). */
export async function sendManualRelances(input: unknown): Promise<
  ActionResult<{ sent: number; failed: number; skipped: number }>
> {
  try {
    const userId = await requireAuth();
    const v = sendManualRelancesSchema.parse(input);
    const c = await prisma.campaign.findFirst({
      where: { id: v.campaignId, userId },
      include: {
        mailTemplate: { include: { variants: { orderBy: { order: 'asc' } } } },
        relanceTemplate: { include: { variants: { orderBy: { order: 'asc' } } } },
        project: true,
        recipients: {
          where: { id: { in: v.recipientIds } },
          include: {
            contact: true,
            venue: true,
            sends: true,
            responses: true,
          },
        },
      },
    });
    if (!c) throw new NotFoundError('Campagne non trouvée');
    if (c.status === 'DRAFT') {
      return { success: false, error: { code: 'FORBIDDEN', message: 'Campagne non lancée' } };
    }

    let template: { subject: string; body: string; variants: Array<{ capacityCategory: string | null; region: string | null; style: string | null; subject: string; body: string; order: number }> };
    if (v.templateId) {
      const t = await prisma.mailTemplate.findFirst({
        where: { id: v.templateId, userId },
        include: { variants: { orderBy: { order: 'asc' } } },
      });
      if (!t) throw new NotFoundError('Template non trouvé');
      template = { subject: t.subject, body: t.body, variants: t.variants.map((x) => ({ capacityCategory: x.capacityCategory, region: x.region, style: x.style, subject: x.subject, body: x.body, order: x.order })) };
    } else {
      const t = c.relanceTemplate ?? c.mailTemplate;
      template = { subject: t.subject, body: t.body, variants: t.variants.map((x) => ({ capacityCategory: x.capacityCategory, region: x.region, style: x.style, subject: x.subject, body: x.body, order: x.order })) };
    }

    const relanceMax = c.relanceMax ?? Infinity;
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const r of c.recipients) {
      const hasResponse = r.responses.length > 0;
      const numRelances = r.sends.filter((s) => s.sendOrder >= 1).length;
      if (hasResponse || numRelances >= relanceMax) {
        skipped += 1;
        continue;
      }
      const email = r.contact.email;
      if (!email?.trim()) {
        skipped += 1;
        continue;
      }
      const { subject: s, body: b } = pickSubjectBody(template, template.variants, r.venue);
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
      if (result.ok) sent += 1;
      else failed += 1;
    }

    return { success: true, data: { sent, failed, skipped } };
  } catch (e) {
    return { success: false, error: toError(e) };
  }
}
