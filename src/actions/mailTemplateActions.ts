'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError, NotFoundError } from '@/lib/errors';
import {
  createMailTemplateSchema,
  updateMailTemplateSchema,
  deleteMailTemplateSchema,
  duplicateMailTemplateSchema,
  createMailTemplateVariantSchema,
  updateMailTemplateVariantSchema,
  deleteMailTemplateVariantSchema,
} from '@/lib/validations/mailTemplate';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * Crée un nouveau template de mailing
 */
export async function createMailTemplate(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = createMailTemplateSchema.parse(input);

    const template = await prisma.mailTemplate.create({
      data: {
        userId,
        name: validated.name,
        subject: validated.subject,
        body: validated.body,
      },
    });

    return {
      success: true,
      data: { id: template.id },
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

    console.error('Error creating mail template:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la création du template",
      },
    };
  }
}

/**
 * Récupère tous les templates de l'utilisateur
 */
export async function getMailTemplates(): Promise<
  ActionResult<{
    templates: Array<{
      id: string;
      name: string;
      subject: string;
      body: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>
> {
  try {
    const userId = await requireAuth();

    const templates = await prisma.mailTemplate.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      success: true,
      data: {
        templates: templates.map((t) => ({
          id: t.id,
          name: t.name,
          subject: t.subject,
          body: t.body,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
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

    console.error('Error getting mail templates:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la récupération des templates",
      },
    };
  }
}

/**
 * Récupère un template par son ID (avec variantes pour Story 5.3)
 */
export async function getMailTemplate(
  id: string
): Promise<
  ActionResult<{
    id: string;
    name: string;
    subject: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    variants: Array<{
      id: string;
      capacityCategory: string | null;
      region: string | null;
      style: string | null;
      subject: string;
      body: string;
      order: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>
> {
  try {
    const userId = await requireAuth();

    const template = await prisma.mailTemplate.findFirst({
      where: { id, userId },
      include: {
        variants: { orderBy: { order: 'asc' } },
      },
    });

    if (!template) {
      throw new NotFoundError('Template non trouvé');
    }

    return {
      success: true,
      data: {
        id: template.id,
        name: template.name,
        subject: template.subject,
        body: template.body,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        variants: template.variants.map((v) => ({
          id: v.id,
          capacityCategory: v.capacityCategory,
          region: v.region,
          style: v.style,
          subject: v.subject,
          body: v.body,
          order: v.order,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        })),
      },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
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

    console.error('Error getting mail template:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la récupération du template",
      },
    };
  }
}

/**
 * Met à jour un template
 */
export async function updateMailTemplate(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = updateMailTemplateSchema.parse(input);

    const existing = await prisma.mailTemplate.findFirst({
      where: { id: validated.id, userId },
    });

    if (!existing) {
      throw new NotFoundError('Template non trouvé');
    }

    const template = await prisma.mailTemplate.update({
      where: { id: validated.id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.subject !== undefined && { subject: validated.subject }),
        ...(validated.body !== undefined && { body: validated.body }),
      },
    });

    return {
      success: true,
      data: { id: template.id },
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

    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
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

    console.error('Error updating mail template:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la modification du template",
      },
    };
  }
}

/**
 * Supprime un template
 */
export async function deleteMailTemplate(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = deleteMailTemplateSchema.parse(input);

    const existing = await prisma.mailTemplate.findFirst({
      where: { id: validated.id, userId },
    });

    if (!existing) {
      throw new NotFoundError('Template non trouvé');
    }

    await prisma.mailTemplate.delete({
      where: { id: validated.id },
    });

    return {
      success: true,
      data: { id: validated.id },
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

    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
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

    console.error('Error deleting mail template:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la suppression du template",
      },
    };
  }
}

/**
 * Duplique un template pour créer une variante
 */
export async function duplicateMailTemplate(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = duplicateMailTemplateSchema.parse(input);

    const existingWithVariants = await prisma.mailTemplate.findFirst({
      where: { id: validated.id, userId },
      include: { variants: { orderBy: { order: 'asc' } } },
    });
    if (!existingWithVariants) {
      throw new NotFoundError('Template non trouvé');
    }

    const template = await prisma.mailTemplate.create({
      data: {
        userId,
        name: `${existingWithVariants.name} (copie)`,
        subject: existingWithVariants.subject,
        body: existingWithVariants.body,
      },
    });

    if (existingWithVariants.variants.length > 0) {
      await prisma.mailTemplateVariant.createMany({
        data: existingWithVariants.variants.map((v) => ({
          mailTemplateId: template.id,
          capacityCategory: v.capacityCategory,
          region: v.region,
          style: v.style,
          subject: v.subject,
          body: v.body,
          order: v.order,
        })),
      });
    }

    return {
      success: true,
      data: { id: template.id },
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

    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
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

    console.error('Error duplicating mail template:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: "Une erreur est survenue lors de la duplication du template",
      },
    };
  }
}

// --- Story 5.3: CRUD variantes ---

async function ensureTemplateOwnership(mailTemplateId: string, userId: string) {
  const t = await prisma.mailTemplate.findFirst({
    where: { id: mailTemplateId, userId },
  });
  if (!t) throw new NotFoundError('Template non trouvé');
  return t;
}

export async function createMailTemplateVariant(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = createMailTemplateVariantSchema.parse(input);
    await ensureTemplateOwnership(v.mailTemplateId, userId);

    const maxOrder = await prisma.mailTemplateVariant.aggregate({
      where: { mailTemplateId: v.mailTemplateId },
      _max: { order: true },
    });
    const order = v.order ?? (maxOrder._max.order ?? -1) + 1;

    const variant = await prisma.mailTemplateVariant.create({
      data: {
        mailTemplateId: v.mailTemplateId,
        capacityCategory: v.capacityCategory ?? null,
        region: v.region ?? null,
        style: v.style ?? null,
        subject: v.subject,
        body: v.body,
        order,
      },
    });
    return { success: true, data: { id: variant.id } };
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: e.message } };
    }
    if (e instanceof NotFoundError) {
      return { success: false, error: { code: 'NOT_FOUND', message: e.message } };
    }
    if (e instanceof AppError) {
      return { success: false, error: { code: e.code || 'ERROR', message: e.message } };
    }
    console.error('Error creating mail template variant:', e);
    return {
      success: false,
      error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la création de la variante' },
    };
  }
}

export async function updateMailTemplateVariant(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = updateMailTemplateVariantSchema.parse(input);

    const existing = await prisma.mailTemplateVariant.findUnique({
      where: { id: v.id },
      include: { mailTemplate: true },
    });
    if (!existing || existing.mailTemplate.userId !== userId) {
      throw new NotFoundError('Variante non trouvée');
    }

    await prisma.mailTemplateVariant.update({
      where: { id: v.id },
      data: {
        ...(v.capacityCategory !== undefined && { capacityCategory: v.capacityCategory }),
        ...(v.region !== undefined && { region: v.region }),
        ...(v.style !== undefined && { style: v.style }),
        ...(v.subject !== undefined && { subject: v.subject }),
        ...(v.body !== undefined && { body: v.body }),
        ...(v.order !== undefined && { order: v.order }),
      },
    });
    return { success: true, data: { id: v.id } };
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: e.message } };
    }
    if (e instanceof NotFoundError) {
      return { success: false, error: { code: 'NOT_FOUND', message: e.message } };
    }
    if (e instanceof AppError) {
      return { success: false, error: { code: e.code || 'ERROR', message: e.message } };
    }
    console.error('Error updating mail template variant:', e);
    return {
      success: false,
      error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la modification de la variante' },
    };
  }
}

export async function deleteMailTemplateVariant(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const v = deleteMailTemplateVariantSchema.parse(input);

    const existing = await prisma.mailTemplateVariant.findUnique({
      where: { id: v.id },
      include: { mailTemplate: true },
    });
    if (!existing || existing.mailTemplate.userId !== userId) {
      throw new NotFoundError('Variante non trouvée');
    }

    await prisma.mailTemplateVariant.delete({ where: { id: v.id } });
    return { success: true, data: { id: v.id } };
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: e.message } };
    }
    if (e instanceof NotFoundError) {
      return { success: false, error: { code: 'NOT_FOUND', message: e.message } };
    }
    if (e instanceof AppError) {
      return { success: false, error: { code: e.code || 'ERROR', message: e.message } };
    }
    console.error('Error deleting mail template variant:', e);
    return {
      success: false,
      error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la suppression de la variante' },
    };
  }
}
