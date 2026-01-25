import { requireAuth } from '@/lib/auth/utils';
import { VenueForm } from '@/components/venues/VenueForm';

export default async function NewVenuePage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Créer une nouvelle salle</h1>
      <VenueForm mode="create" />
    </div>
  );
}
