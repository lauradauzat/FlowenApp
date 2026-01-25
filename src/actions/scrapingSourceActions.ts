'use server';

import { prisma } from '@/lib/prisma/client';
import { Prisma, ScrapingSourceType } from '@prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError, NotFoundError } from '@/lib/errors';
import {
  createScrapingSourceSchema,
  updateScrapingSourceSchema,
  deleteScrapingSourceSchema,
  testScrapingSourceSchema,
} from '@/lib/validations/scrapingSource';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * Crée une nouvelle source de scraping pour l'utilisateur authentifié
 */
export async function createScrapingSource(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = createScrapingSourceSchema.parse(input);

    const source = await prisma.scrapingSource.create({
      data: {
        userId,
        name: validated.name,
        type: validated.type,
        url: validated.url || undefined,
        selectors: validated.selectors
          ? (validated.selectors as Prisma.InputJsonValue)
          : undefined,
        apiKey: validated.apiKey || undefined,
        frequency: validated.frequency || undefined,
        isActive: validated.isActive ?? false,
      },
    });

    return {
      success: true,
      data: { id: source.id },
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

    console.error('Error creating scraping source:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la création de la source',
      },
    };
  }
}

/**
 * Récupère toutes les sources de scraping de l'utilisateur authentifié
 */
export async function getScrapingSources(): Promise<
  ActionResult<{
    sources: Array<{
      id: string;
      name: string;
      type: ScrapingSourceType;
      url?: string | null;
      isActive: boolean;
      frequency?: string | null;
      lastScrapedAt?: Date | null;
      createdAt: Date;
    }>;
  }>
> {
  try {
    const userId = await requireAuth();

    const sources = await prisma.scrapingSource.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: {
        sources: sources.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          url: s.url,
          isActive: s.isActive,
          frequency: s.frequency,
          lastScrapedAt: s.lastScrapedAt,
          createdAt: s.createdAt,
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

    console.error('Error fetching scraping sources:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du chargement des sources',
      },
    };
  }
}

/**
 * Met à jour une source de scraping existante
 */
export async function updateScrapingSource(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = updateScrapingSourceSchema.parse(input);

    const existing = await prisma.scrapingSource.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Source de scraping non trouvée');
    }

    const updated = await prisma.scrapingSource.update({
      where: { id: validated.id },
      data: {
        name: validated.name ?? undefined,
        type: validated.type ?? undefined,
        url: validated.url ?? undefined,
        selectors: validated.selectors
          ? (validated.selectors as Prisma.InputJsonValue)
          : undefined,
        apiKey: validated.apiKey ?? undefined,
        frequency: validated.frequency ?? undefined,
        isActive: validated.isActive ?? undefined,
      },
    });

    return {
      success: true,
      data: { id: updated.id },
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

    console.error('Error updating scraping source:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la mise à jour de la source',
      },
    };
  }
}

/**
 * Supprime une source de scraping
 */
export async function deleteScrapingSource(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = deleteScrapingSourceSchema.parse(input);

    const existing = await prisma.scrapingSource.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Source de scraping non trouvée');
    }

    const deleted = await prisma.scrapingSource.delete({
      where: { id: validated.id },
    });

    return {
      success: true,
      data: { id: deleted.id },
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

    console.error('Error deleting scraping source:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la suppression de la source',
      },
    };
  }
}

/**
 * Active ou désactive une source de scraping
 */
export async function toggleScrapingSource(
  input: unknown
): Promise<ActionResult<{ id: string; isActive: boolean }>> {
  try {
    const userId = await requireAuth();
    const validated = deleteScrapingSourceSchema.parse(input); // Réutilise le même schéma

    const existing = await prisma.scrapingSource.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Source de scraping non trouvée');
    }

    const updated = await prisma.scrapingSource.update({
      where: { id: validated.id },
      data: { isActive: !existing.isActive },
    });

    return {
      success: true,
      data: { id: updated.id, isActive: updated.isActive },
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

    console.error('Error toggling scraping source:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la modification de la source',
      },
    };
  }
}

/**
 * Teste une source de scraping (vérifie l'accessibilité et la configuration)
 */
export async function testScrapingSource(
  input: unknown
): Promise<ActionResult<{ success: boolean; message: string }>> {
  try {
    const userId = await requireAuth();
    const validated = testScrapingSourceSchema.parse(input);

    const source = await prisma.scrapingSource.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!source) {
      throw new NotFoundError('Source de scraping non trouvée');
    }

    // Pour MVP : validation basique de la configuration
    // Plus tard, on pourra faire un vrai test de scraping
    if (source.type === 'WEBSITE' && !source.url) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message: 'Une URL est requise pour une source de type WEBSITE',
        },
      };
    }

    if (source.type === 'API' && !source.url) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message: 'Une URL est requise pour une source de type API',
        },
      };
    }

    // TODO: Implémenter un vrai test de scraping (vérifier accessibilité URL, etc.)
    // Pour l'instant, on valide juste la configuration
    return {
      success: true,
      data: {
        success: true,
        message: 'La configuration de la source semble valide. Le scraping réel sera implémenté dans les stories suivantes.',
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

    console.error('Error testing scraping source:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du test de la source',
      },
    };
  }
}
