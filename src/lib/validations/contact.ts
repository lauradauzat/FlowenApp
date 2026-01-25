import { z } from 'zod';
import { ContactStatus } from '@prisma/client';

/**
 * Schéma de validation pour la création d'un contact
 * Les champs optionnels acceptent les chaînes vides depuis les formulaires et sont normalisés en undefined.
 */
export const createContactSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'Le prénom est requis')
      .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
    lastName: z
      .string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    email: z
      .string()
      .email('Email invalide')
      .max(255, 'L’email ne peut pas dépasser 255 caractères')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .max(50, 'Le téléphone ne peut pas dépasser 50 caractères')
      .optional()
      .or(z.literal('')),
    role: z
      .string()
      .max(100, 'Le rôle ne peut pas dépasser 100 caractères')
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
    email: data.email || undefined,
    phone: data.phone || undefined,
    role: data.role || undefined,
    notes: data.notes || undefined,
  }));

export type CreateContactInput = z.infer<typeof createContactSchema>;

/**
 * Schéma de validation pour la mise à jour d'un contact
 */
export const updateContactSchema = z.object({
  id: z.string().min(1, "L'identifiant du contact est requis"),
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  email: z
    .string()
    .email('Email invalide')
    .max(255, 'L’email ne peut pas dépasser 255 caractères')
    .optional(),
  phone: z
    .string()
    .max(50, 'Le téléphone ne peut pas dépasser 50 caractères')
    .optional(),
  role: z
    .string()
    .max(100, 'Le rôle ne peut pas dépasser 100 caractères')
    .optional(),
  notes: z
    .string()
    .max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères')
    .optional(),
  status: z.nativeEnum(ContactStatus).optional(),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

/**
 * Schéma de validation pour la suppression d'un contact
 */
export const deleteContactSchema = z.object({
  id: z.string().min(1, "L'identifiant du contact est requis"),
});

export type DeleteContactInput = z.infer<typeof deleteContactSchema>;

/**
 * Schéma de validation pour l'archivage/restauration d'un contact
 */
export const archiveContactSchema = z.object({
  id: z.string().min(1, "L'identifiant du contact est requis"),
});

export type ArchiveContactInput = z.infer<typeof archiveContactSchema>;

/**
 * Schéma de validation pour marquer un contact comme obsolète
 */
export const markContactObsoleteSchema = z.object({
  id: z.string().min(1, "L'identifiant du contact est requis"),
  reason: z.enum(['bounce', 'invalid_email', 'no_longer_here', 'other']).optional(),
});

export type MarkContactObsoleteInput = z.infer<typeof markContactObsoleteSchema>;

