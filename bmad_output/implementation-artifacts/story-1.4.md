# Story 1.4: Architecture multi-tenancy avec middleware Auth.js

Status: completed

## Story

As a développeur,
I want implémenter l'architecture multi-tenancy avec filtrage userId,
So que toutes les données personnelles sont automatiquement filtrées par utilisateur.

## Acceptance Criteria

**Given** que Auth.js est configuré et fonctionnel
**When** j'implémente le middleware Auth.js et les helpers Prisma
**Then** le fichier `src/middleware.ts` protège les routes nécessitant authentification
**And** le middleware injecte le `userId` dans toutes les requêtes authentifiées
**And** le fichier `src/lib/prisma/helpers.ts` contient des fonctions helper garantissant le filtrage par `userId`
**And** toutes les requêtes de données personnelles utilisent les helpers Prisma pour filtrer par `userId`
**And** un utilisateur ne peut accéder qu'à ses propres données
**And** la structure de base pour multi-tenancy est prête pour les epics suivants

## Tasks / Subtasks

- [x] Task 1: Créer le middleware Auth.js (AC: 1, 2)
  - [x] Subtask 1.1: Créer le fichier `src/middleware.ts`
  - [x] Subtask 1.2: Configurer le middleware pour protéger les routes nécessitant authentification
  - [x] Subtask 1.3: Configurer les routes publiques (login, signin, API auth)
  - [x] Subtask 1.4: Middleware redirige vers /login si non authentifié avec callbackUrl
- [x] Task 2: Créer les helpers Prisma pour multi-tenancy (AC: 3)
  - [x] Subtask 2.1: Créer le fichier `src/lib/prisma/helpers.ts`
  - [x] Subtask 2.2: Créer des fonctions helper de base pour garantir le filtrage userId
  - [x] Subtask 2.3: Documenter l'utilisation des helpers dans les commentaires
  - [x] Subtask 2.4: Créer des fonctions utilitaires (requireUserId, withUserIdFilter, verifyResourceOwnership)
- [x] Task 3: Créer des utilitaires pour vérifier l'authentification (AC: 4)
  - [x] Subtask 3.1: Créer une fonction `requireAuth()` pour Server Actions
  - [x] Subtask 3.2: Créer une fonction `getUserId()` pour extraire userId de la session
  - [x] Subtask 3.3: Créer des classes d'erreur pour multi-tenancy (UnauthorizedError, etc.)
- [x] Task 4: Documenter et tester la structure multi-tenancy (AC: 5, 6)
  - [x] Subtask 4.1: Documenter les patterns à suivre dans les commentaires
  - [x] Subtask 4.2: Vérifier que la structure est prête pour les epics suivants

## Dev Notes

### Architecture Patterns and Constraints

- Middleware Auth.js pour protéger les routes selon project-context.md
- Helpers Prisma pour garantir le filtrage userId dans toutes les requêtes
- Structure snake_case pour colonnes de base de données (userId → user_id en DB)
- Vérification de session dans toutes les Server Actions
- Classes d'erreur standardisées pour gérer les erreurs d'authentification

### Source Tree Components to Touch

- `src/middleware.ts` - Middleware Auth.js pour protection des routes
- `src/lib/prisma/helpers.ts` - Helpers Prisma pour multi-tenancy
- `src/lib/auth/utils.ts` - Utilitaires pour vérification d'authentification
- `src/lib/errors.ts` - Classes d'erreur standardisées

### Testing Standards Summary

- Pas de tests unitaires requis pour cette story (infrastructure)
- Tests manuels : vérifier que le middleware protège les routes
- Validation que les helpers forcent le filtrage userId

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy avec userId
- Middleware à la racine de src/ selon Next.js App Router
- Helpers Prisma dans src/lib/prisma/ selon architecture modulaire

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-1.4]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/planning-artifacts/architecture.md#Multi-Tenancy-Architecture]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Middleware Auth.js créé et configuré
  - ✓ `src/middleware.ts` créé avec protection des routes
  - ✓ Routes publiques configurées (/login, /signin, /api/auth)
  - ✓ Redirection vers /login avec callbackUrl si non authentifié
  - ✓ Redirection vers / si authentifié et accès à login/signin
  - ✓ Matcher configuré pour exclure fichiers statiques et assets Next.js
  - ⚠️ Note: Warning Edge Runtime avec Prisma (normal, Prisma n'est pas utilisé directement dans middleware)
- **Task 2 complétée** : Helpers Prisma pour multi-tenancy créés
  - ✓ `src/lib/prisma/helpers.ts` créé avec fonctions helper
  - ✓ `requireUserId()` pour valider userId
  - ✓ `withUserIdFilter()` pour construire des clauses where avec userId
  - ✓ `verifyResourceOwnership()` pour vérifier l'appartenance d'une ressource
  - ✓ `getUserProjects()` comme exemple (sera implémenté dans Epic 2)
  - ✓ Documentation complète dans les commentaires
- **Task 3 complétée** : Utilitaires d'authentification créés
  - ✓ `src/lib/auth/utils.ts` créé avec fonctions utilitaires
  - ✓ `getUserId()` pour extraire userId de la session
  - ✓ `requireAuth()` pour exiger l'authentification (lance UnauthorizedError)
  - ✓ `isAuthenticated()` pour vérifier l'état d'authentification
  - ✓ `src/lib/errors.ts` créé avec classes d'erreur standardisées
  - ✓ Classes: AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError
- **Task 4 complétée** : Structure multi-tenancy documentée et prête
  - ✓ Patterns documentés dans les commentaires
  - ✓ Structure prête pour les epics suivants (Epic 2: Projets musicaux)
  - ✓ Build réussi avec middleware fonctionnel

### File List

**Fichiers créés :**
- `src/middleware.ts` - Middleware Auth.js pour protection des routes
- `src/lib/prisma/helpers.ts` - Helpers Prisma pour multi-tenancy
- `src/lib/auth/utils.ts` - Utilitaires pour vérification d'authentification
- `src/lib/errors.ts` - Classes d'erreur standardisées

**Fonctionnalités implémentées :**
- Protection automatique des routes via middleware
- Helpers garantissant le filtrage userId dans toutes les requêtes
- Utilitaires pour vérifier l'authentification dans Server Actions
- Classes d'erreur standardisées pour gestion d'erreurs cohérente
