import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from '@/actions/contactActions';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';

vi.mock('@/lib/auth/utils', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/lib/validations/contactValidation', () => ({
  validateContact: vi.fn(() => ({ isValid: true })),
}));

vi.mock('@/lib/prisma/client', () => {
  const contactCreate = vi.fn();
  const contactFindMany = vi.fn();
  const contactFindFirst = vi.fn();
  const contactUpdate = vi.fn();
  const contactDelete = vi.fn();
  return {
    prisma: {
      contact: {
        create: contactCreate,
        findMany: contactFindMany,
        findFirst: contactFindFirst,
        update: contactUpdate,
        delete: contactDelete,
      },
    },
  };
});

const mockedRequireAuth = requireAuth as unknown as ReturnType<typeof vi.fn>;
const mockedPrisma = prisma as unknown as {
  contact: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
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
        status: 'ACTIVE',
        dataSource: 'MANUAL',
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'contact_1' });
  });
});

describe('getContacts action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findMany.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('retourne les contacts de l’utilisateur avec filtrage userId et exclut ARCHIVED', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findMany.mockResolvedValue([
      {
        id: 'c1',
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        phone: null,
        role: 'Manager',
        notes: null,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await getContacts();

    expect(mockedRequireAuth).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.contact.findMany).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.contact.findMany).toHaveBeenCalledWith({
      where: { userId: 'user_123', status: { not: 'ARCHIVED' } },
      orderBy: { createdAt: 'desc' },
    });
    expect(result.success).toBe(true);
    expect(result.data?.contacts).toHaveLength(1);
    expect(result.data?.contacts[0]).toMatchObject({
      id: 'c1',
      firstName: 'A',
      lastName: 'B',
      role: 'Manager',
      status: 'ACTIVE',
    });
  });
});

describe('updateContact action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('met à jour un contact quand l’utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      phone: null,
      role: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedPrisma.contact.update.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'A',
      lastName: 'BUpdated',
      email: 'a@b.com',
      phone: null,
      role: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateContact({
      id: 'c1',
      lastName: 'BUpdated',
    });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
    });
    expect(mockedPrisma.contact.update).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'c1' });
  });

  it('retourne une erreur NOT_FOUND quand le contact n’existe pas ou n’appartient pas à l’utilisateur (ownership)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await updateContact({
      id: 'c_autre_user',
      lastName: 'X',
    });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c_autre_user', userId: 'user_123' },
    });
    expect(mockedPrisma.contact.update).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toContain('Contact');
  });
});

describe('deleteContact action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.delete.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('supprime un contact quand l’utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'A',
      lastName: 'B',
      email: null,
      phone: null,
      role: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedPrisma.contact.delete.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'A',
      lastName: 'B',
      email: null,
      phone: null,
      role: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteContact({ id: 'c1' });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
    });
    expect(mockedPrisma.contact.delete).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'c1' });
  });

  it('retourne NOT_FOUND quand le contact n’existe pas ou n’appartient pas à l’utilisateur (multi‑tenancy)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await deleteContact({ id: 'c_autre_user' });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c_autre_user', userId: 'user_123' },
    });
    expect(mockedPrisma.contact.delete).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

