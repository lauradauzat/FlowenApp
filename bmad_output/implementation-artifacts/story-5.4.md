# Story 5.4: Prévisualisation d'un template avant envoi

Status: review

## Story

As a musicien,
I want prévisualiser un template avant envoi,
So que je peux valider le contenu et la personnalisation avant de lancer une campagne.

## Acceptance Criteria

**Given** que j'ai créé ou modifié un template
**When** je clique sur « Prévisualiser »
**Then** une prévisualisation du mail généré s'affiche avec des données d'exemple
**And** les variables dynamiques sont remplacées par des valeurs d'exemple réalistes
**And** je peux voir le sujet et le corps du mail formaté
**And** je peux tester avec différentes variantes (selon capacité, région, style)
**And** la prévisualisation montre exactement ce qui sera envoyé
**And** je peux revenir à l'édition si des modifications sont nécessaires

## Tasks / Subtasks

- [x] Task 1: Prévisualisation de base (déjà en 5.2)
  - [x] Bouton « Prévisualiser », sujet et corps avec variables remplacées via `renderTemplate` et `getExampleData`
- [x] Task 2: Choix du contenu à prévisualiser (5.3 + 5.4)
  - [x] Mode édition : sélecteur « Contenu : Défaut | Variante … | Simuler une salle »
  - [x] Défaut : template par défaut (sujet/corps du formulaire)
  - [x] Variante : sujet/corps de la variante + `getExampleDataForVariant` adapté (capacité/région/style)
  - [x] Simuler une salle : champs capacité (nombre), région, style → `selectTemplateVariant` + rendu du sujet/corps retenu (défaut ou variante) avec `getExampleDataForVariant`
- [x] Task 3: Affichage et retour à l’édition
  - [x] Sujet et corps formatés dans la même vue ; le formulaire reste sur la page, on peut modifier et re-prévisualiser

## Dev Agent Record

### Completion Notes

- La prévisualisation réutilise `renderTemplate`, `getExampleData`, `getExampleDataForVariant` et `selectTemplateVariant` de `templateVariables.ts`.
- « Simuler une salle » permet de vérifier quelle variante serait choisie pour une capacité/région/style données et d’en voir le rendu.

### File List

- `src/components/templates/MailTemplateForm.tsx` — section Prévisualisation : sélecteur Défaut / variantes / Simuler une salle, champs de simulation, rendu sujet + corps
