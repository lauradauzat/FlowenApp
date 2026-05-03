import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addContactToVenue,
  removeContactFromVenue,
  getContactsForVenue,
  getVenuesForContact,
  getAllConnections,
} from '@/actions/contactVenueActions';
import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';

vi.mock('@/lib/auth/utils', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/lib/prisma/client', () => {
  const contactFindFirst = vi.fn();
  const contactFindMany = vi.fn();
  const venueFindFirst = vi.fn();
  const venueFindMany = vi.fn();
  const contactVenueFindUnique = vi.fn();
  const contactVenueCreate = vi.fn();
  const contactVenueDelete = vi.fn();
  return {
    prisma: {
      contact: {
        findFirst: contactFindFirst,
        findMany: contactFindMany,
      },
      venue: {
        findFirst: venueFindFirst,
        findMany: venueFindMany,
      },
      contactVenue: {
        findUnique: contactVenueFindUnique,
        create: contactVenueCreate,
        delete: contactVenueDelete,
      },
    },
  };
});

const mockedRequireAuth = requireAuth as unknown as ReturnType<typeof vi.fn>;
const mockedPrisma = prisma as unknown as {
  contact: {
    findFirst: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  venue: {
    findFirst: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  contactVenue: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

describe('addContactToVenue action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.contactVenue.findUnique.mockReset();
    mockedPrisma.contactVenue.create.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('ajoute un contact à une salle quand l\'utilisateur en est propriétaire des deux', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      firstName: 'Laura',
      lastName: 'Capuche',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      name: 'Le Bataclan',
    });
    mockedPrisma.contactVenue.findUnique.mockResolvedValue(null); // Pas de connexion existante
    mockedPrisma.contactVenue.create.mockResolvedValue({
      id: 'cv1',
      contactId: 'c1',
      venueId: 'v1',
      createdAt: new Date(),
    });

    const result = await addContactToVenue({
      contactId: 'c1',
      venueId: 'v1',
    });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
    });
    expect(mockedPrisma.contactVenue.create).toHaveBeenCalledWith({
      data: { contactId: 'c1', venueId: 'v1' },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'cv1' });
  });

  it('retourne ALREADY_EXISTS si la connexion existe déjà', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
    });
    mockedPrisma.contactVenue.findUnique.mockResolvedValue({
      id: 'cv1',
      contactId: 'c1',
      venueId: 'v1',
    });

    const result = await addContactToVenue({
      contactId: 'c1',
      venueId: 'v1',
    });

    expect(mockedPrisma.contactVenue.create).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('ALREADY_EXISTS');
  });

  it('retourne NOT_FOUND si le contact n\'appartient pas à l\'utilisateur (ownership)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await addContactToVenue({
      contactId: 'c_autre_user',
      venueId: 'v1',
    });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c_autre_user', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.findFirst).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });

  it('retourne NOT_FOUND si la salle n\'appartient pas à l\'utilisateur (multi-tenancy)', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue(null);

    const result = await addContactToVenue({
      contactId: 'c1',
      venueId: 'v_autre_user',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('removeContactFromVenue action', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
    mockedPrisma.venue.findFirst.mockReset();
    mockedPrisma.contactVenue.findUnique.mockReset();
    mockedPrisma.contactVenue.delete.mockReset();
    mockedRequireAuth.mockReset();
  });

  it('retire un contact d\'une salle quand l\'utilisateur en est propriétaire des deux', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
    });
    mockedPrisma.contactVenue.findUnique.mockResolvedValue({
      id: 'cv1',
      contactId: 'c1',
      venueId: 'v1',
      createdAt: new Date(),
    });
    mockedPrisma.contactVenue.delete.mockResolvedValue({
      id: 'cv1',
      contactId: 'c1',
      venueId: 'v1',
      createdAt: new Date(),
    });

    const result = await removeContactFromVenue({
      contactId: 'c1',
      venueId: 'v1',
    });

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
    });
    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
    });
    expect(mockedPrisma.contactVenue.findUnique).toHaveBeenCalledWith({
      where: {
        contactId_venueId: { contactId: 'c1', venueId: 'v1' },
      },
    });
    expect(mockedPrisma.contactVenue.delete).toHaveBeenCalledWith({
      where: {
        contactId_venueId: { contactId: 'c1', venueId: 'v1' },
      },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'cv1' });
  });

  it('retourne NOT_FOUND si la connexion n\'existe pas', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
    });
    mockedPrisma.contactVenue.findUnique.mockResolvedValue(null);

    const result = await removeContactFromVenue({
      contactId: 'c1',
      venueId: 'v1',
    });

    expect(mockedPrisma.contactVenue.delete).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });

  it('retourne NOT_FOUND si le contact n\'appartient pas à l\'utilisateur', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await removeContactFromVenue({
      contactId: 'c_autre_user',
      venueId: 'v1',
    });

    expect(mockedPrisma.contactVenue.delete).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });

  it('retourne NOT_FOUND si la salle n\'appartient pas à l\'utilisateur', async () => {
    mockedRequireAuth.mockResolvedValue('user_123');
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
    });
    mockedPrisma.venue.findFirst.mockResolvedValue(null);

    const result = await removeContactFromVenue({
      contactId: 'c1',
      venueId: 'v_autre_user',
    });

    expect(mockedPrisma.contactVenue.delete).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('getContactsForVenue', () => {
  beforeEach(() => {
    mockedPrisma.venue.findFirst.mockReset();
  });

  it('retourne les contacts associés à une salle avec filtrage userId', async () => {
    mockedPrisma.venue.findFirst.mockResolvedValue({
      id: 'v1',
      userId: 'user_123',
      contacts: [
        {
          contact: {
            id: 'c1',
            firstName: 'Laura',
            lastName: 'Capuche',
            email: 'laura@example.com',
            phone: null,
            role: 'Manager',
            status: 'ACTIVE',
            createdAt: new Date(),
          },
        },
      ],
    });

    const result = await getContactsForVenue('v1', 'user_123');

    expect(mockedPrisma.venue.findFirst).toHaveBeenCalledWith({
      where: { id: 'v1', userId: 'user_123' },
      include: {
        contacts: {
          include: { contact: true },
        },
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'c1',
      firstName: 'Laura',
      lastName: 'Capuche',
      role: 'Manager',
    });
  });

  it('retourne un tableau vide si la salle n\'appartient pas à l\'utilisateur', async () => {
    mockedPrisma.venue.findFirst.mockResolvedValue(null);

    const result = await getContactsForVenue('v_autre_user', 'user_123');

    expect(result).toEqual([]);
  });
});

describe('getVenuesForContact', () => {
  beforeEach(() => {
    mockedPrisma.contact.findFirst.mockReset();
  });

  it('retourne les salles associées à un contact avec filtrage userId', async () => {
    mockedPrisma.contact.findFirst.mockResolvedValue({
      id: 'c1',
      userId: 'user_123',
      venues: [
        {
          venue: {
            id: 'v1',
            name: 'Le Bataclan',
            address: 'Paris',
            capacity: 1500,
            style: 'Rock',
            region: 'Paris',
            website: null,
            status: 'ACTIVE',
            createdAt: new Date(),
          },
        },
      ],
    });

    const result = await getVenuesForContact('c1', 'user_123');

    expect(mockedPrisma.contact.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', userId: 'user_123' },
      include: {
        venues: {
          include: { venue: true },
        },
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'v1',
      name: 'Le Bataclan',
      capacity: 1500,
    });
  });

  it('retourne un tableau vide si le contact n\'appartient pas à l\'utilisateur', async () => {
    mockedPrisma.contact.findFirst.mockResolvedValue(null);

    const result = await getVenuesForContact('c_autre_user', 'user_123');

    expect(result).toEqual([]);
  });
});

describe('getAllConnections', () => {
  beforeEach(() => {
    mockedPrisma.venue.findMany.mockReset();
    mockedPrisma.contact.findMany.mockReset();
  });

  it('retourne toutes les connexions avec filtrage userId', async () => {
    mockedPrisma.venue.findMany.mockResolvedValue([
      {
        id: 'v1',
        name: 'Le Bataclan',
        address: 'Paris',
        capacity: 1500,
        style: 'Rock',
        region: 'Paris',
        website: null,
        status: 'ACTIVE',
        createdAt: new Date(),
        contacts: [
          {
            contact: {
              id: 'c1',
              firstName: 'Laura',
              lastName: 'Capuche',
              email: 'laura@example.com',
              phone: null,
              role: 'Manager',
              status: 'ACTIVE',
              createdAt: new Date(),
            },
          },
        ],
      },
    ]);

    mockedPrisma.contact.findMany.mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Laura',
        lastName: 'Capuche',
        email: 'laura@example.com',
        phone: null,
        role: 'Manager',
        status: 'ACTIVE',
        createdAt: new Date(),
        venues: [
          {
            venue: {
              id: 'v1',
              name: 'Le Bataclan',
              address: 'Paris',
              capacity: 1500,
              style: 'Rock',
              region: 'Paris',
              website: null,
              status: 'ACTIVE',
              createdAt: new Date(),
            },
          },
        ],
      },
    ]);

    const result = await getAllConnections('user_123');

    expect(mockedPrisma.venue.findMany).toHaveBeenCalledWith({
      where: { userId: 'user_123' },
      include: {
        contacts: {
          include: { contact: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    expect(mockedPrisma.contact.findMany).toHaveBeenCalledWith({
      where: { userId: 'user_123' },
      include: {
        venues: {
          include: { venue: true },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    expect(result.venuesWithContacts).toHaveLength(1);
    expect(result.contactsWithVenues).toHaveLength(1);
    expect(result.venuesWithContacts[0].contacts).toHaveLength(1);
    expect(result.contactsWithVenues[0].venues).toHaveLength(1);
  });
});
