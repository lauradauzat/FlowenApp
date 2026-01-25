# Story 3.4: Visualisation des connexions entre contacts et salles

Status: review

## Story

As a musicien,
I want visualiser les connexions entre contacts et salles,
So que je peux comprendre rapidement la structure de mes relations.

## Acceptance Criteria

**Given** que j'ai créé des connexions entre contacts et salles  
**When** j'accède à la page de visualisation des connexions  
**Then** je peux voir un graphique ou une liste montrant les relations contacts ↔ salles  
**And** chaque salle affiche ses contacts associés  
**And** chaque contact affiche ses salles associées  
**And** je peux naviguer facilement entre contacts et salles via les connexions  
**And** la visualisation est claire et ne surcharge pas l'interface

## Tasks / Subtasks

- [x] Task 1: Créer la page de visualisation des connexions (AC: 1, 2, 3)
  - [x] Subtask 1.1: Créer `src/app/connections/page.tsx` (Server Component)
  - [x] Subtask 1.2: Récupérer toutes les salles avec leurs contacts associés
  - [x] Subtask 1.3: Récupérer tous les contacts avec leurs salles associées
  - [x] Subtask 1.4: Organiser les données pour l'affichage
- [x] Task 2: Afficher les connexions par salle (AC: 2)
  - [x] Subtask 2.1: Créer une section pour chaque salle
  - [x] Subtask 2.2: Afficher la liste des contacts associés à chaque salle
  - [x] Subtask 2.3: Afficher les informations essentielles de chaque salle (nom, région, capacité)
  - [x] Subtask 2.4: Permettre la navigation vers la page de détail de chaque salle
- [x] Task 3: Afficher les connexions par contact (AC: 3)
  - [x] Subtask 3.1: Créer une section pour chaque contact
  - [x] Subtask 3.2: Afficher la liste des salles associées à chaque contact
  - [x] Subtask 3.3: Afficher les informations essentielles de chaque contact (nom, email, rôle)
  - [x] Subtask 3.4: Permettre la navigation vers la page de détail de chaque contact
- [x] Task 4: Améliorer la navigation et l'UX (AC: 4, 5)
  - [x] Subtask 4.1: Ajouter des liens cliquables entre contacts et salles
  - [x] Subtask 4.2: Ajouter un filtre/recherche pour trouver rapidement une salle ou un contact
  - [x] Subtask 4.3: Organiser la mise en page pour éviter la surcharge visuelle
  - [x] Subtask 4.4: Ajouter des indicateurs visuels (badges, couleurs) pour clarifier les connexions

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour récupérer les données selon project-context.md  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Utiliser les Server Actions existantes (`getContactsForVenue`, `getVenuesForContact`) ou créer des fonctions utilitaires  
- Structure claire et organisée pour éviter la surcharge visuelle

### Source Tree Components to Touch

- `src/app/connections/page.tsx` — Page principale de visualisation des connexions  
- `src/components/connections/ConnectionsView.tsx` — Composant pour afficher les connexions (optionnel, peut être intégré dans la page)  
- Utiliser les Server Actions existantes de `contactVenueActions.ts`

### Structure de la Visualisation

**Option 1 (Recommandée pour MVP) : Vue en liste organisée**
- Section "Par Salle" : Liste des salles avec leurs contacts associés
- Section "Par Contact" : Liste des contacts avec leurs salles associées
- Filtre/recherche en haut pour naviguer rapidement
- Liens cliquables pour navigation bidirectionnelle

**Option 2 (Future enhancement) : Graphique visuel**
- Utiliser une librairie comme vis.js ou D3.js pour un graphique de réseau
- Nœuds pour contacts et salles, arêtes pour les connexions
- Plus complexe à implémenter et maintenir

### Testing Standards Summary

- Tests d'intégration pour vérifier que les données sont correctement récupérées
- Tests de sécurité : vérifier que seul l'utilisateur authentifié voit ses connexions
- Tests de filtrage multi-tenancy

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components  
- Réutiliser les patterns des pages existantes (contacts, venues)  
- Navigation cohérente avec le reste de l'application

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1`, `story-3.2`, et `story-3.3` pour la récupération des données
- Utiliser les Server Actions existantes pour éviter la duplication
- Style cohérent avec les autres pages (Tailwind CSS)

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.4]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/implementation-artifacts/story-3.3.md#Dev-Notes] — Patterns pour connexions

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Page de visualisation des connexions créée
  - ✓ `src/app/connections/page.tsx` créée (Server Component) avec protection `requireAuth()`
  - ✓ Server Action `getAllConnections` ajoutée dans `contactVenueActions.ts` pour récupérer toutes les données en une seule requête optimisée
  - ✓ Données organisées en deux structures : `venuesWithContacts` et `contactsWithVenues`
  - ✓ Filtrage pour ne garder que les salles/contacts qui ont des connexions
- **Task 2 complétée** : Affichage des connexions par salle
  - ✓ Section "Par Salle" avec grille responsive (md:grid-cols-2 lg:grid-cols-3)
  - ✓ Carte pour chaque salle affichant nom, région, capacité
  - ✓ Liste des contacts associés avec informations essentielles (nom, rôle)
  - ✓ Liens cliquables vers la page de détail de chaque salle et chaque contact
  - ✓ Compteur de connexions par salle
- **Task 3 complétée** : Affichage des connexions par contact
  - ✓ Section "Par Contact" avec grille responsive identique
  - ✓ Carte pour chaque contact affichant nom, email, rôle
  - ✓ Liste des salles associées avec informations essentielles (nom, région)
  - ✓ Liens cliquables vers la page de détail de chaque contact et chaque salle
  - ✓ Compteur de connexions par contact
- **Task 4 complétée** : Amélioration de la navigation et UX
  - ✓ Composant client `ConnectionsSearch` créé avec recherche en temps réel
  - ✓ Composant client `ConnectionsView` créé pour gérer le filtrage côté client
  - ✓ Filtrage intelligent : recherche dans les noms, emails, rôles, régions, styles
  - ✓ Mise en page organisée avec grille responsive pour éviter la surcharge
  - ✓ Indicateurs visuels : compteurs de connexions, badges de statut, hover effects
  - ✓ Message d'état vide si aucune connexion
  - ✓ Message de recherche vide si aucun résultat

### File List

**Server Actions :**
- `src/actions/contactVenueActions.ts` — Ajout de la fonction `getAllConnections` pour récupérer toutes les connexions en une seule requête optimisée

**Pages :**
- `src/app/connections/page.tsx` — Page principale de visualisation des connexions (Server Component)

**Composants :**
- `src/components/connections/ConnectionsView.tsx` — Composant client pour afficher et filtrer les connexions
- `src/components/connections/ConnectionsSearch.tsx` — Composant client pour la recherche/filtrage en temps réel
