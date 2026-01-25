import { requireAuth } from '@/lib/auth/utils';
import { getTourDates } from '@/actions/campaignActions';

export default async function TourDatesPage() {
  await requireAuth();
  const res = await getTourDates();

  if (!res.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{res.error?.message ?? 'Erreur'}</p>
      </div>
    );
  }

  const dates = res.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dates de tournée</h1>
      <p className="text-gray-500 mb-6">
        Dates obtenues via les campagnes de mailing, associées à vos projets.
      </p>

      {dates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Aucune date de tournée enregistrée.</p>
          <p className="text-sm text-gray-400 mt-2">
            Les dates apparaîtront ici lorsque vous marquerez des réponses comme &quot;date obtenue&quot; dans vos campagnes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((d) => (
            <div
              key={d.id}
              className="p-4 bg-white border border-gray-200 rounded-lg flex flex-wrap justify-between items-center gap-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {d.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {d.venueName} — {d.contactName}
                </p>
                <p className="text-xs text-gray-500">{d.campaignName} · {d.projectName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
