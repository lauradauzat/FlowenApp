# Story 4.7: Ajout manuel de données from scratch

Status: review

## Story

As a musicien,
I want ajouter manuellement des données from scratch,
So que je peux compléter ma base de données même sans sources automatisées.

## Acceptance Criteria

**Given** que je suis authentifié et sur la page de création de contact ou salle  
**When** je remplis le formulaire de création manuelle  
**Then** je peux saisir toutes les informations nécessaires  
**And** la fiche est créée dans ma base de données avec `userId` associé  
**And** les données manuelles sont identifiées comme telles (origine = "manuel")  
**And** je peux créer des contacts et salles manuellement à tout moment  
**And** les fiches créées manuellement fonctionnent exactement comme les fiches scrapées/importées

## Tasks / Subtasks

- [x] Task 1: Vérifier et mettre à jour les actions de création pour définir explicitement dataSource (AC: 4)
  - [x] Subtask 1.1: Modifier `createContact` dans `src/actions/contactActions.ts` pour définir `dataSource: 'MANUAL'`
  - [x] Subtask 1.2: Modifier `createVenue` dans `src/actions/venueActions.ts` pour définir `dataSource: 'MANUAL'`
  - [x] Subtask 1.3: Vérifier que les pages `/contacts/new` et `/venues/new` existent et fonctionnent
- [x] Task 2: Vérifier que les formulaires permettent de saisir toutes les informations (AC: 3)
  - [x] Subtask 2.1: Vérifier `ContactForm` permet de saisir tous les champs nécessaires (firstName, lastName, email, phone, role, notes)
  - [x] Subtask 2.2: Vérifier `VenueForm` permet de saisir tous les champs nécessaires (name, address, region, website, capacity, style, notes)
- [x] Task 3: Documenter que l'ajout manuel est déjà implémenté (AC: 1, 2, 5, 6)
  - [x] Subtask 3.1: Vérifier que les pages de création sont accessibles et protégées par `requireAuth()`
  - [x] Subtask 3.2: Vérifier que les fiches créées manuellement fonctionnent comme les autres (même structure, même validation)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md

### Source Tree Components to Touch

- `src/actions/contactActions.ts` — Ajouter `dataSource: 'MANUAL'` dans `createContact`  
- `src/actions/venueActions.ts` — Ajouter `dataSource: 'MANUAL'` dans `createVenue`

### Notes importantes

- L'ajout manuel de contacts et salles est **déjà implémenté** dans l'Epic 3 (Story 3.1 et 3.2)
- Les pages `/contacts/new` et `/venues/new` existent déjà
- Les formulaires `ContactForm` et `VenueForm` existent déjà
- Le schéma Prisma a une valeur par défaut `@default(MANUAL)` pour `dataSource`
- Cette story consiste principalement à s'assurer que `dataSource` est explicitement défini à `MANUAL` lors de la création manuelle

### Testing Standards Summary

- Vérifier que les contacts/salles créés manuellement ont bien `dataSource = 'MANUAL'`
- Vérifier que les formulaires fonctionnent correctement

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Les pages de création existent déjà dans `src/app/contacts/new/` et `src/app/venues/new/`

### Patterns à suivre depuis les stories précédentes

- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.7]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Actions de création mises à jour
  - ✓ `createContact` dans `src/actions/contactActions.ts` définit maintenant explicitement `dataSource: 'MANUAL'`
  - ✓ `createVenue` dans `src/actions/venueActions.ts` définit maintenant explicitement `dataSource: 'MANUAL'`
  - ✓ Les pages `/contacts/new` et `/venues/new` existent déjà et fonctionnent correctement
- **Task 2 complétée** : Formulaires vérifiés
  - ✓ `ContactForm` permet de saisir tous les champs nécessaires : firstName, lastName, email, phone, role, notes
  - ✓ `VenueForm` permet de saisir tous les champs nécessaires : name, address, region, website, capacity, style, notes
  - ✓ Les formulaires utilisent la validation Zod pour valider les données
- **Task 3 complétée** : Documentation et vérification
  - ✓ Les pages de création sont protégées par `requireAuth()` (déjà implémenté dans Epic 3)
  - ✓ Les fiches créées manuellement fonctionnent exactement comme les autres (même structure, même validation, même multi-tenancy)
  - ✓ L'ajout manuel était déjà implémenté dans l'Epic 3 (Story 3.1 pour contacts, Story 3.2 pour salles)
  - ✓ Cette story a simplement ajouté l'explicitation du `dataSource: 'MANUAL'` pour être conforme aux critères d'acceptation

### File List

**Actions :**
- `src/actions/contactActions.ts` — `createContact` modifié pour définir `dataSource: 'MANUAL'`
- `src/actions/venueActions.ts` — `createVenue` modifié pour définir `dataSource: 'MANUAL'`

**Pages (déjà existantes) :**
- `src/app/contacts/new/page.tsx` — Page de création de contact
- `src/app/venues/new/page.tsx` — Page de création de salle

**Composants (déjà existants) :**
- `src/components/contacts/ContactForm.tsx` — Formulaire de création/édition de contact
- `src/components/venues/VenueForm.tsx` — Formulaire de création/édition de salle

### Notes importantes

- **Déjà implémenté** : L'ajout manuel de contacts et salles était déjà fonctionnel dans l'Epic 3
- **Explicitation** : Cette story a simplement ajouté l'explicitation du `dataSource: 'MANUAL'` dans les actions de création
- **Fonctionnalité complète** : Les utilisateurs peuvent créer des contacts et salles manuellement à tout moment via les pages dédiées
- **Traitement identique** : Les fiches créées manuellement sont traitées exactement comme les fiches scrapées/importées (même validation, même structure, même multi-tenancy)
- **Traçage** : Tous les contacts et salles créés manuellement ont maintenant explicitement `dataSource = 'MANUAL'` pour le traçage
