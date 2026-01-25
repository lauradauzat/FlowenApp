'use server';

import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { createProjectSchema, updateStepStatusSchema } from '@/lib/validations/project';
import { updateProjectPersonalDataSchema } from '@/lib/validations/projectPersonalData';
import { getProjectStepsForType } from '@/lib/projects/projectTemplates';
import { AppError, NotFoundError, ForbiddenError } from '@/lib/errors';

/**
 * Format de réponse standard pour les Server Actions
 */
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

/**
 * Crée un nouveau projet musical avec sa structure d'étapes préconstruite
 */
export async function createProject(
  input: unknown
): Promise<ActionResult<{ id: string; name: string; type: string }>> {
  try {
    // 1. Vérifier l'authentification
    const userId = await requireAuth();

    // 2. Valider les données avec Zod
    const validatedData = createProjectSchema.parse(input);

    // 3. Créer le projet avec les étapes préconstruites
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        userId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        steps: {
          create: getProjectStepsForType(validatedData.type).map((stepTemplate) => ({
            name: stepTemplate.name,
            order: stepTemplate.order,
          })),
        },
      },
      include: {
        steps: true,
      },
    });

    return {
      success: true,
      data: {
        id: project.id,
        name: project.name,
        type: project.type,
      },
    };
  } catch (error) {
    // Gestion des erreurs de validation Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    // Gestion des erreurs d'authentification
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    // Erreur inconnue
    console.error('Error creating project:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la création du projet',
      },
    };
  }
}

/**
 * Met à jour le statut d'une étape de projet
 */
export async function updateStepStatus(
  input: unknown
): Promise<ActionResult<{ id: string; status: string; actualDate: Date | null }>> {
  try {
    // 1. Vérifier l'authentification
    const userId = await requireAuth();

    // 2. Valider les données avec Zod
    const validatedData = updateStepStatusSchema.parse(input);

    // 3. Récupérer l'étape et vérifier que le projet appartient à l'utilisateur
    const step = await prisma.projectStep.findUnique({
      where: { id: validatedData.stepId },
      include: {
        project: true,
      },
    });

    if (!step) {
      throw new NotFoundError('Étape non trouvée');
    }

    // 4. Vérifier que le projet appartient à l'utilisateur (multi-tenancy)
    if (step.project.userId !== userId) {
      throw new ForbiddenError('Vous n\'avez pas le droit de modifier cette étape');
    }

    // 5. Mettre à jour le statut et la date réelle si complétée
    const updateData: {
      status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
      actualDate?: Date;
    } = {
      status: validatedData.status,
    };

    // Si l'étape est marquée comme complétée et qu'elle n'a pas encore de date réelle
    if (validatedData.status === 'COMPLETED' && !step.actualDate) {
      updateData.actualDate = new Date();
    }

    const updatedStep = await prisma.projectStep.update({
      where: { id: validatedData.stepId },
      data: updateData,
    });

    return {
      success: true,
      data: {
        id: updatedStep.id,
        status: updatedStep.status,
        actualDate: updatedStep.actualDate,
      },
    };
  } catch (error) {
    // Gestion des erreurs de validation Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    // Gestion des erreurs d'authentification et autorisation
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    // Erreur inconnue
    console.error('Error updating step status:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la mise à jour de l\'étape',
      },
    };
  }
}

/**
 * Met à jour les données personnelles d'un projet
 */
export async function updateProjectPersonalData(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Vérifier l'authentification
    const userId = await requireAuth();

    // 2. Valider les données avec Zod
    const validatedData = updateProjectPersonalDataSchema.parse(input);

    // 3. Vérifier que le projet existe et appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        userId, // Multi-tenancy
      },
    });

    if (!project) {
      throw new NotFoundError('Projet non trouvé');
    }

    // 4. Créer ou mettre à jour les données personnelles
    const personalData = await prisma.projectPersonalData.upsert({
      where: {
        projectId: validatedData.projectId,
      },
      create: {
        projectId: validatedData.projectId,
        bio: validatedData.bio || null,
        photos: validatedData.photos || [],
        videos: validatedData.videos || [],
        socialLinks: validatedData.socialLinks
          ? (validatedData.socialLinks as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
      update: {
        bio: validatedData.bio !== undefined ? (validatedData.bio || null) : undefined,
        photos: validatedData.photos !== undefined ? validatedData.photos : undefined,
        videos: validatedData.videos !== undefined ? validatedData.videos : undefined,
        socialLinks: validatedData.socialLinks !== undefined ? (validatedData.socialLinks as Prisma.InputJsonValue) : undefined,
      },
    });

    return {
      success: true,
      data: {
        id: personalData.id,
      },
    };
  } catch (error) {
    // Gestion des erreurs de validation Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    // Gestion des erreurs d'authentification et autorisation
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    // Erreur inconnue
    console.error('Error updating project personal data:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la mise à jour des données personnelles',
      },
    };
  }
}
