# Story 4.5: Export de données vers fichier CSV

Status: review

## Story

As a musicien,
I want exporter mes données vers un fichier CSV,
So que je peux sauvegarder mes données ou les utiliser dans d'autres outils.

## Acceptance Criteria

**Given** que j'ai des contacts et/ou des salles dans ma base de données  
**When** j'accède à la page d'export et sélectionne le type de données (contacts, salles, ou les deux)  
**Then** je peux choisir les champs à exporter  
**And** je peux filtrer les données à exporter (actifs uniquement, par région, etc.)  
**And** après validation, un fichier CSV est généré et téléchargé  
**And** le format CSV est compatible avec les outils standards (Excel, Google Sheets, etc.)  
**And** toutes les données exportées respectent le format attendu  
**And** les connexions relationnelles sont préservées dans l'export si possible

## Tasks / Subtasks

- [x] Task 1: Créer un utilitaire pour générer des CSV (AC: 4, 5)
  - [x] Subtask 1.1: Créer fonction `generateCSV` dans `src/lib/utils/csvGenerator.ts`
  - [x] Subtask 1.2: Gérer l'échappement des valeurs (guillemets, virgules, retours à la ligne)
  - [x] Subtask 1.3: Générer les en-têtes depuis les données
  - [x] Subtask 1.4: Créer fonction `generateCSVBuffer` avec BOM UTF-8 pour Excel
- [x] Task 2: Créer les Server Actions pour l'export (AC: 1, 2, 3, 4, 5)
  - [x] Subtask 2.1: Créer `src/actions/exportActions.ts`
  - [x] Subtask 2.2: Créer fonction `prepareContactsExport` pour préparer les données de contacts
  - [x] Subtask 2.3: Créer fonction `prepareVenuesExport` pour préparer les données de salles
  - [x] Subtask 2.4: Gérer les filtres (statut, région, rôle)
  - [x] Subtask 2.5: Permettre de sélectionner les champs à exporter
  - [x] Subtask 2.6: Inclure les connexions relationnelles si `includeRelations` est activé
- [x] Task 3: Créer les validations Zod pour l'export (AC: 2, 3)
  - [x] Subtask 3.1: Créer `src/lib/validations/export.ts`
  - [x] Subtask 3.2: Créer schémas `exportContactsSchema` et `exportVenuesSchema`
  - [x] Subtask 3.3: Valider les filtres et les champs sélectionnés
- [x] Task 4: Créer l'API Route pour le téléchargement (AC: 3, 4)
  - [x] Subtask 4.1: Créer `src/app/api/export/csv/route.ts`
  - [x] Subtask 4.2: Gérer les paramètres de requête (type, filtres, champs, includeRelations)
  - [x] Subtask 4.3: Retourner le fichier CSV avec les headers appropriés (Content-Type, Content-Disposition)
- [x] Task 5: Créer la page et les composants d'export (AC: 1, 2, 3)
  - [x] Subtask 5.1: Créer `src/app/export/page.tsx` (Server Component)
  - [x] Subtask 5.2: Créer `src/components/export/ExportForm.tsx` pour le formulaire d'export
  - [x] Subtask 5.3: Permettre de sélectionner le type de données (contacts ou salles)
  - [x] Subtask 5.4: Permettre de choisir les champs à exporter (checkboxes)
  - [x] Subtask 5.5: Permettre de filtrer les données (statut, région pour salles, rôle pour contacts)
  - [x] Subtask 5.6: Générer et télécharger le fichier CSV via API Route

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- API Routes pour les téléchargements de fichiers selon Next.js best practices  
- Multi-tenancy : toujours filtrer par `userId` selon project-context.md  
- Validation Zod avant logique métier selon project-context.md

### Source Tree Components to Touch

- `src/lib/utils/csvGenerator.ts` — Utilitaire pour générer des CSV  
- `src/lib/validations/export.ts` — Schémas Zod pour l'export  
- `src/actions/exportActions.ts` — Server Actions pour préparer les données d'export  
- `src/app/api/export/csv/route.ts` — API Route pour télécharger le CSV  
- `src/app/export/page.tsx` — Page d'export  
- `src/components/export/ExportForm.tsx` — Formulaire d'export

### Format CSV

Le CSV généré doit :
- Utiliser la virgule comme délimiteur
- Échapper les valeurs contenant des virgules, guillemets ou retours à la ligne
- Inclure les en-têtes en première ligne
- Être compatible avec Excel, Google Sheets, etc.

### Champs exportables

**Pour les contacts :**
- firstName, lastName, email, phone, role, notes, status
- Optionnel : venues (liste des noms de salles liées)

**Pour les salles :**
- name, address, region, website, capacity, style, notes, status
- Optionnel : contacts (liste des noms de contacts liés)

### Filtres disponibles

- Statut : ACTIVE, ARCHIVED, ERROR, ou tous
- Pour les salles : région
- Pour les contacts : rôle

### Testing Standards Summary

- Tests unitaires pour le générateur CSV
- Tests d'intégration pour les API Routes
- Tests de sécurité : vérifier que seul le propriétaire peut exporter ses données

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- API Routes dans `src/app/api/` selon Next.js App Router  
- Composants dans `src/components/export/` selon architecture modulaire

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-4.4` pour la structure
- Utiliser le format de réponse standardisé
- Gestion d'erreurs avec classes d'erreur standardisées

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-4.5]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Utilitaire pour générer des CSV créé
  - ✓ Fichier `src/lib/utils/csvGenerator.ts` créé
  - ✓ `generateCSV` pour convertir un tableau d'objets en CSV avec échappement
  - ✓ `generateCSVBuffer` pour générer un Buffer avec BOM UTF-8 (compatibilité Excel)
  - ✓ Gestion de l'échappement des valeurs (virgules, guillemets, retours à la ligne)
- **Task 2 complétée** : Server Actions créées
  - ✓ Fichier `src/actions/exportActions.ts` créé
  - ✓ `prepareContactsExport` pour préparer les données de contacts avec filtres et sélection de champs
  - ✓ `prepareVenuesExport` pour préparer les données de salles avec filtres et sélection de champs
  - ✓ Support des filtres : statut, région (salles), rôle (contacts)
  - ✓ Support de la sélection de champs avec labels français
  - ✓ Inclusion optionnelle des connexions relationnelles (salles liées pour contacts, contacts liés pour salles)
- **Task 3 complétée** : Validations Zod créées
  - ✓ Fichier `src/lib/validations/export.ts` créé
  - ✓ `exportContactsSchema` et `exportVenuesSchema` pour valider les paramètres d'export
  - ✓ Validation des filtres et des champs sélectionnés
- **Task 4 complétée** : API Route créée
  - ✓ `src/app/api/export/csv/route.ts` créée (GET handler)
  - ✓ Gestion des paramètres de requête (type, fields, status, region, role, includeRelations)
  - ✓ Génération du CSV et retour avec headers appropriés (Content-Type, Content-Disposition)
  - ✓ Nom de fichier avec date pour éviter les conflits
- **Task 5 complétée** : Page et composants créés
  - ✓ `src/app/export/page.tsx` créée (Server Component) protégée par `requireAuth()`
  - ✓ `ExportForm` : formulaire complet avec sélection de type, champs, filtres
  - ✓ Sélection de champs via checkboxes avec valeurs par défaut
  - ✓ Filtres dynamiques selon le type (région pour salles, rôle pour contacts)
  - ✓ Option pour inclure les connexions relationnelles
  - ✓ Téléchargement du fichier CSV via fetch et création d'un lien de téléchargement

### File List

**Utilitaires :**
- `src/lib/utils/csvGenerator.ts` — Générateur CSV (`generateCSV`, `generateCSVBuffer`)

**Validations :**
- `src/lib/validations/export.ts` — Schémas Zod `exportContactsSchema`, `exportVenuesSchema`, `exportDataSchema`

**Server Actions :**
- `src/actions/exportActions.ts` — Server Actions `prepareContactsExport`, `prepareVenuesExport`

**API Routes :**
- `src/app/api/export/csv/route.ts` — API Route GET pour télécharger le CSV

**Composants :**
- `src/components/export/ExportForm.tsx` — Formulaire d'export avec sélection de type, champs et filtres

**Pages :**
- `src/app/export/page.tsx` — Page d'export CSV

### Notes importantes

- **Format CSV** : Compatible avec Excel et Google Sheets grâce au BOM UTF-8
- **Échappement** : Gestion correcte des valeurs contenant des virgules, guillemets ou retours à la ligne
- **Connexions relationnelles** : Incluses dans une colonne séparée (séparées par `; `) si `includeRelations` est activé
- **Filtres** : Support des filtres par statut, région (salles) et rôle (contacts)
- **Labels français** : Les en-têtes CSV sont en français pour une meilleure lisibilité
