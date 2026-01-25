# Story 2.6: Visualisation de la progression d'un projet musical

Status: completed

## Story

As a musicien,
I want visualiser la progression de mes projets musicaux,
So que je peux voir visuellement où j'en suis dans chaque projet.

## Acceptance Criteria

**Given** que j'ai un projet avec plusieurs étapes
**When** j'accède à la page de détail du projet
**Then** une visualisation de la progression est affichée (barre de progression, timeline, ou pourcentage)
**And** la progression est calculée automatiquement selon les étapes complétées vs total
**And** je peux voir quelles étapes sont terminées, en cours, ou à venir
**And** la visualisation est mise à jour en temps réel quand je complète une étape
**And** je peux voir les dates importantes (début projet, dates d'étapes, fin prévue)

## Tasks / Subtasks

- [x] Task 1: Améliorer la visualisation de la progression (AC: 1, 2)
  - [x] Subtask 1.1: La barre de progression est déjà affichée, vérifier qu'elle fonctionne correctement
  - [x] Subtask 1.2: Ajouter une timeline visuelle montrant les étapes dans l'ordre chronologique
  - [x] Subtask 1.3: Afficher clairement les étapes terminées, en cours, et à venir avec couleurs distinctes
- [x] Task 2: Afficher les dates importantes (AC: 5)
  - [x] Subtask 2.1: Afficher la date de début du projet si disponible
  - [x] Subtask 2.2: Afficher les dates prévues des étapes dans la timeline
  - [x] Subtask 2.3: Afficher la date de fin prévue du projet si disponible
- [x] Task 3: Mise à jour en temps réel (AC: 4)
  - [x] Subtask 3.1: Vérifier que la progression se met à jour automatiquement quand une étape est complétée
  - [x] Subtask 3.2: Utiliser router.refresh() ou revalidation pour mettre à jour après modification d'étape

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components pour afficher les données selon project-context.md
- La progression est déjà calculée avec `calculateProjectProgress()` dans projectUtils.ts
- Timeline visuelle avec étapes colorées selon leur statut
- Mise à jour via router.refresh() après modification d'étape

### Source Tree Components to Touch

- `src/app/projects/[id]/page.tsx` - Améliorer la visualisation de la progression
- `src/components/projects/ProjectTimeline.tsx` - Nouveau composant pour timeline (optionnel)
- `src/components/projects/StepCard.tsx` - Peut-être améliorer pour inclure dates

### Testing Standards Summary

- Tests manuels pour vérifier la visualisation
- Vérifier que la progression se met à jour correctement

### Project Structure Notes

- Alignement avec project-context.md : Server Components
- Réutilisation des fonctions utilitaires existantes

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.6]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Visualisation améliorée de la progression
  - ✓ Barre de progression améliorée avec design gradient et pourcentage visible
  - ✓ Composant `ProjectTimeline` créé avec timeline visuelle verticale
  - ✓ Étapes affichées avec couleurs distinctes (vert=terminée, bleu=en cours, gris=à faire)
  - ✓ Indicateurs visuels (checkmark pour terminée, point animé pour en cours)
  - ✓ Légende avec compteurs pour chaque statut d'étape
- **Task 2 complétée** : Affichage des dates importantes
  - ✓ Date de début du projet affichée en haut de la timeline si disponible
  - ✓ Date de fin prévue du projet affichée en haut de la timeline si disponible
  - ✓ Dates prévues des étapes affichées dans la timeline
  - ✓ Dates réelles affichées si disponibles
  - ✓ Indicateur visuel pour les étapes en retard (⚠️)
- **Task 3 complétée** : Mise à jour en temps réel
  - ✓ `router.refresh()` ajouté dans `StepCard` après modification d'étape
  - ✓ La progression se met à jour automatiquement quand une étape est complétée
  - ✓ La timeline se met à jour automatiquement après modification

### File List

**Composants créés :**
- `src/components/projects/ProjectTimeline.tsx` - Timeline visuelle avec étapes et dates

**Composants modifiés :**
- `src/components/projects/StepCard.tsx` - Ajout de `router.refresh()` pour mise à jour automatique

**Pages modifiées :**
- `src/app/projects/[id]/page.tsx` - Amélioration de la visualisation de progression avec timeline et barre de progression améliorée
