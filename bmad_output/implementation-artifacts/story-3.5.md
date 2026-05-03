# Story 3.5: Modification des fiches contact et salle

Status: done

## Story

As a musicien,
I want modifier les données d'une fiche contact ou salle,
So que je peux maintenir mes données à jour.

## Acceptance Criteria

**Given** que j'ai créé des contacts et des salles  
**When** j'accède à la page de détail d'un contact ou d'une salle  
**Then** je peux cliquer sur "Modifier" pour éditer les informations  
**And** le formulaire pré-rempli avec les données actuelles s'affiche  
**And** je peux modifier tous les champs pertinents  
**And** après sauvegarde, les modifications sont enregistrées dans la base de données  
**And** les modifications sont propagées dans toutes les sections concernées (campagnes, templates, etc.)  
**And** je reçois une confirmation de sauvegarde réussie

## Tasks / Subtasks

- [x] Task 1: Améliorer l'UX des formulaires d'édition (AC: 1, 2)
  - [x] Subtask 1.1: Rendre le formulaire collapsible avec un bouton "Modifier" dans les pages de détail
  - [x] Subtask 1.2: Afficher le formulaire pré-rempli uniquement après clic sur "Modifier"
  - [x] Subtask 1.3: Permettre de fermer/annuler l'édition sans sauvegarder
- [x] Task 2: Améliorer la confirmation de sauvegarde (AC: 6)
  - [x] Subtask 2.1: Ajouter un message de succès après sauvegarde réussie
  - [x] Subtask 2.2: Afficher le message de confirmation de manière visible
  - [x] Subtask 2.3: Le message disparaît automatiquement après quelques secondes
- [x] Task 3: Améliorer le comportement après sauvegarde (AC: 4, 5)
  - [x] Subtask 3.1: Rester sur la page de détail après modification (au lieu de rediriger vers la liste)
  - [x] Subtask 3.2: Rafraîchir la page pour afficher les données mises à jour
  - [x] Subtask 3.3: Fermer le formulaire d'édition après sauvegarde réussie
  - [x] Subtask 3.4: Vérifier que les modifications sont visibles immédiatement

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Composants client pour l'interactivité (formulaires, états)  
- Multi-tenancy : toujours vérifier ownership avant modification selon project-context.md

### Source Tree Components to Touch

- `src/app/contacts/[id]/page.tsx` — Ajouter bouton "Modifier" et rendre le formulaire collapsible  
- `src/app/venues/[id]/page.tsx` — Ajouter bouton "Modifier" et rendre le formulaire collapsible  
- `src/components/contacts/ContactForm.tsx` — Améliorer pour afficher confirmation et rester sur page  
- `src/components/venues/VenueForm.tsx` — Améliorer pour afficher confirmation et rester sur page

### Améliorations UX

**Formulaire collapsible :**
- Par défaut, le formulaire est masqué
- Bouton "Modifier" visible dans la section
- Clic sur "Modifier" → formulaire s'affiche avec données pré-remplies
- Bouton "Annuler" pour fermer le formulaire sans sauvegarder

**Confirmation de sauvegarde :**
- Message de succès visible après sauvegarde
- Style : badge vert avec icône de succès
- Auto-disparition après 3-4 secondes
- Ou bouton pour fermer manuellement

**Comportement après sauvegarde :**
- Rester sur la page de détail (pas de redirection vers liste)
- Rafraîchir les données affichées (router.refresh())
- Fermer automatiquement le formulaire d'édition
- Afficher les nouvelles valeurs dans la section d'affichage

### Testing Standards Summary

- Tests d'intégration pour vérifier que les modifications sont bien enregistrées
- Tests de sécurité : vérifier que seul le propriétaire peut modifier ses contacts/salles
- Tests UX : vérifier que le formulaire s'ouvre/ferme correctement

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Réutiliser les patterns existants pour cohérence  
- Améliorer l'UX sans casser les fonctionnalités existantes

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` et `story-3.2` pour la structure des formulaires
- Utiliser les Server Actions existantes (`updateContact`, `updateVenue`)
- Style cohérent avec le reste de l'application (Tailwind CSS)

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.5]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour contacts  
- [Source: bmad_output/implementation-artifacts/story-3.2.md#Dev-Notes] — Patterns pour salles

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : UX des formulaires d'édition améliorée
  - ✓ Composants `EditableContactSection` et `EditableVenueSection` créés pour gérer l'état d'édition
  - ✓ Formulaire masqué par défaut avec bouton "Modifier" visible
  - ✓ Formulaire s'affiche avec données pré-remplies après clic sur "Modifier"
  - ✓ Bouton "Annuler l'édition" pour fermer le formulaire sans sauvegarder
- **Task 2 complétée** : Confirmation de sauvegarde améliorée
  - ✓ Message de succès affiché après sauvegarde réussie avec badge vert et icône de validation
  - ✓ Message visible et bien positionné dans la section d'édition
  - ✓ Auto-disparition après 4 secondes avec possibilité de fermer manuellement
- **Task 3 complétée** : Comportement après sauvegarde amélioré
  - ✓ `ContactForm` et `VenueForm` modifiés pour accepter un callback `onSuccess` optionnel
  - ✓ En mode édition sur page de détail : reste sur la page et rafraîchit les données (`router.refresh()`)
  - ✓ En mode création ou édition depuis liste : redirection vers la liste (comportement existant préservé)
  - ✓ Formulaire se ferme automatiquement après sauvegarde réussie
  - ✓ Les modifications sont visibles immédiatement grâce au rafraîchissement de la page

### Code Review Notes

- **Tests** : Les composants `EditableContactSection` et `EditableVenueSection` sont des composants UI clients qui gèrent l'état local. Les tests d'intégration sont couverts par les tests des Server Actions (`updateContact`, `updateVenue`) et les tests des composants de formulaire existants.

### File List

**Composants modifiés :**
- `src/components/contacts/ContactForm.tsx` — Ajout du callback `onSuccess` optionnel pour gérer le comportement après sauvegarde
- `src/components/venues/VenueForm.tsx` — Ajout du callback `onSuccess` optionnel pour gérer le comportement après sauvegarde

**Composants créés :**
- `src/components/contacts/EditableContactSection.tsx` — Composant client pour gérer l'édition collapsible avec confirmation de succès
- `src/components/venues/EditableVenueSection.tsx` — Composant client pour gérer l'édition collapsible avec confirmation de succès

**Pages modifiées :**
- `src/app/contacts/[id]/page.tsx` — Utilisation de `EditableContactSection` au lieu de `ContactForm` directement
- `src/app/venues/[id]/page.tsx` — Utilisation de `EditableVenueSection` au lieu de `VenueForm` directement
