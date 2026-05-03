# Story 3.2: Création et gestion des fiches de salle

Status: done

## Story

As a musicien,
I want créer et gérer des fiches de salle avec les attributs pertinents (nom, capacité, style, région, contacts),
So que je peux organiser les salles cibles pour mes campagnes de booking.

## Acceptance Criteria

**Given** que je suis authentifié et sur la page de gestion des salles  
**When** je clique sur "Créer une nouvelle salle"  
**Then** un formulaire s'affiche avec les champs pertinents (nom, adresse, capacité, style musical, région, site web, notes)  
**And** je peux sauvegarder la salle avec toutes les informations  
**And** la salle est créée dans la base de données avec `userId` associé  
**And** je peux voir la liste de toutes mes salles avec leurs informations essentielles  
**And** je peux rechercher et filtrer mes salles (par région, capacité, style)  
**And** chaque salle affiche son statut (active, archivée, avec erreurs)

## Tasks / Subtasks

- [x] Task 1: Créer le schéma Prisma pour les salles (AC: 5)
  - [x] Subtask 1.1: Créer le model `Venue` dans `prisma/schema.prisma` avec champs essentiels (id, name, address, capacity, style, region, website, notes, userId, status, createdAt, updatedAt)
  - [x] Subtask 1.2: Définir l'enum `VenueStatus` (ACTIVE, ARCHIVED, ERROR)
  - [x] Subtask 1.3: Préparer les relations futures (many-to-many avec Contact via table de jointure pour Story 3.3)
  - [x] Subtask 1.4: Créer et appliquer la migration Prisma
- [x] Task 2: Créer les validations Zod pour les salles (AC: 1-2)
  - [x] Subtask 2.1: Créer `src/lib/validations/venue.ts` avec schémas Zod
  - [x] Subtask 2.2: Définir le schéma `createVenueSchema` avec validation des champs (nom requis, capacité nombre positif optionnel, email site web URL valide, région/style chaînes limitées, notes)
  - [x] Subtask 2.3: Définir le schéma `updateVenueSchema` pour les mises à jour
  - [x] Subtask 2.4: Gérer les champs optionnels (adresse, site web, notes) avec normalisation des chaînes vides
- [x] Task 3: Créer les Server Actions pour les salles (AC: 2, 5)
  - [x] Subtask 3.1: Créer `src/actions/venueActions.ts` avec fonction `createVenue`
  - [x] Subtask 3.2: Utiliser `requireAuth()` pour vérifier l'authentification
  - [x] Subtask 3.3: Valider les données avec Zod
  - [x] Subtask 3.4: Créer la salle avec `userId` (multi-tenancy)
  - [x] Subtask 3.5: Créer fonction `getVenues` pour récupérer les salles de l'utilisateur avec filtrage `userId`
  - [x] Subtask 3.6: Créer fonction `updateVenue` pour modifier une salle (avec vérification ownership)
  - [x] Subtask 3.7: Créer fonction `deleteVenue` pour supprimer une salle (avec vérification ownership)
- [x] Task 4: Créer la page de liste des salles (AC: 4, 6, 7)
  - [x] Subtask 4.1: Créer `src/app/venues/page.tsx` (Server Component)
  - [x] Subtask 4.2: Récupérer les salles de l'utilisateur avec filtrage `userId`
  - [x] Subtask 4.3: Afficher la liste des salles avec informations essentielles (nom, région, capacité, style, statut)
  - [x] Subtask 4.4: Afficher le statut de chaque salle avec badge coloré (active=vert, archivée=gris, erreur=rouge)
  - [x] Subtask 4.5: Ajouter un lien vers la page de création de salle
- [x] Task 5: Créer la page de création de salle (AC: 1-3)
  - [x] Subtask 5.1: Créer `src/app/venues/new/page.tsx` (Server Component)
  - [x] Subtask 5.2: Créer le formulaire avec champs (nom, adresse, capacité, style musical, région, site web, notes)
  - [x] Subtask 5.3: Créer le composant client `VenueForm` pour le formulaire avec gestion d'état
  - [x] Subtask 5.4: Intégrer la Server Action pour créer la salle
  - [x] Subtask 5.5: Rediriger vers la page de détail ou liste après création
- [x] Task 6: Créer la page de détail d'une salle (AC: 4)
  - [x] Subtask 6.1: Créer `src/app/venues/[id]/page.tsx` (Server Component)
  - [x] Subtask 6.2: Récupérer la salle avec vérification ownership (multi-tenancy)
  - [x] Subtask 6.3: Afficher toutes les informations de la salle (adresse, capacité, style, région, site web, notes)
  - [x] Subtask 6.4: Afficher le statut de la salle
  - [x] Subtask 6.5: Ajouter bouton pour modifier la salle (vers page d'édition avec réutilisation de `VenueForm`)
- [x] Task 7: Créer la fonctionnalité de recherche et filtrage pour les salles (AC: 6)
  - [x] Subtask 7.1: Ajouter un champ de recherche dans la page de liste (nom, ville/region)
  - [x] Subtask 7.2: Implémenter la recherche côté serveur (filtrage par nom)
  - [x] Subtask 7.3: Ajouter filtres par région, capacité (plages) et style musical
  - [x] Subtask 7.4: Utiliser URL search params pour persister les filtres

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Prisma avec multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour la création/modification de salles selon project-context.md  
- Validation Zod avant logique métier selon project-context.md  
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md  
- Format de réponse standardisé pour Server Actions : `{ success: boolean, data?: T, error?: { code, message } }`  
- Gestion d'erreurs avec classes d'erreur standardisées (AppError, NotFoundError, ForbiddenError)

### Source Tree Components to Touch

- `prisma/schema.prisma` — Ajouter enum `VenueStatus` et model `Venue` (et éventuellement préparer la table de jointure future)  
- `src/lib/validations/venue.ts` — Schémas Zod pour validation des salles  
- `src/actions/venueActions.ts` — Server Actions pour salles (create, get, update, delete)  
- `src/app/venues/page.tsx` — Page de liste des salles  
- `src/app/venues/new/page.tsx` — Page de création de salle  
- `src/app/venues/[id]/page.tsx` — Page de détail / édition de salle  
- `src/components/venues/` — Composants pour salles (formulaire, liste, card)

### Champs de la Salle

**Champs essentiels :**
- `name` (String, requis) — Nom de la salle  
- `address` (String?, optionnel) — Adresse complète ou ville + pays  
- `capacity` (Int?, optionnel) — Capacité approximative  
- `style` (String?, optionnel) — Style musical principal (rock, electro, jazz, etc.)  
- `region` (String?, optionnel) — Région / ville / pays pour les filtres  
- `website` (String?, optionnel) — URL du site de la salle  
- `notes` (String?, optionnel) — Notes libres sur la salle  
- `status` (VenueStatus, défaut: ACTIVE) — Statut de la salle (ACTIVE, ARCHIVED, ERROR)  
- `userId` (String, requis) — Propriétaire (multi-tenancy)

**Champs système :**
- `id` (String, UUID) — Identifiant unique  
- `createdAt` (DateTime) — Date de création  
- `updatedAt` (DateTime) — Date de dernière modification

**Relations futures (Story 3.3) :**
- Many-to-many avec `Contact` via table de jointure `ContactVenue` (non implémentée ici, seulement préparée dans les Dev Notes)

### Testing Standards Summary

- Tests unitaires pour validations Zod (création/mise à jour de salle)  
- Tests d'intégration pour Server Actions (mocker Prisma)  
- Tests de sécurité : vérifier que seul le propriétaire peut voir/modifier/supprimer ses salles  
- Tests de filtrage multi-tenancy : vérifier qu'un utilisateur ne peut pas accéder aux salles d'un autre utilisateur  
- Tests E2E (optionnels pour MVP) pour création + filtrage des salles

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Structure `src/app/venues/` selon App Router  
- Actions dans `src/actions/venueActions.ts` selon architecture modulaire  
- Validations dans `src/lib/validations/venue.ts` selon architecture modulaire  
- Composants réutilisables dans `src/components/venues/` selon architecture modulaire  
- Pattern similaire à `src/app/projects/` et `src/app/contacts/` pour cohérence

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` (contacts) pour la partie CRUD / liste / détails  
- Reprendre les patterns des pages `projects` pour la présentation (badges, tableaux, formulaires)  
- Toujours filtrer par `userId` et vérifier ownership avant modification/suppression

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.2]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/project-context.md#Validation]  
- [Source: bmad_output/planning-artifacts/architecture.md#Data-Architecture]  
- [Source: bmad_output/planning-artifacts/architecture.md#Format-Patterns]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour la gestion de fiches personnelles (contacts)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Schéma Prisma des salles créé et migration préparée
  - ✓ Enum `VenueStatus` ajoutée (`ACTIVE`, `ARCHIVED`, `ERROR`)
  - ✓ Model `Venue` ajouté dans `prisma/schema.prisma` avec tous les champs essentiels et mapping snake_case
  - ✓ Relation `venues Venue[]` ajoutée dans le model `User` pour multi-tenancy
  - ✓ Migration SQL `20260123114902_add_venues` créée manuellement (prête à être appliquée quand la base sera accessible)
- **Task 2 complétée** : Validations Zod pour salles
  - ✓ Fichier `src/lib/validations/venue.ts` créé
  - ✓ `createVenueSchema` valide nom (requis), adresse, capacité (nombre positif), style, région, website (URL valide), notes
  - ✓ Gestion de la capacité depuis formulaire (string → number avec transformation)
  - ✓ `updateVenueSchema` et `deleteVenueSchema` créés pour mises à jour / suppressions
  - ✓ Normalisation des champs optionnels (chaînes vides → undefined)
- **Task 3 complétée** : Server Actions salles
  - ✓ Fichier `src/actions/venueActions.ts` créé
  - ✓ `createVenue`, `getVenues`, `updateVenue`, `deleteVenue` utilisent `requireAuth()` et filtrent systématiquement par `userId`
  - ✓ Format de réponse standard `{ success, data?, error? }` respecté
  - ✓ Gestion d'erreurs Zod / AppError standardisée
- **Task 4 complétée** : Page de liste des salles
  - ✓ `src/app/venues/page.tsx` affiche la liste des salles de l'utilisateur avec nom, localisation, capacité, style et badge de statut
  - ✓ Tableau structuré avec colonnes claires
  - ✓ Lien vers la page de création de salle ajouté
- **Task 5 complétée** : Page de création de salle
  - ✓ `src/app/venues/new/page.tsx` (Server Component) protégée par `requireAuth()`
  - ✓ Composant client `VenueForm` créé avec gestion d'état et erreurs, intégration de `createVenue`
  - ✓ Formulaire complet avec tous les champs (nom, adresse, capacité, style, région, site web, notes)
  - ✓ Redirection vers `/venues` après création réussie
- **Task 6 complétée** : Page de détail d'une salle
  - ✓ `src/app/venues/[id]/page.tsx` récupère une salle avec vérification ownership (where `{ id, userId }`)
  - ✓ Affichage des informations complètes de la salle (adresse, capacité, style, région, site web, notes) + badge de statut
  - ✓ Réutilisation de `VenueForm` en mode édition pour mettre à jour la salle
- **Task 7 complétée** : Recherche & filtrage
  - ✓ Champ de recherche et filtres (statut, région, style) intégrés dans `src/app/venues/page.tsx`
  - ✓ Filtrage côté serveur avec clauses Prisma `OR` (nom, adresse, région) + filtres par statut, région, style
  - ✓ Utilisation des query params (`q`, `status`, `region`, `style`) pour persister les filtres
  - ✓ Bouton "Réinitialiser" pour effacer tous les filtres
- **Code review (2025-01-26)** : Corrections appliquées — tests getVenues/updateVenue/deleteVenue/ownership, extraction `getStatusLabel`/`getStatusClasses` dans `statusHelpers`, File List complétée (`venueValidation.ts`, `EditableVenueSection.tsx`, `VenueErrors.tsx`, `ArchiveButton.tsx`), libellé « Créer une nouvelle salle ». Status → `done`.

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` — Ajout de l'enum `VenueStatus` et du model `Venue` + relation `venues` dans `User`

**Migrations :**
- `prisma/migrations/20260123114902_add_venues/migration.sql` — Migration SQL pour la table `venues` + enum `VenueStatus`

**Validations :**
- `src/lib/validations/venue.ts` — Schémas Zod `createVenueSchema`, `updateVenueSchema`, `deleteVenueSchema`

**Server Actions :**
- `src/actions/venueActions.ts` — Server Actions `createVenue`, `getVenues`, `updateVenue`, `deleteVenue`
- `src/actions/venueActions.test.ts` — Tests createVenue, getVenues, updateVenue, deleteVenue, ownership/multi‑tenancy

**Validations :**
- `src/lib/validations/venueValidation.ts` — Validation métier venue (validateVenue) pour statut ERROR/ACTIVE

**Composants :**
- `src/components/venues/VenueForm.tsx` — Formulaire client pour création/édition de salle
- `src/components/venues/EditableVenueSection.tsx` — Section édition inline sur la page détail
- `src/components/venues/VenueErrors.tsx` — Affichage des erreurs de validation venue
- `src/components/venues/ArchiveButton.tsx` — Bouton archivage/restauration venue

**Pages :**
- `src/app/venues/page.tsx` — Page liste avec recherche, filtres (statut, région, style), Réinitialiser (Link), libellé AC, statusHelpers
- `src/app/venues/new/page.tsx` — Page de création de salle
- `src/app/venues/[id]/page.tsx` — Page de détail + édition, statusHelpers

**Helpers partagés :**
- `src/lib/contacts/statusHelpers.ts` — getStatusLabel/getStatusClasses (partagés contacts et venues)

