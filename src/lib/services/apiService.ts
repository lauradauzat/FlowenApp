/**
 * Service pour gérer les appels aux APIs externes
 */

type APIConfig = {
  url: string;
  apiKey?: string;
  authType?: 'header' | 'query' | 'bearer';
  authHeader?: string;
  endpoint?: string;
  method?: 'GET' | 'POST';
  dataPath?: string; // Chemin dans la réponse JSON (ex: "data.venues")
  timeout?: number; // Timeout en millisecondes (défaut: 30000)
};

type APIResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
};

/**
 * Fait un appel à une API externe avec authentification
 */
export async function fetchFromAPI<T = unknown>(
  config: APIConfig
): Promise<APIResponse<T>> {
  try {
    const {
      url,
      apiKey,
      authType = 'header',
      authHeader = 'X-API-Key',
      endpoint = '',
      method = 'GET',
      dataPath,
      timeout = 30000,
    } = config;

    // Construire l'URL complète
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let fullUrl = `${baseUrl}${apiEndpoint}`;

    // Préparer les headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Ajouter l'authentification
    if (apiKey) {
      if (authType === 'header') {
        headers[authHeader] = apiKey;
      } else if (authType === 'bearer') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      } else if (authType === 'query') {
        const separator = fullUrl.includes('?') ? '&' : '?';
        fullUrl = `${fullUrl}${separator}api_key=${encodeURIComponent(apiKey)}`;
      }
    }

    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Faire l'appel API
      const response = await fetch(fullUrl, {
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API Error: ${response.status} ${response.statusText}. ${errorText}`,
          statusCode: response.status,
        };
      }

      // Parser la réponse JSON
      const jsonData = await response.json();

      // Extraire les données selon le chemin spécifié
      let data = jsonData;
      if (dataPath) {
        const pathParts = dataPath.split('.');
        for (const part of pathParts) {
          if (data && typeof data === 'object' && part in data) {
            data = (data as Record<string, unknown>)[part];
          } else {
            return {
              success: false,
              error: `Chemin de données invalide: ${dataPath}`,
            };
          }
        }
      }

      return {
        success: true,
        data: data as T,
        statusCode: response.status,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return {
            success: false,
            error: `Timeout: L'appel API a dépassé le délai de ${timeout}ms`,
          };
        }

        if (fetchError.message.includes('fetch failed')) {
          return {
            success: false,
            error: `Erreur de connexion: Impossible de joindre l'API à ${fullUrl}`,
          };
        }

        return {
          success: false,
          error: `Erreur lors de l'appel API: ${fetchError.message}`,
        };
      }

      return {
        success: false,
        error: 'Erreur inconnue lors de l\'appel API',
      };
    }
  } catch (error) {
    console.error('Error in fetchFromAPI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Parse la configuration API depuis le JSON selectors d'une ScrapingSource
 */
export function parseAPIConfig(selectors: unknown): APIConfig | null {
  if (!selectors || typeof selectors !== 'object') {
    return null;
  }

  const config = selectors as Record<string, unknown>;

  if (!config.url || typeof config.url !== 'string') {
    return null;
  }

  return {
    url: config.url,
    apiKey: typeof config.apiKey === 'string' ? config.apiKey : undefined,
    authType: (config.authType as 'header' | 'query' | 'bearer') || 'header',
    authHeader: (config.authHeader as string) || 'X-API-Key',
    endpoint: typeof config.endpoint === 'string' ? config.endpoint : undefined,
    method: (config.method as 'GET' | 'POST') || 'GET',
    dataPath: typeof config.dataPath === 'string' ? config.dataPath : undefined,
    timeout: typeof config.timeout === 'number' ? config.timeout : 30000,
  };
}
