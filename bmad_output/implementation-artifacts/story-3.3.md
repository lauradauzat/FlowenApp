# Story 3.3: Connexions relationnelles entre contacts et salles

Status: done

## Story

As a musicien,
I want établir des connexions relationnelles entre contacts et salles,
So que je comprends qui sont les contacts associés à chaque salle.

## Acceptance Criteria

**Given** que j'ai créé des contacts et des salles  
**When** j'accède à la page de détail d'une salle  
**Then** je peux voir la liste des contacts associés à cette salle  
**And** je peux ajouter un contact existant à cette salle  
**And** je peux créer un nouveau contact directement depuis la page de la salle  
**And** la relation many-to-many est créée dans la base de données (table de jointure)  
**And** quand j'accède à la page de détail d'un contact, je peux voir les salles associées  
**And** les connexions sont visuellement claires et compréhensibles

## Tasks / Subtasks

- [x] Task 1: Créer la table de jointure pour les relations many-to-many (AC: 4)
  - [x] Subtask 1.1: Créer le model `ContactVenue` dans `prisma/schema.prisma` avec champs (contactId, venueId, createdAt)
  - [x] Subtask 1.2: Ajouter les relations dans les models `Contact` et `Venue` (venues ContactVenue[], contacts ContactVenue[])
  - [x] Subtask 1.3: Créer et appliquer la migration Prisma
- [x] Task 2: Créer les Server Actions pour gérer les connexions (AC: 2, 4)
  - [x] Subtask 2.1: Créer fonction `addContactToVenue` dans `src/actions/contactVenueActions.ts`
  - [x] Subtask 2.2: Créer fonction `removeContactFromVenue` pour retirer une connexion
  - [x] Subtask 2.3: Vérifier que le contact et la salle appartiennent à l'utilisateur (multi-tenancy)
  - [x] Subtask 2.4: Créer fonction `getContactsForVenue` pour récupérer les contacts d'une salle
  - [x] Subtask 2.5: Créer fonction `getVenuesForContact` pour récupérer les salles d'un contact
- [x] Task 3: Afficher les connexions dans la page de détail d'une salle (AC: 1, 5)
  - [x] Subtask 3.1: Modifier `src/app/venues/[id]/page.tsx` pour inclure les contacts associés
  - [x] Subtask 3.2: Afficher la liste des contacts avec leurs informations essentielles
  - [x] Subtask 3.3: Ajouter un bouton pour ajouter un contact existant
  - [x] Subtask 3.4: Créer un composant client pour sélectionner un contact existant
- [x] Task 4: Permettre d'ajouter un contact existant à une salle (AC: 2)
  - [x] Subtask 4.1: Créer un composant client `AddContactToVenue` avec liste déroulante des contacts
  - [x] Subtask 4.2: Intégrer la Server Action `addContactToVenue`
  - [x] Subtask 4.3: Gérer les erreurs (contact déjà associé, etc.)
  - [x] Subtask 4.4: Rafraîchir la liste après ajout
- [x] Task 5: Permettre de créer un contact depuis la page d'une salle (AC: 3)
  - [x] Subtask 5.1: Ajouter un bouton "Créer un nouveau contact" dans la page de détail de salle
  - [x] Subtask 5.2: Créer un modal ou formulaire inline pour créer un contact
  - [x] Subtask 5.3: Après création, associer automatiquement le contact à la salle
  - [x] Subtask 5.4: Rediriger ou rafraîchir la page pour afficher le nouveau contact
- [x] Task 6: Afficher les connexions dans la page de détail d'un contact (AC: 5)
  - [x] Subtask 6.1: Modifier `src/app/contacts/[id]/page.tsx` pour inclure les salles associées
  - [x] Subtask 6.2: Afficher la liste des salles avec leurs informations essentielles
  - [x] Subtask 6.3: Permettre de naviguer vers chaque salle via un lien
  - [ ] Subtask 6.4: Permettre de retirer une connexion si nécessaire (optionnel - non implémenté pour MVP)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Prisma avec multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations (ajout/retrait de connexions) selon project-context.md  
- Validation Zod avant logique métier selon project-context.md  
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md  
- Format de réponse standardisé pour Server Actions : `{ success: boolean, data?: T, error?: { code, message } }`  
- Gestion d'erreurs avec classes d'erreur standardisées (AppError, NotFoundError, ForbiddenError)

### Source Tree Components to Touch

- `prisma/schema.prisma` — Ajouter model `ContactVenue` (table de jointure) et relations dans `Contact` et `Venue`  
- `src/actions/contactVenueActions.ts` — Server Actions pour gérer les connexions (add, remove, get)  
- `src/app/venues/[id]/page.tsx` — Modifier pour afficher et gérer les contacts associés  
- `src/app/contacts/[id]/page.tsx` — Modifier pour afficher les salles associées  
- `src/components/venues/AddContactToVenue.tsx` — Composant pour ajouter un contact à une salle  
- `src/components/contacts/AddVenueToContact.tsx` — Composant pour ajouter une salle à un contact (optionnel)

### Structure de la Table de Jointure

**Model ContactVenue :**
- `id` (String, UUID) — Identifiant unique
- `contactId` (String, requis) — Référence vers Contact
- `venueId` (String, requis) — Référence vers Venue
- `createdAt` (DateTime) — Date de création de la connexion
- Contrainte unique sur `(contactId, venueId)` pour éviter les doublons

**Relations :**
- `Contact.venues ContactVenue[]` — Toutes les connexions d'un contact
- `Venue.contacts ContactVenue[]` — Toutes les connexions d'une salle

### Testing Standards Summary

- Tests unitaires pour validations Zod (si ajoutées)
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut gérer les connexions de ses contacts/salles
- Tests de filtrage multi-tenancy : vérifier qu'un utilisateur ne peut pas voir les connexions d'un autre utilisateur

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Actions dans `src/actions/contactVenueActions.ts` selon architecture modulaire  
- Composants réutilisables dans `src/components/venues/` et `src/components/contacts/` selon architecture modulaire  
- Pattern similaire aux stories précédentes pour cohérence

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` et `story-3.2` pour la gestion des relations
- Toujours vérifier ownership avant toute opération sur les connexions
- Utiliser les Server Actions pour les mutations, Server Components pour l'affichage

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.3]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/planning-artifacts/architecture.md#Data-Architecture]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour contacts  
- [Source: bmad_output/implementation-artifacts/story-3.2.md#Dev-Notes] — Patterns pour salles

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Table de jointure ContactVenue créée
  - ✓ Model `ContactVenue` ajouté dans `prisma/schema.prisma` avec contrainte unique sur `(contactId, venueId)`
  - ✓ Relations ajoutées : `Contact.venues ContactVenue[]` et `Venue.contacts ContactVenue[]`
  - ✓ Migration SQL `20260123120152_add_contact_venues` créée manuellement (prête à être appliquée)
- **Task 2 complétée** : Server Actions pour gérer les connexions
  - ✓ Fichier `src/actions/contactVenueActions.ts` créé
  - ✓ `addContactToVenue` : vérifie ownership contact + salle, évite doublons, crée la connexion
  - ✓ `removeContactFromVenue` : vérifie ownership, supprime la connexion
  - ✓ `getContactsForVenue` et `getVenuesForContact` : récupèrent les connexions avec filtrage `userId`
  - ✓ Validations Zod créées dans `src/lib/validations/contactVenue.ts`
- **Task 3 complétée** : Affichage des connexions dans la page de détail d'une salle
  - ✓ `src/app/venues/[id]/page.tsx` modifiée pour inclure la section "Contacts associés"
  - ✓ Composant Server `ContactsList` affiche la liste des contacts avec informations essentielles (nom, email, téléphone, rôle)
  - ✓ Liens cliquables vers chaque contact pour navigation
- **Task 4 complétée** : Ajout d'un contact existant à une salle
  - ✓ Composant client `AddContactToVenue` créé avec liste déroulante des contacts disponibles
  - ✓ Intégration de la Server Action `addContactToVenue` avec gestion d'erreurs (contact déjà associé)
  - ✓ Rafraîchissement automatique de la page après ajout réussi
- **Task 5 complétée** : Création d'un contact depuis la page d'une salle
  - ✓ Composant client `CreateContactForVenue` créé avec formulaire inline
  - ✓ Après création du contact, association automatique à la salle via `addContactToVenue`
  - ✓ Rafraîchissement automatique pour afficher le nouveau contact dans la liste
- **Task 6 complétée** : Affichage des connexions dans la page de détail d'un contact
  - ✓ `src/app/contacts/[id]/page.tsx` modifiée pour inclure la section "Salles associées"
  - ✓ Composant Server `VenuesList` affiche la liste des salles avec informations essentielles (nom, région, capacité, style)
  - ✓ Liens cliquables vers chaque salle pour navigation bidirectionnelle
  - ⚠️ Subtask 6.4 (retirer une connexion depuis la page contact) : non implémentée pour MVP (peut être ajoutée plus tard si nécessaire)
- **Code review (2025-01-26)** : Corrections appliquées — tests addContactToVenue/removeContactFromVenue/getContactsForVenue/getVenuesForContact/ownership, gestion erreur connexion inexistante dans `removeContactFromVenue`, File List complétée (`getAllConnections`). Status → `done`.

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` — Ajout du model `ContactVenue` (table de jointure) et relations dans `Contact` et `Venue`

**Migrations :**
- `prisma/migrations/20260123120152_add_contact_venues/migration.sql` — Migration SQL pour la table `contact_venues` avec contrainte unique

**Validations :**
- `src/lib/validations/contactVenue.ts` — Schémas Zod `addContactToVenueSchema`, `removeContactFromVenueSchema`

**Server Actions :**
- `src/actions/contactVenueActions.ts` — Server Actions `addContactToVenue`, `removeContactFromVenue`, `getContactsForVenue`, `getVenuesForContact`, `getAllConnections`
- `src/actions/contactVenueActions.test.ts` — Tests addContactToVenue, removeContactFromVenue, getContactsForVenue, getVenuesForContact, ownership/multi‑tenancy

**Composants :**
- `src/components/venues/AddContactToVenue.tsx` — Composant pour ajouter un contact existant à une salle
- `src/components/venues/CreateContactForVenue.tsx` — Composant pour créer un nouveau contact et l'associer à une salle

**Pages modifiées :**
- `src/app/venues/[id]/page.tsx` — Ajout de la section "Contacts associés" avec composants d'ajout/création
- `src/app/contacts/[id]/page.tsx` — Ajout de la section "Salles associées" avec navigation vers les salles
