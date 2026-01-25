# Story 2.3: Visualisation des étapes d'un projet musical

Status: completed

## Story

As a musicien,
I want voir les étapes d'un projet musical intégrées dans la structure,
So que je comprends le cheminement complet de mon projet.

## Acceptance Criteria

**Given** que j'ai créé un projet musical avec structure préconstruite
**When** j'accède à la page de détail du projet
**Then** toutes les étapes du projet sont affichées dans l'ordre chronologique
**And** chaque étape affiche son statut (à faire, en cours, terminée)
**And** les étapes sont adaptées au type de projet (ex: EP = Composition, Enregistrement, Mixage, Mastering, Sortie)
**And** je peux voir les dates prévues et réelles pour chaque étape
**And** je peux marquer une étape comme complétée

## Tasks / Subtasks

- [x] Task 1: Améliorer l'affichage des étapes dans la page de détail (AC: 1-3)
  - [x] Subtask 1.1: Afficher les étapes dans l'ordre chronologique (order)
  - [x] Subtask 1.2: Afficher le statut de chaque étape avec badge coloré (TODO, IN_PROGRESS, COMPLETED)
  - [x] Subtask 1.3: Améliorer la présentation visuelle des étapes (timeline ou liste structurée)
- [x] Task 2: Afficher les dates prévues et réelles des étapes (AC: 4)
  - [x] Subtask 2.1: Afficher la date prévue (plannedDate) si disponible
  - [x] Subtask 2.2: Afficher la date réelle (actualDate) si disponible
  - [x] Subtask 2.3: Indiquer visuellement si une date prévue est dépassée
- [x] Task 3: Créer la fonctionnalité pour marquer une étape comme complétée (AC: 5)
  - [x] Subtask 3.1: Créer une Server Action `updateStepStatus` pour mettre à jour le statut d'une étape
  - [x] Subtask 3.2: Créer un composant client pour permettre de changer le statut d'une étape
  - [x] Subtask 3.3: Mettre à jour automatiquement la date réelle quand une étape est marquée comme complétée
  - [x] Subtask 3.4: Valider que seul le propriétaire du projet peut modifier les étapes (multi-tenancy)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components pour afficher les données selon project-context.md
- Server Actions pour les mutations selon project-context.md
- Multi-tenancy : vérifier que l'utilisateur est propriétaire du projet avant modification
- Validation Zod pour les mises à jour d'étapes
- Format de réponse standardisé pour Server Actions

### Source Tree Components to Touch

- `src/app/projects/[id]/page.tsx` - Améliorer l'affichage des étapes
- `src/actions/projectActions.ts` - Ajouter fonction `updateStepStatus`
- `src/lib/validations/project.ts` - Ajouter schéma de validation pour mise à jour d'étape
- `src/components/projects/StepCard.tsx` - Composant pour afficher et modifier une étape (optionnel)

### Testing Standards Summary

- Tests unitaires pour la validation de mise à jour d'étape
- Tests d'intégration pour la Server Action (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut modifier

### Project Structure Notes

- Alignement avec project-context.md : Server Components, Server Actions, multi-tenancy
- Composants réutilisables dans `src/components/projects/` selon architecture modulaire

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.3]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]
- [Source: bmad_output/project-context.md#Multi-Tenancy]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Affichage amélioré des étapes
  - ✓ Les étapes sont affichées dans l'ordre chronologique (order ASC)
  - ✓ Badge coloré pour chaque statut (gris=à faire, bleu=en cours, vert=terminée)
  - ✓ Composant StepCard créé pour une présentation visuelle améliorée
  - ✓ Affichage de la progression globale du projet en haut de page
- **Task 2 complétée** : Affichage des dates prévues et réelles
  - ✓ Date prévue affichée si disponible avec formatage français
  - ✓ Date réelle affichée si disponible avec formatage français
  - ✓ Indicateur visuel (⚠️) si une date prévue est dépassée et l'étape n'est pas complétée
  - ✓ Couleur rouge pour les dates prévues dépassées
- **Task 3 complétée** : Fonctionnalité pour marquer une étape comme complétée
  - ✓ Server Action `updateStepStatus` créée avec validation Zod
  - ✓ Composant client StepCard avec boutons pour changer le statut (À faire, En cours, Terminée)
  - ✓ Date réelle automatiquement mise à jour quand une étape est marquée comme COMPLETED
  - ✓ Vérification multi-tenancy : seul le propriétaire du projet peut modifier les étapes
  - ✓ Gestion d'erreurs avec messages d'erreur affichés
  - ✓ États de chargement pendant la mise à jour

### File List

**Validations :**
- `src/lib/validations/project.ts` - Ajout du schéma `updateStepStatusSchema`

**Server Actions :**
- `src/actions/projectActions.ts` - Ajout de la fonction `updateStepStatus`

**Composants :**
- `src/components/projects/StepCard.tsx` - Composant client pour afficher et modifier une étape

**Pages modifiées :**
- `src/app/projects/[id]/page.tsx` - Amélioration de l'affichage avec StepCard, progression globale, et statut du projet
