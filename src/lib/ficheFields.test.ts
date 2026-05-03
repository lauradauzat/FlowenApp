import { describe, it, expect } from 'vitest';
import {
  getEffectiveFicheConfig,
  validateContactAgainstFicheConfig,
  validateVenueAgainstFicheConfig,
} from '@/lib/ficheFields';

describe('validateContactAgainstFicheConfig', () => {
  it('signale un champ obligatoire vide', () => {
    const { contact } = getEffectiveFicheConfig(
      { email: { visible: true, required: true } },
      null
    );
    const errs = validateContactAgainstFicheConfig(
      {
        firstName: 'A',
        lastName: 'B',
        email: '',
      },
      contact
    );
    expect(errs.some((e) => e.includes('email'))).toBe(true);
  });

  it('ne impose pas un champ non visible même si required dans le JSON brut', () => {
    const { contact } = getEffectiveFicheConfig(
      { phone: { visible: false, required: true } },
      null
    );
    const errs = validateContactAgainstFicheConfig(
      {
        firstName: 'A',
        lastName: 'B',
        phone: undefined,
      },
      contact
    );
    expect(errs).toHaveLength(0);
  });
});

describe('validateVenueAgainstFicheConfig', () => {
  it('exige une capacité numérique valide si obligatoire', () => {
    const { venue } = getEffectiveFicheConfig(null, {
      capacity: { visible: true, required: true },
    });
    const errs = validateVenueAgainstFicheConfig(
      { name: 'Salle X', capacity: null },
      venue
    );
    expect(errs.length).toBeGreaterThan(0);
  });

  it('accepte une capacité renseignée', () => {
    const { venue } = getEffectiveFicheConfig(null, {
      capacity: { visible: true, required: true },
    });
    const errs = validateVenueAgainstFicheConfig(
      { name: 'Salle X', capacity: 200 },
      venue
    );
    expect(errs).toHaveLength(0);
  });
});
