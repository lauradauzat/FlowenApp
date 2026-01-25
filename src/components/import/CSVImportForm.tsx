'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  previewCSVImport,
  importContactsFromCSV,
  importVenuesFromCSV,
} from '@/actions/importActions';
import type { ContactColumnMapping, VenueColumnMapping } from '@/lib/validations/import';
import { CSVPreview } from './CSVPreview';
import { ColumnMapping } from './ColumnMapping';
import { ImportReport } from './ImportReport';

type ImportType = 'contacts' | 'venues';

export function CSVImportForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('contacts');
  const [headers, setHeaders] = useState<string[]>([]);
  const [preview, setPreview] = useState<Array<Record<string, string>>>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'report'>(
    'upload'
  );
  const [report, setReport] = useState<{
    totalRows: number;
    imported: number;
    duplicates: number;
    errors: number;
    errorDetails: Array<{ row: number; field?: string; message: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Le fichier doit être un fichier CSV (.csv)');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      // Prévisualiser le fichier avec un mapping par défaut
      const result = await previewCSVImport(selectedFile, importType, {});

      if (result.success && result.data) {
        setHeaders(result.data.headers);
        setPreview(result.data.preview);
        setStep('mapping');
      } else {
        setError(result.error?.message || 'Erreur lors de la prévisualisation');
      }
    } catch {
      setError('Une erreur est survenue lors de la lecture du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingComplete = (newMapping: Record<string, string>) => {
    setMapping(newMapping);
    setStep('preview');
  };

  const handleImport = async () => {
    if (!file) return;

    setStep('importing');
    setError(null);
    setIsLoading(true);

    try {
      const result =
        importType === 'contacts'
          ? await importContactsFromCSV(file, mapping as ContactColumnMapping, true)
          : await importVenuesFromCSV(file, mapping as VenueColumnMapping, true);

      if (result.success && result.data) {
        setReport(result.data);
        setStep('report');
        router.refresh();
      } else {
        setError(result.error?.message || 'Erreur lors de l\'import');
        setStep('preview');
      }
    } catch {
      setError('Une erreur est survenue lors de l\'import');
      setStep('preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setHeaders([]);
    setPreview([]);
    setMapping({});
    setReport(null);
    setError(null);
    setStep('upload');
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="importType" className="block text-sm font-medium text-gray-700 mb-2">
              Type d&apos;import
            </label>
            <select
              id="importType"
              value={importType}
              onChange={(e) => setImportType(e.target.value as ImportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contacts">Contacts</option>
              <option value="venues">Salles</option>
            </select>
          </div>

          <div>
            <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
              Fichier CSV
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              Sélectionnez un fichier CSV avec des en-têtes de colonnes
            </p>
          </div>
        </div>
      )}

      {step === 'mapping' && headers.length > 0 && (
        <ColumnMapping
          headers={headers}
          type={importType}
          onComplete={handleMappingComplete}
          onCancel={() => setStep('upload')}
        />
      )}

      {step === 'preview' && preview.length > 0 && (
        <div className="space-y-4">
          <CSVPreview data={preview} mapping={mapping} type={importType} />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleImport}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Import en cours...' : 'Importer les données'}
            </button>
            <button
              type="button"
              onClick={() => setStep('mapping')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Modifier le mapping
            </button>
          </div>
        </div>
      )}

      {step === 'importing' && (
        <div className="text-center py-8">
          <div className="text-lg font-medium text-gray-700 mb-2">Import en cours...</div>
          <div className="text-sm text-gray-500">Veuillez patienter</div>
        </div>
      )}

      {step === 'report' && report && (
        <div className="space-y-4">
          <ImportReport report={report} />
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Importer un autre fichier
          </button>
        </div>
      )}
    </div>
  );
}
