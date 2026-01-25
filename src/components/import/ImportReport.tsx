'use client';

type ImportReportProps = {
  report: {
    totalRows: number;
    imported: number;
    duplicates: number;
    errors: number;
    errorDetails: Array<{ row: number; field?: string; message: string }>;
  };
};

export function ImportReport({ report }: ImportReportProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rapport d&apos;import</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{report.totalRows}</div>
          <div className="text-sm text-blue-700">Lignes totales</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{report.imported}</div>
          <div className="text-sm text-green-700">Importées</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-900">{report.duplicates}</div>
          <div className="text-sm text-yellow-700">Doublons</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-900">{report.errors}</div>
          <div className="text-sm text-red-700">Erreurs</div>
        </div>
      </div>

      {report.errorDetails.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Détails des erreurs</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            <ul className="space-y-2 text-sm">
              {report.errorDetails.map((error, index) => (
                <li key={index} className="text-red-700">
                  <span className="font-medium">Ligne {error.row}:</span> {error.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {report.imported > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ {report.imported} élément(s) importé(s) avec succès !
        </div>
      )}
    </div>
  );
}
