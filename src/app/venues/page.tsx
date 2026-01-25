import Link from 'next/link';
import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import { VenueStatus } from '@prisma/client';
import { StartScrapingButton } from '@/components/scraping/StartScrapingButton';
import { ScrapingJobsList } from '@/components/scraping/ScrapingJobsList';

function getStatusLabel(status: VenueStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'ARCHIVED':
      return 'Archivée';
    case 'ERROR':
      return 'Avec erreurs';
    default:
      return status;
  }
}

function getStatusClasses(status: VenueStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
    case 'ARCHIVED':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700';
    case 'ERROR':
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800';
    default:
      return 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700';
  }
}

async function getVenues(
  userId: string,
  search: string | null,
  status: string | null,
  region: string | null,
  style: string | null
) {
  const where: {
    userId: string;
    OR?: Array<{ [key: string]: { contains: string; mode: 'insensitive' } }>;
    status?: VenueStatus | { not: VenueStatus };
    region?: { contains: string; mode: 'insensitive' };
    style?: { contains: string; mode: 'insensitive' };
  } = {
    userId,
  };

  if (search && search.trim().length > 0) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } },
      { region: { contains: term, mode: 'insensitive' } },
    ];
  }

  if (status && ['ACTIVE', 'ARCHIVED', 'ERROR'].includes(status)) {
    where.status = status as VenueStatus;
  } else if (!status) {
    // Par défaut, exclure les archivés si aucun filtre de statut n'est spécifié
    where.status = { not: 'ARCHIVED' as VenueStatus };
  }

  if (region && region.trim().length > 0) {
    where.region = { contains: region.trim(), mode: 'insensitive' };
  }

  if (style && style.trim().length > 0) {
    where.style = { contains: style.trim(), mode: 'insensitive' };
  }

  return prisma.venue.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function VenuesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; status?: string; region?: string; style?: string }>;
}) {
  const userId = await requireAuth();

  const params = (await searchParams) ?? {};
  const search = params.q ?? null;
  const status = params.status ?? null;
  const region = params.region ?? null;
  const style = params.style ?? null;

  const venues = await getVenues(userId, search, status, region, style);

  // Récupérer les sources de scraping actives pour les salles
  const activeSources = await prisma.scrapingSource.findMany({
    where: {
      userId,
      isActive: true,
      type: 'WEBSITE', // Pour MVP, on se concentre sur les sources WEBSITE
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Si aucune salle et aucune recherche, proposer de créer la première salle
  if (venues.length === 0 && !search && !status && !region && !style) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes salles</h1>
          <Link
            href="/venues/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nouvelle salle
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de salle.</p>
          <Link
            href="/venues/new"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Créer votre première salle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes salles</h1>
        <Link
          href="/venues/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nouvelle salle
        </Link>
      </div>

      {/* Section Scraping */}
      {activeSources.length > 0 && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Import automatique de salles</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Lancez un scraping pour importer automatiquement des salles depuis vos sources
                configurées.
              </p>
              <div className="flex flex-wrap gap-3">
                <StartScrapingButton />
                {activeSources.map((source) => (
                  <StartScrapingButton
                    key={source.id}
                    sourceId={source.id}
                    sourceName={source.name}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Jobs de scraping récents</h3>
              <ScrapingJobsList type="VENUES" limit={5} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form action="/venues" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                id="q"
                name="q"
                defaultValue={search ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom, adresse, région"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Statut
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous</option>
                <option value="ACTIVE">Actives</option>
                <option value="ARCHIVED">Archivées</option>
                <option value="ERROR">Avec erreurs</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Région
              </label>
              <input
                type="text"
                id="region"
                name="region"
                defaultValue={region ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Paris"
              />
            </div>

            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Style
              </label>
              <input
                type="text"
                id="style"
                name="style"
                defaultValue={style ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Rock"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filtrer
            </button>
            {(search || status || region || style) && (
              <Link
                href="/venues"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Réinitialiser
              </Link>
            )}
          </div>
        </form>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune salle ne correspond à vos filtres.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Style
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {venues.map((venue) => (
                <tr key={venue.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {venue.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-col">
                      {venue.region && (
                        <span className="text-gray-800">{venue.region}</span>
                      )}
                      {venue.address && (
                        <span className="text-gray-500 text-xs">{venue.address}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {venue.capacity ? `${venue.capacity} pers.` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {venue.style || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <span className={getStatusClasses(venue.status)}>
                        {getStatusLabel(venue.status)}
                      </span>
                      {venue.status === 'ERROR' && (
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                          title="Cette fiche contient des erreurs"
                        >
                          ⚠️ Erreurs
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/venues/${venue.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
