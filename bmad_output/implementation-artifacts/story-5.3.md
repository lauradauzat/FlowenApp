# Story 5.3: Personnalisation des templates selon propriétés

Status: review

## Story

As a musicien,
I want personnaliser mes templates selon les propriétés (capacité, région, style),
So que je peux adapter mes messages selon le type de salle ou de contact.

## Acceptance Criteria

**Given** que j'ai créé un template de mailing
**When** je configure la personnalisation du template
**Then** je peux définir des variantes du template selon la capacité de la salle (petite, moyenne, grande)
**And** je peux définir des variantes selon la région de la salle
**And** je peux définir des variantes selon le style musical de la salle
**And** le système sélectionne automatiquement la bonne variante lors de la génération du mail
**And** je peux prévisualiser chaque variante avec des données d'exemple
**And** si aucune variante ne correspond, le template par défaut est utilisé

## Tasks / Subtasks

- [x] Task 1: Modèle et migration (variantes)
  - [x] `MailTemplateVariant` : capacityCategory, region, style, subject, body, order
  - [x] Migration `20260123160000_add_mail_template_variants`
- [x] Task 2: Logique de sélection et catégorie capacité
  - [x] `capacityToCategory(capacity)` : petite <300, moyenne 300–999, grande ≥1000
  - [x] `selectTemplateVariant(variants, { capacity, region, style })` : variante la plus spécifique ou null
  - [x] `getExampleDataForVariant(overrides?)` pour prévisualisation
- [x] Task 3: Validations et actions CRUD variantes
  - [x] create/update/delete MailTemplateVariant, ownership via template userId
  - [x] getMailTemplate inclut les variantes ; duplicateMailTemplate copie les variantes
- [x] Task 4: UI variantes dans MailTemplateForm (mode édition)
  - [x] Section « Variantes » : liste, Ajouter, Modifier, Supprimer (avec confirmation)
  - [x] Formulaire variante : capacité (Toutes / petite / moyenne / grande), région, style, sujet, corps
  - [x] Prévisualisation par variante (intégrée Story 5.4)

## Dev Agent Record

### Completion Notes

- **Capacité** : petite <300, moyenne 300–999, grande ≥1000. `capacityToCategory` dans `templateVariables.ts`.
- **Sélection** : la variante avec le plus de critères renseignés qui matche l’emporte ; à égalité, `order` asc.
- **Duplication** : la duplication d’un template copie aussi ses variantes.

### File List

- `prisma/schema.prisma` — modèle `MailTemplateVariant`, relation `MailTemplate.variants`
- `prisma/migrations/20260123160000_add_mail_template_variants/migration.sql`
- `src/lib/utils/templateVariables.ts` — `CAPACITY_CATEGORIES`, `capacityToCategory`, `selectTemplateVariant`, `getExampleDataForVariant`, `VariantLike`
- `src/lib/validations/mailTemplate.ts` — `createMailTemplateVariantSchema`, `updateMailTemplateVariantSchema`, `deleteMailTemplateVariantSchema`
- `src/actions/mailTemplateActions.ts` — `createMailTemplateVariant`, `updateMailTemplateVariant`, `deleteMailTemplateVariant` ; `getMailTemplate` inclut variants ; `duplicateMailTemplate` copie les variantes
- `src/components/templates/MailTemplateForm.tsx` — section Variantes (liste, ajout, édition, suppression)
- `src/app/templates/[id]/edit/page.tsx` — passage de `variants` à `MailTemplateForm`
