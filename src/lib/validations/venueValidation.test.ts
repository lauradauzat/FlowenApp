import { describe, it, expect } from 'vitest';
import { validateVenue } from './venueValidation';

describe('validateVenue', () => {
  it('retourne isValid=true pour une salle valide', () => {
    const result = validateVenue({
      name: 'Le Bataclan',
      region: 'Paris',
      capacity: 1500,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('détecte le nom manquant', () => {
    const result = validateVenue({
      name: '',
      region: 'Paris',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('name');
    expect(result.errors[0].type).toBe('missing');
  });

  it('détecte une URL invalide pour le site web', () => {
    const result = validateVenue({
      name: 'Le Bataclan',
      website: 'not-a-url',
      address: 'Paris', // Ajouter adresse pour éviter l'avertissement
    });

    expect(result.isValid).toBe(false);
    const criticalErrors = result.errors.filter((e) => e.type !== 'warning');
    expect(criticalErrors).toHaveLength(1);
    expect(criticalErrors[0].field).toBe('website');
    expect(criticalErrors[0].type).toBe('invalid');
  });

  it('détecte une capacité invalide (négative)', () => {
    const result = validateVenue({
      name: 'Le Bataclan',
      capacity: -10,
      address: 'Paris', // Ajouter adresse pour éviter l'avertissement
    });

    expect(result.isValid).toBe(false);
    const criticalErrors = result.errors.filter((e) => e.type !== 'warning');
    expect(criticalErrors).toHaveLength(1);
    expect(criticalErrors[0].field).toBe('capacity');
    expect(criticalErrors[0].type).toBe('invalid');
  });

  it('ajoute un avertissement si pas d\'adresse ni région', () => {
    const result = validateVenue({
      name: 'Le Bataclan',
    });

    expect(result.isValid).toBe(true); // Pas d'erreur critique
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe('warning');
    expect(result.errors[0].message).toContain('localisation');
  });

  it('accepte une salle valide avec région mais sans adresse', () => {
    const result = validateVenue({
      name: 'Le Bataclan',
      region: 'Paris',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
