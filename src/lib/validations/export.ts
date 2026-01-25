import { z } from 'zod';
import { ContactStatus, VenueStatus } from '@prisma/client';

/**
 * Schéma de validation pour l'export de contacts
 */
export const exportContactsSchema = z.object({
  fields: z
    .array(
      z.enum(['firstName', 'lastName', 'email', 'phone', 'role', 'notes', 'status', 'venues'])
    )
    .min(1, 'Au moins un champ doit être sélectionné')
    .optional()
    .default(['firstName', 'lastName', 'email', 'phone', 'role', 'status']),
  filters: z
    .object({
      status: z.nativeEnum(ContactStatus).optional(),
      role: z.string().optional(),
    })
    .optional(),
  includeRelations: z.boolean().optional().default(false),
});

/**
 * Schéma de validation pour l'export de salles
 */
export const exportVenuesSchema = z.object({
  fields: z
    .array(
      z.enum([
        'name',
        'address',
        'region',
        'website',
        'capacity',
        'style',
        'notes',
        'status',
        'contacts',
      ])
    )
    .min(1, 'Au moins un champ doit être sélectionné')
    .optional()
    .default(['name', 'address', 'region', 'website', 'capacity', 'status']),
  filters: z
    .object({
      status: z.nativeEnum(VenueStatus).optional(),
      region: z.string().optional(),
    })
    .optional(),
  includeRelations: z.boolean().optional().default(false),
});

/**
 * Schéma de validation pour l'export combiné
 */
export const exportDataSchema = z.object({
  type: z.enum(['contacts', 'venues', 'both']),
  contacts: exportContactsSchema.optional(),
  venues: exportVenuesSchema.optional(),
});

export type ExportDataInput = z.infer<typeof exportDataSchema>;
