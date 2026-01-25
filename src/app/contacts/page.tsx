import Link from 'next/link';
import { requireAuth } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma/client';
import { ContactStatus } from '@prisma/client';
import { getStatusLabel, getStatusClasses } from '@/lib/contacts/statusHelpers';
import { StartScrapingButton } from '@/components/scraping/StartScrapingButton';
import { ScrapingJobsList } from '@/components/scraping/ScrapingJobsList';

async function getContacts(
  userId: string,
  search: string | null,
  status: string | null,
  role: string | null
) {
  const where: {
    userId: string;
    OR?: Array<{ [key: string]: { contains: string; mode: 'insensitive' } }>;
    status?: ContactStatus | { not: ContactStatus };
    role?: { contains: string; mode: 'insensitive' };
  } = {
    userId,
  };

  if (search && search.trim().length > 0) {
    const term = search.trim();
    where.OR = [
      { firstName: { contains: term, mode: 'insensitive' } },
      { lastName: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
    ];
  }

  if (status && ['ACTIVE', 'ARCHIVED', 'ERROR'].includes(status)) {
    where.status = status as ContactStatus;
  } else if (!status) {
    where.status = { not: 'ARCHIVED' as ContactStatus };
  }

  if (role && role.trim().length > 0) {
    where.role = { contains: role.trim(), mode: 'insensitive' };
  }

  return prisma.contact.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; status?: string; role?: string }>;
}) {
  const userId = await requireAuth();

  const params = (await searchParams) ?? {};
  const search = params.q ?? null;
  const status = params.status ?? null;
  const role = params.role ?? null;

  const contacts = await getContacts(userId, search, status, role);

  // Récupérer les sources de scraping actives pour les contacts
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

  // Si aucun contact et aucun filtre, proposer de créer le premier contact
  if (contacts.length === 0 && !search && !status && !role) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes contacts</h1>
          <Link
            href="/contacts/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Créer un nouveau contact
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de contact.</p>
          <Link
            href="/contacts/new"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Créer votre premier contact
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes contacts</h1>
        <Link
            href="/contacts/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Créer un nouveau contact
          </Link>
      </div>

      {/* Section Scraping */}
      {activeSources.length > 0 && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Import automatique de contacts</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Lancez un scraping pour importer automatiquement des contacts depuis vos sources
                configurées. Les contacts seront automatiquement liés aux salles correspondantes si
                possible.
              </p>
              <div className="flex flex-wrap gap-3">
                <StartScrapingButton type="CONTACTS" />
                {activeSources.map((source) => (
                  <StartScrapingButton
                    key={source.id}
                    type="CONTACTS"
                    sourceId={source.id}
                    sourceName={source.name}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Jobs de scraping récents</h3>
              <ScrapingJobsList type="CONTACTS" limit={5} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form
          action="/contacts"
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >
          <div className="flex-1">
            <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              id="q"
              name="q"
              defaultValue={search ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom, prénom ou email"
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
              <option value="ACTIVE">Actifs</option>
              <option value="ARCHIVED">Archivés</option>
              <option value="ERROR">Avec erreurs</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rôle
            </label>
            <input
              type="text"
              id="role"
              name="role"
              defaultValue={role ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Programmateur, Manager"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filtrer
            </button>
            {(search || status || role) && (
              <Link
                href="/contacts"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-block text-center"
              >
                Réinitialiser
              </Link>
            )}
          </div>
        </form>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun contact ne correspond à vos filtres.</p>
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
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contact.lastName.toUpperCase()} {contact.firstName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-col">
                      {contact.email && (
                        <span className="text-gray-800">{contact.email}</span>
                      )}
                      {contact.phone && (
                        <span className="text-gray-500 text-xs">
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {contact.role || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <span className={getStatusClasses(contact.status)}>
                        {getStatusLabel(contact.status)}
                      </span>
                      {contact.status === 'ERROR' && (
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                          title={
                            contact.email
                              ? 'Cette fiche contient des erreurs ou est obsolète'
                              : 'Cette fiche contient des erreurs'
                          }
                        >
                          ⚠️ {contact.email ? 'Obsolète' : 'Erreurs'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/contacts/${contact.id}`}
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

