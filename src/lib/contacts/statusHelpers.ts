import type { ContactStatus } from '@prisma/client';

export function getStatusLabel(status: ContactStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';
    case 'ARCHIVED':
      return 'Archivé';
    case 'ERROR':
      return 'Avec erreurs';
    default:
      return status;
  }
}

export function getStatusClasses(status: ContactStatus): string {
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
