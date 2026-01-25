import { requireAuth } from '@/lib/auth/utils';
import { getCampaigns } from '@/actions/campaignActions';
import Link from 'next/link';

const statusLabel: Record<string, string> = {
  DRAFT: 'Brouillon',
  RUNNING: 'En cours',
  COMPLETED: 'Terminée',
  PAUSED: 'En pause',
};

export default async function CampaignsPage() {
  await requireAuth();
  const result = await getCampaigns();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{result.error?.message ?? 'Erreur'}</p>
      </div>
    );
  }

  const { campaigns } = result.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campagnes de mailing</h1>
        <Link
          href="/campaigns/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nouvelle campagne
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">Aucune campagne pour le moment.</p>
          <Link href="/campaigns/new" className="text-blue-600 hover:underline">
            Créer une campagne
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{c.name}</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    c.status === 'DRAFT'
                      ? 'bg-gray-100 text-gray-700'
                      : c.status === 'RUNNING'
                        ? 'bg-blue-100 text-blue-700'
                        : c.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {statusLabel[c.status] ?? c.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
