import { z } from 'zod';

/**
 * Schéma de validation pour lancer un scraping de salles
 */
export const startVenueScrapingSchema = z.object({
  sourceId: z.string().min(1, "L'identifiant de la source est requis").optional(),
});

export type StartVenueScrapingInput = z.infer<typeof startVenueScrapingSchema>;

/**
 * Schéma de validation pour lancer un scraping de contacts
 */
export const startContactScrapingSchema = z.object({
  sourceId: z.string().min(1, "L'identifiant de la source est requis").optional(),
});

export type StartContactScrapingInput = z.infer<typeof startContactScrapingSchema>;

/**
 * Schéma de validation pour récupérer le statut d'un job
 */
export const getScrapingJobStatusSchema = z.object({
  jobId: z.string().min(1, "L'identifiant du job est requis"),
});

export type GetScrapingJobStatusInput = z.infer<typeof getScrapingJobStatusSchema>;
