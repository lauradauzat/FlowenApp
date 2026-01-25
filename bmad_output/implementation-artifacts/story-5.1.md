# Story 5.1: Création et modification de templates de mailing

Status: review

## Story

As a musicien,
I want créer et modifier des templates de mailing,
So que je peux réutiliser des modèles de mails pour mes campagnes de booking.

## Acceptance Criteria

**Given** que je suis authentifié et sur la page de gestion des templates  
**When** je clique sur "Créer un nouveau template"  
**Then** un éditeur de template s'affiche avec un champ pour le sujet et un pour le corps du mail  
**And** je peux saisir le texte du template avec mise en forme de base  
**And** je peux sauvegarder le template avec un nom descriptif  
**And** le template est créé dans la base de données avec `userId` associé  
**And** je peux voir la liste de tous mes templates  
**And** je peux modifier un template existant  
**And** je peux dupliquer un template pour créer une variante  
**And** je peux supprimer un template (avec confirmation)

## Tasks / Subtasks

- [x] Task 1: Créer le modèle Prisma et la migration (AC: 4)
  - [x] Subtask 1.1: Ajouter le model `MailTemplate` dans `prisma/schema.prisma`
  - [x] Subtask 1.2: Champs : name, subject, body, userId, createdAt, updatedAt
  - [x] Subtask 1.3: Relation User et migration `20260123150000_add_mail_templates`
- [x] Task 2: Créer les validations Zod et Server Actions (AC: 3, 4, 6, 7, 8)
  - [x] Subtask 2.1: `src/lib/validations/mailTemplate.ts` : create, update, delete, duplicate
  - [x] Subtask 2.2: `src/actions/mailTemplateActions.ts` : createMailTemplate, getMailTemplates, getMailTemplate
  - [x] Subtask 2.3: updateMailTemplate, deleteMailTemplate, duplicateMailTemplate
- [x] Task 3: Créer les composants et pages (AC: 1, 2, 3, 5, 6, 8, 9)
  - [x] Subtask 3.1: `MailTemplateForm` : champs nom, sujet, corps (textarea)
  - [x] Subtask 3.2: `MailTemplateList` : liste, Modifier, Dupliquer, Supprimer (avec confirmation)
  - [x] Subtask 3.3: Page `/templates` (liste + lien Créer un template)
  - [x] Subtask 3.4: Page `/templates/new` (création)
  - [x] Subtask 3.5: Page `/templates/[id]/edit` (modification)
- [x] Task 4: Intégrer dans la navigation (AC: 1)
  - [x] Subtask 4.1: Lien "Templates" dans le Header

## Dev Agent Record

### Agent Model Used

Claude (Cursor)

### Completion Notes List

- **Task 1** : Modèle `MailTemplate` avec name, subject, body, userId. Migration créée.
- **Task 2** : Validations Zod (create, update, delete, duplicate). Server Actions : create, get (list + by id), update, delete, duplicate. Gestion NotFoundError et format `{ success, data?, error? }`.
- **Task 3** : `MailTemplateForm` (create/edit) avec nom, sujet, corps (textarea). `MailTemplateList` avec actions Modifier, Dupliquer, Supprimer (confirm). Pages `/templates`, `/templates/new`, `/templates/[id]/edit`.
- **Task 4** : Lien "Templates" ajouté dans `Header.tsx`.

### File List

- `prisma/schema.prisma` — Model MailTemplate, relation User
- `prisma/migrations/20260123150000_add_mail_templates/migration.sql`
- `src/lib/validations/mailTemplate.ts`
- `src/actions/mailTemplateActions.ts`
- `src/components/templates/MailTemplateForm.tsx`
- `src/components/templates/MailTemplateList.tsx`
- `src/app/templates/page.tsx`
- `src/app/templates/new/page.tsx`
- `src/app/templates/[id]/edit/page.tsx`
- `src/components/layout/Header.tsx` — Lien Templates
