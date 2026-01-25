import { requireAuth } from '@/lib/auth/utils';
import { getUserSettings } from '@/actions/userSettingsActions';
import { ScrapingSourceForm } from '@/components/scraping/ScrapingSourceForm';

export default async function NewScrapingSourcePage() {
  await requireAuth();
  const settingsRes = await getUserSettings();
  const settings = settingsRes.success ? settingsRes.data : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nouvelle source de scraping</h1>
        <p className="text-gray-600">
          Configurez une nouvelle source pour importer des données automatiquement
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ScrapingSourceForm mode="create" defaultFrequency={settings?.scrapingDefaultFrequency ?? null} />
      </div>
    </div>
  );
}
