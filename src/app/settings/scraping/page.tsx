import { requireAuth } from '@/lib/auth/utils';
import { getScrapingSources } from '@/actions/scrapingSourceActions';
import Link from 'next/link';
import { ScrapingSourceList } from '@/components/scraping/ScrapingSourceList';

export default async function ScrapingSettingsPage() {
  await requireAuth();
  const result = await getScrapingSources();

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {result.error?.message || 'Une erreur est survenue lors du chargement des sources'}
        </div>
      </div>
    );
  }

  const sources = result.data.sources;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration du scraping</h1>
        <p className="text-gray-600">
          Configurez les sources de données pour importer automatiquement des contacts et des
          salles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section : Liste des sources */}
        <div className="lg:col-span-2">
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
        </div>

        {/* Section : Informations */}
        <div className="space-y-6">
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
