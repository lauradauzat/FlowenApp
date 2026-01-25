# Story 4.3: Scraping automatique des données de contacts

Status: review

## Story

As a musicien,
I want que le système scrape automatiquement les données de contacts depuis une source configurée,
So que je peux peupler ma base de contacts sans saisie manuelle.

## Acceptance Criteria

**Given** que j'ai configuré au moins une source de scraping pour les contacts  
**When** je lance un scraping de contacts depuis la page de gestion des contacts  
**Then** un job de scraping asynchrone est créé (évite timeout)  
**And** le système vérifie d'abord le cache pour éviter re-scraping inutile  
**And** si pas de cache valide, le scraping s'exécute en arrière-plan  
**And** le statut du job est visible (pending, running, completed, failed)  
**And** après completion, les données scrapées sont importées dans ma base de données  
**And** les contacts créés sont associés à mon `userId`  
**And** je reçois une notification quand le scraping est terminé  
**And** je peux voir les résultats du scraping (nombre de contacts trouvés, erreurs)  
**And** les contacts scrapés sont automatiquement liés aux salles correspondantes si possible

## Tasks / Subtasks

- [x] Task 1: Créer le modèle Prisma pour le cache des contacts (AC: 2, 3)
  - [x] Subtask 1.1: Créer le model `PublicContactCache` dans `prisma/schema.prisma`
  - [x] Subtask 1.2: Ajouter la relation dans `ScrapingSource`
  - [x] Subtask 1.3: Créer et appliquer la migration Prisma
- [x] Task 2: Étendre le service de scraping pour les contacts (AC: 3, 4, 6, 9)
  - [x] Subtask 2.1: Ajouter fonction `checkContactCache` dans `scrapingService.ts`
  - [x] Subtask 2.2: Ajouter fonction `saveContactToCache` dans `scrapingService.ts`
  - [x] Subtask 2.3: Ajouter fonction `scrapeContactsFromSource` (MVP: placeholder avec données de test)
  - [x] Subtask 2.4: Ajouter fonction `importScrapedContacts` pour importer les contacts
  - [x] Subtask 2.5: Étendre `processScrapingJob` pour gérer le type CONTACTS
  - [x] Subtask 2.6: Ajouter logique de liaison automatique aux salles (par nom/email si correspondance)
- [x] Task 3: Créer les Server Actions pour le scraping de contacts (AC: 1, 2, 5, 7)
  - [x] Subtask 3.1: Ajouter `startContactScraping` dans `scrapingActions.ts`
  - [x] Subtask 3.2: Ajouter validation Zod `startContactScrapingSchema`
  - [x] Subtask 3.3: Vérifier les sources actives pour les contacts
- [x] Task 4: Créer l'UI pour lancer le scraping de contacts (AC: 1, 5, 7, 8)
  - [x] Subtask 4.1: Intégrer `StartScrapingButton` dans la page `/contacts` (avec type CONTACTS)
  - [x] Subtask 4.2: Intégrer `ScrapingJobsList` avec type CONTACTS
  - [x] Subtask 4.3: Afficher les sources actives pour les contacts
  - [x] Subtask 4.4: Modifier `StartScrapingButton` pour supporter les deux types (VENUES/CONTACTS)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md  
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md  
- Jobs asynchrones : créer job immédiatement, traiter en arrière-plan pour éviter timeout

### Source Tree Components to Touch

- `prisma/schema.prisma` — Ajouter model `PublicContactCache`  
- `src/lib/services/scrapingService.ts` — Étendre pour gérer les contacts  
- `src/lib/validations/scraping.ts` — Ajouter `startContactScrapingSchema`  
- `src/actions/scrapingActions.ts` — Ajouter `startContactScraping`  
- `src/app/contacts/page.tsx` — Intégrer le bouton de scraping

### Structure du Model PublicContactCache

**Champs :**
- `id` (String, UUID) — Identifiant unique
- `sourceId` (String, requis) — Référence vers ScrapingSource
- `sourceUrl` (String, requis) — URL scrapée (pour identifier le cache)
- `data` (JSON) — Données scrapées (structure flexible)
- `expiresAt` (DateTime) — Date d'expiration du cache
- `createdAt`, `updatedAt` (DateTime) — Timestamps

**Relations :**
- `ScrapingSource.contactCache PublicContactCache[]` — Cache pour une source

### MVP Scraping Implementation

Pour MVP, le scraping réel sera un placeholder qui :
- Simule un délai de traitement
- Crée quelques contacts de test avec des données génériques
- Permet de tester le flux complet (job, statut, import)

Le scraping réel (avec sélecteurs CSS/XPath, parsing HTML, etc.) sera implémenté dans une story future.

### Liaison automatique aux salles

Pour MVP, la liaison se fera par correspondance simple :
- Si un contact scrapé a un email qui correspond à un contact existant lié à une salle, on lie le nouveau contact
- Si un contact scrapé a un nom qui correspond à une salle (par nom de contact dans les notes), on tente une liaison
- Cette logique sera améliorée dans les stories futures

### Testing Standards Summary

- Tests unitaires pour services de scraping et cache
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut voir ses jobs

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Services dans `src/lib/services/` selon architecture  
- Composants dans `src/components/scraping/` selon architecture modulaire

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-4.2` pour les contacts
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.3]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/planning-artifacts/architecture.md#Scraping-Asynchrone]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Modèle Prisma pour le cache des contacts créé
  - ✓ Model `PublicContactCache` ajouté dans `prisma/schema.prisma` avec tous les champs nécessaires
  - ✓ Relation `contactCache PublicContactCache[]` ajoutée dans `ScrapingSource`
  - ✓ Migration SQL `20260123131023_add_contact_cache` créée manuellement
- **Task 2 complétée** : Service de scraping étendu pour les contacts
  - ✓ `checkContactCache` ajoutée pour vérifier le cache des contacts
  - ✓ `saveContactToCache` ajoutée pour sauvegarder les données scrapées dans le cache
  - ✓ `scrapeContactsFromSource` créée (MVP: placeholder qui crée des contacts de test)
  - ✓ `importScrapedContacts` créée pour importer les contacts (évite les doublons par email ou nom complet)
  - ✓ `processScrapingJob` étendue pour gérer le type CONTACTS (vérifie cache, scrape, importe)
  - ✓ Logique de liaison automatique aux salles implémentée :
    - Par `venueName` si fourni dans les données scrapées
    - Par email si un contact existant avec le même email est déjà lié à une salle
- **Task 3 complétée** : Server Actions créées
  - ✓ `startContactScraping` ajoutée dans `scrapingActions.ts` pour lancer un scraping de contacts
  - ✓ `startContactScrapingSchema` ajoutée dans `src/lib/validations/scraping.ts`
  - ✓ Vérification des sources actives avant de lancer un scraping
- **Task 4 complétée** : UI créée et intégrée
  - ✓ `StartScrapingButton` modifié pour supporter les deux types (VENUES/CONTACTS)
  - ✓ Intégration dans `/contacts` : section "Import automatique de contacts" avec boutons pour chaque source active
  - ✓ `ScrapingJobsList` intégré avec type CONTACTS pour afficher les jobs récents
  - ✓ Message informatif sur la liaison automatique aux salles

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` — Ajout du model `PublicContactCache` + relation dans `ScrapingSource`

**Migrations :**
- `prisma/migrations/20260123131023_add_contact_cache/migration.sql` — Migration SQL pour la table `public_contact_cache`

**Validations :**
- `src/lib/validations/scraping.ts` — Ajout de `startContactScrapingSchema`

**Services :**
- `src/lib/services/scrapingService.ts` — Ajout de `checkContactCache`, `saveContactToCache`, `scrapeContactsFromSource` (MVP placeholder), `importScrapedContacts`, extension de `processScrapingJob` pour CONTACTS

**Server Actions :**
- `src/actions/scrapingActions.ts` — Ajout de `startContactScraping`

**Composants :**
- `src/components/scraping/StartScrapingButton.tsx` — Modifié pour supporter les types VENUES et CONTACTS

**Pages :**
- `src/app/contacts/page.tsx` — Intégration de la section "Import automatique de contacts" avec boutons de scraping et liste des jobs
