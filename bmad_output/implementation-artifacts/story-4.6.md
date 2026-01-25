# Story 4.6: Connexion aux APIs externes pour récupérer des données

Status: review

## Story

As a musicien,
I want que le système se connecte à des APIs externes pour récupérer des données de salles/contacts,
So que je peux utiliser des sources de données plus fiables que le scraping.

## Acceptance Criteria

**Given** qu'une API externe est disponible pour les données de salles/contacts  
**When** je configure la connexion à l'API (clé API, endpoint, etc.)  
**Then** le système peut se connecter à l'API avec authentification  
**And** je peux lancer une récupération de données depuis l'API  
**And** les données récupérées sont importées dans ma base de données  
**And** les erreurs de connexion API sont gérées et signalées clairement  
**And** les données de l'API sont mises en cache pour éviter appels répétés  
**And** les données importées sont associées à mon `userId`  
**And** je peux voir l'origine des données (scraping, API, import CSV, manuel)

## Tasks / Subtasks

- [x] Task 1: Ajouter un champ pour tracer l'origine des données (AC: 8)
  - [x] Subtask 1.1: Ajouter champ `dataSource` dans `Contact` et `Venue` dans `prisma/schema.prisma`
  - [x] Subtask 1.2: Créer enum `DataSource` (SCRAPING, API, CSV, MANUAL)
  - [x] Subtask 1.3: Créer migration Prisma `20260123140000_add_data_source/migration.sql`
- [x] Task 2: Créer un service pour gérer les appels API externes (AC: 3, 4, 5)
  - [x] Subtask 2.1: Créer `src/lib/services/apiService.ts`
  - [x] Subtask 2.2: Créer fonction `fetchFromAPI` pour faire des appels API avec authentification
  - [x] Subtask 2.3: Gérer différents types d'authentification (API key header, Bearer token, query params)
  - [x] Subtask 2.4: Gérer les erreurs de connexion et les timeouts (AbortController)
  - [x] Subtask 2.5: Parser les réponses JSON et extraire les données selon `dataPath`
  - [x] Subtask 2.6: Créer fonction `parseAPIConfig` pour parser la config depuis selectors JSON
- [x] Task 3: Étendre le scrapingService pour gérer les sources API (AC: 2, 4, 6)
  - [x] Subtask 3.1: Modifier `scrapeVenuesFromSource` pour détecter le type `API`
  - [x] Subtask 3.2: Appeler `apiService.fetchFromAPI` pour les sources API
  - [x] Subtask 3.3: Transformer les données API en format attendu (array ou single object)
  - [x] Subtask 3.4: Utiliser le cache existant pour les données API (même système que scraping)
  - [x] Subtask 3.5: Faire de même pour `scrapeContactsFromSource`
- [x] Task 4: Mettre à jour les fonctions d'import pour inclure l'origine (AC: 7, 8)
  - [x] Subtask 4.1: Modifier `importScrapedVenues` pour accepter un paramètre `dataSource` (défaut: 'SCRAPING')
  - [x] Subtask 4.2: Modifier `importScrapedContacts` pour accepter un paramètre `dataSource` (défaut: 'SCRAPING')
  - [x] Subtask 4.3: Mettre à jour tous les appels dans `processScrapingJob` pour passer le bon `dataSource` (API ou SCRAPING)
- [x] Task 5: Améliorer la gestion d'erreurs API (AC: 5)
  - [x] Subtask 5.1: Créer des messages d'erreur spécifiques pour les erreurs API (timeout, connexion, status HTTP)
  - [x] Subtask 5.2: Logger les erreurs API avec `console.error` pour le debugging
  - [x] Subtask 5.3: Retourner des messages d'erreur clairs à l'utilisateur via le système de jobs

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md  
- Réutiliser le système de cache existant (`PublicVenueCache`, `PublicContactCache`)

### Source Tree Components to Touch

- `prisma/schema.prisma` — Ajouter enum `DataSource` et champs dans `Contact` et `Venue`  
- `src/lib/services/apiService.ts` — Nouveau service pour les appels API  
- `src/lib/services/scrapingService.ts` — Étendre pour gérer les sources API  
- `prisma/migrations/` — Migration pour ajouter les champs `dataSource`

### Types d'authentification API supportés (MVP)

- **API Key dans header** : `X-API-Key: <key>` ou `Authorization: Bearer <key>`
- **API Key dans query params** : `?api_key=<key>`
- Configuration via `ScrapingSource.selectors` (JSON) pour spécifier le type d'auth

### Format de configuration API dans selectors

```json
{
  "authType": "header" | "query" | "bearer",
  "authHeader": "X-API-Key" | "Authorization" | etc.,
  "endpoint": "/venues" | "/contacts" | etc.,
  "method": "GET" | "POST",
  "dataPath": "data.venues" // Chemin dans la réponse JSON
}
```

### Testing Standards Summary

- Tests unitaires pour `apiService` (mocking des appels HTTP)
- Tests d'intégration pour vérifier la connexion API réelle (optionnel pour MVP)
- Tests de sécurité : vérifier que les clés API ne sont pas exposées

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Réutilisation du système de cache existant  
- Compatibilité avec le système de jobs existant

### Patterns à suivre depuis les stories précédentes

- Réutiliser les patterns de `story-4.2` et `story-4.3` pour le traitement des jobs
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.6]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Ajout du champ `dataSource` pour tracer l'origine des données
  - ✓ Enum `DataSource` créé avec valeurs : SCRAPING, API, CSV, MANUAL
  - ✓ Champ `dataSource` ajouté dans `Contact` et `Venue` avec valeur par défaut `MANUAL`
  - ✓ Migration Prisma créée (`20260123140000_add_data_source/migration.sql`)
- **Task 2 complétée** : Service API créé
  - ✓ Fichier `src/lib/services/apiService.ts` créé
  - ✓ Fonction `fetchFromAPI` avec support de plusieurs types d'authentification :
    - Header personnalisé (ex: `X-API-Key`)
    - Bearer token (`Authorization: Bearer <key>`)
    - Query parameter (`?api_key=<key>`)
  - ✓ Gestion des timeouts avec `AbortController` (défaut: 30s)
  - ✓ Extraction de données selon `dataPath` (ex: `data.venues`)
  - ✓ Gestion d'erreurs complète (connexion, timeout, HTTP errors)
  - ✓ Fonction `parseAPIConfig` pour parser la configuration depuis `selectors` JSON
- **Task 3 complétée** : Extension du scrapingService pour les APIs
  - ✓ `scrapeVenuesFromSource` détecte le type `API` et appelle `fetchFromAPI`
  - ✓ `scrapeContactsFromSource` détecte le type `API` et appelle `fetchFromAPI`
  - ✓ Utilisation du cache existant pour les données API (même système que scraping)
  - ✓ Transformation des données API (support array ou single object)
- **Task 4 complétée** : Mise à jour des fonctions d'import
  - ✓ `importScrapedVenues` accepte maintenant `dataSource` (défaut: 'SCRAPING')
  - ✓ `importScrapedContacts` accepte maintenant `dataSource` (défaut: 'SCRAPING')
  - ✓ Tous les appels dans `processScrapingJob` passent le bon `dataSource` :
    - `API` si `job.source.type === 'API'`
    - `SCRAPING` sinon
- **Task 5 complétée** : Gestion d'erreurs améliorée
  - ✓ Messages d'erreur spécifiques pour timeout, connexion, erreurs HTTP
  - ✓ Logging des erreurs avec `console.error`
  - ✓ Messages d'erreur retournés via le système de jobs existant

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` — Ajout enum `DataSource` et champs `dataSource` dans `Contact` et `Venue`

**Migrations :**
- `prisma/migrations/20260123140000_add_data_source/migration.sql` — Migration pour ajouter `dataSource`

**Services :**
- `src/lib/services/apiService.ts` — Nouveau service pour les appels API (`fetchFromAPI`, `parseAPIConfig`)
- `src/lib/services/scrapingService.ts` — Étendu pour gérer les sources API et inclure `dataSource` dans les imports

### Notes importantes

- **Configuration API** : La configuration API est stockée dans `ScrapingSource.selectors` (JSON) avec :
  - `url`, `apiKey`, `authType` (header/query/bearer), `authHeader`, `endpoint`, `method`, `dataPath`, `timeout`
- **Authentification** : Support de 3 types d'authentification (header, bearer, query) pour couvrir la plupart des APIs
- **Cache** : Les données API utilisent le même système de cache que le scraping (`PublicVenueCache`, `PublicContactCache`)
- **Tracing** : Tous les contacts et salles importés ont maintenant un champ `dataSource` pour tracer leur origine
- **Compatibilité** : Les sources de type `WEBSITE` continuent de fonctionner comme avant (simulation pour MVP)
- **Erreurs** : Gestion complète des erreurs avec messages clairs pour l'utilisateur via le système de jobs
