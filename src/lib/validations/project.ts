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
