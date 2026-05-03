import { describe, it, expect } from 'vitest';
import { validateContact } from './contactValidation';

describe('validateContact', () => {
  it('retourne isValid=true pour un contact valide', () => {
    const result = validateContact({
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'laura@example.com',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('détecte le prénom manquant', () => {
    const result = validateContact({
      firstName: '',
      lastName: 'Capuche',
      email: 'laura@example.com', // Ajouter email pour éviter l'avertissement
    });

    expect(result.isValid).toBe(false);
    const criticalErrors = result.errors.filter((e) => e.type !== 'warning');
    expect(criticalErrors).toHaveLength(1);
    expect(criticalErrors[0].field).toBe('firstName');
    expect(criticalErrors[0].type).toBe('missing');
  });

  it('détecte le nom manquant', () => {
    const result = validateContact({
      firstName: 'Laura',
      lastName: '',
      email: 'laura@example.com', // Ajouter email pour éviter l'avertissement
    });

    expect(result.isValid).toBe(false);
    const criticalErrors = result.errors.filter((e) => e.type !== 'warning');
    expect(criticalErrors).toHaveLength(1);
    expect(criticalErrors[0].field).toBe('lastName');
    expect(criticalErrors[0].type).toBe('missing');
  });

  it('détecte un email invalide', () => {
    const result = validateContact({
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'invalid-email',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('email');
    expect(result.errors[0].type).toBe('invalid');
  });

  it('ajoute un avertissement si pas d\'email ni téléphone', () => {
    const result = validateContact({
      firstName: 'Laura',
      lastName: 'Capuche',
    });

    expect(result.isValid).toBe(true); // Pas d'erreur critique
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe('warning');
    expect(result.errors[0].message).toContain('contact');
  });

  it('accepte un contact valide avec téléphone mais sans email', () => {
    const result = validateContact({
      firstName: 'Laura',
      lastName: 'Capuche',
      phone: '+33 6 12 34 56 78',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
