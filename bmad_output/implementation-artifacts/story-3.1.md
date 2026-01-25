# Story 3.1: Création et gestion des fiches de contact

Status: done

## Story

As a musicien,
I want créer et gérer des fiches de contact avec les attributs pertinents,
So que je peux organiser mes contacts pour les campagnes de booking.

## Acceptance Criteria

**Given** que je suis authentifié et sur la page de gestion des contacts
**When** je clique sur "Créer un nouveau contact"
**Then** un formulaire s'affiche avec les champs pertinents (nom, prénom, email, téléphone, rôle, notes)
**And** je peux sauvegarder le contact avec toutes les informations
**And** le contact est créé dans la base de données avec `userId` associé
**And** je peux voir la liste de tous mes contacts avec leurs informations essentielles
**And** je peux rechercher et filtrer mes contacts
**And** chaque contact affiche son statut (actif, archivé, avec erreurs)

## Tasks / Subtasks

- [x] Task 1: Créer le schéma Prisma pour les contacts (AC: 5)
  - [x] Subtask 1.1: Créer le model `Contact` dans `prisma/schema.prisma` avec champs essentiels (id, firstName, lastName, email, phone, role, notes, userId, status, createdAt, updatedAt)
  - [x] Subtask 1.2: Définir l'enum `ContactStatus` (ACTIVE, ARCHIVED, ERROR)
  - [x] Subtask 1.3: Configurer les relations futures (many-to-many avec Venue via table de jointure pour Story 3.3)
  - [x] Subtask 1.4: Créer et appliquer la migration Prisma
- [x] Task 2: Créer les validations Zod pour les contacts (AC: 1-2)
  - [x] Subtask 2.1: Créer `src/lib/validations/contact.ts` avec schémas Zod
  - [x] Subtask 2.2: Définir le schéma `createContactSchema` avec validation des champs (nom, prénom, email optionnel avec validation format, téléphone optionnel, rôle, notes)
  - [x] Subtask 2.3: Définir le schéma `updateContactSchema` pour les mises à jour
  - [x] Subtask 2.4: Valider le format email si fourni
- [x] Task 3: Créer les Server Actions pour les contacts (AC: 2, 5)
  - [x] Subtask 3.1: Créer `src/actions/contactActions.ts` avec fonction `createContact`
  - [x] Subtask 3.2: Utiliser `requireAuth()` pour vérifier l'authentification
  - [x] Subtask 3.3: Valider les données avec Zod
  - [x] Subtask 3.4: Créer le contact avec `userId` (multi-tenancy)
  - [x] Subtask 3.5: Créer fonction `getContacts` pour récupérer les contacts de l'utilisateur avec filtrage `userId`
  - [x] Subtask 3.6: Créer fonction `updateContact` pour modifier un contact (avec vérification ownership)
  - [x] Subtask 3.7: Créer fonction `deleteContact` pour supprimer un contact (avec vérification ownership)
- [x] Task 4: Créer la page de liste des contacts (AC: 4, 6, 7)
  - [x] Subtask 4.1: Créer `src/app/contacts/page.tsx` (Server Component)
  - [x] Subtask 4.2: Récupérer les contacts de l'utilisateur avec filtrage `userId`
  - [x] Subtask 4.3: Afficher la liste des contacts avec informations essentielles (nom, prénom, email, téléphone, rôle, statut)
  - [x] Subtask 4.4: Afficher le statut de chaque contact avec badge coloré (actif=vert, archivé=gris, erreur=rouge)
  - [x] Subtask 4.5: Ajouter un lien vers la page de création de contact
- [x] Task 5: Créer la page de création de contact (AC: 1-3)
  - [x] Subtask 5.1: Créer `src/app/contacts/new/page.tsx` (Server Component)
  - [x] Subtask 5.2: Créer le formulaire avec champs (nom, prénom, email, téléphone, rôle, notes)
  - [x] Subtask 5.3: Créer le composant client pour le formulaire avec gestion d'état
  - [x] Subtask 5.4: Intégrer la Server Action pour créer le contact
  - [x] Subtask 5.5: Rediriger vers la page de détail ou liste après création
- [x] Task 6: Créer la page de détail d'un contact (AC: 4)
  - [x] Subtask 6.1: Créer `src/app/contacts/[id]/page.tsx` (Server Component)
  - [x] Subtask 6.2: Récupérer le contact avec vérification ownership (multi-tenancy)
  - [x] Subtask 6.3: Afficher toutes les informations du contact
  - [x] Subtask 6.4: Afficher le statut du contact
  - [x] Subtask 6.5: Ajouter bouton pour modifier le contact (vers page d'édition)
- [x] Task 7: Créer la fonctionnalité de recherche et filtrage (AC: 6)
  - [x] Subtask 7.1: Ajouter un champ de recherche dans la page de liste
  - [x] Subtask 7.2: Implémenter la recherche côté serveur (filtrage par nom, prénom, email)
  - [x] Subtask 7.3: Ajouter filtres par statut (actif, archivé, erreur)
  - [x] Subtask 7.4: Ajouter filtres par rôle si applicable
  - [x] Subtask 7.5: Utiliser URL search params pour persister les filtres

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Prisma avec multi-tenancy : toujours filtrer par `userId` selon project-context.md
- Server Components par défaut pour les pages selon project-context.md
- Server Actions pour la création/modification de contacts selon project-context.md
- Validation Zod avant logique métier selon project-context.md
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md
- Format de réponse standardisé pour Server Actions : `{ success: boolean, data?: T, error?: { code, message } }`
- Gestion d'erreurs avec classes d'erreur standardisées (AppError, NotFoundError, ForbiddenError)

### Source Tree Components to Touch

- `prisma/schema.prisma` - Ajouter model `Contact` avec enum `ContactStatus`
- `src/lib/validations/contact.ts` - Schémas Zod pour validation
- `src/actions/contactActions.ts` - Server Actions pour contacts (create, get, update, delete)
- `src/app/contacts/page.tsx` - Page de liste des contacts
- `src/app/contacts/new/page.tsx` - Page de création de contact
- `src/app/contacts/[id]/page.tsx` - Page de détail du contact
- `src/components/contacts/` - Composants pour contacts (formulaire, liste, card)

### Champs du Contact

**Champs essentiels :**
- `firstName` (String, requis) - Prénom du contact
- `lastName` (String, requis) - Nom du contact
- `email` (String?, optionnel) - Email du contact (validation format si fourni)
- `phone` (String?, optionnel) - Téléphone du contact
- `role` (String?, optionnel) - Rôle du contact (ex: "Programmateur", "Manager", "Booking Agent")
- `notes` (String?, optionnel) - Notes libres sur le contact
- `status` (ContactStatus, défaut: ACTIVE) - Statut du contact (ACTIVE, ARCHIVED, ERROR)
- `userId` (String, requis) - Propriétaire du contact (multi-tenancy)

**Champs système :**
- `id` (String, UUID) - Identifiant unique
- `createdAt` (DateTime) - Date de création
- `updatedAt` (DateTime) - Date de dernière modification

**Relations futures (Story 3.3) :**
- Many-to-many avec `Venue` via table de jointure `ContactVenue` (à préparer dans le schéma)

### Testing Standards Summary

- Tests unitaires pour validations Zod
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut voir/modifier/supprimer ses contacts
- Tests de filtrage multi-tenancy : vérifier qu'un utilisateur ne peut pas accéder aux contacts d'un autre utilisateur
- Tests E2E pour le flux de création (optionnel pour MVP)
- Toujours tester le filtrage `userId` dans les tests de données personnelles

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions
- Structure `src/app/contacts/` selon App Router
- Actions dans `src/actions/contactActions.ts` selon architecture modulaire
- Validations dans `src/lib/validations/contact.ts` selon architecture modulaire
- Composants réutilisables dans `src/components/contacts/` selon architecture modulaire
- Pattern similaire à `src/app/projects/` pour cohérence

### Patterns à suivre depuis les stories précédentes

**Depuis Story 2.1 (Création de projet) :**
- Pattern Server Action : `requireAuth()` → validation Zod → création avec `userId` → retour format standardisé
- Pattern formulaire : Server Component pour page, Client Component pour formulaire interactif
- Pattern redirection : rediriger vers page de détail après création

**Depuis Story 2.2 (Visualisation) :**
- Pattern liste : Server Component récupère données avec filtrage `userId`, affiche avec badges de statut
- Pattern recherche : URL search params pour persister les filtres

**Depuis Story 1.4 (Multi-tenancy) :**
- Pattern helpers Prisma : utiliser `requireAuth()` et toujours inclure `userId` dans `where` clause
- Pattern vérification ownership : vérifier que la ressource appartient à l'utilisateur avant modification/suppression

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.1]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]
- [Source: bmad_output/project-context.md#Validation]
- [Source: bmad_output/planning-artifacts/architecture.md#Data-Architecture]
- [Source: bmad_output/planning-artifacts/architecture.md#Format-Patterns]
- [Source: bmad_output/implementation-artifacts/story-2.1.md#Dev-Notes] - Patterns de création d'entité
- [Source: bmad_output/implementation-artifacts/story-2.2.md#Dev-Notes] - Patterns de visualisation et liste

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Schéma Prisma des contacts créé et migré
  - ✓ Enum `ContactStatus` ajoutée (`ACTIVE`, `ARCHIVED`, `ERROR`)
  - ✓ Model `Contact` ajouté dans `prisma/schema.prisma` avec champs essentiels et mapping snake_case
  - ✓ Migration SQL `20260123110730_add_contacts` créée et appliquée avec `npx prisma migrate dev --name add_contacts`
- **Task 2 complétée** : Validations Zod pour contacts
  - ✓ Fichier `src/lib/validations/contact.ts` créé
  - ✓ `createContactSchema` valide prénom, nom, email (format), téléphone, rôle, notes (avec normalisation des champs optionnels)
  - ✓ `updateContactSchema` et `deleteContactSchema` créés pour mises à jour / suppressions
- **Task 3 complétée** : Server Actions contacts
  - ✓ Fichier `src/actions/contactActions.ts` créé
  - ✓ `createContact`, `getContacts`, `updateContact`, `deleteContact` utilisent `requireAuth()` et filtrent systématiquement par `userId`
  - ✓ Format de réponse standard `{ success, data?, error? }` respecté et erreurs Zod / AppError gérées
- **Task 4 complétée** : Page de liste des contacts
  - ✓ `src/app/contacts/page.tsx` affiche la liste des contacts de l'utilisateur avec nom, coordonnées, rôle et badge de statut
  - ✓ Recherche côté serveur par nom/prénom/email et filtres par statut via `searchParams`
  - ✓ Lien vers la page de création de contact ajouté
- **Task 5 complétée** : Page de création de contact
  - ✓ `src/app/contacts/new/page.tsx` (Server Component) protégée par `requireAuth()`
  - ✓ Composant client `ContactForm` créé avec gestion d'état et erreurs, et intégration de `createContact`
  - ✓ Redirection vers `/contacts` après création réussie
- **Task 6 complétée** : Page de détail d'un contact
  - ✓ `src/app/contacts/[id]/page.tsx` récupère un contact avec vérification ownership (where `{ id, userId }`)
  - ✓ Affichage des informations complètes du contact + badge de statut
  - ✓ Réutilisation de `ContactForm` en mode édition pour mettre à jour le contact
- **Task 7 complétée** : Recherche & filtrage
  - ✓ Champ de recherche et filtres de statut intégrés dans `src/app/contacts/page.tsx`
  - ✓ Filtrage côté serveur avec clauses Prisma `OR` + `status`
  - ✓ Utilisation des query params (`q`, `status`) pour persister les filtres
- **Session Dev Story (2025-01-26)** : Story déjà complète ; suite de tests OK. Correction de `contactActions.test.ts` (expect `dataSource: 'MANUAL'`, `status: 'ACTIVE'`) pour supprimer la régression. Status passé à `review`.
- **Code review (2025-01-26)** : Corrections appliquées — filtre par rôle (7.4), bouton Réinitialiser (Link au lieu de onClick Server Component), tests getContacts/updateContact/deleteContact/ownership, File List complétée, libellé « Créer un nouveau contact », extraction `getStatusLabel`/`getStatusClasses` dans `statusHelpers`. Status → `done`.

### File List

- `src/actions/contactActions.test.ts` — Tests createContact, getContacts, updateContact, deleteContact, ownership/multi‑tenancy
- `src/lib/validations/contactValidation.ts` — Validation métier contact (validateContact) pour statut ERROR/ACTIVE
- `src/lib/contacts/statusHelpers.ts` — getStatusLabel, getStatusClasses (partagés page liste et détail)
- `src/components/contacts/EditableContactSection.tsx` — Section édition inline sur la page détail
- `prisma/schema.prisma` — Ajout de l'enum `ContactStatus` et du model `Contact`
- `prisma/migrations/20260123110730_add_contacts/migration.sql` — Migration SQL pour la table `contacts` + enum
- `src/lib/validations/contact.ts` — Schémas Zod `createContactSchema`, `updateContactSchema`, `deleteContactSchema`
- `src/actions/contactActions.ts` — Server Actions `createContact`, `getContacts`, `updateContact`, `deleteContact`
- `src/components/contacts/ContactForm.tsx` — Formulaire client pour création/édition de contact
- `src/app/contacts/page.tsx` — Page liste avec recherche, filtres (statut, rôle), Réinitialiser (Link), libellé AC, statusHelpers
- `src/app/contacts/new/page.tsx` — Page de création de contact
- `src/app/contacts/[id]/page.tsx` — Page de détail + édition, statusHelpers
