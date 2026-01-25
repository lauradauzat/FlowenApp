import { z } from 'zod';

/**
 * Schéma de validation pour ajouter un contact à une salle
 */
export const addContactToVenueSchema = z.object({
  contactId: z.string().min(1, "L'identifiant du contact est requis"),
  venueId: z.string().min(1, "L'identifiant de la salle est requis"),
});

export type AddContactToVenueInput = z.infer<typeof addContactToVenueSchema>;

/**
 * Schéma de validation pour retirer un contact d'une salle
 */
export const removeContactFromVenueSchema = z.object({
  contactId: z.string().min(1, "L'identifiant du contact est requis"),
  venueId: z.string().min(1, "L'identifiant de la salle est requis"),
});

export type RemoveContactFromVenueInput = z.infer<typeof removeContactFromVenueSchema>;
