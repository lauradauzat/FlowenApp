/**
 * Échappe une valeur CSV si nécessaire
 */
function escapeCSVValue(value: string): string {
  // Si la valeur contient une virgule, un guillemet ou un retour à la ligne, l'entourer de guillemets
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    // Échapper les guillemets en les doublant
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convertit un tableau d'objets en CSV
 */
export function generateCSV(
  data: Array<Record<string, unknown>>,
  headers?: string[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Déterminer les en-têtes
  const csvHeaders = headers || Object.keys(data[0]);

  // Générer la ligne d'en-têtes
  const headerLine = csvHeaders.map((header) => escapeCSVValue(String(header))).join(',');

  // Générer les lignes de données
  const dataLines = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Convertir la valeur en string, gérer null/undefined
        const stringValue = value === null || value === undefined ? '' : String(value);
        return escapeCSVValue(stringValue);
      })
      .join(',');
  });

  // Combiner en-têtes et données
  return [headerLine, ...dataLines].join('\n');
}

/**
 * Génère un CSV et retourne un Buffer pour téléchargement
 */
export function generateCSVBuffer(
  data: Array<Record<string, unknown>>,
  headers?: string[]
): Buffer {
  const csvContent = generateCSV(data, headers);
  // Ajouter BOM UTF-8 pour Excel
  const BOM = '\uFEFF';
  return Buffer.from(BOM + csvContent, 'utf-8');
}
