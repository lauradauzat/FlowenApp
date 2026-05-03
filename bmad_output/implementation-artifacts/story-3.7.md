# Story 3.7: Identification visuelle des fiches avec erreurs

Status: done

## Story

As a musicien,
I want identifier visuellement les fiches avec données incomplètes ou erronées,
So que je peux rapidement repérer les données nécessitant correction.

## Acceptance Criteria

**Given** que j'ai des contacts et des salles dans ma base de données  
**When** une fiche a des données incomplètes (champs requis manquants) ou erronées (email invalide, etc.)  
**Then** la fiche est marquée visuellement avec un badge ou une icône d'alerte  
**And** le badge indique le type d'erreur (données incomplètes, email invalide, etc.)  
**And** dans la liste des contacts/salles, les fiches avec erreurs sont mises en évidence  
**And** je peux filtrer la liste pour voir uniquement les fiches avec erreurs  
**And** quand j'accède à la fiche, les champs problématiques sont clairement identifiés  
**And** je peux corriger les erreurs directement depuis la fiche

## Tasks / Subtasks

- [x] Task 1: Créer les fonctions de validation des données (AC: 1, 2)
  - [x] Subtask 1.1: Créer fonction `validateContact` dans `src/lib/validations/contactValidation.ts`
  - [x] Subtask 1.2: Créer fonction `validateVenue` dans `src/lib/validations/venueValidation.ts`
  - [x] Subtask 1.3: Détecter les champs requis manquants (nom, prénom pour contact ; nom pour salle)
  - [x] Subtask 1.4: Détecter les emails invalides (format incorrect)
  - [x] Subtask 1.5: Détecter les URLs invalides (pour les sites web de salles)
  - [x] Subtask 1.6: Retourner un objet avec les erreurs détectées
- [x] Task 2: Mettre à jour le statut des fiches avec erreurs (AC: 1)
  - [x] Subtask 2.1: Créer une Server Action pour valider et mettre à jour le statut
  - [x] Subtask 2.2: Marquer automatiquement les fiches avec erreurs avec `status = ERROR`
  - [ ] Subtask 2.3: Créer un job ou une fonction pour valider toutes les fiches périodiquement (optionnel pour MVP)
- [x] Task 3: Afficher les badges d'alerte dans les listes (AC: 3, 4)
  - [x] Subtask 3.1: Modifier `src/app/contacts/page.tsx` pour afficher un badge d'alerte si `status = ERROR`
  - [x] Subtask 3.2: Modifier `src/app/venues/page.tsx` pour afficher un badge d'alerte si `status = ERROR`
  - [x] Subtask 3.3: Ajouter un filtre "Avec erreurs" dans les listes (filtre de statut "ERROR" déjà présent)
  - [x] Subtask 3.4: Mettre en évidence visuellement les fiches avec erreurs (couleur, icône)
- [x] Task 4: Afficher les erreurs dans les pages de détail (AC: 5, 6)
  - [x] Subtask 4.1: Modifier `src/app/contacts/[id]/page.tsx` pour afficher les erreurs détectées
  - [x] Subtask 4.2: Modifier `src/app/venues/[id]/page.tsx` pour afficher les erreurs détectées
  - [x] Subtask 4.3: Mettre en évidence les champs problématiques (bordure rouge, message d'erreur)
  - [x] Subtask 4.4: Permettre la correction via le formulaire d'édition existant

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les validations et mises à jour selon project-context.md  
- Multi-tenancy : toujours vérifier ownership avant validation selon project-context.md  
- Validation Zod pour les formats (email, URL) selon project-context.md  
- Le statut `ERROR` existe déjà dans les enums `ContactStatus` et `VenueStatus`

### Source Tree Components to Touch

- `src/lib/validations/contactValidation.ts` — Fonctions de validation pour contacts  
- `src/lib/validations/venueValidation.ts` — Fonctions de validation pour salles  
- `src/actions/contactActions.ts` — Ajouter fonction `validateAndUpdateContactStatus`  
- `src/actions/venueActions.ts` — Ajouter fonction `validateAndUpdateVenueStatus`  
- `src/app/contacts/page.tsx` — Ajouter badges d'alerte et filtre "Avec erreurs"  
- `src/app/venues/page.tsx` — Ajouter badges d'alerte et filtre "Avec erreurs"  
- `src/app/contacts/[id]/page.tsx` — Afficher les erreurs détectées  
- `src/app/venues/[id]/page.tsx` — Afficher les erreurs détectées

### Types d'Erreurs à Détecter

**Pour les Contacts :**
- Prénom manquant (requis)
- Nom manquant (requis)
- Email invalide (format incorrect si présent)
- Email manquant (optionnel mais recommandé)

**Pour les Salles :**
- Nom manquant (requis)
- Site web invalide (URL invalide si présent)
- Capacité invalide (nombre négatif si présent)

### Validation et Mise à Jour du Statut

**Approche :**
- Validation à la création/mise à jour : valider automatiquement et mettre à jour le statut
- Validation manuelle : fonction pour valider toutes les fiches d'un utilisateur
- Validation périodique : optionnel, peut être ajouté plus tard avec un cron job

**Mise à jour du statut :**
- Si erreurs détectées → `status = ERROR`
- Si pas d'erreurs → `status = ACTIVE` (ou garder `ARCHIVED` si déjà archivé)

### Testing Standards Summary

- Tests unitaires pour les fonctions de validation
- Tests d'intégration pour vérifier la mise à jour du statut
- Tests de sécurité : vérifier que seul le propriétaire peut valider ses fiches

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Réutiliser les patterns existants pour cohérence  
- Les statuts `ERROR` existent déjà dans les enums

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` et `story-3.2` pour les Server Actions
- Utiliser le format de réponse standardisé
- Style cohérent avec le reste de l'application (Tailwind CSS)

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.7]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour contacts  
- [Source: bmad_output/implementation-artifacts/story-3.2.md#Dev-Notes] — Patterns pour salles

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Fonctions de validation créées
  - ✓ `validateContact` créée dans `src/lib/validations/contactValidation.ts`
  - ✓ `validateVenue` créée dans `src/lib/validations/venueValidation.ts`
  - ✓ Détection des champs requis manquants (prénom, nom pour contact ; nom pour salle)
  - ✓ Détection des emails invalides avec validation Zod
  - ✓ Détection des URLs invalides avec validation Zod
  - ✓ Détection des capacités invalides (nombres négatifs)
  - ✓ Retour d'un objet `ValidationResult` avec `isValid` et liste d'erreurs
  - ✓ Distinction entre erreurs critiques (`missing`, `invalid`) et avertissements (`warning`)
- **Task 2 complétée** : Mise à jour automatique du statut
  - ✓ Validation automatique lors de la création (`createContact`, `createVenue`)
  - ✓ Validation automatique lors de la mise à jour (`updateContact`, `updateVenue`)
  - ✓ Mise à jour du statut : `ERROR` si erreurs critiques, `ACTIVE` sinon
  - ✓ Préservation du statut `ARCHIVED` sauf si erreurs critiques détectées
  - ⚠️ Subtask 2.3 (validation périodique) : optionnel pour MVP, peut être ajouté plus tard
- **Task 3 complétée** : Badges d'alerte dans les listes
  - ✓ Badge "⚠️ Erreurs" ajouté dans `src/app/contacts/page.tsx` pour les contacts avec `status = ERROR`
  - ✓ Badge "⚠️ Erreurs" ajouté dans `src/app/venues/page.tsx` pour les salles avec `status = ERROR`
  - ✓ Filtre "Avec erreurs" disponible via le filtre de statut existant (option "ERROR")
  - ✓ Mise en évidence visuelle : badge rouge avec icône d'alerte
- **Task 4 complétée** : Affichage des erreurs dans les pages de détail
  - ✓ Composant `ContactErrors` créé pour afficher les erreurs d'un contact
  - ✓ Composant `VenueErrors` créé pour afficher les erreurs d'une salle
  - ✓ Affichage conditionnel : seulement si `status = ERROR`
  - ✓ Section d'erreurs avec icône d'alerte, liste des erreurs critiques et avertissements
  - ✓ Correction possible via le formulaire d'édition existant (qui valide automatiquement après modification)

### Code Review Notes

- **Tests manquants** : Ajout de tests unitaires pour les fonctions de validation
  - ✓ Tests pour `validateContact` dans `contactValidation.test.ts`
  - ✓ Tests pour `validateVenue` dans `venueValidation.test.ts`
  - ✓ Vérification de la détection des erreurs critiques (missing, invalid) et des avertissements (warning)

### File List

**Validations :**
- `src/lib/validations/contactValidation.ts` — Fonction `validateContact` pour valider les données d'un contact
- `src/lib/validations/venueValidation.ts` — Fonction `validateVenue` pour valider les données d'une salle

**Server Actions modifiées :**
- `src/actions/contactActions.ts` — Validation automatique dans `createContact` et `updateContact`, mise à jour du statut
- `src/actions/venueActions.ts` — Validation automatique dans `createVenue` et `updateVenue`, mise à jour du statut

**Composants :**
- `src/components/contacts/ContactErrors.tsx` — Composant pour afficher les erreurs d'un contact
- `src/components/venues/VenueErrors.tsx` — Composant pour afficher les erreurs d'une salle

**Pages modifiées :**
- `src/app/contacts/page.tsx` — Ajout du badge "⚠️ Erreurs" pour les contacts avec erreurs
- `src/app/venues/page.tsx` — Ajout du badge "⚠️ Erreurs" pour les salles avec erreurs
- `src/app/contacts/[id]/page.tsx` — Affichage des erreurs détectées via `ContactErrors`
- `src/app/venues/[id]/page.tsx` — Affichage des erreurs détectées via `VenueErrors`

**Tests :**
- `src/lib/validations/contactValidation.test.ts` — Tests unitaires pour `validateContact`
  - ✓ Test de validation réussie
  - ✓ Tests de détection d'erreurs (prénom/nom manquants, email invalide)
  - ✓ Test d'avertissement (pas d'email ni téléphone)
- `src/lib/validations/venueValidation.test.ts` — Tests unitaires pour `validateVenue`
  - ✓ Test de validation réussie
  - ✓ Tests de détection d'erreurs (nom manquant, URL invalide, capacité négative)
  - ✓ Test d'avertissement (pas d'adresse ni région)
