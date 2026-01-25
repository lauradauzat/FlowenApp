import { z } from 'zod';
import { VenueStatus } from '@prisma/client';

/**
 * Schéma de validation pour la création d'une salle
 * Les champs optionnels acceptent les chaînes vides depuis les formulaires et sont normalisés en undefined.
 */
export const createVenueSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Le nom de la salle est requis')
      .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
    address: z
      .string()
      .max(500, "L'adresse ne peut pas dépasser 500 caractères")
      .optional()
      .or(z.literal('')),
    capacity: z
      .union([
        z.number().int('La capacité doit être un nombre entier').positive('La capacité doit être positive'),
        z.string().transform((val) => (val === '' ? undefined : parseInt(val, 10))),
      ])
      .optional()
      .refine((val) => val === undefined || (typeof val === 'number' && val > 0), {
        message: 'La capacité doit être un nombre entier positif',
      }),
    style: z
      .string()
      .max(100, 'Le style ne peut pas dépasser 100 caractères')
      .optional()
      .or(z.literal('')),
    region: z
      .string()
      .max(200, 'La région ne peut pas dépasser 200 caractères')
      .optional()
      .or(z.literal('')),
    website: z
      .string()
      .url('URL invalide')
      .max(500, "L'URL ne peut pas dépasser 500 caractères")
      .optional()
      .or(z.literal('')),
    notes: z
      .string()
      .max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères')
      .optional()
      .or(z.literal('')),
  })
  .transform((data) => ({
    ...data,
    address: data.address || undefined,
    capacity: data.capacity || undefined,
    style: data.style || undefined,
    region: data.region || undefined,
    website: data.website || undefined,
    notes: data.notes || undefined,
  }));

export type CreateVenueInput = z.infer<typeof createVenueSchema>;

/**
 * Schéma de validation pour la mise à jour d'une salle
 */
export const updateVenueSchema = z.object({
  id: z.string().min(1, "L'identifiant de la salle est requis"),
  name: z
    .string()
    .min(1, 'Le nom de la salle est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .optional(),
  address: z
    .string()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional(),
  capacity: z
    .number()
    .int('La capacité doit être un nombre entier')
    .positive('La capacité doit être positive')
    .optional(),
  style: z
    .string()
    .max(100, 'Le style ne peut pas dépasser 100 caractères')
    .optional(),
  region: z
    .string()
    .max(200, 'La région ne peut pas dépasser 200 caractères')
    .optional(),
  website: z
    .string()
    .url('URL invalide')
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional(),
  notes: z
    .string()
    .max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères')
    .optional(),
  status: z.nativeEnum(VenueStatus).optional(),
});

export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;

/**
 * Schéma de validation pour la suppression d'une salle
 */
export const deleteVenueSchema = z.object({
  id: z.string().min(1, "L'identifiant de la salle est requis"),
});

export type DeleteVenueInput = z.infer<typeof deleteVenueSchema>;

/**
 * Schéma de validation pour l'archivage/restauration d'une salle
 */
export const archiveVenueSchema = z.object({
  id: z.string().min(1, "L'identifiant de la salle est requis"),
});

export type ArchiveVenueInput = z.infer<typeof archiveVenueSchema>;
