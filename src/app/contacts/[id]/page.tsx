import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { getEffectiveFicheConfig } from '@/lib/ficheFields';
import { prisma } from '@/lib/prisma/client';
import { getStatusLabel, getStatusClasses } from '@/lib/contacts/statusHelpers';
import { EditableContactSection } from '@/components/contacts/EditableContactSection';
import { ArchiveButton } from '@/components/contacts/ArchiveButton';
import { ContactErrors } from '@/components/contacts/ContactErrors';
import { ObsoleteActions } from '@/components/contacts/ObsoleteActions';
import { getVenuesForContact } from '@/actions/contactVenueActions';
import { getExchangesForContact } from '@/actions/campaignActions';
import { getProjectsForSelect } from '@/actions/projectActions';
import { ExchangeHistory } from '@/components/campaigns/ExchangeHistory';

async function getContact(id: string, userId: string) {
  return prisma.contact.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireAuth();
  const { id } = await params;

  const [contact, exchRes, projectsRes, settingsRes] = await Promise.all([
    getContact(id, userId),
    getExchangesForContact(id),
    getProjectsForSelect(),
    getUserSettings(),
  ]);
  const s = settingsRes.success ? settingsRes.data : null;
  const { contact: fieldConfig } = getEffectiveFicheConfig(s?.ficheContactFields ?? null, s?.ficheVenueFields ?? null);

  if (!contact) {
    notFound();
  }
  const exchanges = exchRes.success ? exchRes.data : [];
  const projects = projectsRes.success ? projectsRes.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">
              {contact.firstName} {contact.lastName.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Contact créé le{' '}
              {contact.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={getStatusClasses(contact.status)}>
              {getStatusLabel(contact.status)}
            </span>
            <ArchiveButton contactId={contact.id} isArchived={contact.status === 'ARCHIVED'} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">
              {contact.email || <span className="text-gray-400">Non renseigné</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Téléphone</p>
            <p className="font-medium text-gray-900">
              {contact.phone || <span className="text-gray-400">Non renseigné</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Rôle</p>
            <p className="font-medium text-gray-900">
              {contact.role || <span className="text-gray-400">Non renseigné</span>}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Dernière mise à jour</p>
            <p className="font-medium text-gray-900">
              {contact.updatedAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Section Actions pour contacts obsolètes */}
      {contact.status === 'ERROR' && contact.email && (
        <ObsoleteActions contactId={contact.id} />
      )}

      {/* Section Erreurs */}
      {contact.status === 'ERROR' && (
        <ContactErrors
          contact={{
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            notes: contact.notes,
          }}
        />
      )}

      {/* Section Salles associées */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Salles associées</h2>
        <VenuesList contactId={contact.id} userId={userId} />
      </div>

      {/* Historique des échanges (campagnes) */}
      <div className="mb-6">
        <ExchangeHistory items={exchanges} emptyMessage="Aucun mail envoyé ou réponse reçue pour ce contact." projects={projects} />
      </div>

      <EditableContactSection contact={contact} fieldConfig={fieldConfig} />
    </div>
  );
}

async function VenuesList({ contactId, userId }: { contactId: string; userId: string }) {
  const venues = await getVenuesForContact(contactId, userId);

  if (venues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune salle associée à ce contact.</p>
        <p className="text-sm mt-2">
          Les salles associées apparaîtront ici une fois qu&apos;elles seront ajoutées depuis la page de la salle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <Link
              href={`/venues/${venue.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {venue.name}
            </Link>
            <div className="text-sm text-gray-600 mt-1">
              {venue.region && <span>{venue.region}</span>}
              {venue.capacity && (
                <>
                  {venue.region && <span className="mx-2">•</span>}
                  <span>{venue.capacity} pers.</span>
                </>
              )}
              {venue.style && (
                <>
                  {(venue.region || venue.capacity) && <span className="mx-2">•</span>}
                  <span>{venue.style}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

