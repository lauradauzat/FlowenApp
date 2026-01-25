import { describe, it, expect } from 'vitest';
import { createContactSchema } from '@/lib/validations/contact';

describe('createContactSchema', () => {
  it('valide un payload minimal correct', () => {
    const result = createContactSchema.parse({
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'laura@example.com',
    });

    expect(result.firstName).toBe('Laura');
    expect(result.lastName).toBe('Capuche');
    expect(result.email).toBe('laura@example.com');
  });

  it('rejette un email invalide', () => {
    expect(() =>
      createContactSchema.parse({
        firstName: 'Laura',
        lastName: 'Capuche',
        email: 'not-an-email',
      }),
    ).toThrowError(/Email invalide/);
  });

  it('rejette l’absence de prénom ou nom', () => {
    expect(() =>
      createContactSchema.parse({
        firstName: '',
        lastName: 'Capuche',
      }),
    ).toThrow();

    expect(() =>
      createContactSchema.parse({
        firstName: 'Laura',
        lastName: '',
      }),
    ).toThrow();
  });
});

