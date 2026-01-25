# Epic 5: Templates de Mailing - Résumé Complet

**Status**: Complète  
**Date**: 23 janvier 2026  
**Stories complétées**: 5.1, 5.2, 5.3, 5.4

## Vue d'ensemble

L'Epic 5 permet aux musiciens de créer et personnaliser des templates de mailing avec variables dynamiques, variantes selon capacité/région/style, et prévisualisation avant envoi. Les templates et variantes sont prêts pour la génération de mails dans les campagnes (Epic 6).

## Stories implémentées

### Story 5.1: Création et modification de templates de mailing ✅

- CRUD templates : `MailTemplate` (name, subject, body), liste, création, édition, duplication, suppression avec confirmation
- Pages : `/templates`, `/templates/new`, `/templates/[id]/edit`
- Lien « Templates » dans le Header

### Story 5.2: Utilisation de variables dynamiques dans les templates ✅

- `templateVariables.ts` : `TEMPLATE_VARIABLES` (salle, contact, projet), `replaceTemplateVariables`, `getExampleData`, `renderTemplate`
- Syntaxe `{{nom_variable}}` ; variables absentes → chaîne vide
- Panneau « Variables disponibles » par catégorie, insertion au clic dans sujet/corps (selon focus)
- Bouton « Prévisualiser » avec données d’exemple

### Story 5.3: Personnalisation des templates selon propriétés ✅

- Modèle `MailTemplateVariant` : capacityCategory (petite/moyenne/grande), region, style, subject, body, order
- `capacityToCategory(capacity)` : petite &lt;300, moyenne 300–999, grande ≥1000
- `selectTemplateVariant(variants, { capacity, region, style })` : variante la plus spécifique ; sinon template par défaut
- CRUD variantes (create/update/delete) ; `getMailTemplate` inclut les variantes ; `duplicateMailTemplate` copie les variantes
- Section « Variantes » en mode édition : liste, Ajouter, Modifier, Supprimer ; formulaire par variante (capacité, région, style, sujet, corps)

### Story 5.4: Prévisualisation d'un template avant envoi ✅

- Sélecteur de contenu : **Défaut** | **Variante …** | **Simuler une salle** (capacité, région, style)
- Rendu sujet + corps avec variables remplacées ; « Simuler une salle » utilise `selectTemplateVariant` + `getExampleDataForVariant`
- Le formulaire reste sur la page ; on peut modifier et re-prévisualiser

## Modèles Prisma

- **MailTemplate** : id, userId, name, subject, body, createdAt, updatedAt ; relation `variants`
- **MailTemplateVariant** : id, mailTemplateId, capacityCategory, region, style, subject, body, order, createdAt, updatedAt

## Fichiers principaux

| Rôle | Fichier |
|------|---------|
| Schéma / migration | `prisma/schema.prisma`, `prisma/migrations/20260123150000_add_mail_templates`, `20260123160000_add_mail_template_variants` |
| Validations | `src/lib/validations/mailTemplate.ts` |
| Actions | `src/actions/mailTemplateActions.ts` |
| Utilitaires | `src/lib/utils/templateVariables.ts` |
| UI | `src/components/templates/MailTemplateForm.tsx`, `MailTemplateList.tsx` |
| Pages | `src/app/templates/`, `templates/new`, `templates/[id]/edit` |

## Réutilisation pour Epic 6

- `replaceTemplateVariables`, `renderTemplate` : génération des mails
- `selectTemplateVariant` : choix de la variante selon venue (capacity, region, style) ; si null → subject/body du template par défaut

## Migration à appliquer

Quand la base est disponible :

```bash
npx prisma migrate deploy
```

(ou `npx prisma migrate dev` en dev.)

## Statistiques

- **Stories** : 4/4 (100 %)
- **Modèles** : 1 modèle, 1 sous-modèle (variantes)
- **Migrations** : 2 (templates, variantes)
