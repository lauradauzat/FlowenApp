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
 * Valide un contact et retourne les erreurs détectées
 */
export function validateContact(data: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  notes?: string | null;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Vérifier les champs requis
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push({
      field: 'firstName',
      message: 'Le prénom est requis',
      type: 'missing',
    });
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push({
      field: 'lastName',
      message: 'Le nom est requis',
      type: 'missing',
    });
  }

  // Vérifier le format de l'email si présent
  if (data.email && data.email.trim().length > 0) {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(data.email.trim());
    if (!result.success) {
      errors.push({
        field: 'email',
        message: 'Le format de l\'email est invalide',
        type: 'invalid',
      });
    }
  }

  // Avertissement si pas d'email ni de téléphone (données de contact manquantes)
  if (
    (!data.email || data.email.trim().length === 0) &&
    (!data.phone || data.phone.trim().length === 0)
  ) {
    errors.push({
      field: 'contact',
      message: 'Aucun moyen de contact (email ou téléphone) renseigné',
      type: 'warning',
    });
  }

  return {
    isValid: errors.filter((e) => e.type !== 'warning').length === 0,
    errors,
  };
}
