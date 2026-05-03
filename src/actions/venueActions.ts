'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError, NotFoundError } from '@/lib/errors';
import {
  createVenueSchema,
  updateVenueSchema,
  deleteVenueSchema,
  archiveVenueSchema,
} from '@/lib/validations/venue';
import { validateVenue } from '@/lib/validations/venueValidation';
import { validateVenueAgainstFicheConfig } from '@/lib/ficheFields';
import { loadEffectiveFicheConfig } from '@/lib/userFicheEffectiveConfig';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type VenueSummary = {
  id: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
  style?: string | null;
  region?: string | null;
  website?: string | null;
  status: string;
  createdAt: Date;
};

/**
 * Crée une nouvelle salle pour l'utilisateur authentifié
 */
export async function createVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();

    const validated = createVenueSchema.parse(input);

    const { venue: ficheVenueCfg } = await loadEffectiveFicheConfig(userId);
    const ficheErrors = validateVenueAgainstFicheConfig(
      {
        name: validated.name,
        address: validated.address,
        capacity: validated.capacity ?? null,
        style: validated.style,
        region: validated.region,
        website: validated.website,
        notes: validated.notes,
      },
      ficheVenueCfg
    );
    if (ficheErrors.length > 0) {
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: ficheErrors.join(' · ') },
      };
    }

    // Valider les données et déterminer le statut
    const validation = validateVenue({
      name: validated.name,
      address: validated.address,
      capacity: validated.capacity,
      style: validated.style,
      region: validated.region,
      website: validated.website,
      notes: validated.notes,
    });

    const venue = await prisma.venue.create({
      data: {
        userId,
        name: validated.name,
        address: validated.address,
        capacity: validated.capacity,
        style: validated.style,
        region: validated.region,
        website: validated.website,
        notes: validated.notes,
        status: validation.isValid ? 'ACTIVE' : 'ERROR',
        dataSource: 'MANUAL', // Création manuelle
      },
    });

    return {
      success: true,
      data: { id: venue.id },
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

    console.error('Error creating venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la création de la salle',
      },
    };
  }
}

/**
 * Récupère la liste des salles de l'utilisateur authentifié
 */
export async function getVenues(): Promise<
  ActionResult<{ venues: VenueSummary[] }>
> {
  try {
    const userId = await requireAuth();

    const venues = await prisma.venue.findMany({
      where: {
        userId,
        status: { not: 'ARCHIVED' }, // Exclure les archivés par défaut
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: {
        venues: venues.map((v) => ({
          id: v.id,
          name: v.name,
          address: v.address,
          capacity: v.capacity,
          style: v.style,
          region: v.region,
          website: v.website,
          status: v.status,
          createdAt: v.createdAt,
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

    console.error('Error fetching venues:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du chargement des salles',
      },
    };
  }
}

/**
 * Met à jour une salle existante
 */
export async function updateVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = updateVenueSchema.parse(input);

    const existing = await prisma.venue.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Salle non trouvée');
    }

    // Récupérer les données actuelles pour la validation
    const currentData = {
      name: validated.name ?? existing.name,
      address: validated.address ?? existing.address,
      capacity: validated.capacity ?? existing.capacity,
      style: validated.style ?? existing.style,
      region: validated.region ?? existing.region,
      website: validated.website ?? existing.website,
      notes: validated.notes ?? existing.notes,
    };

    const { venue: ficheVenueCfg } = await loadEffectiveFicheConfig(userId);
    const ficheErrors = validateVenueAgainstFicheConfig(currentData, ficheVenueCfg);
    if (ficheErrors.length > 0) {
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: ficheErrors.join(' · ') },
      };
    }

    // Valider les données et déterminer le statut (sauf si le statut est explicitement défini)
    let newStatus = validated.status ?? existing.status;
    if (!validated.status) {
      const validation = validateVenue(currentData);
      // Ne pas changer le statut si c'est ARCHIVED, sauf si on a des erreurs critiques
      if (existing.status !== 'ARCHIVED' || !validation.isValid) {
        newStatus = validation.isValid ? 'ACTIVE' : 'ERROR';
      }
    }

    const updated = await prisma.venue.update({
      where: { id: validated.id },
      data: {
        name: validated.name ?? undefined,
        address: validated.address ?? undefined,
        capacity: validated.capacity ?? undefined,
        style: validated.style ?? undefined,
        region: validated.region ?? undefined,
        website: validated.website ?? undefined,
        notes: validated.notes ?? undefined,
        status: newStatus,
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

    console.error('Error updating venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la mise à jour de la salle',
      },
    };
  }
}

/**
 * Supprime une salle appartenant à l'utilisateur
 */
export async function deleteVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = deleteVenueSchema.parse(input);

    const existing = await prisma.venue.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Salle non trouvée');
    }

    const deleted = await prisma.venue.delete({
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

    console.error('Error deleting venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la suppression de la salle',
      },
    };
  }
}

/**
 * Archive une salle appartenant à l'utilisateur
 */
export async function archiveVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = archiveVenueSchema.parse(input);

    const existing = await prisma.venue.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Salle non trouvée');
    }

    if (existing.status === 'ARCHIVED') {
      return {
        success: false,
        error: {
          code: 'ALREADY_ARCHIVED',
          message: 'Cette salle est déjà archivée',
        },
      };
    }

    const updated = await prisma.venue.update({
      where: { id: validated.id },
      data: { status: 'ARCHIVED' },
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

    console.error('Error archiving venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de l\'archivage de la salle',
      },
    };
  }
}

/**
 * Restaure une salle archivée appartenant à l'utilisateur
 */
export async function restoreVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = archiveVenueSchema.parse(input);

    const existing = await prisma.venue.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Salle non trouvée');
    }

    if (existing.status === 'ACTIVE') {
      return {
        success: false,
        error: {
          code: 'ALREADY_ACTIVE',
          message: 'Cette salle est déjà active',
        },
      };
    }

    const updated = await prisma.venue.update({
      where: { id: validated.id },
      data: { status: 'ACTIVE' },
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

    console.error('Error restoring venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la restauration de la salle',
      },
    };
  }
}
