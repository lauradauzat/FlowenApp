import { z } from 'zod';

/**
 * Schéma de validation pour les liens réseaux sociaux
 */
export const socialLinksSchema = z.object({
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  spotify: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  soundcloud: z.string().url().optional().or(z.literal('')),
  bandcamp: z.string().url().optional().or(z.literal('')),
}).passthrough(); // Permet d'autres champs non définis

/**
 * Schéma de validation pour la mise à jour des données personnelles d'un projet
 */
export const updateProjectPersonalDataSchema = z.object({
  projectId: z.string().min(1, 'ID du projet requis'),
  bio: z.string().max(5000, 'La bio ne peut pas dépasser 5000 caractères').optional().or(z.literal('')),
  photos: z.array(z.string().url('URL de photo invalide')).optional(),
  videos: z.array(z.string().url('URL de vidéo invalide')).optional(),
  socialLinks: socialLinksSchema.optional(),
});

export type UpdateProjectPersonalDataInput = z.infer<typeof updateProjectPersonalDataSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
