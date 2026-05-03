import type { ContactStatus, VenueStatus } from '@prisma/client';

type Status = ContactStatus | VenueStatus;

export function getStatusLabel(status: Status): string {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';
    case 'ARCHIVED':
      return 'Archivé';
    case 'ERROR':
      return 'Avec erreurs';
    default:
      return String(status);
  }
}

export function getStatusClasses(status: Status): string {
  switch (status) {
    case 'ACTIVE':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
    case 'ARCHIVED':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700';
    case 'ERROR':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800';
    default:
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700';
  }
}

// Helpers spécifiques pour compatibilité (même logique mais typés)
export function getContactStatusLabel(status: ContactStatus): string {
  return getStatusLabel(status);
}

export function getVenueStatusLabel(status: VenueStatus): string {
  return getStatusLabel(status);
}

export function getContactStatusClasses(status: ContactStatus): string {
  return getStatusClasses(status);
}

export function getVenueStatusClasses(status: VenueStatus): string {
  return getStatusClasses(status);
}
