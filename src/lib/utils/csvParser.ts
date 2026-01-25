export type CSVParseResult = {
  success: boolean;
  data: Array<Record<string, string>>;
  headers: string[];
  errors: Array<{
    row: number;
    message: string;
  }>;
};

/**
 * Parse un fichier CSV depuis un Buffer ou une string (version simplifiée)
 * 
 * NOTE: Pour une version plus robuste, installer papaparse:
 * npm install papaparse @types/papaparse
 * 
 * Cette version basique fonctionne pour les CSV simples (sans guillemets complexes, etc.)
 */
export async function parseCSV(
  content: string | Buffer,
  options?: {
    delimiter?: string;
    skipEmptyLines?: boolean;
  }
): Promise<CSVParseResult> {
  const csvString = typeof content === 'string' ? content : content.toString('utf-8');
  const delimiter = options?.delimiter ?? ',';
  const skipEmptyLines = options?.skipEmptyLines ?? true;

  const lines = csvString.split(/\r?\n/).filter((line) => {
    if (skipEmptyLines) {
      return line.trim().length > 0;
    }
    return true;
  });

  if (lines.length === 0) {
    return {
      success: false,
      data: [],
      headers: [],
      errors: [{ row: 0, message: 'Le fichier CSV est vide' }],
    };
  }

  // Parser la première ligne comme en-têtes
  const headers = lines[0]
    .split(delimiter)
    .map((h) => h.trim())
    .filter((h) => h.length > 0);

  if (headers.length === 0) {
    return {
      success: false,
      data: [],
      headers: [],
      errors: [{ row: 1, message: 'Aucun en-tête trouvé dans le CSV' }],
    };
  }

  // Parser les lignes de données
  const data: Array<Record<string, string>> = [];
  const errors: Array<{ row: number; message: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (skipEmptyLines && line.trim().length === 0) {
      continue;
    }

    const values = line.split(delimiter).map((v) => v.trim());
    
    if (values.length !== headers.length) {
      errors.push({
        row: i + 1,
        message: `Nombre de colonnes incorrect (attendu: ${headers.length}, trouvé: ${values.length})`,
      });
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return {
    success: errors.length === 0,
    data,
    headers,
    errors,
  };
}

/**
 * Parse un fichier CSV depuis un File (FormData)
 */
export async function parseCSVFile(file: File): Promise<CSVParseResult> {
  const text = await file.text();
  return parseCSV(text);
}
