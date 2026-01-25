import { NextRequest, NextResponse } from 'next/server';
import { processRelances } from '@/lib/relances/processRelances';

function handleProcess(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET non configuré' },
      { status: 503 }
    );
  }
  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token !== secret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  return processRelances()
    .then((result) => NextResponse.json(result))
    .catch((e) => {
      console.error('Error process relances:', e);
      return NextResponse.json(
        { error: 'Une erreur est survenue lors du traitement des relances' },
        { status: 500 }
      );
    });
}

/**
 * GET /api/relances/process
 * Utilisé par Vercel Cron (envoie des GET). Authorization: Bearer <CRON_SECRET>.
 */
export async function GET(request: NextRequest) {
  return handleProcess(request);
}

/**
 * POST /api/relances/process
 * Alternative manuelle ou autres crons. Authorization: Bearer <CRON_SECRET>.
 */
export async function POST(request: NextRequest) {
  return handleProcess(request);
}
