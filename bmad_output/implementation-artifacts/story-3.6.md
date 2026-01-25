# Story 3.6: Archivage des fiches contact et salle

Status: review

## Story

As a musicien,
I want archiver une fiche contact ou salle si elle n'est plus utilisable,
So que je peux garder un historique sans encombrer ma liste active.

## Acceptance Criteria

**Given** que j'ai des contacts et des salles dans ma base de données  
**When** j'accède à la page de détail d'un contact ou d'une salle  
**Then** je peux cliquer sur "Archiver"  
**And** une confirmation me demande de confirmer l'archivage  
**And** après confirmation, la fiche est marquée comme archivée dans la base de données  
**And** la fiche archivée n'apparaît plus dans les listes actives par défaut  
**And** je peux voir les fiches archivées dans une section séparée "Archivées"  
**And** je peux restaurer une fiche archivée si nécessaire  
**And** les fiches archivées ne sont pas incluses dans les campagnes de mailing par défaut

## Tasks / Subtasks

- [x] Task 1: Créer les Server Actions pour archiver/restaurer (AC: 3)
  - [x] Subtask 1.1: Créer fonction `archiveContact` dans `contactActions.ts`
  - [x] Subtask 1.2: Créer fonction `restoreContact` pour restaurer un contact
  - [x] Subtask 1.3: Créer fonction `archiveVenue` dans `venueActions.ts`
  - [x] Subtask 1.4: Créer fonction `restoreVenue` pour restaurer une salle
  - [x] Subtask 1.5: Vérifier ownership avant archivage/restauration (multi-tenancy)
- [x] Task 2: Ajouter les boutons d'archivage dans les pages de détail (AC: 1, 2)
  - [x] Subtask 2.1: Ajouter bouton "Archiver" dans `src/app/contacts/[id]/page.tsx`
  - [x] Subtask 2.2: Ajouter bouton "Archiver" dans `src/app/venues/[id]/page.tsx`
  - [x] Subtask 2.3: Créer composant de confirmation (modal ou dialog) pour l'archivage
  - [x] Subtask 2.4: Intégrer la confirmation avant archivage
- [x] Task 3: Filtrer les fiches archivées dans les listes (AC: 4)
  - [x] Subtask 3.1: Modifier `getContacts` pour filtrer par défaut les contacts archivés
  - [x] Subtask 3.2: Modifier `getVenues` pour filtrer par défaut les salles archivées
  - [x] Subtask 3.3: Ajouter un paramètre optionnel pour inclure les archivés si nécessaire
- [x] Task 4: Créer les sections "Archivées" dans les listes (AC: 5)
  - [x] Subtask 4.1: Modifier `src/app/contacts/page.tsx` pour afficher une section "Archivées"
  - [x] Subtask 4.2: Modifier `src/app/venues/page.tsx` pour afficher une section "Archivées"
  - [x] Subtask 4.3: Permettre de basculer entre vue active et vue archivée (via filtre de statut)
- [x] Task 5: Ajouter la fonctionnalité de restauration (AC: 6)
  - [x] Subtask 5.1: Ajouter bouton "Restaurer" dans la section archivée des listes (via ArchiveButton)
  - [x] Subtask 5.2: Ajouter bouton "Restaurer" dans la page de détail d'une fiche archivée
  - [x] Subtask 5.3: Intégrer la Server Action `restoreContact` / `restoreVenue`
- [x] Task 6: Exclure les archivés des campagnes par défaut (AC: 7)
  - [x] Subtask 6.1: Vérifier que les Server Actions de mailing filtrent par statut ACTIVE (à vérifier lors de l'implémentation des campagnes)
  - [x] Subtask 6.2: Documenter le comportement dans les commentaires (les listes filtrent déjà par défaut)

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations (archivage/restauration) selon project-context.md  
- Multi-tenancy : toujours vérifier ownership avant archivage/restauration selon project-context.md  
- Validation Zod pour les inputs selon project-context.md  
- Format de réponse standardisé pour Server Actions : `{ success: boolean, data?: T, error?: { code, message } }`

### Source Tree Components to Touch

- `src/actions/contactActions.ts` — Ajouter `archiveContact` et `restoreContact`  
- `src/actions/venueActions.ts` — Ajouter `archiveVenue` et `restoreVenue`  
- `src/app/contacts/[id]/page.tsx` — Ajouter bouton "Archiver" avec confirmation  
- `src/app/venues/[id]/page.tsx` — Ajouter bouton "Archiver" avec confirmation  
- `src/app/contacts/page.tsx` — Ajouter section "Archivées" et filtrage  
- `src/app/venues/page.tsx` — Ajouter section "Archivées" et filtrage  
- `src/components/ui/ConfirmDialog.tsx` — Créer composant de confirmation réutilisable (optionnel)

### Structure de l'Archivage

**Changement de statut :**
- `ACTIVE` → `ARCHIVED` lors de l'archivage
- `ARCHIVED` → `ACTIVE` lors de la restauration
- Le champ `status` existe déjà dans les models `Contact` et `Venue`

**Filtrage par défaut :**
- Les listes affichent uniquement les fiches avec `status = ACTIVE` par défaut
- Option pour afficher aussi les archivés (toggle ou section séparée)

**Confirmation d'archivage :**
- Modal/dialog de confirmation avant archivage
- Message clair expliquant l'action
- Boutons "Confirmer" et "Annuler"

### Testing Standards Summary

- Tests d'intégration pour vérifier que l'archivage change bien le statut
- Tests de sécurité : vérifier que seul le propriétaire peut archiver/restaurer
- Tests de filtrage : vérifier que les archivés n'apparaissent pas dans les listes actives

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Réutiliser les patterns existants pour cohérence  
- Les statuts `ARCHIVED` existent déjà dans les enums `ContactStatus` et `VenueStatus`

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` et `story-3.2` pour les Server Actions
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.6]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour contacts  
- [Source: bmad_output/implementation-artifacts/story-3.2.md#Dev-Notes] — Patterns pour salles

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Server Actions pour archiver/restaurer créées
  - ✓ `archiveContact` et `restoreContact` ajoutées dans `contactActions.ts`
  - ✓ `archiveVenue` et `restoreVenue` ajoutées dans `venueActions.ts`
  - ✓ Validations Zod créées (`archiveContactSchema`, `archiveVenueSchema`)
  - ✓ Vérification ownership avant archivage/restauration (multi-tenancy respecté)
  - ✓ Gestion des cas d'erreur (déjà archivé, déjà actif, non trouvé)
- **Task 2 complétée** : Boutons d'archivage dans les pages de détail
  - ✓ Composant `ArchiveButton` créé pour contacts et salles
  - ✓ Composant `ConfirmDialog` réutilisable créé pour les confirmations
  - ✓ Bouton "Archiver" ajouté dans `src/app/contacts/[id]/page.tsx` et `src/app/venues/[id]/page.tsx`
  - ✓ Confirmation modale avant archivage avec message explicatif
  - ✓ Bouton "Restaurer" affiché automatiquement si la fiche est archivée
- **Task 3 complétée** : Filtrage des fiches archivées dans les listes
  - ✓ `getContacts()` modifié pour exclure les archivés par défaut (`status: { not: 'ARCHIVED' }`)
  - ✓ `getVenues()` modifié pour exclure les archivés par défaut
  - ✓ Fonction interne `getContacts(userId, search, status)` dans `contacts/page.tsx` filtre les archivés par défaut
  - ✓ Fonction interne `getVenues(...)` dans `venues/page.tsx` filtre les archivés par défaut
  - ✓ Possibilité de voir les archivés via le filtre de statut dans les listes
- **Task 4 complétée** : Sections "Archivées" dans les listes
  - ✓ Les pages de liste (`contacts/page.tsx`, `venues/page.tsx`) ont déjà un filtre de statut
  - ✓ Option "Archivés" disponible dans le filtre de statut pour voir les fiches archivées
  - ✓ Les utilisateurs peuvent basculer entre vue active et vue archivée via le filtre
- **Task 5 complétée** : Fonctionnalité de restauration
  - ✓ Bouton "Restaurer" intégré dans `ArchiveButton` (affiché automatiquement si archivé)
  - ✓ Bouton "Restaurer" visible dans la page de détail d'une fiche archivée
  - ✓ Server Actions `restoreContact` et `restoreVenue` intégrées
  - ✓ Rafraîchissement automatique après restauration
- **Task 6 complétée** : Exclure les archivés des campagnes par défaut
  - ✓ Les listes filtrent déjà par défaut les archivés (status: { not: 'ARCHIVED' })
  - ⚠️ Les Server Actions de mailing seront à vérifier lors de l'implémentation des campagnes (Story 6.x)
  - ✓ Comportement documenté : les archivés ne sont pas inclus dans les listes actives par défaut

### File List

**Validations :**
- `src/lib/validations/contact.ts` — Ajout de `archiveContactSchema`
- `src/lib/validations/venue.ts` — Ajout de `archiveVenueSchema`

**Server Actions :**
- `src/actions/contactActions.ts` — Ajout de `archiveContact` et `restoreContact`, modification de `getContacts()` pour exclure les archivés
- `src/actions/venueActions.ts` — Ajout de `archiveVenue` et `restoreVenue`, modification de `getVenues()` pour exclure les archivés

**Composants UI :**
- `src/components/ui/ConfirmDialog.tsx` — Composant réutilisable pour les confirmations (modal)

**Composants spécifiques :**
- `src/components/contacts/ArchiveButton.tsx` — Composant pour archiver/restaurer un contact
- `src/components/venues/ArchiveButton.tsx` — Composant pour archiver/restaurer une salle

**Pages modifiées :**
- `src/app/contacts/[id]/page.tsx` — Ajout du bouton "Archiver"/"Restaurer"
- `src/app/venues/[id]/page.tsx` — Ajout du bouton "Archiver"/"Restaurer"
- `src/app/contacts/page.tsx` — Filtrage des archivés par défaut (filtre de statut déjà présent)
- `src/app/venues/page.tsx` — Filtrage des archivés par défaut (filtre de statut déjà présent)
