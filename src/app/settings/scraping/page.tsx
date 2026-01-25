import { requireAuth } from '@/lib/auth/utils';
import { getScrapingSources } from '@/actions/scrapingSourceActions';
import { getUserScrapingJobsAction } from '@/actions/scrapingActions';
import { getUserSettings } from '@/actions/userSettingsActions';
import Link from 'next/link';
import { ScrapingSourceList } from '@/components/scraping/ScrapingSourceList';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { ScrapingGlobalSettingsForm } from '@/components/settings/ScrapingGlobalSettingsForm';

export default async function ScrapingSettingsPage() {
  await requireAuth();
  const [sourcesRes, failedJobsRes, settingsRes] = await Promise.all([
    getScrapingSources(),
    getUserScrapingJobsAction({ status: 'FAILED', limit: 10 }),
    getUserSettings(),
  ]);

  if (!sourcesRes.success || !sourcesRes.data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {sourcesRes.error?.message || 'Une erreur est survenue lors du chargement des sources'}
        </div>
      </div>
    );
  }

  const sources = sourcesRes.data.sources;
  const failedJobs = failedJobsRes.success && failedJobsRes.data ? failedJobsRes.data.jobs : [];
  const settings = settingsRes.success ? settingsRes.data : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <SettingsNav current="/settings/scraping" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration du scraping</h1>
        <p className="text-gray-600">
          Configurez les sources de données pour importer automatiquement des contacts et des
          salles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section : Liste des sources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Sources configurées</h2>
              <Link
                href="/settings/scraping/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Nouvelle source
              </Link>
            </div>

            <ScrapingSourceList sources={sources} />
          </div>

          {/* Epic 9: Jobs en échec */}
          {failedJobs.length > 0 && (
            <div className="bg-white border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-3">Jobs en échec</h2>
              <p className="text-sm text-gray-600 mb-4">
                Derniers jobs de scraping ayant échoué. Corrigez la source ou les données puis relancez.
              </p>
              <ul className="space-y-3">
                {failedJobs.map((j) => (
                  <li key={j.id} className="border border-red-100 rounded p-3 bg-red-50/50">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-medium text-sm">
                          {j.type === 'VENUES' ? 'Salles' : 'Contacts'} — {j.source?.name ?? 'Sans source'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(j.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {j.errorMessage && (
                          <p className="text-sm text-red-700 mt-1">{j.errorMessage}</p>
                        )}
                      </div>
                      {j.source && (
                        <Link
                          href={`/settings/scraping/${j.source.id}/edit`}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Voir la source
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section : Paramètres généraux (Story 10.1) + Informations */}
        <div className="space-y-6">
          <ScrapingGlobalSettingsForm
            autoUpdateEnabled={settings?.scrapingAutoUpdateEnabled ?? true}
            defaultFrequency={settings?.scrapingDefaultFrequency ?? null}
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              À propos du scraping
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              Configurez des sources pour importer automatiquement des données de salles et de
              contacts depuis des sites web ou des APIs externes.
            </p>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Sources de type &quot;Site web&quot; : scraping avec sélecteurs CSS/XPath</li>
              <li>Sources de type &quot;API&quot; : connexion à une API externe</li>
              <li>Sources personnalisées : configuration flexible</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Note importante</h3>
            <p className="text-sm text-yellow-800">
              Le scraping réel des données sera implémenté dans les stories suivantes. Pour
              l&apos;instant, vous pouvez configurer et tester vos sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
