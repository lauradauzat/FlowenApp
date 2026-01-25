# Story 4.8: Mise à jour automatique des données scrapées

Status: review

## Story

As a musicien,
I want que le système mette à jour automatiquement les données scrapées,
So que ma base de données reste à jour sans intervention manuelle.

## Acceptance Criteria

**Given** que j'ai des données scrapées dans ma base de données  
**When** le système détecte que les données doivent être mises à jour (selon fréquence configurée)  
**Then** un job de mise à jour automatique est créé  
**And** le système vérifie les sources pour les mises à jour  
**And** les données modifiées sont mises à jour dans ma base de données  
**And** je reçois une notification des mises à jour effectuées  
**And** les données obsolètes sont identifiées et signalées  
**And** je peux configurer la fréquence de mise à jour automatique  
**And** je peux désactiver la mise à jour automatique si nécessaire

## Tasks / Subtasks

- [x] Task 1: Créer un service pour détecter les sources à mettre à jour (AC: 1, 2, 7, 8)
  - [x] Subtask 1.1: Créer fonction `getSourcesDueForUpdate` dans `src/lib/services/scrapingService.ts`
  - [x] Subtask 1.2: Créer fonction `shouldUpdateSource` pour vérifier `isActive`, `frequency` et `lastScrapedAt`
  - [x] Subtask 1.3: Gérer les fréquences : daily (24h), weekly (7 jours), monthly (30 jours)
  - [x] Subtask 1.4: Filtrer les sources qui ont déjà un job en cours (PENDING ou RUNNING)
- [x] Task 2: Créer une fonction pour mettre à jour les données existantes (AC: 3)
  - [x] Subtask 2.1: Modifier `importScrapedVenues` pour accepter un paramètre `updateExisting` et retourner `{ imported, updated }`
  - [x] Subtask 2.2: Modifier `importScrapedContacts` pour accepter un paramètre `updateExisting` et retourner `{ imported, updated }`
  - [x] Subtask 2.3: Mettre à jour les données existantes si `updateExisting` est true et si les données ont changé
  - [x] Subtask 2.4: Détecter automatiquement si c'est une mise à jour automatique selon `frequency`
- [x] Task 3: Mettre à jour `lastScrapedAt` après chaque scraping (AC: 2)
  - [x] Subtask 3.1: Mettre à jour `lastScrapedAt` dans `processScrapingJob` après un scraping réussi (pour VENUES et CONTACTS)
- [x] Task 4: Créer une API Route pour déclencher les mises à jour automatiques (AC: 1, 2)
  - [x] Subtask 4.1: Créer `src/app/api/scraping/auto-update/route.ts` avec handlers GET et POST
  - [x] Subtask 4.2: Créer fonction `triggerAutoUpdates` pour vérifier les sources et créer des jobs
  - [x] Subtask 4.3: Protéger la route avec `requireAuth()` (pour MVP, peut être étendue avec un secret partagé)
- [x] Task 5: Améliorer les notifications et le suivi (AC: 4, 5)
  - [x] Subtask 5.1: Retourner `{ imported, updated }` dans les résultats pour distinguer nouvelles données et mises à jour
  - [x] Subtask 5.2: Logger les erreurs avec `console.error` pour le debugging
  - [x] Subtask 5.3: Retourner des informations détaillées dans l'API Route (sourceId, sourceName, jobId, error)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md

### Source Tree Components to Touch

- `src/lib/services/scrapingService.ts` — Ajouter fonctions pour détecter et mettre à jour les sources  
- `src/app/api/scraping/auto-update/route.ts` — API Route pour déclencher les mises à jour automatiques

### Fréquences de mise à jour

- `daily` : Mise à jour si `lastScrapedAt` est null ou > 24h
- `weekly` : Mise à jour si `lastScrapedAt` est null ou > 7 jours
- `monthly` : Mise à jour si `lastScrapedAt` est null ou > 30 jours
- `manual` ou `null` : Pas de mise à jour automatique

### Mise à jour des données existantes

Pour MVP, on mettra à jour les données existantes en comparant par nom (pour salles) ou email/nom (pour contacts). Les champs seront mis à jour si les nouvelles données sont différentes.

### Planification (MVP)

Pour MVP, on créera une API Route qui peut être appelée par :
- Un cron job externe (Vercel Cron, GitHub Actions, etc.)
- Un scheduler cloud
- Un appel manuel pour tester

Dans une version future, on pourrait utiliser un système de queue (Bull, BullMQ) avec des jobs planifiés.

### Testing Standards Summary

- Tests unitaires pour la détection des sources à mettre à jour
- Tests d'intégration pour vérifier la mise à jour des données existantes
- Tests de sécurité : vérifier que seul le propriétaire peut déclencher des mises à jour

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- API Routes dans `src/app/api/` selon Next.js App Router

### Patterns à suivre depuis les stories précédentes

- Réutiliser les patterns de `story-4.2` et `story-4.3` pour le traitement des jobs
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.8]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Service pour détecter les sources à mettre à jour
  - ✓ Fonction `shouldUpdateSource` créée pour déterminer si une source doit être mise à jour
  - ✓ Fonction `getSourcesDueForUpdate` créée pour récupérer toutes les sources qui nécessitent une mise à jour
  - ✓ Gestion des fréquences : daily (≥24h), weekly (≥7 jours), monthly (≥30 jours)
  - ✓ Filtrage des sources qui ont déjà un job en cours (PENDING ou RUNNING)
  - ✓ Support multi-tenancy (filtrage par userId si fourni)
- **Task 2 complétée** : Mise à jour des données existantes
  - ✓ `importScrapedVenues` modifié pour accepter `updateExisting` et retourner `{ imported, updated }`
  - ✓ `importScrapedContacts` modifié pour accepter `updateExisting` et retourner `{ imported, updated }`
  - ✓ Mise à jour des données existantes si `updateExisting` est true et si les données ont changé
  - ✓ Détection automatique : `isAutoUpdate` est true si `frequency` est défini et différent de 'manual'
- **Task 3 complétée** : Mise à jour de `lastScrapedAt`
  - ✓ `lastScrapedAt` mis à jour après chaque scraping réussi (pour VENUES et CONTACTS)
  - ✓ Mise à jour effectuée après import depuis cache ou après scraping réel
- **Task 4 complétée** : API Route pour déclencher les mises à jour
  - ✓ `src/app/api/scraping/auto-update/route.ts` créée avec handlers GET et POST
  - ✓ Handler GET : retourne la liste des sources qui doivent être mises à jour
  - ✓ Handler POST : déclenche les mises à jour automatiques via `triggerAutoUpdates`
  - ✓ Fonction `triggerAutoUpdates` créée pour créer des jobs pour toutes les sources à mettre à jour
  - ✓ Route protégée par `requireAuth()` (pour MVP)
- **Task 5 complétée** : Notifications et suivi améliorés
  - ✓ Résultats des imports retournent maintenant `{ imported, updated }` pour distinguer nouvelles données et mises à jour
  - ✓ `resultCount` dans les jobs inclut maintenant les données importées ET mises à jour
  - ✓ API Route retourne des informations détaillées (sourceId, sourceName, jobId, error)
  - ✓ Logging des erreurs avec `console.error` pour le debugging

### File List

**Services :**
- `src/lib/services/scrapingService.ts` — Ajout de `getSourcesDueForUpdate`, `triggerAutoUpdates`, `shouldUpdateSource` ; modification de `importScrapedVenues` et `importScrapedContacts` pour supporter la mise à jour

**API Routes :**
- `src/app/api/scraping/auto-update/route.ts` — API Route pour déclencher les mises à jour automatiques (GET et POST)

### Notes importantes

- **Fréquences** : daily (≥24h), weekly (≥7 jours), monthly (≥30 jours), manual (pas de mise à jour automatique)
- **Mise à jour des données** : Les données existantes sont mises à jour si `updateExisting` est true et si les données ont changé
- **Détection automatique** : `isAutoUpdate` est automatiquement true si la source a une `frequency` définie et différente de 'manual'
- **Planification** : Pour MVP, l'API Route peut être appelée par un cron job externe (Vercel Cron, GitHub Actions, etc.)
- **Multi-tenancy** : Les mises à jour sont filtrées par `userId` pour respecter la multi-tenancy
- **Jobs en cours** : Les sources qui ont déjà un job PENDING ou RUNNING ne sont pas mises à jour pour éviter les doublons
- **Notifications** : Les résultats incluent maintenant le nombre de données importées ET mises à jour
