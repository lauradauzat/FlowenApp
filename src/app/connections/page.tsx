import { requireAuth } from '@/lib/auth/utils';
import { getAllConnections } from '@/actions/contactVenueActions';
import { ConnectionsView } from '@/components/connections/ConnectionsView';

export default async function ConnectionsPage() {
  const userId = await requireAuth();
  const { venuesWithContacts, contactsWithVenues } = await getAllConnections(userId);

  // Filtrer pour ne garder que les salles/contacts qui ont des connexions
  const venuesWithConnections = venuesWithContacts.filter((v) => v.contacts.length > 0);
  const contactsWithConnections = contactsWithVenues.filter((c) => c.venues.length > 0);

  const totalConnections = venuesWithConnections.reduce(
    (sum, v) => sum + v.contacts.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Visualisation des connexions</h1>
        <p className="text-gray-600">
          Vue d&apos;ensemble des relations entre vos contacts et vos salles
        </p>
        {totalConnections > 0 && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <span className="font-medium">
              {totalConnections} connexion{totalConnections > 1 ? 's' : ''} au total
            </span>
          </div>
        )}
      </div>

      <ConnectionsView
        venuesWithConnections={venuesWithConnections}
        contactsWithConnections={contactsWithConnections}
        totalConnections={totalConnections}
      />
    </div>
  );
}
