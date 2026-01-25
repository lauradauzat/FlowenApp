import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { getEffectiveFicheConfig } from '@/lib/ficheFields';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { FicheFieldsSettingsForm } from '@/components/settings/FicheFieldsSettingsForm';

export default async function FichesSettingsPage() {
  await requireAuth();
  const settingsRes = await getUserSettings();
  const s = settingsRes.success ? settingsRes.data : null;
  const { contact, venue } = getEffectiveFicheConfig(s?.ficheContactFields ?? null, s?.ficheVenueFields ?? null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SettingsNav current="/settings/fiches" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Paramètres des fiches</h1>
        <p className="text-gray-600 text-sm">
          Choisissez les champs affichés dans les fiches contact et salle, leur caractère obligatoire et les valeurs par défaut (création). Les champs Prénom, Nom (contact) et Nom (salle) restent toujours visibles et obligatoires.
        </p>
      </div>
      <FicheFieldsSettingsForm defaults={{ contact, venue }} />
    </div>
  );
}
