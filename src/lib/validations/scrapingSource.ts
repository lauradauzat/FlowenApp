import { z } from 'zod';
import { ScrapingSourceType } from '@prisma/client';

/**
 * Schéma de validation pour la création d'une source de scraping
 */
export const createScrapingSourceSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Le nom de la source est requis')
      .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
    type: z.nativeEnum(ScrapingSourceType),
    url: z
      .string()
      .max(500, "L'URL ne peut pas dépasser 500 caractères")
      .optional()
      .or(z.literal('')),
    selectors: z.record(z.string(), z.unknown()).optional(), // JSON object
    apiKey: z
      .string()
      .max(500, "La clé API ne peut pas dépasser 500 caractères")
      .optional()
      .or(z.literal('')),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).optional(),
    isActive: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.url && data.url !== '') {
      const urlResult = z.string().url().safeParse(data.url);
      if (!urlResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'URL invalide',
          path: ['url'],
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    url: data.url === '' ? undefined : data.url,
    apiKey: data.apiKey === '' ? undefined : data.apiKey,
  }));

export type CreateScrapingSourceInput = z.infer<typeof createScrapingSourceSchema>;

/**
 * Schéma de validation pour la mise à jour d'une source de scraping
 */
export const updateScrapingSourceSchema = z.object({
  id: z.string().min(1, "L'identifiant de la source est requis"),
  name: z
    .string()
    .min(1, 'Le nom de la source est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .optional(),
  type: z.nativeEnum(ScrapingSourceType).optional(),
  url: z
    .string()
    .url('URL invalide')
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional(),
  selectors: z.record(z.string(), z.unknown()).optional(),
  apiKey: z
    .string()
    .max(500, "La clé API ne peut pas dépasser 500 caractères")
    .optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateScrapingSourceInput = z.infer<typeof updateScrapingSourceSchema>;

/**
 * Schéma de validation pour la suppression d'une source de scraping
 */
export const deleteScrapingSourceSchema = z.object({
  id: z.string().min(1, "L'identifiant de la source est requis"),
});

export type DeleteScrapingSourceInput = z.infer<typeof deleteScrapingSourceSchema>;

/**
 * Schéma de validation pour tester une source de scraping
 */
export const testScrapingSourceSchema = z.object({
  id: z.string().min(1, "L'identifiant de la source est requis"),
});

export type TestScrapingSourceInput = z.infer<typeof testScrapingSourceSchema>;
