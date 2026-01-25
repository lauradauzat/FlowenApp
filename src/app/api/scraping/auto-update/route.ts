import { NextRequest, NextResponse } from 'next/server';
import { triggerAutoUpdates } from '@/lib/services/scrapingService';
import { requireAuth } from '@/lib/auth/utils';

/**
 * API Route pour déclencher les mises à jour automatiques des sources de scraping
 * 
 * Cette route peut être appelée par :
 * - Un cron job externe (Vercel Cron, GitHub Actions, etc.)
 * - Un scheduler cloud
 * - Un appel manuel pour tester
 * 
 * Pour MVP, on protège la route avec requireAuth().
 * Dans une version future, on pourrait utiliser un secret partagé pour les appels externes.
 */
export async function POST(request: NextRequest) {
  try {
    // Pour MVP, on exige une authentification
    // Dans une version future, on pourrait accepter un secret dans les headers
    const userId = await requireAuth();

    // Déclencher les mises à jour pour l'utilisateur authentifié
    const results = await triggerAutoUpdates(userId);

    return NextResponse.json({
      success: true,
      message: `${results.length} source(s) mise(s) à jour`,
      results: results.map((r) => ({
        sourceId: r.sourceId,
        sourceName: r.sourceName,
        jobId: r.jobId,
        error: r.error,
      })),
    });
  } catch (error) {
    console.error('Error triggering auto-updates:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler pour vérifier quelles sources doivent être mises à jour
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const { getSourcesDueForUpdate } = await import('@/lib/services/scrapingService');

    const sources = await getSourcesDueForUpdate(userId);

    return NextResponse.json({
      success: true,
      count: sources.length,
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        frequency: s.frequency,
        lastScrapedAt: s.lastScrapedAt,
      })),
    });
  } catch (error) {
    console.error('Error getting sources due for update:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      },
      { status: 500 }
    );
  }
}
