import { z } from 'zod';

/**
 * Schéma de validation pour la création d'un template de mailing
 */
export const createMailTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du template est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  subject: z
    .string()
    .min(1, 'Le sujet du mail est requis')
    .max(500, 'Le sujet ne peut pas dépasser 500 caractères'),
  body: z
    .string()
    .min(1, 'Le corps du mail est requis')
    .max(50000, 'Le corps ne peut pas dépasser 50000 caractères'),
});

export type CreateMailTemplateInput = z.infer<typeof createMailTemplateSchema>;

/**
 * Schéma de validation pour la mise à jour d'un template
 */
export const updateMailTemplateSchema = z.object({
  id: z.string().min(1, "L'identifiant du template est requis"),
  name: z
    .string()
    .min(1, 'Le nom du template est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .optional(),
  subject: z
    .string()
    .min(1, 'Le sujet du mail est requis')
    .max(500, 'Le sujet ne peut pas dépasser 500 caractères')
    .optional(),
  body: z
    .string()
    .min(1, 'Le corps du mail est requis')
    .max(50000, 'Le corps ne peut pas dépasser 50000 caractères')
    .optional(),
});

export type UpdateMailTemplateInput = z.infer<typeof updateMailTemplateSchema>;

/**
 * Schéma de validation pour la suppression d'un template
 */
export const deleteMailTemplateSchema = z.object({
  id: z.string().min(1, "L'identifiant du template est requis"),
});

export type DeleteMailTemplateInput = z.infer<typeof deleteMailTemplateSchema>;

/**
 * Schéma de validation pour la duplication d'un template
 */
export const duplicateMailTemplateSchema = z.object({
  id: z.string().min(1, "L'identifiant du template est requis"),
});

export type DuplicateMailTemplateInput = z.infer<typeof duplicateMailTemplateSchema>;

// --- Story 5.3: Variantes selon capacité, région, style ---

const capacityCategorySchema = z.enum(['petite', 'moyenne', 'grande']);

export const createMailTemplateVariantSchema = z.object({
  mailTemplateId: z.string().min(1, "L'identifiant du template est requis"),
  capacityCategory: capacityCategorySchema.nullable().optional(),
  region: z.string().max(200).nullable().optional(),
  style: z.string().max(200).nullable().optional(),
  subject: z
    .string()
    .min(1, 'Le sujet du mail est requis')
    .max(500, 'Le sujet ne peut pas dépasser 500 caractères'),
  body: z
    .string()
    .min(1, 'Le corps du mail est requis')
    .max(50000, 'Le corps ne peut pas dépasser 50000 caractères'),
  order: z.number().int().min(0).optional(),
});

export type CreateMailTemplateVariantInput = z.infer<typeof createMailTemplateVariantSchema>;

export const updateMailTemplateVariantSchema = z.object({
  id: z.string().min(1, "L'identifiant de la variante est requis"),
  capacityCategory: capacityCategorySchema.nullable().optional(),
  region: z.string().max(200).nullable().optional(),
  style: z.string().max(200).nullable().optional(),
  subject: z
    .string()
    .min(1, 'Le sujet du mail est requis')
    .max(500, 'Le sujet ne peut pas dépasser 500 caractères')
    .optional(),
  body: z
    .string()
    .min(1, 'Le corps du mail est requis')
    .max(50000, 'Le corps ne peut pas dépasser 50000 caractères')
    .optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateMailTemplateVariantInput = z.infer<typeof updateMailTemplateVariantSchema>;

export const deleteMailTemplateVariantSchema = z.object({
  id: z.string().min(1, "L'identifiant de la variante est requis"),
});

export type DeleteMailTemplateVariantInput = z.infer<typeof deleteMailTemplateVariantSchema>;
