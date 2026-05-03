'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError, NotFoundError } from '@/lib/errors';
import {
  createContactSchema,
  updateContactSchema,
  deleteContactSchema,
  archiveContactSchema,
  markContactObsoleteSchema,
} from '@/lib/validations/contact';
import { validateContact } from '@/lib/validations/contactValidation';
import { validateContactAgainstFicheConfig } from '@/lib/ficheFields';
import { loadEffectiveFicheConfig } from '@/lib/userFicheEffectiveConfig';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type ContactSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  status: string;
  createdAt: Date;
};

/**
 * Crée un nouveau contact pour l'utilisateur authentifié
 */
export async function createContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();

    const validated = createContactSchema.parse(input);

    const { contact: ficheContactCfg } = await loadEffectiveFicheConfig(userId);
    const ficheErrors = validateContactAgainstFicheConfig(
      {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        role: validated.role,
        notes: validated.notes,
      },
      ficheContactCfg
    );
    if (ficheErrors.length > 0) {
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: ficheErrors.join(' · ') },
      };
    }

    // Valider les données et déterminer le statut
    const validation = validateContact({
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
      phone: validated.phone,
      role: validated.role,
      notes: validated.notes,
    });

    const contact = await prisma.contact.create({
      data: {
        userId,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        role: validated.role,
        notes: validated.notes,
        status: validation.isValid ? 'ACTIVE' : 'ERROR',
        dataSource: 'MANUAL', // Création manuelle
      },
    });

    return {
      success: true,
      data: { id: contact.id },
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

    console.error('Error creating contact:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la création du contact',
      },
    };
  }
}

/**
 * Récupère la liste des contacts de l'utilisateur authentifié
 */
export async function getContacts(): Promise<
  ActionResult<{ contacts: ContactSummary[] }>
> {
  try {
    const userId = await requireAuth();

    const contacts = await prisma.contact.findMany({
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
        contacts: contacts.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          role: c.role,
          status: c.status,
          createdAt: c.createdAt,
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

    console.error('Error fetching contacts:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du chargement des contacts',
      },
    };
  }
}

/**
 * Met à jour un contact existant
 */
export async function updateContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = updateContactSchema.parse(input);

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    // Récupérer les données actuelles pour la validation
    const currentData = {
      firstName: validated.firstName ?? existing.firstName,
      lastName: validated.lastName ?? existing.lastName,
      email: validated.email ?? existing.email,
      phone: validated.phone ?? existing.phone,
      role: validated.role ?? existing.role,
      notes: validated.notes ?? existing.notes,
    };

    const { contact: ficheContactCfg } = await loadEffectiveFicheConfig(userId);
    const ficheErrors = validateContactAgainstFicheConfig(currentData, ficheContactCfg);
    if (ficheErrors.length > 0) {
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: ficheErrors.join(' · ') },
      };
    }

    // Valider les données et déterminer le statut (sauf si le statut est explicitement défini)
    let newStatus = validated.status ?? existing.status;
    if (!validated.status) {
      const validation = validateContact(currentData);
      // Ne pas changer le statut si c'est ARCHIVED, sauf si on a des erreurs critiques
      if (existing.status !== 'ARCHIVED' || !validation.isValid) {
        newStatus = validation.isValid ? 'ACTIVE' : 'ERROR';
      }
    }

    const updated = await prisma.contact.update({
      where: { id: validated.id },
      data: {
        firstName: validated.firstName ?? undefined,
        lastName: validated.lastName ?? undefined,
        email: validated.email ?? undefined,
        phone: validated.phone ?? undefined,
        role: validated.role ?? undefined,
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

    console.error('Error updating contact:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la mise à jour du contact',
      },
    };
  }
}

/**
 * Supprime un contact appartenant à l'utilisateur
 */
export async function deleteContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = deleteContactSchema.parse(input);

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    const deleted = await prisma.contact.delete({
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

    console.error('Error deleting contact:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la suppression du contact',
      },
    };
  }
}

/**
 * Archive un contact appartenant à l'utilisateur
 */
export async function archiveContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = archiveContactSchema.parse(input);

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    if (existing.status === 'ARCHIVED') {
      return {
        success: false,
        error: {
          code: 'ALREADY_ARCHIVED',
          message: 'Ce contact est déjà archivé',
        },
      };
    }

    const updated = await prisma.contact.update({
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

    console.error('Error archiving contact:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de l\'archivage du contact',
      },
    };
  }
}

/**
 * Restaure un contact archivé appartenant à l'utilisateur
 */
export async function restoreContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = archiveContactSchema.parse(input);

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    if (existing.status === 'ACTIVE') {
      return {
        success: false,
        error: {
          code: 'ALREADY_ACTIVE',
          message: 'Ce contact est déjà actif',
        },
      };
    }

    const updated = await prisma.contact.update({
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

    console.error('Error restoring contact:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la restauration du contact',
      },
    };
  }
}

/**
 * Marque un contact comme obsolète (email invalide, bounce, etc.)
 * Utilise le statut ERROR pour indiquer l'obsolescence
 */
export async function markContactAsObsolete(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = markContactObsoleteSchema.parse(input);

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    if (existing.status === 'ERROR') {
      return {
        success: false,
        error: {
          code: 'ALREADY_OBSOLETE',
          message: 'Ce contact est déjà marqué comme obsolète',
        },
      };
    }

    const updated = await prisma.contact.update({
      where: { id: validated.id },
      data: { status: 'ERROR' },
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

    console.error('Error marking contact as obsolete:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors du marquage du contact comme obsolète',
      },
    };
  }
}

/**
 * Marque un contact obsolète comme valide (restaure après correction)
 */
export async function markContactAsValid(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = archiveContactSchema.parse(input); // Réutilise le même schéma

    const existing = await prisma.contact.findFirst({
      where: {
        id: validated.id,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Contact non trouvé');
    }

    if (existing.status !== 'ERROR') {
      return {
        success: false,
        error: {
          code: 'NOT_OBSOLETE',
          message: 'Ce contact n\'est pas marqué comme obsolète',
        },
      };
    }

    // Valider les données avant de restaurer
    const validation = validateContact({
      firstName: existing.firstName,
      lastName: existing.lastName,
      email: existing.email,
      phone: existing.phone,
      role: existing.role,
      notes: existing.notes,
    });

    const updated = await prisma.contact.update({
      where: { id: validated.id },
      data: { status: validation.isValid ? 'ACTIVE' : 'ERROR' },
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

    console.error('Error marking contact as valid:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la restauration du contact',
      },
    };
  }
}

