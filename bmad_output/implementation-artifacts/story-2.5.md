# Story 2.5: Saisie des données personnelles dans le contexte d'un projet

Status: completed

## Story

As a musicien,
I want rentrer mes données personnelles (bio, photos, vidéos, liens réseaux sociaux) dans le contexte d'un projet musical,
So que ces informations sont disponibles pour les campagnes de booking et la communication.

## Acceptance Criteria

**Given** que j'ai créé un projet musical
**When** j'accède à la section "Données personnelles" du projet
**Then** je peux saisir ma bio artistique pour ce projet
**And** je peux uploader des photos (logo, photos promo, etc.)
**And** je peux ajouter des liens vers des vidéos (YouTube, Vimeo, etc.)
**And** je peux ajouter mes liens réseaux sociaux (Instagram, Facebook, Spotify, etc.)
**And** toutes ces données sont sauvegardées et associées au projet
**And** je peux modifier ces données à tout moment
**And** ces données sont utilisables pour les templates de mailing (FR25)

## Tasks / Subtasks

- [x] Task 1: Créer le schéma Prisma pour les données personnelles (AC: 5)
  - [x] Subtask 1.1: Créer le model `ProjectPersonalData` dans `prisma/schema.prisma`
  - [x] Subtask 1.2: Ajouter les champs : bio, photos (array), videos (array), socialLinks (JSON)
  - [x] Subtask 1.3: Relation avec Project (one-to-one)
  - [x] Subtask 1.4: Créer et appliquer la migration Prisma
- [x] Task 2: Créer les validations Zod pour les données personnelles (AC: 1-4)
  - [x] Subtask 2.1: Créer `src/lib/validations/projectPersonalData.ts` avec schémas Zod
  - [x] Subtask 2.2: Valider bio (texte), photos (URLs), videos (URLs), socialLinks (objets)
- [x] Task 3: Créer la Server Action pour sauvegarder les données personnelles (AC: 5, 6)
  - [x] Subtask 3.1: Créer fonction `updateProjectPersonalData` dans `src/actions/projectActions.ts`
  - [x] Subtask 3.2: Vérifier que le projet appartient à l'utilisateur (multi-tenancy)
  - [x] Subtask 3.3: Créer ou mettre à jour les données personnelles
- [x] Task 4: Créer la page/interface pour saisir les données personnelles (AC: 1-4, 6)
  - [x] Subtask 4.1: Ajouter une section "Données personnelles" dans la page de détail du projet
  - [x] Subtask 4.2: Créer un formulaire avec champs : bio, photos, videos, socialLinks
  - [x] Subtask 4.3: Créer un composant client pour le formulaire avec gestion d'état
  - [x] Subtask 4.4: Intégrer la Server Action pour sauvegarder
  - [x] Subtask 4.5: Afficher les données existantes si elles existent

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components pour afficher les données selon project-context.md
- Server Actions pour les mutations selon project-context.md
- Multi-tenancy : vérifier que le projet appartient à l'utilisateur
- Validation Zod avant logique métier selon project-context.md
- Pour le MVP : stocker les URLs des photos/vidéos (pas d'upload de fichiers pour l'instant)
- SocialLinks stocké en JSON avec structure : { instagram?: string, facebook?: string, spotify?: string, etc. }

### Source Tree Components to Touch

- `prisma/schema.prisma` - Ajouter model ProjectPersonalData
- `src/lib/validations/projectPersonalData.ts` - Schémas Zod
- `src/actions/projectActions.ts` - Ajouter fonction updateProjectPersonalData
- `src/app/projects/[id]/page.tsx` - Ajouter section données personnelles
- `src/components/projects/PersonalDataForm.tsx` - Formulaire pour données personnelles

### Testing Standards Summary

- Tests unitaires pour validations Zod
- Tests d'intégration pour Server Actions (mocker Prisma)
- Tests de sécurité : vérifier que seul le propriétaire peut modifier

### Project Structure Notes

- Alignement avec project-context.md : Server Components, Server Actions, multi-tenancy
- Structure JSON pour socialLinks permet flexibilité
- URLs pour photos/vidéos (upload de fichiers sera dans un epic ultérieur)

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-2.5]
- [Source: bmad_output/project-context.md#Multi-Tenancy]
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Schéma Prisma créé pour les données personnelles
  - ✓ Model `ProjectPersonalData` créé avec relation one-to-one vers Project
  - ✓ Champs : bio (Text), photos (String[]), videos (String[]), socialLinks (JSON)
  - ✓ Migration créée et appliquée (`20260118224035_add_project_personal_data`)
- **Task 2 complétée** : Validations Zod créées
  - ✓ Schéma `updateProjectPersonalDataSchema` avec validation des URLs
  - ✓ Schéma `socialLinksSchema` pour les liens réseaux sociaux (8 plateformes supportées)
  - ✓ Validation de la bio (max 5000 caractères)
- **Task 3 complétée** : Server Action créée
  - ✓ Fonction `updateProjectPersonalData` avec authentification et validation
  - ✓ Vérification multi-tenancy : seul le propriétaire peut modifier
  - ✓ Utilisation de `upsert` pour créer ou mettre à jour
  - ✓ Gestion du type JSON avec `Prisma.InputJsonValue` et `Prisma.JsonNull`
- **Task 4 complétée** : Interface de saisie créée
  - ✓ Section "Données personnelles" ajoutée dans la page de détail du projet
  - ✓ Composant `PersonalDataForm` avec gestion d'état complète
  - ✓ Formulaire avec : bio (textarea), photos (array d'URLs), videos (array d'URLs), socialLinks (8 plateformes)
  - ✓ Ajout/suppression dynamique de photos et vidéos
  - ✓ Affichage des données existantes si disponibles
  - ✓ Messages de succès et d'erreur
  - ✓ Compteur de caractères pour la bio

### File List

**Schéma Prisma :**
- `prisma/schema.prisma` - Model `ProjectPersonalData` ajouté

**Validations :**
- `src/lib/validations/projectPersonalData.ts` - Schémas Zod pour données personnelles

**Server Actions :**
- `src/actions/projectActions.ts` - Fonction `updateProjectPersonalData` ajoutée

**Composants :**
- `src/components/projects/PersonalDataForm.tsx` - Formulaire pour saisir les données personnelles

**Pages modifiées :**
- `src/app/projects/[id]/page.tsx` - Section "Données personnelles" ajoutée

**Migrations :**
- `prisma/migrations/20260118224035_add_project_personal_data/` - Migration pour table project_personal_data
