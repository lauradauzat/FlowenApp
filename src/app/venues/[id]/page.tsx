import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { getEffectiveFicheConfig } from '@/lib/ficheFields';
import { prisma } from '@/lib/prisma/client';
import { getVenueStatusLabel, getVenueStatusClasses } from '@/lib/contacts/statusHelpers';
import { EditableVenueSection } from '@/components/venues/EditableVenueSection';
import { ArchiveButton } from '@/components/venues/ArchiveButton';
import { VenueErrors } from '@/components/venues/VenueErrors';
import { AddContactToVenue } from '@/components/venues/AddContactToVenue';
import { CreateContactForVenue } from '@/components/venues/CreateContactForVenue';
import { getContactsForVenue } from '@/actions/contactVenueActions';
import { getExchangesForVenue } from '@/actions/campaignActions';
import { getProjectsForSelect } from '@/actions/projectActions';
import { ExchangeHistory } from '@/components/campaigns/ExchangeHistory';

async function getVenue(id: string, userId: string) {
  return prisma.venue.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireAuth();
  const { id } = await params;

  const [venue, exchRes, projectsRes, settingsRes] = await Promise.all([
    getVenue(id, userId),
    getExchangesForVenue(id),
    getProjectsForSelect(),
    getUserSettings(),
  ]);
  const s = settingsRes.success ? settingsRes.data : null;
  const { venue: fieldConfig } = getEffectiveFicheConfig(s?.ficheContactFields ?? null, s?.ficheVenueFields ?? null);

  if (!venue) {
    notFound();
  }
  const exchanges = exchRes.success ? exchRes.data : [];
  const projects = projectsRes.success ? projectsRes.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Salle créée le{' '}
              {venue.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={getVenueStatusClasses(venue.status)}>
              {getVenueStatusLabel(venue.status)}
            </span>
            <ArchiveButton venueId={venue.id} isArchived={venue.status === 'ARCHIVED'} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Adresse</p>
            <p className="font-medium text-gray-900">
              {venue.address || <span className="text-gray-400">Non renseignée</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Région</p>
            <p className="font-medium text-gray-900">
              {venue.region || <span className="text-gray-400">Non renseignée</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Capacité</p>
            <p className="font-medium text-gray-900">
              {venue.capacity ? `${venue.capacity} personnes` : <span className="text-gray-400">Non renseignée</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Style musical</p>
            <p className="font-medium text-gray-900">
              {venue.style || <span className="text-gray-400">Non renseigné</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Site web</p>
            <p className="font-medium text-gray-900">
              {venue.website ? (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {venue.website}
                </a>
              ) : (
                <span className="text-gray-400">Non renseigné</span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Dernière mise à jour</p>
            <p className="font-medium text-gray-900">
              {venue.updatedAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {venue.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{venue.notes}</p>
          </div>
        )}
      </div>

      {/* Section Erreurs */}
      {venue.status === 'ERROR' && (
        <VenueErrors
          venue={{
            name: venue.name,
            address: venue.address,
            capacity: venue.capacity,
            style: venue.style,
            region: venue.region,
            website: venue.website,
            notes: venue.notes,
          }}
        />
      )}

      {/* Section Contacts associés */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contacts associés</h2>
          <div className="flex gap-2">
            <AddContactToVenue venueId={venue.id} />
            <CreateContactForVenue venueId={venue.id} />
          </div>
        </div>

        <ContactsList venueId={venue.id} userId={userId} />
      </div>

      {/* Historique des échanges (campagnes) */}
      <div className="mb-6">
        <ExchangeHistory items={exchanges} emptyMessage="Aucun mail envoyé ou réponse reçue pour cette salle." projects={projects} />
      </div>

      <EditableVenueSection venue={venue} fieldConfig={fieldConfig} />
    </div>
  );
}

async function ContactsList({ venueId, userId }: { venueId: string; userId: string }) {
  const contacts = await getContactsForVenue(venueId, userId);

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun contact associé à cette salle.</p>
        <p className="text-sm mt-2">Utilisez le bouton &quot;Ajouter un contact&quot; pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <Link
              href={`/contacts/${contact.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {contact.firstName} {contact.lastName.toUpperCase()}
            </Link>
            <div className="text-sm text-gray-600 mt-1">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && contact.email && <span className="mx-2">•</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.role && (
                <>
                  <span className="mx-2">•</span>
                  <span>{contact.role}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
