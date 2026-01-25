# Story 2.4: Consultation des prochaines étapes à accomplir

Status: completed

## Story

As a musicien,
I want consulter les prochaines étapes à accomplir pour mes projets,
So que je sais exactement quoi faire ensuite sans me poser de questions.

## Acceptance Criteria

**Given** que j'ai plusieurs projets avec différentes étapes
**When** j'accède à la vue "Prochaines étapes" ou au tableau de bord
**Then** les prochaines étapes de tous mes projets sont listées par ordre de priorité/date
**And** chaque prochaine étape affiche le projet associé, l'étape à accomplir, et la date prévue
**And** les étapes déjà complétées ne sont pas affichées dans cette liste
**And** je peux cliquer sur une étape pour accéder directement au projet concerné
**And** les étapes sont triées par urgence (dates proches en premier)

## Tasks / Subtasks

- [x] Task 1: Créer une fonction pour récupérer les prochaines étapes (AC: 1, 3)
  - [x] Subtask 1.1: Créer une fonction dans `src/lib/projects/projectUtils.ts` pour récupérer les prochaines étapes
  - [x] Subtask 1.2: Filtrer les étapes complétées (status !== 'COMPLETED')
  - [x] Subtask 1.3: Inclure les informations du projet pour chaque étape
- [x] Task 2: Créer la page "Prochaines étapes" (AC: 2, 4, 5)
  - [x] Subtask 2.1: Créer `src/app/next-steps/page.tsx` (Server Component)
  - [x] Subtask 2.2: Récupérer toutes les prochaines étapes de l'utilisateur
  - [x] Subtask 2.3: Trier les étapes par urgence (dates proches en premier, puis par ordre)
  - [x] Subtask 2.4: Afficher chaque étape avec projet associé, nom de l'étape, et date prévue
  - [x] Subtask 2.5: Rendre chaque étape cliquable pour accéder au projet
- [x] Task 3: Intégrer les prochaines étapes dans le tableau de bord (AC: 1, 2)
  - [x] Subtask 3.1: Créer ou modifier la page d'accueil `/` pour afficher les prochaines étapes
  - [x] Subtask 3.2: Afficher les 5-10 prochaines étapes les plus urgentes
  - [x] Subtask 3.3: Ajouter un lien vers la page complète "Prochaines étapes"

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components pour récupérer les données selon project-context.md
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md
- Tri par urgence : dates prévues proches en premier, puis par ordre d'étape
- Si pas de date prévue, afficher quand même l'étape (triée à la fin)

### Source Tree Components to Touch

- `src/lib/projects/projectUtils.ts` - Fonction pour récupérer les prochaines étapes
- `src/app/next-steps/page.tsx` - Page complète des prochaines étapes
- `src/app/page.tsx` - Page d'accueil avec tableau de bord (prochaines étapes)

### Testing Standards Summary

- Tests unitaires pour la fonction de récupération des prochaines étapes
- Tests d'intégration pour vérifier le tri et le filtrage
- Tests manuels pour vérifier l'affichage et la navigation

### Project Structure Notes

- Alignement avec project-context.md : Server Components, multi-tenancy
- Page dédiée pour vue complète, intégration dans tableau de bord pour vue d'ensemble

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.4]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Fonction pour récupérer les prochaines étapes
  - ✓ Fonction `getNextSteps()` créée dans `src/lib/projects/projectUtils.ts`
  - ✓ Filtrage des étapes complétées (status !== 'COMPLETED')
  - ✓ Calcul du score d'urgence basé sur les dates prévues (dates proches = plus urgent)
  - ✓ Tri par urgence puis par ordre d'étape
  - ✓ Inclusion des informations du projet (id, name) pour chaque étape
- **Task 2 complétée** : Page "Prochaines étapes"
  - ✓ Page `/next-steps` créée (Server Component)
  - ✓ Récupération de toutes les prochaines étapes de l'utilisateur avec filtrage multi-tenancy
  - ✓ Tri automatique par urgence (dates proches en premier)
  - ✓ Affichage de chaque étape avec : nom de l'étape, projet associé, date prévue formatée
  - ✓ Indicateur visuel pour les dates dépassées (⚠️ et couleur rouge)
  - ✓ Chaque étape est cliquable pour accéder directement au projet
  - ✓ Formatage intelligent des dates (aujourd'hui, demain, dans X jours, ou date complète)
- **Task 3 complétée** : Intégration dans le tableau de bord
  - ✓ Page d'accueil `/` transformée en tableau de bord avec authentification
  - ✓ Affichage des 5 prochaines étapes les plus urgentes
  - ✓ Lien vers la page complète "Prochaines étapes" si plus de 5 étapes
  - ✓ Section "Actions rapides" avec liens vers création de projet, liste des projets, prochaines étapes
  - ✓ Section "Statistiques" avec nombre de projets actifs et étapes à faire
  - ✓ Design responsive avec grille adaptative

### File List

**Fonctions utilitaires :**
- `src/lib/projects/projectUtils.ts` - Ajout de la fonction `getNextSteps()` et type `NextStep`

**Pages créées :**
- `src/app/next-steps/page.tsx` - Page complète des prochaines étapes

**Pages modifiées :**
- `src/app/page.tsx` - Transformation en tableau de bord avec prochaines étapes, actions rapides et statistiques
