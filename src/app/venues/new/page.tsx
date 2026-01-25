import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { getEffectiveFicheConfig } from '@/lib/ficheFields';
import { VenueForm } from '@/components/venues/VenueForm';

export default async function NewVenuePage() {
  await requireAuth();
  const settingsRes = await getUserSettings();
  const s = settingsRes.success ? settingsRes.data : null;
  const { venue: fieldConfig } = getEffectiveFicheConfig(s?.ficheContactFields ?? null, s?.ficheVenueFields ?? null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Créer une nouvelle salle</h1>
      <VenueForm mode="create" fieldConfig={fieldConfig} />
    </div>
  );
}
