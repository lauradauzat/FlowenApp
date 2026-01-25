import { z } from 'zod';

/**
 * Schéma de validation pour le mapping des colonnes CSV pour les contacts
 */
export const contactColumnMappingSchema = z.object({
  firstName: z.string().min(1, 'La colonne prénom est requise'),
  lastName: z.string().min(1, 'La colonne nom est requise'),
  email: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  notes: z.string().optional(),
});

export type ContactColumnMapping = z.infer<typeof contactColumnMappingSchema>;

/**
 * Schéma de validation pour le mapping des colonnes CSV pour les salles
 */
export const venueColumnMappingSchema = z.object({
  name: z.string().min(1, 'La colonne nom est requise'),
  address: z.string().optional(),
  region: z.string().optional(),
  website: z.string().optional(),
  capacity: z.string().optional(),
  style: z.string().optional(),
  notes: z.string().optional(),
});

export type VenueColumnMapping = z.infer<typeof venueColumnMappingSchema>;

/**
 * Schéma de validation pour l'import de contacts depuis CSV
 */
export const importContactsFromCSVSchema = z.object({
  mapping: contactColumnMappingSchema,
  data: z.array(z.record(z.string(), z.string())).min(1, 'Aucune donnée à importer'),
  skipDuplicates: z.boolean().optional().default(true),
});

export type ImportContactsFromCSVInput = z.infer<typeof importContactsFromCSVSchema>;

/**
 * Schéma de validation pour l'import de salles depuis CSV
 */
export const importVenuesFromCSVSchema = z.object({
  mapping: venueColumnMappingSchema,
  data: z.array(z.record(z.string(), z.string())).min(1, 'Aucune donnée à importer'),
  skipDuplicates: z.boolean().optional().default(true),
});

export type ImportVenuesFromCSVInput = z.infer<typeof importVenuesFromCSVSchema>;

/**
 * Schéma de validation pour la prévisualisation CSV
 */
export const previewCSVSchema = z.object({
  type: z.enum(['contacts', 'venues']),
  mapping: z.record(z.string(), z.string().optional()),
  data: z.array(z.record(z.string(), z.string())).min(1),
});

export type PreviewCSVInput = z.infer<typeof previewCSVSchema>;
