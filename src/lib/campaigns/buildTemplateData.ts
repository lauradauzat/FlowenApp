/**
 * Construit l'objet de données pour replaceTemplateVariables à partir
 * d'un contact, d'une salle et optionnellement d'un projet.
 */

import type { Contact, Venue, Project } from '@prisma/client';

type C = Pick<Contact, 'firstName' | 'lastName' | 'email' | 'phone' | 'role'>;
type V = Pick<Venue, 'name' | 'capacity' | 'region' | 'style' | 'address' | 'website'>;
type P = Pick<Project, 'name' | 'type'> | null | undefined;

export function buildTemplateData(
  contact: C,
  venue: V,
  project?: P
): Record<string, string | number | null | undefined> {
  return {
    nom_salle: venue.name,
    capacite: venue.capacity ?? '',
    region: venue.region ?? '',
    style: venue.style ?? '',
    adresse: venue.address ?? '',
    site_web: venue.website ?? '',
    nom_contact: contact.lastName,
    prenom_contact: contact.firstName,
    email_contact: contact.email ?? '',
    telephone_contact: contact.phone ?? '',
    role_contact: contact.role ?? '',
    nom_projet: project?.name ?? '',
    type_projet: project?.type ?? '',
  };
}

