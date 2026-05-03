'use server';

import { prisma } from '@/lib/prisma/client';
import { requireAuth } from '@/lib/auth/utils';
import { AppError, NotFoundError } from '@/lib/errors';
import {
  addContactToVenueSchema,
  removeContactFromVenueSchema,
} from '@/lib/validations/contactVenue';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type ContactSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  status: string;
  createdAt: Date;
};

type VenueSummary = {
  id: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
  style?: string | null;
  region?: string | null;
  website?: string | null;
  status: string;
  createdAt: Date;
};

/**
 * Ajoute un contact à une salle (crée la connexion many-to-many)
 */
export async function addContactToVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = addContactToVenueSchema.parse(input);

    // Vérifier que le contact appartient à l'utilisateur
    const contact = await prisma.contact.findFirst({
      where: {
        id: validated.contactId,
        userId,
      },
    });

    if (!contact) {
      throw new NotFoundError('Contact non trouvé');
    }

    // Vérifier que la salle appartient à l'utilisateur
    const venue = await prisma.venue.findFirst({
      where: {
        id: validated.venueId,
        userId,
      },
    });

    if (!venue) {
      throw new NotFoundError('Salle non trouvée');
    }

    // Vérifier si la connexion existe déjà
    const existing = await prisma.contactVenue.findUnique({
      where: {
        contactId_venueId: {
          contactId: validated.contactId,
          venueId: validated.venueId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Ce contact est déjà associé à cette salle',
        },
      };
    }

    // Créer la connexion
    const connection = await prisma.contactVenue.create({
      data: {
        contactId: validated.contactId,
        venueId: validated.venueId,
      },
    });

    return {
      success: true,
      data: { id: connection.id },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error adding contact to venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de l\'ajout du contact à la salle',
      },
    };
  }
}

/**
 * Retire un contact d'une salle (supprime la connexion)
 */
export async function removeContactFromVenue(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireAuth();
    const validated = removeContactFromVenueSchema.parse(input);

    // Vérifier que le contact appartient à l'utilisateur
    const contact = await prisma.contact.findFirst({
      where: {
        id: validated.contactId,
        userId,
      },
    });

    if (!contact) {
      throw new NotFoundError('Contact non trouvé');
    }

    // Vérifier que la salle appartient à l'utilisateur
    const venue = await prisma.venue.findFirst({
      where: {
        id: validated.venueId,
        userId,
      },
    });

    if (!venue) {
      throw new NotFoundError('Salle non trouvée');
    }

    // Vérifier si la connexion existe avant de supprimer
    const existing = await prisma.contactVenue.findUnique({
      where: {
        contactId_venueId: {
          contactId: validated.contactId,
          venueId: validated.venueId,
        },
      },
    });

    if (!existing) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Cette connexion n\'existe pas',
        },
      };
    }

    // Supprimer la connexion
    const deleted = await prisma.contactVenue.delete({
      where: {
        contactId_venueId: {
          contactId: validated.contactId,
          venueId: validated.venueId,
        },
      },
    });

    return {
      success: true,
      data: { id: deleted.id },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message,
        },
      };
    }

    console.error('Error removing contact from venue:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur est survenue lors de la suppression de la connexion',
      },
    };
  }
}

/**
 * Récupère les contacts associés à une salle
 */
export async function getContactsForVenue(
  venueId: string,
  userId: string
): Promise<ContactSummary[]> {
  const venue = await prisma.venue.findFirst({
    where: {
      id: venueId,
      userId,
    },
    include: {
      contacts: {
        include: {
          contact: true,
        },
      },
    },
  });

  if (!venue) {
    return [];
  }

  return venue.contacts.map((cv) => ({
    id: cv.contact.id,
    firstName: cv.contact.firstName,
    lastName: cv.contact.lastName,
    email: cv.contact.email,
    phone: cv.contact.phone,
    role: cv.contact.role,
    status: cv.contact.status,
    createdAt: cv.contact.createdAt,
  }));
}

/**
 * Récupère les salles associées à un contact
 */
export async function getVenuesForContact(
  contactId: string,
  userId: string
): Promise<VenueSummary[]> {
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      userId,
    },
    include: {
      venues: {
        include: {
          venue: true,
        },
      },
    },
  });

  if (!contact) {
    return [];
  }

  return contact.venues.map((cv) => ({
    id: cv.venue.id,
    name: cv.venue.name,
    address: cv.venue.address,
    capacity: cv.venue.capacity,
    style: cv.venue.style,
    region: cv.venue.region,
    website: cv.venue.website,
    status: cv.venue.status,
    createdAt: cv.venue.createdAt,
  }));
}

/**
 * Récupère toutes les connexions pour l'utilisateur (pour la page de visualisation)
 */
export async function getAllConnections(userId: string): Promise<{
  venuesWithContacts: Array<{
    venue: VenueSummary;
    contacts: ContactSummary[];
  }>;
  contactsWithVenues: Array<{
    contact: ContactSummary;
    venues: VenueSummary[];
  }>;
}> {
  // Récupérer toutes les salles avec leurs contacts
  const venues = await prisma.venue.findMany({
    where: { userId },
    include: {
      contacts: {
        include: {
          contact: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Récupérer tous les contacts avec leurs salles
  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: {
      venues: {
        include: {
          venue: true,
        },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  const venuesWithContacts = venues.map((venue) => ({
    venue: {
      id: venue.id,
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity,
      style: venue.style,
      region: venue.region,
      website: venue.website,
      status: venue.status,
      createdAt: venue.createdAt,
    },
    contacts: venue.contacts.map((cv) => ({
      id: cv.contact.id,
      firstName: cv.contact.firstName,
      lastName: cv.contact.lastName,
      email: cv.contact.email,
      phone: cv.contact.phone,
      role: cv.contact.role,
      status: cv.contact.status,
      createdAt: cv.contact.createdAt,
    })),
  }));

  const contactsWithVenues = contacts.map((contact) => ({
    contact: {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      role: contact.role,
      status: contact.status,
      createdAt: contact.createdAt,
    },
    venues: contact.venues.map((cv) => ({
      id: cv.venue.id,
      name: cv.venue.name,
      address: cv.venue.address,
      capacity: cv.venue.capacity,
      style: cv.venue.style,
      region: cv.venue.region,
      website: cv.venue.website,
      status: cv.venue.status,
      createdAt: cv.venue.createdAt,
    })),
  }));

  return {
    venuesWithContacts,
    contactsWithVenues,
  };
}
