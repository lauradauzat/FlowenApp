import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createContact } from '@/actions/contactActions';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';

vi.mock('@/lib/auth/utils', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/lib/prisma/client', () => {
  const contactCreate = vi.fn();
  return {
    prisma: {
      contact: {
        create: contactCreate,
      },
    },
  };
});

const mockedRequireAuth = requireAuth as unknown as ReturnType<typeof vi.fn>;
const mockedPrisma = prisma as unknown as {
  contact: {
    create: ReturnType<typeof vi.fn>;
  };
};

describe('createContact action', () => {
  beforeEach(() => {
    mockedPrisma.contact.create.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('crée un contact avec le userId authentifié et retourne un succès', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.create.mockResolvedValue({
      id: 'contact_1',
      userId: 'user_123',
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'laura@example.com',
      phone: null,
      role: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createContact({
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'laura@example.com',
    });

    expect(mockedRequireAuth).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.contact.create).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.contact.create).toHaveBeenCalledWith({
      data: {
        userId: 'user_123',
        firstName: 'Laura',
        lastName: 'Capuche',
        email: 'laura@example.com',
        phone: undefined,
        role: undefined,
        notes: undefined,
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'contact_1' });
  });
});

