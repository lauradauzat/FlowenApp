import { describe, it, expect } from 'vitest';
import { validateAndNormalizeMailingFrom } from '@/lib/validations/mailing';

describe('validateAndNormalizeMailingFrom', () => {
  it('accepte null et chaîne vide comme défaut serveur', () => {
    expect(validateAndNormalizeMailingFrom(null)).toEqual({ ok: true, value: null });
    expect(validateAndNormalizeMailingFrom('')).toEqual({ ok: true, value: null });
    expect(validateAndNormalizeMailingFrom('   ')).toEqual({ ok: true, value: null });
  });

  it('accepte un email seul', () => {
    expect(validateAndNormalizeMailingFrom('hello@example.com')).toEqual({
      ok: true,
      value: 'hello@example.com',
    });
  });

  it('accepte Nom <email>', () => {
    const r = validateAndNormalizeMailingFrom('Booking <hello@example.com>');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('Booking <hello@example.com>');
  });

  it('refuse un format invalide', () => {
    const r = validateAndNormalizeMailingFrom('pas-un-email');
    expect(r.ok).toBe(false);
  });
});
