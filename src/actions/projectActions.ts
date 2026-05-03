'use server';

import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import {
  createProjectSchema,
  updateStepStatusSchema,
  updateProjectScheduleSchema,
  updateProjectStepDetailsSchema,
  addProjectStepSchema,
  deleteProjectStepSchema,
  applySuggestedStepDatesSchema,
} from '@/lib/validations/project';
import { updateProjectPersonalDataSchema } from '@/lib/validations/projectPersonalData';
import {
  getProjectStepTreeForType,
  type ProjectStepTemplateNode,
} from '@/lib/projects/projectTemplates';
import { suggestPlannedDatesForProject, clampWeeklyDedicatedDays } from '@/lib/projects/suggestStepDates';
import { AppError, NotFoundError, ForbiddenError } from '@/lib/errors';

type DbTx = Prisma.TransactionClient;

async function insertTemplateSteps(
  tx: DbTx,
  projectId: string,
  nodes: ProjectStepTemplateNode[],
  parentId: string | null,
  orderRef: { n: number }
): Promise<void> {
  for (const node of nodes) {
    const row = await tx.projectStep.create({
      data: {
        projectId,
        name: node.name,
        order: orderRef.n++,
        parentStepId: parentId,
        estimatedDays: node.estimatedDays ?? null,
      },
    });
    if (node.children?.length) {
      await insertTemplateSteps(tx, projectId, node.children, row.id, orderRef);
    }
  }
}

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

/** Epic 6: Liste projets (id, name) pour select (ex. formulaire Date obtenue). */
export async function getProjectsForSelect(): Promise<
  { success: true; data: Array<{ id: string; name: string }> } | { success: false; error: { code: string; message: string } }
> {
  try {
    const userId = await requireAuth();
    const list = await prisma.project.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    return { success: true, data: list };
  } catch (e) {
    if (e instanceof AppError) return { success: false, error: { code: e.code || 'ERROR', message: e.message } };
    console.error('getProjectsForSelect:', e);
    return { success: false, error: { code: 'UNKNOWN', message: 'Une erreur est survenue' } };
  }
}

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

    // 3. Créer le projet avec l’arbre d’étapes (phases + sous-tâches)
    const tree = getProjectStepTreeForType(validatedData.type);
    const project = await prisma.$transaction(async (tx) => {
      const p = await tx.project.create({
        data: {
          name: validatedData.name,
          type: validatedData.type,
          userId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
        },
      });
      const orderRef = { n: 1 };
      await insertTemplateSteps(tx, p.id, tree, null, orderRef);
      return tx.project.findFirstOrThrow({
        where: { id: p.id },
        include: { steps: true },
      });
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

/** Dates de début / fin du projet (modifiables). */
export async function updateProjectSchedule(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const data = updateProjectScheduleSchema.parse(input);
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId },
    });
    if (!project) throw new NotFoundError('Projet non trouvé');

    await prisma.project.update({
      where: { id: data.projectId },
      data: {
        startDate: data.startDate !== undefined ? data.startDate : undefined,
        endDate: data.endDate !== undefined ? data.endDate : undefined,
        weeklyDedicatedDays:
          data.weeklyDedicatedDays !== undefined ? data.weeklyDedicatedDays : undefined,
      },
    });
    return { success: true, data: { id: data.projectId } };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: error.message } };
    }
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code || 'ERROR', message: error.message } };
    }
    console.error('updateProjectSchedule:', error);
    return { success: false, error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la mise à jour' } };
  }
}

/** Met à jour nom, date prévue ou durée estimée d’une étape. */
export async function updateProjectStepDetails(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const data = updateProjectStepDetailsSchema.parse(input);
    const step = await prisma.projectStep.findUnique({
      where: { id: data.stepId },
      include: { project: true },
    });
    if (!step || step.project.userId !== userId) {
      throw new ForbiddenError('Étape non trouvée ou accès refusé');
    }

    await prisma.projectStep.update({
      where: { id: data.stepId },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        plannedDate: data.plannedDate !== undefined ? data.plannedDate : undefined,
        estimatedDays: data.estimatedDays !== undefined ? data.estimatedDays : undefined,
      },
    });
    return { success: true, data: { id: data.stepId } };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: error.message } };
    }
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code || 'ERROR', message: error.message } };
    }
    console.error('updateProjectStepDetails:', error);
    return { success: false, error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la mise à jour' } };
  }
}

/** Ajoute une étape ou sous-étape en fin de liste du projet. */
export async function addProjectStep(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const data = addProjectStepSchema.parse(input);
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId },
    });
    if (!project) throw new NotFoundError('Projet non trouvé');

    if (data.parentStepId) {
      const parent = await prisma.projectStep.findFirst({
        where: { id: data.parentStepId, projectId: data.projectId },
      });
      if (!parent) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Étape parente invalide' } };
      }
    }

    const agg = await prisma.projectStep.aggregate({
      where: { projectId: data.projectId },
      _max: { order: true },
    });
    const nextOrder = (agg._max.order ?? 0) + 1;

    const created = await prisma.projectStep.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        order: nextOrder,
        parentStepId: data.parentStepId ?? null,
        estimatedDays: data.estimatedDays ?? null,
      },
    });
    return { success: true, data: { id: created.id } };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: error.message } };
    }
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code || 'ERROR', message: error.message } };
    }
    console.error('addProjectStep:', error);
    return { success: false, error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de l’ajout' } };
  }
}

/** Supprime une étape (les sous-tâches sont supprimées en cascade). */
export async function deleteProjectStep(input: unknown): Promise<ActionResult<void>> {
  try {
    const userId = await requireAuth();
    const { stepId } = deleteProjectStepSchema.parse(input);
    const step = await prisma.projectStep.findUnique({
      where: { id: stepId },
      include: { project: true },
    });
    if (!step || step.project.userId !== userId) {
      throw new ForbiddenError('Étape non trouvée ou accès refusé');
    }
    await prisma.projectStep.delete({ where: { id: stepId } });
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: error.message } };
    }
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code || 'ERROR', message: error.message } };
    }
    console.error('deleteProjectStep:', error);
    return { success: false, error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors de la suppression' } };
  }
}

/**
 * Remplit les dates prévues des étapes à partir de la date de début du projet
 * (ou aujourd’hui) et des durées estimées (jours).
 */
export async function applySuggestedStepDates(
  input: unknown
): Promise<ActionResult<{ updated: number; warning?: string }>> {
  try {
    const userId = await requireAuth();
    const { projectId } = applySuggestedStepDatesSchema.parse(input);
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        steps: { orderBy: { order: 'asc' } },
      },
    });
    if (!project) throw new NotFoundError('Projet non trouvé');

    const base = project.startDate ?? new Date();
    const weekly = clampWeeklyDedicatedDays(
      project.weeklyDedicatedDays != null ? project.weeklyDedicatedDays : 3
    );
    const { dates: map, warning } = suggestPlannedDatesForProject({
      steps: project.steps.map((s) => ({
        id: s.id,
        order: s.order,
        estimatedDays: s.estimatedDays,
      })),
      start: base,
      end: project.endDate,
      weeklyDedicatedDays: weekly,
    });

    await prisma.$transaction(
      [...map.entries()].map(([id, plannedDate]) =>
        prisma.projectStep.update({
          where: { id },
          data: { plannedDate },
        })
      )
    );

    return { success: true, data: { updated: map.size, warning } };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: error.message } };
    }
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code || 'ERROR', message: error.message } };
    }
    console.error('applySuggestedStepDates:', error);
    return { success: false, error: { code: 'UNKNOWN_ERROR', message: 'Erreur lors du calcul des dates' } };
  }
}
