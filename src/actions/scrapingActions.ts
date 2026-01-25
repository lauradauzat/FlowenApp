'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError } from '@/lib/errors';
import {
  startVenueScrapingSchema,
  startContactScrapingSchema,
  getScrapingJobStatusSchema,
} from '@/lib/validations/scraping';
import { createScrapingJob, getScrapingJob, getUserScrapingJobs } from '@/lib/services/jobService';
import { processScrapingJob } from '@/lib/services/scrapingService';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * Lance un scraping de salles depuis une source configurée
 */
export async function startVenueScraping(
  input: unknown
): Promise<ActionResult<{ jobId: string; status: string }>> {
  try {
    const userId = await requireAuth();
    const validated = startVenueScrapingSchema.parse(input);

    // Si une source est spécifiée, vérifier qu'elle existe et appartient à l'utilisateur
    if (validated.sourceId) {
      const source = await prisma.scrapingSource.findFirst({
        where: {
          id: validated.sourceId,
          userId,
          isActive: true,
        },
      });

      if (!source) {
        return {
          success: false,
          error: {
            code: 'SOURCE_NOT_FOUND',
            message: 'Source de scraping non trouvée ou inactive',
          },
        };
      }
    } else {
      // Si aucune source n'est spécifiée, vérifier qu'il existe au moins une source active
      const activeSource = await prisma.scrapingSource.findFirst({
        where: {
          userId,
          isActive: true,
          type: 'WEBSITE', // Pour MVP, on se concentre sur les sources WEBSITE
        },
      });

      if (!activeSource) {
        return {
          success: false,
          error: {
            code: 'NO_ACTIVE_SOURCE',
            message: 'Aucune source de scraping active trouvée. Veuillez configurer une source.',
          },
        };
      }
    }

    // Créer le job de scraping
    const job = await createScrapingJob(userId, 'VENUES', validated.sourceId);

    // Traiter le job en arrière-plan (non-bloquant)
    // Pour MVP, on appelle directement processScrapingJob
    // Dans une version future, on pourrait utiliser un système de queue
    processScrapingJob(job.id, userId).catch((error) => {
      console.error('Error processing scraping job:', error);
    });

    return {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error starting venue scraping:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du lancement du scraping',
      },
    };
  }
}

/**
 * Lance un scraping de contacts depuis une source configurée
 */
export async function startContactScraping(
  input: unknown
): Promise<ActionResult<{ jobId: string; status: string }>> {
  try {
    const userId = await requireAuth();
    const validated = startContactScrapingSchema.parse(input);

    // Si une source est spécifiée, vérifier qu'elle existe et appartient à l'utilisateur
    if (validated.sourceId) {
      const source = await prisma.scrapingSource.findFirst({
        where: {
          id: validated.sourceId,
          userId,
          isActive: true,
        },
      });

      if (!source) {
        return {
          success: false,
          error: {
            code: 'SOURCE_NOT_FOUND',
            message: 'Source de scraping non trouvée ou inactive',
          },
        };
      }
    } else {
      // Si aucune source n'est spécifiée, vérifier qu'il existe au moins une source active
      const activeSource = await prisma.scrapingSource.findFirst({
        where: {
          userId,
          isActive: true,
          type: 'WEBSITE', // Pour MVP, on se concentre sur les sources WEBSITE
        },
      });

      if (!activeSource) {
        return {
          success: false,
          error: {
            code: 'NO_ACTIVE_SOURCE',
            message: 'Aucune source de scraping active trouvée. Veuillez configurer une source.',
          },
        };
      }
    }

    // Créer le job de scraping
    const job = await createScrapingJob(userId, 'CONTACTS', validated.sourceId);

    // Traiter le job en arrière-plan (non-bloquant)
    processScrapingJob(job.id, userId).catch((error) => {
      console.error('Error processing scraping job:', error);
    });

    return {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error starting contact scraping:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du lancement du scraping',
      },
    };
  }
}

/**
 * Récupère le statut d'un job de scraping
 */
export async function getScrapingJobStatus(
  input: unknown
): Promise<
  ActionResult<{
    id: string;
    status: string;
    resultCount?: number | null;
    errorMessage?: string | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    source?: {
      id: string;
      name: string;
    } | null;
  }>
> {
  try {
    const userId = await requireAuth();
    const validated = getScrapingJobStatusSchema.parse(input);

    const job = await getScrapingJob(validated.jobId, userId);

    if (!job) {
      return {
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job de scraping non trouvé',
        },
      };
    }

    return {
      success: true,
      data: {
        id: job.id,
        status: job.status,
        resultCount: job.resultCount,
        errorMessage: job.errorMessage,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        source: job.source
          ? {
              id: job.source.id,
              name: job.source.name,
            }
          : null,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error getting scraping job status:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la récupération du statut',
      },
    };
  }
}

/**
 * Récupère tous les jobs de scraping de l'utilisateur
 */
export async function getUserScrapingJobsAction(
  options?: {
    type?: 'VENUES' | 'CONTACTS';
    status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    limit?: number;
  }
): Promise<
  ActionResult<{
    jobs: Array<{
      id: string;
      type: string;
      status: string;
      resultCount?: number | null;
      errorMessage?: string | null;
      startedAt?: Date | null;
      completedAt?: Date | null;
      createdAt: Date;
      source?: {
        id: string;
        name: string;
      } | null;
    }>;
  }>
> {
  try {
    const userId = await requireAuth();

    const jobs = await getUserScrapingJobs(userId, options);

    return {
      success: true,
      data: {
        jobs: jobs.map((job) => ({
          id: job.id,
          type: job.type,
          status: job.status,
          resultCount: job.resultCount,
          errorMessage: job.errorMessage,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          createdAt: job.createdAt,
          source: job.source
            ? {
                id: job.source.id,
                name: job.source.name,
              }
            : null,
        })),
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error getting user scraping jobs:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la récupération des jobs',
      },
    };
  }
}
