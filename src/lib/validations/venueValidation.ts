import { z } from 'zod';

export type ValidationError = {
  field: string;
  message: string;
  type: 'missing' | 'invalid' | 'warning';
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

/**
 * Valide une salle et retourne les erreurs détectées
 */
export function validateVenue(data: {
  name?: string | null;
  address?: string | null;
  capacity?: number | null;
  style?: string | null;
  region?: string | null;
  website?: string | null;
  notes?: string | null;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Vérifier les champs requis
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Le nom de la salle est requis',
      type: 'missing',
    });
  }

  // Vérifier le format de l'URL du site web si présent
  if (data.website && data.website.trim().length > 0) {
    const urlSchema = z.string().url();
    const result = urlSchema.safeParse(data.website.trim());
    if (!result.success) {
      errors.push({
        field: 'website',
        message: 'Le format de l\'URL est invalide',
        type: 'invalid',
      });
    }
  }

  // Vérifier la capacité si présente
  if (data.capacity !== null && data.capacity !== undefined) {
    if (data.capacity < 1) {
      errors.push({
        field: 'capacity',
        message: 'La capacité doit être un nombre positif',
        type: 'invalid',
      });
    }
  }

  // Avertissement si pas d'adresse ni de région (localisation manquante)
  if (
    (!data.address || data.address.trim().length === 0) &&
    (!data.region || data.region.trim().length === 0)
  ) {
    errors.push({
      field: 'location',
      message: 'Aucune information de localisation (adresse ou région) renseignée',
      type: 'warning',
    });
  }

  return {
    isValid: errors.filter((e) => e.type !== 'warning').length === 0,
    errors,
  };
}
