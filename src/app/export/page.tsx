import { requireAuth } from '@/lib/auth/utils';
import { ExportForm } from '@/components/export/ExportForm';

export default async function ExportPage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Export de données</h1>
        <p className="text-gray-600">
          Exportez vos contacts ou salles vers un fichier CSV. Vous pouvez choisir les champs à
          exporter et filtrer les données selon vos besoins.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ExportForm />
      </div>
    </div>
  );
}
