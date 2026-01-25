'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError } from '@/lib/errors';
import { exportContactsSchema, exportVenuesSchema } from '@/lib/validations/export';
import type { ContactStatus, VenueStatus } from '@prisma/client';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * Prépare les données de contacts pour l'export CSV
 */
export async function prepareContactsExport(
  input: unknown
): Promise<ActionResult<{ data: Array<Record<string, unknown>>; headers: string[] }>> {
  try {
    const userId = await requireAuth();
    const validated = exportContactsSchema.parse(input);

    // Construire les filtres
    const where: {
      userId: string;
      status?: ContactStatus;
      role?: string;
    } = {
      userId,
    };

    if (validated.filters?.status) {
      where.status = validated.filters.status;
    }
    if (validated.filters?.role) {
      where.role = validated.filters.role;
    }

    // Récupérer les contacts
    const contacts = await prisma.contact.findMany({
      where,
      include: validated.includeRelations
        ? {
            venues: {
              include: {
                venue: true,
              },
            },
          }
        : undefined,
      orderBy: {
        lastName: 'asc',
      },
    });

    // Transformer les données selon les champs sélectionnés
    const data = contacts.map((contact) => {
      const contactWithVenues = contact as typeof contact & {
        venues?: Array<{ venue: { name: string } }>;
      };
      const row: Record<string, unknown> = {};

      if (validated.fields.includes('firstName')) {
        row['Prénom'] = contact.firstName;
      }
      if (validated.fields.includes('lastName')) {
        row['Nom'] = contact.lastName;
      }
      if (validated.fields.includes('email')) {
        row['Email'] = contact.email || '';
      }
      if (validated.fields.includes('phone')) {
        row['Téléphone'] = contact.phone || '';
      }
      if (validated.fields.includes('role')) {
        row['Rôle'] = contact.role || '';
      }
      if (validated.fields.includes('notes')) {
        row['Notes'] = contact.notes || '';
      }
      if (validated.fields.includes('status')) {
        row['Statut'] = contact.status;
      }
      if (validated.fields.includes('venues') && validated.includeRelations && contactWithVenues.venues) {
        row['Salles'] = contactWithVenues.venues.map((cv) => cv.venue.name).join('; ');
      }

      return row;
    });

    // Générer les en-têtes depuis les champs sélectionnés
    const headers: string[] = [];
    if (validated.fields.includes('firstName')) headers.push('Prénom');
    if (validated.fields.includes('lastName')) headers.push('Nom');
    if (validated.fields.includes('email')) headers.push('Email');
    if (validated.fields.includes('phone')) headers.push('Téléphone');
    if (validated.fields.includes('role')) headers.push('Rôle');
    if (validated.fields.includes('notes')) headers.push('Notes');
    if (validated.fields.includes('status')) headers.push('Statut');
    if (validated.fields.includes('venues') && validated.includeRelations) headers.push('Salles');

    return {
      success: true,
      data: {
        data,
        headers,
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

    console.error('Error preparing contacts export:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la préparation de l\'export',
      },
    };
  }
}

/**
 * Prépare les données de salles pour l'export CSV
 */
export async function prepareVenuesExport(
  input: unknown
): Promise<ActionResult<{ data: Array<Record<string, unknown>>; headers: string[] }>> {
  try {
    const userId = await requireAuth();
    const validated = exportVenuesSchema.parse(input);

    // Construire les filtres
    const where: {
      userId: string;
      status?: VenueStatus;
      region?: string;
    } = {
      userId,
    };

    if (validated.filters?.status) {
      where.status = validated.filters.status;
    }
    if (validated.filters?.region) {
      where.region = validated.filters.region;
    }

    // Récupérer les salles
    const venues = await prisma.venue.findMany({
      where,
      include: validated.includeRelations
        ? {
            contacts: {
              include: {
                contact: true,
              },
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });

    // Transformer les données selon les champs sélectionnés
    const data = venues.map((venue) => {
      const venueWithContacts = venue as typeof venue & {
        contacts?: Array<{ contact: { firstName: string; lastName: string } }>;
      };
      const row: Record<string, unknown> = {};

      if (validated.fields.includes('name')) {
        row['Nom'] = venue.name;
      }
      if (validated.fields.includes('address')) {
        row['Adresse'] = venue.address || '';
      }
      if (validated.fields.includes('region')) {
        row['Région'] = venue.region || '';
      }
      if (validated.fields.includes('website')) {
        row['Site web'] = venue.website || '';
      }
      if (validated.fields.includes('capacity')) {
        row['Capacité'] = venue.capacity || '';
      }
      if (validated.fields.includes('style')) {
        row['Style'] = venue.style || '';
      }
      if (validated.fields.includes('notes')) {
        row['Notes'] = venue.notes || '';
      }
      if (validated.fields.includes('status')) {
        row['Statut'] = venue.status;
      }
      if (validated.fields.includes('contacts') && validated.includeRelations && venueWithContacts.contacts) {
        row['Contacts'] = venueWithContacts.contacts
          .map((cv) => `${cv.contact.firstName} ${cv.contact.lastName}`)
          .join('; ');
      }

      return row;
    });

    // Générer les en-têtes depuis les champs sélectionnés
    const headers: string[] = [];
    if (validated.fields.includes('name')) headers.push('Nom');
    if (validated.fields.includes('address')) headers.push('Adresse');
    if (validated.fields.includes('region')) headers.push('Région');
    if (validated.fields.includes('website')) headers.push('Site web');
    if (validated.fields.includes('capacity')) headers.push('Capacité');
    if (validated.fields.includes('style')) headers.push('Style');
    if (validated.fields.includes('notes')) headers.push('Notes');
    if (validated.fields.includes('status')) headers.push('Statut');
    if (validated.fields.includes('contacts') && validated.includeRelations) headers.push('Contacts');

    return {
      success: true,
      data: {
        data,
        headers,
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

    console.error('Error preparing venues export:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la préparation de l\'export',
      },
    };
  }
}
