import { prisma } from '@/lib/prisma/client';
import { updateJobStatus, createScrapingJob } from './jobService';
import { fetchFromAPI, parseAPIConfig } from './apiService';
import { DataSource } from '@prisma/client';

/**
 * Durée de validité du cache (24 heures)
 */
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Vérifie si un cache existe et est valide pour une source et une URL (salles)
 */
export async function checkCache(sourceId: string, sourceUrl: string) {
  const cache = await prisma.publicVenueCache.findFirst({
    where: {
      sourceId,
      sourceUrl,
      expiresAt: {
        gt: new Date(), // Cache non expiré
      },
    },
    orderBy: {
      createdAt: 'desc', // Prendre le cache le plus récent
    },
  });

  if (cache) {
    return {
      exists: true,
      data: cache.data,
      expiresAt: cache.expiresAt,
    };
  }

  return {
    exists: false,
    data: null,
    expiresAt: null,
  };
}

/**
 * Vérifie si un cache existe et est valide pour une source et une URL (contacts)
 */
export async function checkContactCache(sourceId: string, sourceUrl: string) {
  const cache = await prisma.publicContactCache.findFirst({
    where: {
      sourceId,
      sourceUrl,
      expiresAt: {
        gt: new Date(), // Cache non expiré
      },
    },
    orderBy: {
      createdAt: 'desc', // Prendre le cache le plus récent
    },
  });

  if (cache) {
    return {
      exists: true,
      data: cache.data,
      expiresAt: cache.expiresAt,
    };
  }

  return {
    exists: false,
    data: null,
    expiresAt: null,
  };
}

/**
 * Sauvegarde des données dans le cache (salles)
 */
export async function saveToCache(
  sourceId: string,
  sourceUrl: string,
  data: unknown
) {
  const expiresAt = new Date(Date.now() + CACHE_DURATION_MS);

  // Supprimer les anciens caches pour cette source/URL
  await prisma.publicVenueCache.deleteMany({
    where: {
      sourceId,
      sourceUrl,
    },
  });

  // Créer le nouveau cache
  return prisma.publicVenueCache.create({
    data: {
      sourceId,
      sourceUrl,
      data: data as object,
      expiresAt,
    },
  });
}

/**
 * Sauvegarde des données dans le cache (contacts)
 */
export async function saveContactToCache(
  sourceId: string,
  sourceUrl: string,
  data: unknown
) {
  const expiresAt = new Date(Date.now() + CACHE_DURATION_MS);

  // Supprimer les anciens caches pour cette source/URL
  await prisma.publicContactCache.deleteMany({
    where: {
      sourceId,
      sourceUrl,
    },
  });

  // Créer le nouveau cache
  return prisma.publicContactCache.create({
    data: {
      sourceId,
      sourceUrl,
      data: data as object,
      expiresAt,
    },
  });
}

/**
 * Scrape les salles depuis une source (MVP: placeholder pour WEBSITE, API support pour API)
 * 
 * Pour MVP, cette fonction simule un scraping pour les sources WEBSITE.
 * Pour les sources API, elle fait un appel API réel.
 * Le scraping réel (avec sélecteurs CSS/XPath, parsing HTML, etc.) sera implémenté plus tard.
 */
async function scrapeVenuesFromSource(sourceId: string): Promise<{
  success: boolean;
  venues: Array<{
    name: string;
    address?: string;
    region?: string;
    website?: string;
    capacity?: number;
  }>;
  error?: string;
}> {
  // Récupérer la source
  const source = await prisma.scrapingSource.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    return {
      success: false,
      venues: [],
      error: 'Source de scraping non trouvée',
    };
  }

  // Si c'est une source API, faire un appel API
  if (source.type === 'API') {
    if (!source.url) {
      return {
        success: false,
        venues: [],
        error: 'URL de l\'API non configurée',
      };
    }

    // Parser la configuration API depuis selectors
    const apiConfig = parseAPIConfig(source.selectors);
    if (!apiConfig) {
      return {
        success: false,
        venues: [],
        error: 'Configuration API invalide dans selectors',
      };
    }

    // Utiliser l'URL de la source et la clé API
    const apiResponse = await fetchFromAPI<Array<{
      name: string;
      address?: string;
      region?: string;
      website?: string;
      capacity?: number;
    }>>({
      ...apiConfig,
      url: source.url,
      apiKey: source.apiKey || apiConfig.apiKey,
    });

    if (!apiResponse.success || !apiResponse.data) {
      return {
        success: false,
        venues: [],
        error: apiResponse.error || 'Erreur lors de l\'appel API',
      };
    }

    // Transformer les données si nécessaire
    const venues = Array.isArray(apiResponse.data)
      ? apiResponse.data
      : [apiResponse.data];

    return {
      success: true,
      venues,
    };
  }

  // Pour les sources WEBSITE, simulation d'un scraping (MVP)
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simule un délai

  const mockVenues = [
    {
      name: `Salle ${source.name} - Test 1`,
      address: '123 Rue de la Musique',
      region: 'Île-de-France',
      website: 'https://example.com/venue1',
      capacity: 200,
    },
    {
      name: `Salle ${source.name} - Test 2`,
      address: '456 Avenue des Arts',
      region: 'Auvergne-Rhône-Alpes',
      website: 'https://example.com/venue2',
      capacity: 150,
    },
  ];

  return {
    success: true,
    venues: mockVenues,
  };
}

/**
 * Scrape les contacts depuis une source (MVP: placeholder pour WEBSITE, API support pour API)
 * 
 * Pour MVP, cette fonction simule un scraping pour les sources WEBSITE.
 * Pour les sources API, elle fait un appel API réel.
 * Le scraping réel (avec sélecteurs CSS/XPath, parsing HTML, etc.) sera implémenté plus tard.
 */
async function scrapeContactsFromSource(sourceId: string): Promise<{
  success: boolean;
  contacts: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role?: string;
    notes?: string;
    venueName?: string; // Pour liaison automatique aux salles
  }>;
  error?: string;
}> {
  // Récupérer la source
  const source = await prisma.scrapingSource.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    return {
      success: false,
      contacts: [],
      error: 'Source de scraping non trouvée',
    };
  }

  // Si c'est une source API, faire un appel API
  if (source.type === 'API') {
    if (!source.url) {
      return {
        success: false,
        contacts: [],
        error: 'URL de l\'API non configurée',
      };
    }

    // Parser la configuration API depuis selectors
    const apiConfig = parseAPIConfig(source.selectors);
    if (!apiConfig) {
      return {
        success: false,
        contacts: [],
        error: 'Configuration API invalide dans selectors',
      };
    }

    // Utiliser l'URL de la source et la clé API
    const apiResponse = await fetchFromAPI<Array<{
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      role?: string;
      notes?: string;
      venueName?: string;
    }>>({
      ...apiConfig,
      url: source.url,
      apiKey: source.apiKey || apiConfig.apiKey,
    });

    if (!apiResponse.success || !apiResponse.data) {
      return {
        success: false,
        contacts: [],
        error: apiResponse.error || 'Erreur lors de l\'appel API',
      };
    }

    // Transformer les données si nécessaire
    const contacts = Array.isArray(apiResponse.data)
      ? apiResponse.data
      : [apiResponse.data];

    return {
      success: true,
      contacts,
    };
  }

  // Pour les sources WEBSITE, simulation d'un scraping (MVP)
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simule un délai

  const mockContacts = [
    {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 6 12 34 56 78',
      role: 'Programmateur',
      notes: 'Contact principal',
      venueName: undefined,
    },
    {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phone: '+33 6 98 76 54 32',
      role: 'Responsable communication',
      notes: 'Contact pour les événements',
      venueName: undefined,
    },
  ];

  return {
    success: true,
    contacts: mockContacts,
  };
}

/**
 * Importe les contacts scrapés dans la base de données de l'utilisateur
 * et tente de les lier automatiquement aux salles correspondantes
 */
async function importScrapedContacts(
  userId: string,
  contacts: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role?: string;
    notes?: string;
    venueName?: string;
  }>,
  dataSource: DataSource = 'SCRAPING',
  updateExisting: boolean = false
): Promise<{ imported: number; updated: number }> {
  let importedCount = 0;
  let updatedCount = 0;

  for (const contactData of contacts) {
    // Vérifier si le contact existe déjà (par email ou nom complet)
    const existing = await prisma.contact.findFirst({
      where: {
        userId,
        OR: [
          ...(contactData.email
            ? [{ email: contactData.email }]
            : []),
          {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
          },
        ],
      },
    });

    if (existing) {
      if (updateExisting) {
        // Mettre à jour le contact existant si les données ont changé
        const hasChanges =
          existing.email !== contactData.email ||
          existing.phone !== contactData.phone ||
          existing.role !== contactData.role ||
          existing.notes !== contactData.notes;

        if (hasChanges) {
          await prisma.contact.update({
            where: { id: existing.id },
            data: {
              email: contactData.email,
              phone: contactData.phone,
              role: contactData.role,
              notes: contactData.notes,
              // Ne pas changer le dataSource lors de la mise à jour
            },
          });
          updatedCount++;
        }
      }
      // Si updateExisting est false, on ignore les contacts existants
    } else {
      // Valider le contact avant de le créer
      const { validateContact } = await import('@/lib/validations/contactValidation');
      const validation = validateContact({
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        role: contactData.role,
        notes: contactData.notes,
      });

      const newContact = await prisma.contact.create({
        data: {
          userId,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          role: contactData.role,
          notes: contactData.notes,
          status: validation.isValid ? 'ACTIVE' : 'ERROR',
          dataSource,
        },
      });

      importedCount++;

      // Tenter de lier le contact à une salle si venueName est fourni
      if (contactData.venueName) {
        const venue = await prisma.venue.findFirst({
          where: {
            userId,
            name: {
              contains: contactData.venueName,
              mode: 'insensitive',
            },
          },
        });

        if (venue) {
          // Vérifier si la liaison n'existe pas déjà
          const existingLink = await prisma.contactVenue.findFirst({
            where: {
              contactId: newContact.id,
              venueId: venue.id,
            },
          });

          if (!existingLink) {
            await prisma.contactVenue.create({
              data: {
                contactId: newContact.id,
                venueId: venue.id,
              },
            });
          }
        }
      } else if (contactData.email) {
        // Tenter de trouver une salle liée à un contact avec le même email
        const contactWithSameEmail = await prisma.contact.findFirst({
          where: {
            userId,
            email: contactData.email,
            id: { not: newContact.id },
          },
          include: {
            venues: {
              take: 1,
            },
          },
        });

        if (contactWithSameEmail && contactWithSameEmail.venues.length > 0) {
          const venueId = contactWithSameEmail.venues[0].venueId;
          const existingLink = await prisma.contactVenue.findFirst({
            where: {
              contactId: newContact.id,
              venueId,
            },
          });

          if (!existingLink) {
            await prisma.contactVenue.create({
              data: {
                contactId: newContact.id,
                venueId,
              },
            });
          }
        }
      }
    }
  }

  return { imported: importedCount, updated: updatedCount };
}

/**
 * Importe les salles scrapées dans la base de données de l'utilisateur
 */
async function importScrapedVenues(
  userId: string,
  venues: Array<{
    name: string;
    address?: string;
    region?: string;
    website?: string;
    capacity?: number;
  }>,
  dataSource: DataSource = 'SCRAPING',
  updateExisting: boolean = false
): Promise<{ imported: number; updated: number }> {
  let importedCount = 0;
  let updatedCount = 0;

  for (const venueData of venues) {
    // Vérifier si la salle existe déjà (par nom)
    const existing = await prisma.venue.findFirst({
      where: {
        userId,
        name: venueData.name,
      },
    });

    if (existing) {
      if (updateExisting) {
        // Mettre à jour la salle existante si les données ont changé
        const hasChanges =
          existing.address !== venueData.address ||
          existing.region !== venueData.region ||
          existing.website !== venueData.website ||
          existing.capacity !== venueData.capacity;

        if (hasChanges) {
          await prisma.venue.update({
            where: { id: existing.id },
            data: {
              address: venueData.address,
              region: venueData.region,
              website: venueData.website,
              capacity: venueData.capacity,
              // Ne pas changer le dataSource lors de la mise à jour
            },
          });
          updatedCount++;
        }
      }
      // Si updateExisting est false, on ignore les salles existantes
    } else {
      await prisma.venue.create({
        data: {
          userId,
          name: venueData.name,
          address: venueData.address,
          region: venueData.region,
          website: venueData.website,
          capacity: venueData.capacity,
          status: 'ACTIVE',
          dataSource,
        },
      });
      importedCount++;
    }
  }

  return { imported: importedCount, updated: updatedCount };
}

/**
 * Traite un job de scraping en arrière-plan
 * 
 * Cette fonction est appelée de manière asynchrone pour éviter les timeouts.
 * Pour MVP, elle est appelée directement, mais dans une version future,
 * elle pourrait être déclenchée par un système de queue (Bull, BullMQ, etc.).
 */
export async function processScrapingJob(jobId: string, userId: string) {
  try {
    // Mettre à jour le statut à RUNNING
    const job = await prisma.scrapingJob.findFirst({
      where: {
        id: jobId,
        userId, // Multi-tenancy
      },
      include: {
        source: true,
      },
    });

    if (!job) {
      throw new Error('Job de scraping non trouvé');
    }

    await updateJobStatus(jobId, 'RUNNING', {
      startedAt: new Date(),
    });

    // Vérifier le cache d'abord
    if (job.source && job.source.url) {
      const cache = await checkCache(job.sourceId!, job.source.url);

      if (cache.exists && cache.data) {
        // Utiliser les données du cache
        const venues = cache.data as Array<{
          name: string;
          address?: string;
          region?: string;
          website?: string;
          capacity?: number;
        }>;

        const dataSource = job.source?.type === 'API' ? 'API' : 'SCRAPING';
        const isAutoUpdate = !!(job.source?.frequency && job.source.frequency !== 'manual');
        const result = await importScrapedVenues(userId, venues, dataSource, isAutoUpdate);

        await updateJobStatus(jobId, 'COMPLETED', {
          resultCount: result.imported + result.updated,
          completedAt: new Date(),
        });

        // Mettre à jour lastScrapedAt de la source
        if (job.sourceId) {
          await prisma.scrapingSource.update({
            where: { id: job.sourceId },
            data: { lastScrapedAt: new Date() },
          });
        }

          return {
            success: true,
            fromCache: true,
            count: result.imported + result.updated,
          };
      }
    }

    // Si pas de cache, faire le scraping
    if (job.type === 'VENUES' && job.sourceId) {
      const scrapingResult = await scrapeVenuesFromSource(job.sourceId);

      if (!scrapingResult.success) {
        await updateJobStatus(jobId, 'FAILED', {
          errorMessage: scrapingResult.error || 'Erreur lors du scraping',
          completedAt: new Date(),
        });
        return {
          success: false,
          error: scrapingResult.error,
        };
      }

      // Sauvegarder dans le cache
      if (job.source && job.source.url) {
        await saveToCache(job.sourceId, job.source.url, scrapingResult.venues);
      }

      // Importer les salles
      const dataSource = job.source?.type === 'API' ? 'API' : 'SCRAPING';
      const isAutoUpdate = !!(job.source?.frequency && job.source.frequency !== 'manual');
      const result = await importScrapedVenues(userId, scrapingResult.venues, dataSource, isAutoUpdate);

      await updateJobStatus(jobId, 'COMPLETED', {
        resultCount: result.imported + result.updated,
        completedAt: new Date(),
      });

      return {
        success: true,
        fromCache: false,
        count: result.imported + result.updated,
      };
    }

    if (job.type === 'CONTACTS' && job.sourceId) {
      // Vérifier le cache d'abord
      if (job.source && job.source.url) {
        const cache = await checkContactCache(job.sourceId, job.source.url);

        if (cache.exists && cache.data) {
          // Utiliser les données du cache
          const contacts = cache.data as Array<{
            firstName: string;
            lastName: string;
            email?: string;
            phone?: string;
            role?: string;
            notes?: string;
            venueName?: string;
          }>;

          const dataSourceFromCache = job.source?.type === 'API' ? 'API' : 'SCRAPING';
          const isAutoUpdate = !!(job.source?.frequency && job.source.frequency !== 'manual');
          const result = await importScrapedContacts(userId, contacts, dataSourceFromCache, isAutoUpdate);

          await updateJobStatus(jobId, 'COMPLETED', {
            resultCount: result.imported + result.updated,
            completedAt: new Date(),
          });

          // Mettre à jour lastScrapedAt de la source
          if (job.sourceId) {
            await prisma.scrapingSource.update({
              where: { id: job.sourceId },
              data: { lastScrapedAt: new Date() },
            });
          }

          return {
            success: true,
            fromCache: true,
            count: result.imported + result.updated,
          };
        }
      }

      const scrapingResult = await scrapeContactsFromSource(job.sourceId);

      if (!scrapingResult.success) {
        await updateJobStatus(jobId, 'FAILED', {
          errorMessage: scrapingResult.error || 'Erreur lors du scraping',
          completedAt: new Date(),
        });
        return {
          success: false,
          error: scrapingResult.error,
        };
      }

      // Sauvegarder dans le cache
      if (job.source && job.source.url) {
        await saveContactToCache(job.sourceId, job.source.url, scrapingResult.contacts);
      }

      // Importer les contacts
      const dataSource = job.source?.type === 'API' ? 'API' : 'SCRAPING';
      const isAutoUpdate = !!(job.source?.frequency && job.source.frequency !== 'manual');
      const result = await importScrapedContacts(userId, scrapingResult.contacts, dataSource, isAutoUpdate);

      await updateJobStatus(jobId, 'COMPLETED', {
        resultCount: result.imported + result.updated,
        completedAt: new Date(),
      });

      // Mettre à jour lastScrapedAt de la source
      if (job.sourceId) {
        await prisma.scrapingSource.update({
          where: { id: job.sourceId },
          data: { lastScrapedAt: new Date() },
        });
      }

      return {
        success: true,
        fromCache: false,
        count: result.imported + result.updated,
      };
    }

    throw new Error(`Type de scraping non supporté: ${job.type}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue lors du scraping';

    await updateJobStatus(jobId, 'FAILED', {
      errorMessage,
      completedAt: new Date(),
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Détermine si une source doit être mise à jour selon sa fréquence
 */
function shouldUpdateSource(source: {
  frequency: string | null;
  lastScrapedAt: Date | null;
  isActive: boolean;
}): boolean {
  // Si la source n'est pas active, ne pas mettre à jour
  if (!source.isActive) {
    return false;
  }

  // Si la fréquence est manuelle ou null, ne pas mettre à jour automatiquement
  if (!source.frequency || source.frequency === 'manual') {
    return false;
  }

  // Si jamais scrapée, mettre à jour
  if (!source.lastScrapedAt) {
    return true;
  }

  const now = new Date();
  const lastScraped = new Date(source.lastScrapedAt);
  const hoursSinceLastScrape = (now.getTime() - lastScraped.getTime()) / (1000 * 60 * 60);

  switch (source.frequency) {
    case 'daily':
      return hoursSinceLastScrape >= 24;
    case 'weekly':
      return hoursSinceLastScrape >= 24 * 7;
    case 'monthly':
      return hoursSinceLastScrape >= 24 * 30;
    default:
      return false;
  }
}

/**
 * Récupère toutes les sources qui doivent être mises à jour.
 * Si userId est fourni et que UserSettings.scrapingAutoUpdateEnabled === false, renvoie [].
 */
export async function getSourcesDueForUpdate(userId?: string) {
  if (userId) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });
    if (settings && settings.scrapingAutoUpdateEnabled === false) {
      return [];
    }
  }

  const where: {
    isActive: boolean;
    frequency?: {
      in: string[];
    };
  } = {
    isActive: true,
    frequency: {
      in: ['daily', 'weekly', 'monthly'],
    },
  };

  if (userId) {
    // Multi-tenancy : filtrer par userId si fourni
    const sources = await prisma.scrapingSource.findMany({
      where: {
        ...where,
        userId,
      },
      include: {
        scrapingJobs: {
          where: {
            status: {
              in: ['PENDING', 'RUNNING'],
            },
          },
          take: 1,
        },
      },
    });

    // Filtrer les sources qui doivent être mises à jour et qui n'ont pas de job en cours
    return sources.filter(
      (source) => shouldUpdateSource(source) && source.scrapingJobs.length === 0
    );
  }

  // Si pas de userId, récupérer toutes les sources actives (pour un cron job global)
  const sources = await prisma.scrapingSource.findMany({
    where,
    include: {
      scrapingJobs: {
        where: {
          status: {
            in: ['PENDING', 'RUNNING'],
          },
        },
        take: 1,
      },
    },
  });

  // Filtrer les sources qui doivent être mises à jour et qui n'ont pas de job en cours
  return sources.filter(
    (source) => shouldUpdateSource(source) && source.scrapingJobs.length === 0
  );
}

/**
 * Déclenche les mises à jour automatiques pour toutes les sources qui le nécessitent.
 * Si userId est fourni et que UserSettings.scrapingAutoUpdateEnabled === false, ne fait rien ([]).
 */
export async function triggerAutoUpdates(userId?: string) {
  const sourcesToUpdate = await getSourcesDueForUpdate(userId);
  const results: Array<{
    sourceId: string;
    sourceName: string;
    jobId?: string;
    error?: string;
  }> = [];

  for (const source of sourcesToUpdate) {
    try {
      // Déterminer le type de scraping selon la source
      // Pour MVP, on suppose que chaque source peut scraper les deux types
      // Dans une version future, on pourrait avoir un champ pour spécifier le type
      
      // Pour l'instant, on crée un job pour les salles (VENUES)
      // TODO: Ajouter un champ dans ScrapingSource pour spécifier le type (VENUES, CONTACTS, BOTH)
      const job = await createScrapingJob(source.userId, 'VENUES', source.id);

      // Traiter le job en arrière-plan
      processScrapingJob(job.id, source.userId).catch((error) => {
        console.error(`Error processing auto-update job ${job.id}:`, error);
      });

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        jobId: job.id,
      });
    } catch (error) {
      results.push({
        sourceId: source.id,
        sourceName: source.name,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  return results;
}
