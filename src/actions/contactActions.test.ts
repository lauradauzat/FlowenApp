import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  archiveContact,
  restoreContact,
  markContactAsObsolete,
  markContactAsValid,
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
  const userSettingsFindUnique = vi.fn();
  return {
    prisma: {
      contact: {
        create: contactCreate,
        findMany: contactFindMany,
        findFirst: contactFindFirst,
        update: contactUpdate,
        delete: contactDelete,
      },
      userSettings: {
        findUnique: userSettingsFindUnique,
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
  userSettings: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  mockedPrisma.userSettings.findUnique.mockReset();
  mockedPrisma.userSettings.findUnique.mockResolvedValue(null);
});

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

  it('refuse la création si les paramètres fiche exigent un email (Story 10.3)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.userSettings.findUnique.mockResolvedValue({
      ficheContactFields: { email: { visible: true, required: true } },
      ficheVenueFields: null,
    });

    const result = await createContact({
      firstName: 'Laura',
      lastName: 'Capuche',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toMatch(/email/i);
    expect(mockedPrisma.contact.create).not.toHaveBeenCalled();
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

describe('archiveContact action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('archive un contact quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ACTIVE',
    });
    mockedPrisma.contact.update.mockResolvedValue({
      id: 'c1',
      status: 'ARCHIVED',
    });

    const result = await archiveContact({ id: 'c1' });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
    });
    expect(mockedPrisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: 'ARCHIVED' },
    });
    expect(result.success).toBe(true);
  });

  it('retourne ALREADY_ARCHIVED si le contact est déjà archivé', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ARCHIVED',
    });

    const result = await archiveContact({ id: 'c1' });

    expect(mockedPrisma.contact.update).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_ARCHIVED');
  });

  it('retourne NOT_FOUND si le contact n\'appartient pas à l\'utilisateur', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await archiveContact({ id: 'c_autre_user' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('restoreContact action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('restaure un contact archivé quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ARCHIVED',
    });
    mockedPrisma.contact.update.mockResolvedValue({
      id: 'c1',
      status: 'ACTIVE',
    });

    const result = await restoreContact({ id: 'c1' });

    expect(mockedPrisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: 'ACTIVE' },
    });
    expect(result.success).toBe(true);
  });

  it('retourne ALREADY_ACTIVE si le contact est déjà actif', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ACTIVE',
    });

    const result = await restoreContact({ id: 'c1' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_ACTIVE');
  });
});

describe('markContactAsObsolete action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('marque un contact comme obsolète quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ACTIVE',
    });
    mockedPrisma.contact.update.mockResolvedValue({
      id: 'c1',
      status: 'ERROR',
    });

    const result = await markContactAsObsolete({ id: 'c1' });

    expect(mockedPrisma.contact.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: 'ERROR' },
    });
    expect(result.success).toBe(true);
  });

  it('retourne ALREADY_OBSOLETE si le contact est déjà obsolète', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ERROR',
    });

    const result = await markContactAsObsolete({ id: 'c1' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_OBSOLETE');
  });
});

describe('markContactAsValid action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.contact.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('marque un contact obsolète comme valide si les données sont valides', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'Laura',
      lastName: 'Capuche',
      email: 'laura@example.com',
      phone: null,
      role: null,
      notes: null,
      status: 'ERROR',
    });
    mockedPrisma.contact.update.mockResolvedValue({
      id: 'c1',
      status: 'ACTIVE',
    });

    const result = await markContactAsValid({ id: 'c1' });

    expect(mockedPrisma.contact.update).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('retourne NOT_OBSOLETE si le contact n\'est pas obsolète', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      status: 'ACTIVE',
    });

    const result = await markContactAsValid({ id: 'c1' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_OBSOLETE');
  });
});

