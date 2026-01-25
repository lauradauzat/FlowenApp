'use client';

type CSVPreviewProps = {
  data: Array<Record<string, string>>;
  mapping: Record<string, string>;
  type: 'contacts' | 'venues';
};

export function CSVPreview({ data, mapping }: CSVPreviewProps) {
  // Inverser le mapping pour afficher les valeurs mappées
  const reverseMapping: Record<string, string> = {};
  Object.entries(mapping).forEach(([field, header]) => {
    reverseMapping[header] = field;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prévisualisation des données</h3>
      <p className="text-sm text-gray-600">
        Aperçu des {data.length} premières lignes qui seront importées :
      </p>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.values(mapping)
                .filter((header) => header)
                .map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {reverseMapping[header] || header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.values(mapping)
                  .filter((header) => header)
                  .map((header) => (
                    <td key={header} className="px-4 py-3 text-sm text-gray-700">
                      {row[header] || '-'}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
