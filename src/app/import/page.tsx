import { requireAuth } from '@/lib/auth/utils';
import { CSVImportForm } from '@/components/import/CSVImportForm';

export default async function ImportPage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import de données</h1>
        <p className="text-gray-600">
          Importez vos contacts ou salles depuis un fichier CSV. Vous pouvez mapper les colonnes
          de votre CSV aux champs de la base de données et prévisualiser les données avant
          l&apos;import.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <CSVImportForm />
      </div>
    </div>
  );
}
