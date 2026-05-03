import { z } from 'zod';
import { ProjectType } from '@prisma/client';

/**
 * Schéma de validation pour la création d'un projet
 * Accepte des dates en string (depuis formulaire) ou Date objects
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  type: z.nativeEnum(ProjectType),
  startDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => (val ? (typeof val === 'string' ? new Date(val) : val) : undefined)),
  endDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => (val ? (typeof val === 'string' ? new Date(val) : val) : undefined)),
}).refine(
  (data) => {
    // Si les deux dates sont présentes, endDate doit être après startDate
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate'],
  }
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Schéma de validation pour la mise à jour d'un projet
 */
export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.nativeEnum(ProjectType).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate'],
  }
);

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/**
 * Schéma de validation pour la mise à jour du statut d'une étape
 */
export const updateStepStatusSchema = z.object({
  stepId: z.string().min(1, 'ID de l\'étape requis'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
});

export type UpdateStepStatusInput = z.infer<typeof updateStepStatusSchema>;

export const updateProjectScheduleSchema = z
  .object({
    projectId: z.string().min(1),
    startDate: z.union([z.string(), z.date()]).nullable().optional(),
    endDate: z.union([z.string(), z.date()]).nullable().optional(),
    /** Jours de travail équivalent / semaine (0,5–7) pour calibrer les suggestions */
    weeklyDedicatedDays: z.union([z.number(), z.string()]).nullable().optional(),
  })
  .transform((data) => {
    let weeklyDedicatedDays: number | null | undefined = undefined;
    if (data.weeklyDedicatedDays !== undefined && data.weeklyDedicatedDays !== null) {
      const raw =
        typeof data.weeklyDedicatedDays === 'string'
          ? data.weeklyDedicatedDays === ''
            ? null
            : parseFloat(data.weeklyDedicatedDays)
          : data.weeklyDedicatedDays;
      if (raw === null) {
        weeklyDedicatedDays = null;
      } else if (typeof raw === 'number' && Number.isFinite(raw)) {
        weeklyDedicatedDays = Math.min(7, Math.max(0.5, raw));
      }
      /* chaîne invalide → undefined : ne pas écraser la valeur en base */
    } else if (data.weeklyDedicatedDays === null) {
      weeklyDedicatedDays = null;
    }

    return {
      projectId: data.projectId,
      startDate:
        data.startDate === undefined
          ? undefined
          : data.startDate === null
            ? null
            : typeof data.startDate === 'string'
              ? data.startDate === ''
                ? null
                : new Date(data.startDate)
              : data.startDate,
      endDate:
        data.endDate === undefined
          ? undefined
          : data.endDate === null
            ? null
            : typeof data.endDate === 'string'
              ? data.endDate === ''
                ? null
                : new Date(data.endDate)
              : data.endDate,
      weeklyDedicatedDays,
    };
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: 'La date de fin doit être après la date de début', path: ['endDate'] }
  );

export const updateProjectStepDetailsSchema = z.object({
  stepId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  plannedDate: z
    .union([z.string(), z.date()])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === null) return null;
      if (typeof val === 'string') {
        if (val === '') return null;
        return new Date(val);
      }
      return val;
    }),
  estimatedDays: z.number().int().min(0).max(365).nullable().optional(),
});

export const addProjectStepSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(200),
  parentStepId: z.string().min(1).nullable().optional(),
  estimatedDays: z.number().int().min(0).max(365).nullable().optional(),
});

export const deleteProjectStepSchema = z.object({
  stepId: z.string().min(1),
});

export const applySuggestedStepDatesSchema = z.object({
  projectId: z.string().min(1),
});
