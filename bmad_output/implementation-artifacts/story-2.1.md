# Story 2.1: Création de projet musical avec structure préconstruite

Status: completed

## Story

As a musicien,
I want créer un nouveau projet musical avec une structure préconstruite adaptée aux projets musicaux,
So que je peux démarrer rapidement sans avoir à créer la structure manuellement.

## Acceptance Criteria

**Given** que je suis authentifié et sur la page de création de projet
**When** je clique sur "Créer un nouveau projet"
**Then** un formulaire de création s'affiche avec les champs essentiels (nom, type de projet, dates)
**And** je peux sélectionner un type de projet préconstruit (EP, Album, Tournée, Single, etc.)
**And** la structure d'étapes correspondant au type de projet est automatiquement créée
**And** après validation, le projet est créé dans la base de données avec `userId` associé
**And** je suis redirigé vers la page de détail du projet créé
**And** le projet apparaît dans ma liste de projets

## Tasks / Subtasks

- [x] Task 1: Créer le schéma Prisma pour les projets musicaux (AC: 4)
  - [x] Subtask 1.1: Créer le model `Project` dans `prisma/schema.prisma` avec champs essentiels (id, name, type, userId, dates)
  - [x] Subtask 1.2: Créer le model `ProjectStep` pour les étapes avec relation vers Project
  - [x] Subtask 1.3: Définir les types de projets préconstruits (EP, Album, Tournée, Single) avec leurs structures d'étapes
  - [x] Subtask 1.4: Créer et appliquer la migration Prisma
- [x] Task 2: Créer les validations Zod pour les projets (AC: 1-3)
  - [x] Subtask 2.1: Créer `src/lib/validations/project.ts` avec schémas Zod
  - [x] Subtask 2.2: Définir les types de projets et leurs structures d'étapes
  - [x] Subtask 2.3: Valider les données de création de projet
- [x] Task 3: Créer la Server Action pour créer un projet (AC: 4)
  - [x] Subtask 3.1: Créer `src/actions/projectActions.ts` avec fonction `createProject`
  - [x] Subtask 3.2: Utiliser `requireAuth()` pour vérifier l'authentification
  - [x] Subtask 3.3: Valider les données avec Zod
  - [x] Subtask 3.4: Créer le projet avec `userId` (multi-tenancy)
  - [x] Subtask 3.5: Créer automatiquement les étapes selon le type de projet
- [x] Task 4: Créer la page de création de projet (AC: 1-3, 5)
  - [x] Subtask 4.1: Créer `src/app/projects/new/page.tsx` (Server Component)
  - [x] Subtask 4.2: Créer le formulaire avec champs (nom, type, dates)
  - [x] Subtask 4.3: Créer le composant client pour le formulaire avec gestion d'état
  - [x] Subtask 4.4: Intégrer la Server Action pour créer le projet
  - [x] Subtask 4.5: Rediriger vers la page de détail après création
- [x] Task 5: Créer la page de liste des projets (AC: 6)
  - [x] Subtask 5.1: Créer `src/app/projects/page.tsx` (Server Component)
  - [x] Subtask 5.2: Récupérer les projets de l'utilisateur avec filtrage `userId`
  - [x] Subtask 5.3: Afficher la liste des projets avec informations essentielles
  - [x] Subtask 5.4: Ajouter un lien vers la page de création

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Prisma avec multi-tenancy : toujours filtrer par `userId` selon project-context.md
- Server Components par défaut pour les pages selon project-context.md
- Server Actions pour la création de projet selon project-context.md
- Validation Zod avant logique métier selon project-context.md
- Structure snake_case pour tables et colonnes en DB, camelCase pour code selon project-context.md

### Source Tree Components to Touch

- `prisma/schema.prisma` - Ajouter models `Project` et `ProjectStep`
- `src/lib/validations/project.ts` - Schémas Zod pour validation
- `src/actions/projectActions.ts` - Server Actions pour projets
- `src/app/projects/new/page.tsx` - Page de création de projet
- `src/app/projects/page.tsx` - Page de liste des projets
- `src/components/projects/` - Composants pour projets (formulaire, liste)

### Types de Projets et Structures d'Étapes

**EP:**
- Composition
- Enregistrement
- Mixage
- Mastering
- Sortie

**Album:**
- Composition
- Enregistrement
- Mixage
- Mastering
- Artwork
- Sortie

**Tournée:**
- Planification
- Réservation salles
- Promotion
- Répétitions
- Exécution

**Single:**
- Composition
- Enregistrement
- Mixage
- Mastering
- Sortie

### Testing Standards Summary

- Tests unitaires pour validations Zod
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests E2E pour le flux de création (optionnel pour MVP)
- Toujours tester le filtrage `userId` dans les tests

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions
- Structure `src/app/projects/` selon App Router
- Actions dans `src/actions/` selon architecture modulaire
- Validations dans `src/lib/validations/` selon architecture modulaire

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.1]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]
- [Source: bmad_output/project-context.md#Validation]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Schéma Prisma créé avec models Project et ProjectStep
  - ✓ Models créés avec multi-tenancy (userId)
  - ✓ Enums ProjectType et StepStatus définis
  - ✓ Migration créée et appliquée (`20260118220829_add_projects_and_steps`)
  - ✓ Templates d'étapes préconstruites créés dans `src/lib/projects/projectTemplates.ts`
- **Task 2 complétée** : Validations Zod créées
  - ✓ Schéma `createProjectSchema` avec validation des dates
  - ✓ Support des dates en string (depuis formulaire) ou Date objects
  - ✓ Validation de cohérence des dates (endDate >= startDate)
- **Task 3 complétée** : Server Action créée
  - ✓ Fonction `createProject` avec authentification et validation
  - ✓ Création automatique des étapes selon le type de projet
  - ✓ Gestion d'erreurs standardisée avec format ActionResult
- **Task 4 complétée** : Page de création de projet
  - ✓ Page Server Component avec protection d'authentification
  - ✓ Formulaire client avec gestion d'état et erreurs
  - ✓ Redirection vers page de détail après création
- **Task 5 complétée** : Page de liste des projets
  - ✓ Page Server Component avec récupération des projets filtrés par userId
  - ✓ Affichage des projets avec progression et informations essentielles
  - ✓ Page de détail du projet créée pour la redirection
  - ✓ Lien vers création de projet

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` - Models Project et ProjectStep ajoutés

**Validations :**
- `src/lib/validations/project.ts` - Schémas Zod pour création et mise à jour de projets

**Templates :**
- `src/lib/projects/projectTemplates.ts` - Structures d'étapes préconstruites par type de projet

**Server Actions :**
- `src/actions/projectActions.ts` - Fonction `createProject` pour créer un projet avec étapes

**Pages :**
- `src/app/projects/page.tsx` - Page de liste des projets
- `src/app/projects/new/page.tsx` - Page de création de projet
- `src/app/projects/[id]/page.tsx` - Page de détail du projet

**Composants :**
- `src/components/projects/CreateProjectForm.tsx` - Formulaire de création de projet (Client Component)

**Migrations :**
- `prisma/migrations/20260118220829_add_projects_and_steps/` - Migration pour tables projects et project_steps
