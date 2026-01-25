'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ConnectionsSearch } from './ConnectionsSearch';

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

type ConnectionsViewProps = {
  venuesWithConnections: Array<{
    venue: VenueSummary;
    contacts: ContactSummary[];
  }>;
  contactsWithConnections: Array<{
    contact: ContactSummary;
    venues: VenueSummary[];
  }>;
  totalConnections: number;
};

export function ConnectionsView({
  venuesWithConnections,
  contactsWithConnections,
  totalConnections,
}: ConnectionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVenues = useMemo(() => {
    if (!searchTerm.trim()) {
      return venuesWithConnections;
    }

    const term = searchTerm.toLowerCase().trim();
    return venuesWithConnections.filter(({ venue, contacts }) => {
      const venueMatches =
        venue.name.toLowerCase().includes(term) ||
        venue.region?.toLowerCase().includes(term) ||
        venue.style?.toLowerCase().includes(term);

      const contactMatches = contacts.some(
        (contact) =>
          contact.firstName.toLowerCase().includes(term) ||
          contact.lastName.toLowerCase().includes(term) ||
          contact.email?.toLowerCase().includes(term) ||
          contact.role?.toLowerCase().includes(term)
      );

      return venueMatches || contactMatches;
    });
  }, [venuesWithConnections, searchTerm]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) {
      return contactsWithConnections;
    }

    const term = searchTerm.toLowerCase().trim();
    return contactsWithConnections.filter(({ contact, venues }) => {
      const contactMatches =
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.role?.toLowerCase().includes(term);

      const venueMatches = venues.some(
        (venue) =>
          venue.name.toLowerCase().includes(term) ||
          venue.region?.toLowerCase().includes(term) ||
          venue.style?.toLowerCase().includes(term)
      );

      return contactMatches || venueMatches;
    });
  }, [contactsWithConnections, searchTerm]);

  if (totalConnections === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg mb-4">
          Aucune connexion entre vos contacts et vos salles pour le moment.
        </p>
        <p className="text-gray-400 text-sm">
          Commencez par associer des contacts à vos salles depuis les pages de détail.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <ConnectionsSearch onSearchChange={setSearchTerm} />

      {/* Section : Par Salle */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Par Salle</h2>
          <span className="text-sm text-gray-500">
            {filteredVenues.length} salle{filteredVenues.length > 1 ? 's' : ''} avec connexions
            {searchTerm && filteredVenues.length !== venuesWithConnections.length && (
              <span className="text-gray-400">
                {' '}
                (sur {venuesWithConnections.length} au total)
              </span>
            )}
          </span>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Aucune salle ne correspond à votre recherche &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map(({ venue, contacts }) => (
              <div
                key={venue.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <Link
                    href={`/venues/${venue.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {venue.name}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">
                    {venue.region && <span>{venue.region}</span>}
                    {venue.capacity && (
                      <>
                        {venue.region && <span className="mx-1">•</span>}
                        <span>{venue.capacity} pers.</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {contacts.length} contact{contacts.length > 1 ? 's' : ''} associé{contacts.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <Link
                        key={contact.id}
                        href={`/contacts/${contact.id}`}
                        className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-sm">
                          {contact.firstName} {contact.lastName.toUpperCase()}
                        </div>
                        {contact.role && (
                          <div className="text-xs text-gray-500 mt-1">{contact.role}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section : Par Contact */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Par Contact</h2>
          <span className="text-sm text-gray-500">
            {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''} avec connexions
            {searchTerm && filteredContacts.length !== contactsWithConnections.length && (
              <span className="text-gray-400">
                {' '}
                (sur {contactsWithConnections.length} au total)
              </span>
            )}
          </span>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Aucun contact ne correspond à votre recherche &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map(({ contact, venues }) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {contact.firstName} {contact.lastName.toUpperCase()}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">
                    {contact.email && <span>{contact.email}</span>}
                    {contact.role && (
                      <>
                        {contact.email && <span className="mx-1">•</span>}
                        <span>{contact.role}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {venues.length} salle{venues.length > 1 ? 's' : ''} associée{venues.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {venues.map((venue) => (
                      <Link
                        key={venue.id}
                        href={`/venues/${venue.id}`}
                        className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-sm">{venue.name}</div>
                        {venue.region && (
                          <div className="text-xs text-gray-500 mt-1">{venue.region}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
