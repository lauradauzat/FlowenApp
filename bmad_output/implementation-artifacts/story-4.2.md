# Story 4.2: Scraping automatique des données de salles

Status: review

## Story

As a musicien,
I want que le système scrape automatiquement les données de salles depuis une source configurée,
So que je peux peupler ma base de données sans saisie manuelle.

## Acceptance Criteria

**Given** que j'ai configuré au moins une source de scraping pour les salles  
**When** je lance un scraping de salles depuis la page de gestion des salles  
**Then** un job de scraping asynchrone est créé (évite timeout)  
**And** le système vérifie d'abord le cache pour éviter re-scraping inutile  
**And** si pas de cache valide, le scraping s'exécute en arrière-plan  
**And** le statut du job est visible (pending, running, completed, failed)  
**And** après completion, les données scrapées sont importées dans ma base de données  
**And** les salles créées sont associées à mon `userId`  
**And** je reçois une notification quand le scraping est terminé  
**And** je peux voir les résultats du scraping (nombre de salles trouvées, erreurs)

## Tasks / Subtasks

- [x] Task 1: Créer les modèles Prisma pour les jobs et le cache (AC: 2, 3, 4, 5)
  - [x] Subtask 1.1: Créer le model `ScrapingJob` dans `prisma/schema.prisma`
  - [x] Subtask 1.2: Créer le model `PublicVenueCache` pour le cache des salles
  - [x] Subtask 1.3: Ajouter les relations nécessaires
  - [x] Subtask 1.4: Créer et appliquer la migration Prisma
- [x] Task 2: Créer le service de jobs (AC: 2, 4, 5)
  - [x] Subtask 2.1: Créer `src/lib/services/jobService.ts`
  - [x] Subtask 2.2: Créer fonction `createScrapingJob` pour créer un job
  - [x] Subtask 2.3: Créer fonction `getScrapingJob` pour récupérer un job
  - [x] Subtask 2.4: Créer fonction `updateJobStatus` pour mettre à jour le statut
  - [x] Subtask 2.5: Créer fonction `getUserScrapingJobs` pour récupérer les jobs d'un utilisateur
- [x] Task 3: Créer le service de scraping avec cache (AC: 3, 4, 6)
  - [x] Subtask 3.1: Créer `src/lib/services/scrapingService.ts`
  - [x] Subtask 3.2: Créer fonction `checkCache` pour vérifier le cache
  - [x] Subtask 3.3: Créer fonction `scrapeVenuesFromSource` pour scraper les salles (MVP: placeholder avec données de test)
  - [x] Subtask 3.4: Créer fonction `processScrapingJob` pour traiter un job en arrière-plan
  - [x] Subtask 3.5: Créer fonction `importScrapedVenues` pour importer les données dans la DB
- [x] Task 4: Créer les Server Actions pour lancer le scraping (AC: 1, 2, 5, 7)
  - [x] Subtask 4.1: Créer `src/actions/scrapingActions.ts`
  - [x] Subtask 4.2: Créer fonction `startVenueScraping` pour lancer un scraping
  - [x] Subtask 4.3: Créer fonction `getScrapingJobStatus` pour récupérer le statut d'un job
  - [x] Subtask 4.4: Créer fonction `getUserScrapingJobsAction` pour récupérer les jobs de l'utilisateur
- [x] Task 5: Créer l'UI pour lancer et visualiser les jobs (AC: 1, 5, 7, 8)
  - [x] Subtask 5.1: Créer `src/components/scraping/StartScrapingButton.tsx` pour lancer un scraping
  - [x] Subtask 5.2: Créer `src/components/scraping/ScrapingJobStatus.tsx` pour afficher le statut
  - [x] Subtask 5.3: Créer `src/components/scraping/ScrapingJobsList.tsx` pour afficher la liste des jobs
  - [x] Subtask 5.4: Intégrer dans la page `/venues` pour lancer le scraping
  - [x] Subtask 5.5: Ajouter polling AJAX pour mettre à jour le statut en temps réel (auto-refresh toutes les 2-3 secondes)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md  
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md  
- Jobs asynchrones : créer job immédiatement, traiter en arrière-plan pour éviter timeout

### Source Tree Components to Touch

- `prisma/schema.prisma` — Ajouter models `ScrapingJob` et `PublicVenueCache`  
- `src/lib/services/jobService.ts` — Service pour gérer les jobs de scraping  
- `src/lib/services/scrapingService.ts` — Service pour le scraping et le cache  
- `src/actions/scrapingActions.ts` — Server Actions pour lancer et suivre les scrapings  
- `src/components/scraping/StartScrapingButton.tsx` — Bouton pour lancer un scraping  
- `src/components/scraping/ScrapingJobStatus.tsx` — Affichage du statut d'un job  
- `src/components/scraping/ScrapingJobsList.tsx` — Liste des jobs  
- `src/app/venues/page.tsx` — Intégrer le bouton de scraping

### Structure du Model ScrapingJob

**Champs :**
- `id` (String, UUID) — Identifiant unique
- `userId` (String, requis) — Référence vers User (multi-tenancy)
- `sourceId` (String, optionnel) — Référence vers ScrapingSource
- `type` (Enum: VENUES, CONTACTS) — Type de scraping
- `status` (Enum: PENDING, RUNNING, COMPLETED, FAILED) — Statut du job
- `resultCount` (Int, optionnel) — Nombre d'éléments trouvés
- `errorMessage` (String, optionnel) — Message d'erreur si échec
- `startedAt` (DateTime, optionnel) — Date de début
- `completedAt` (DateTime, optionnel) — Date de fin
- `createdAt`, `updatedAt` (DateTime) — Timestamps

**Relations :**
- `User.scrapingJobs ScrapingJob[]` — Tous les jobs d'un utilisateur
- `ScrapingSource.scrapingJobs ScrapingJob[]` — Tous les jobs d'une source

### Structure du Model PublicVenueCache

**Champs :**
- `id` (String, UUID) — Identifiant unique
- `sourceId` (String, requis) — Référence vers ScrapingSource
- `sourceUrl` (String, requis) — URL scrapée (pour identifier le cache)
- `data` (JSON) — Données scrapées (structure flexible)
- `expiresAt` (DateTime) — Date d'expiration du cache
- `createdAt`, `updatedAt` (DateTime) — Timestamps

**Relations :**
- `ScrapingSource.venueCache PublicVenueCache[]` — Cache pour une source

### MVP Scraping Implementation

Pour MVP, le scraping réel sera un placeholder qui :
- Simule un délai de traitement
- Crée quelques salles de test avec des données génériques
- Permet de tester le flux complet (job, statut, import)

Le scraping réel (avec sélecteurs CSS/XPath, parsing HTML, etc.) sera implémenté dans une story future.

### Testing Standards Summary

- Tests unitaires pour services de scraping et cache
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut voir ses jobs

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Services dans `src/lib/services/` selon architecture  
- Composants dans `src/components/scraping/` selon architecture modulaire

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-4.1` pour les Server Actions
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.2]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/planning-artifacts/architecture.md#Scraping-Asynchrone]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Modèles Prisma pour les jobs et le cache créés
  - ✓ Enums `ScrapingJobType` (`VENUES`, `CONTACTS`) et `ScrapingJobStatus` (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`) ajoutés
  - ✓ Model `ScrapingJob` ajouté avec tous les champs nécessaires (statut, résultat, erreurs, timestamps)
  - ✓ Model `PublicVenueCache` ajouté pour le cache des salles scrapées
  - ✓ Relations ajoutées : `User.scrapingJobs`, `ScrapingSource.scrapingJobs`, `ScrapingSource.venueCache`
  - ✓ Migration SQL `20260123130446_add_scraping_jobs_and_cache` créée manuellement
- **Task 2 complétée** : Service de jobs créé
  - ✓ Fichier `src/lib/services/jobService.ts` créé
  - ✓ `createScrapingJob` pour créer un job avec statut PENDING
  - ✓ `getScrapingJob` pour récupérer un job (avec vérification multi-tenancy)
  - ✓ `updateJobStatus` pour mettre à jour le statut et les métadonnées
  - ✓ `getUserScrapingJobs` pour récupérer tous les jobs d'un utilisateur avec filtres optionnels
- **Task 3 complétée** : Service de scraping avec cache créé
  - ✓ Fichier `src/lib/services/scrapingService.ts` créé
  - ✓ `checkCache` pour vérifier si un cache existe et est valide (24h de durée)
  - ✓ `saveToCache` pour sauvegarder les données scrapées dans le cache
  - ✓ `scrapeVenuesFromSource` pour scraper les salles (MVP: placeholder qui crée des salles de test)
  - ✓ `importScrapedVenues` pour importer les salles scrapées dans la DB (évite les doublons par nom)
  - ✓ `processScrapingJob` pour traiter un job en arrière-plan (vérifie cache, scrape, importe)
- **Task 4 complétée** : Server Actions créées
  - ✓ Fichier `src/actions/scrapingActions.ts` créé
  - ✓ `startVenueScraping` pour lancer un scraping (crée job, démarre traitement asynchrone)
  - ✓ `getScrapingJobStatus` pour récupérer le statut d'un job
  - ✓ `getUserScrapingJobsAction` pour récupérer tous les jobs de l'utilisateur
  - ✓ Validation Zod via `src/lib/validations/scraping.ts`
  - ✓ Vérification des sources actives avant de lancer un scraping
- **Task 5 complétée** : UI créée et intégrée
  - ✓ `StartScrapingButton` créé pour lancer un scraping (avec ou sans source spécifique)
  - ✓ `ScrapingJobStatus` créé pour afficher le statut d'un job avec auto-refresh (polling toutes les 2s)
  - ✓ `ScrapingJobsList` créé pour afficher la liste des jobs récents avec auto-refresh
  - ✓ Intégration dans `/venues` : section "Import automatique de salles" avec boutons pour chaque source active
  - ✓ Affichage des jobs récents avec statut en temps réel
  - ✓ Polling AJAX automatique pour mettre à jour le statut des jobs en cours

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` — Ajout des enums `ScrapingJobType`, `ScrapingJobStatus` et des models `ScrapingJob`, `PublicVenueCache` + relations

**Migrations :**
- `prisma/migrations/20260123130446_add_scraping_jobs_and_cache/migration.sql` — Migration SQL pour les tables `scraping_jobs` et `public_venue_cache` + enums

**Validations :**
- `src/lib/validations/scraping.ts` — Schémas Zod `startVenueScrapingSchema`, `getScrapingJobStatusSchema`

**Services :**
- `src/lib/services/jobService.ts` — Service pour gérer les jobs : `createScrapingJob`, `getScrapingJob`, `updateJobStatus`, `getUserScrapingJobs`
- `src/lib/services/scrapingService.ts` — Service de scraping : `checkCache`, `saveToCache`, `scrapeVenuesFromSource` (MVP placeholder), `importScrapedVenues`, `processScrapingJob`

**Server Actions :**
- `src/actions/scrapingActions.ts` — Server Actions `startVenueScraping`, `getScrapingJobStatus`, `getUserScrapingJobsAction`

**Composants :**
- `src/components/scraping/StartScrapingButton.tsx` — Bouton pour lancer un scraping
- `src/components/scraping/ScrapingJobStatus.tsx` — Affichage du statut d'un job avec auto-refresh
- `src/components/scraping/ScrapingJobsList.tsx` — Liste des jobs avec auto-refresh

**Pages :**
- `src/app/venues/page.tsx` — Intégration de la section "Import automatique de salles" avec boutons de scraping et liste des jobs
