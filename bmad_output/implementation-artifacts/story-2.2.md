# Story 2.2: Visualisation de l'état des projets musicaux

Status: completed

## Story

As a musicien,
I want visualiser l'état de mes projets musicaux,
So que je peux voir rapidement où j'en suis avec chaque projet.

## Acceptance Criteria

**Given** que j'ai créé au moins un projet musical
**When** j'accède à la page de liste des projets
**Then** tous mes projets sont affichés avec leurs informations essentielles (nom, type, statut, dates)
**And** chaque projet affiche son état actuel (en cours, terminé, en attente, etc.)
**And** je peux cliquer sur un projet pour accéder à sa page de détail
**And** les projets sont filtrés automatiquement par mon `userId` (multi-tenancy)
**And** je peux voir la progression globale de chaque projet (pourcentage, étapes complétées)

## Tasks / Subtasks

- [x] Task 1: Ajouter le calcul du statut du projet (AC: 2)
  - [x] Subtask 1.1: Créer une fonction utilitaire pour calculer le statut (en cours, terminé, en attente)
  - [x] Subtask 1.2: Le statut dépend des étapes (toutes terminées = terminé, au moins une en cours = en cours, sinon en attente)
- [x] Task 2: Améliorer l'affichage de la progression dans la liste (AC: 5)
  - [x] Subtask 2.1: Afficher le pourcentage de progression de manière plus visible
  - [x] Subtask 2.2: Afficher le nombre d'étapes complétées vs total (ex: "3/5 étapes complétées")
- [x] Task 3: Améliorer l'affichage des informations essentielles (AC: 1, 3)
  - [x] Subtask 3.1: Afficher le statut du projet avec badge coloré
  - [x] Subtask 3.2: Améliorer l'affichage des dates (début et fin si disponibles)
  - [x] Subtask 3.3: S'assurer que les projets sont cliquables pour accéder au détail
- [x] Task 4: Vérifier le filtrage multi-tenancy (AC: 4)
  - [x] Subtask 4.1: Vérifier que seuls les projets de l'utilisateur connecté sont affichés
  - [x] Subtask 4.2: Tester que les projets d'autres utilisateurs ne sont pas visibles

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components pour récupérer les données selon project-context.md
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md
- Calcul du statut basé sur les étapes du projet
- Statut "terminé" = toutes les étapes sont COMPLETED
- Statut "en cours" = au moins une étape est IN_PROGRESS ou COMPLETED
- Statut "en attente" = toutes les étapes sont TODO

### Source Tree Components to Touch

- `src/lib/projects/projectUtils.ts` - Fonctions utilitaires pour calculer statut et progression
- `src/app/projects/page.tsx` - Améliorer l'affichage de la liste des projets
- `src/app/projects/[id]/page.tsx` - Peut-être améliorer aussi la page de détail

### Testing Standards Summary

- Tests unitaires pour les fonctions de calcul de statut et progression
- Tests d'intégration pour vérifier le filtrage multi-tenancy
- Tests manuels pour vérifier l'affichage

### Project Structure Notes

- Alignement avec project-context.md : Server Components, multi-tenancy
- Fonctions utilitaires dans `src/lib/projects/` selon architecture modulaire

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.2]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Fonctions utilitaires pour calculer le statut du projet
  - ✓ Fonction `calculateProjectStatus()` créée dans `src/lib/projects/projectUtils.ts`
  - ✓ Logique : terminé = toutes étapes COMPLETED, en cours = au moins une IN_PROGRESS/COMPLETED, sinon en attente
  - ✓ Fonctions helper pour labels et classes CSS des badges
- **Task 2 complétée** : Affichage amélioré de la progression
  - ✓ Fonction `calculateProjectProgress()` pour calculer progression (complétées/total/percentage)
  - ✓ Affichage du pourcentage avec barre de progression plus visible (h-2.5)
  - ✓ Affichage du nombre d'étapes complétées vs total (ex: "3 sur 5 étapes complétées")
- **Task 3 complétée** : Affichage amélioré des informations essentielles
  - ✓ Badge de statut coloré selon l'état (gris=en attente, bleu=en cours, vert=terminé)
  - ✓ Affichage des dates de début et fin avec formatage français amélioré
  - ✓ Projets cliquables pour accéder au détail (déjà implémenté dans Story 2.1)
  - ✓ Badge de type de projet (EP, Album, etc.) conservé
- **Task 4 complétée** : Filtrage multi-tenancy vérifié
  - ✓ La fonction `getProjects()` filtre par `userId` dans la requête Prisma
  - ✓ `requireAuth()` garantit que seul l'utilisateur connecté peut voir ses projets
  - ✓ Les projets d'autres utilisateurs ne sont pas accessibles (filtrage au niveau DB)

### File List

**Fonctions utilitaires :**
- `src/lib/projects/projectUtils.ts` - Fonctions pour calculer statut et progression des projets

**Pages modifiées :**
- `src/app/projects/page.tsx` - Amélioration de l'affichage avec statut, progression détaillée et dates
