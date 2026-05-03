import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { sendEmail } from '@/lib/services/emailService';
import { UnauthorizedError } from '@/lib/errors';

const BATCH_SIZE = 10;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth();
    const { id: campaignId } = await params;

    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!campaign) {
      return NextResponse.json({ error: 'Campagne non trouvée' }, { status: 404 });
    }

    const sendSettings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { mailingFrom: true },
    });
    const mailFrom = sendSettings?.mailingFrom?.trim() || undefined;
    if (campaign.status !== 'RUNNING') {
      return NextResponse.json(
        { error: 'La campagne n\'est pas en cours d\'envoi' },
        { status: 400 }
      );
    }

    const pending = await prisma.campaignSend.findMany({
      where: {
        status: 'PENDING',
        campaignRecipient: { campaignId },
      },
      include: {
        campaignRecipient: { include: { contact: true } },
      },
      take: BATCH_SIZE,
    });

    let processed = 0;
    for (const s of pending) {
      const email = s.campaignRecipient.contact.email;
      if (!email) {
        await prisma.campaignSend.update({
          where: { id: s.id },
          data: { status: 'FAILED', errorMessage: 'Contact sans adresse email' },
        });
        processed++;
        continue;
      }
      const result = await sendEmail({
        to: email,
        subject: s.subject,
        body: s.body,
        from: mailFrom,
      });
      await prisma.campaignSend.update({
        where: { id: s.id },
        data: {
          status: result.ok ? 'SENT' : 'FAILED',
          sentAt: result.ok ? new Date() : null,
          errorMessage: result.ok ? null : result.error,
        },
      });
      processed++;
      // Petit délai pour limiter le rate limiting
      if (processed < pending.length) await new Promise((r) => setTimeout(r, 200));
    }

    const remaining = await prisma.campaignSend.count({
      where: {
        status: 'PENDING',
        campaignRecipient: { campaignId },
      },
    });

    if (remaining === 0) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json({
      processed,
      remaining,
      campaignStatus: remaining === 0 ? 'COMPLETED' : 'RUNNING',
    });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    console.error('Error process-send:', e);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi' },
      { status: 500 }
    );
  }
}
