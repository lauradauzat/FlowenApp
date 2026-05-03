import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createVenue,
  getVenues,
  updateVenue,
  deleteVenue,
  archiveVenue,
  restoreVenue,
} from '@/actions/venueActions';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';

vi.mock('@/lib/auth/utils', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/lib/validations/venueValidation', () => ({
  validateVenue: vi.fn(() => ({ isValid: true })),
}));

vi.mock('@/lib/prisma/client', () => {
  const venueCreate = vi.fn();
  const venueFindMany = vi.fn();
  const venueFindFirst = vi.fn();
  const venueUpdate = vi.fn();
  const venueDelete = vi.fn();
  const userSettingsFindUnique = vi.fn();
  return {
    prisma: {
      venue: {
        create: venueCreate,
        findMany: venueFindMany,
        findFirst: venueFindFirst,
        update: venueUpdate,
        delete: venueDelete,
      },
      userSettings: {
        findUnique: userSettingsFindUnique,
      },
    },
  };
});

const mockedRequireAuth = requireAuth as unknown as ReturnType<typeof vi.fn>;
const mockedPrisma = prisma as unknown as {
  venue: {
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

describe('createVenue action', () => {
  beforeEach(() => {
    mockedPrisma.venue.create.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('crée une salle avec le userId authentifié et retourne un succès', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.create.mockResolvedValue({
      id: 'venue_1',
      userId: 'user_123',
      name: 'Le Bataclan',
      address: '50 Boulevard Voltaire, 75011 Paris',
      capacity: 1500,
      style: 'Rock',
      region: 'Paris',
      website: 'https://www.bataclan.fr',
      notes: null,
      status: 'ACTIVE',
      dataSource: 'MANUAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createVenue({
      name: 'Le Bataclan',
      address: '50 Boulevard Voltaire, 75011 Paris',
      capacity: 1500,
      style: 'Rock',
      region: 'Paris',
      website: 'https://www.bataclan.fr',
    });

    expect(mockedRequireAuth).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.venue.create).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.venue.create).toHaveBeenCalledWith({
      data: {
        userId: 'user_123',
        name: 'Le Bataclan',
        address: '50 Boulevard Voltaire, 75011 Paris',
        capacity: 1500,
        style: 'Rock',
        region: 'Paris',
        website: 'https://www.bataclan.fr',
        notes: undefined,
        status: 'ACTIVE',
        dataSource: 'MANUAL',
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'venue_1' });
  });

  it('refuse la création si les paramètres fiche exigent une capacité (Story 10.3)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.userSettings.findUnique.mockResolvedValue({
      ficheContactFields: null,
      ficheVenueFields: { capacity: { visible: true, required: true } },
    });

    const result = await createVenue({
      name: 'Sans capacité',
      address: 'Paris',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toMatch(/capacité/i);
    expect(mockedPrisma.venue.create).not.toHaveBeenCalled();
  });
});

describe('getVenues action', () => {
  beforeEach(() => {
    mockedPrisma.venue.findMany.mockReset();
    mockedRequireAuth.mockReset();
  });

    it('retourne les salles de l\'utilisateur avec filtrage userId et exclut ARCHIVED', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findMany.mockResolvedValue([
      {
        id: 'v1',
        name: 'Le Bataclan',
        address: 'Paris',
        capacity: 1500,
        style: 'Rock',
        region: 'Paris',
        website: 'https://www.bataclan.fr',
        notes: null,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await getVenues();

    expect(mockedRequireAuth).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.venue.findMany).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.venue.findMany).toHaveBeenCalledWith({
      where: { userId: 'user_123', status: { not: 'ARCHIVED' } },
      orderBy: { createdAt: 'desc' },
    });
    expect(result.success).toBe(true);
    expect(result.data?.venues).toHaveLength(1);
    expect(result.data?.venues[0]).toMatchObject({
      id: 'v1',
      name: 'Le Bataclan',
      capacity: 1500,
      style: 'Rock',
      status: 'ACTIVE',
    });
  });
});

describe('updateVenue action', () => {
  beforeEach(() => {
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.venue.update.mockReset();
    mockedRequireAuth.mockReset();
  });

    it('met à jour une salle quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      name: 'Le Bataclan',
      address: 'Paris',
      capacity: 1500,
      style: 'Rock',
      region: 'Paris',
      website: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedPrisma.venue.update.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      name: 'Le Bataclan',
      address: 'Paris',
      capacity: 2000,
      style: 'Rock',
      region: 'Paris',
      website: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateVenue({
      id: 'v1',
      capacity: 2000,
    });

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.update).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'v1' });
  });

    it('retourne une erreur NOT_FOUND quand la salle n\'existe pas ou n\'appartient pas à l\'utilisateur (ownership)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue(null);

    const result = await updateVenue({
      id: 'v_autre_user',
      capacity: 2000,
    });

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v_autre_user', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.update).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toContain('Salle');
  });
});

describe('deleteVenue action', () => {
  beforeEach(() => {
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.venue.delete.mockReset();
    mockedRequireAuth.mockReset();
  });

    it('supprime une salle quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      name: 'Le Bataclan',
      address: null,
      capacity: null,
      style: null,
      region: null,
      website: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockedPrisma.venue.delete.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      name: 'Le Bataclan',
      address: null,
      capacity: null,
      style: null,
      region: null,
      website: null,
      notes: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteVenue({ id: 'v1' });

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.delete).toHaveBeenCalledWith({
      where: { id: 'v1' },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'v1' });
  });

    it('retourne NOT_FOUND quand la salle n\'existe pas ou n\'appartient pas à l\'utilisateur (multi‑tenancy)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue(null);

    const result = await deleteVenue({ id: 'v_autre_user' });

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v_autre_user', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.delete).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('archiveVenue action', () => {
  beforeEach(() => {
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.venue.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('archive une salle quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      status: 'ACTIVE',
    });
    mockedPrisma.venue.update.mockResolvedValue({
      id: 'v1',
      status: 'ARCHIVED',
    });

    const result = await archiveVenue({ id: 'v1' });

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.update).toHaveBeenCalledWith({
      where: { id: 'v1' },
      data: { status: 'ARCHIVED' },
    });
    expect(result.success).toBe(true);
  });

  it('retourne ALREADY_ARCHIVED si la salle est déjà archivée', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      status: 'ARCHIVED',
    });

    const result = await archiveVenue({ id: 'v1' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_ARCHIVED');
  });
});

describe('restoreVenue action', () => {
  beforeEach(() => {
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.venue.update.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('restaure une salle archivée quand l\'utilisateur en est propriétaire', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      status: 'ARCHIVED',
    });
    mockedPrisma.venue.update.mockResolvedValue({
      id: 'v1',
      status: 'ACTIVE',
    });

    const result = await restoreVenue({ id: 'v1' });

    expect(mockedPrisma.venue.update).toHaveBeenCalledWith({
      where: { id: 'v1' },
      data: { status: 'ACTIVE' },
    });
    expect(result.success).toBe(true);
  });

  it('retourne ALREADY_ACTIVE si la salle est déjà active', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      status: 'ACTIVE',
    });

    const result = await restoreVenue({ id: 'v1' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_ACTIVE');
  });
});
