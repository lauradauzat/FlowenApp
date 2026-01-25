# Story 5.2: Utilisation de variables dynamiques dans les templates

Status: review

## Story

As a musicien,
I want utiliser des variables dynamiques dans mes templates (nom, propriétés de la salle, etc.),
So que mes mails sont personnalisés automatiquement pour chaque destinataire.

## Acceptance Criteria

**Given** que je suis en train de créer ou modifier un template  
**When** je tape dans l'éditeur de template  
**Then** je peux insérer des variables dynamiques via un menu ou une syntaxe spéciale (ex: {{nom_salle}}, {{capacite}}, {{region}}, {{nom_contact}})  
**And** une liste des variables disponibles s'affiche (nom salle, capacité, région, style, nom contact, email contact, données projet, etc.)  
**And** les variables sont remplacées automatiquement lors de la génération du mail  
**And** je peux prévisualiser le template avec des données d'exemple  
**And** la syntaxe des variables est claire et documentée  
**And** si une variable n'est pas disponible pour un destinataire, elle est remplacée par une valeur par défaut ou laissée vide

## Tasks / Subtasks

- [x] Task 1: Définir les variables et la syntaxe (AC: 1, 4, 7, 8)
  - [x] `src/lib/utils/templateVariables.ts` : TEMPLATE_VARIABLES (salle, contact, projet)
  - [x] Syntaxe `{{nom_variable}}`
  - [x] `replaceTemplateVariables(text, data)` : remplacement par valeur ou chaîne vide si absente
- [x] Task 2: Liste des variables et insertion dans l’éditeur (AC: 2, 3)
  - [x] Panneau "Variables disponibles" dans MailTemplateForm, regroupé par catégorie
  - [x] Clic sur une variable → insertion de `{{key}}` dans le sujet ou le corps (selon le champ focus)
  - [x] Indication du champ cible (sujet / corps)
- [x] Task 3: Prévisualisation avec données d’exemple (AC: 5)
  - [x] `getExampleData()` et `renderTemplate(subject, body, data?)`
  - [x] Bouton "Prévisualiser" qui affiche sujet et corps avec variables remplacées
- [x] Task 4: Documentation de la syntaxe (AC: 7)
  - [x] Texte d’aide sous le corps : syntaxe `{{nom_variable}}`, comportement si variable absente

## Dev Agent Record

### Completion Notes List

- **Variables** : Salle (nom_salle, capacite, region, style, adresse, site_web), Contact (nom_contact, prenom_contact, email_contact, telephone_contact, role_contact), Projet (nom_projet, type_projet).
- **Remplacement** : `replaceTemplateVariables` et `renderTemplate` réutilisables pour la génération des mails (Story 6.1).
- **Prévisualisation** : snapshot au clic sur "Prévisualiser", données d’exemple réalistes.

### File List

- `src/lib/utils/templateVariables.ts` — TEMPLATE_VARIABLES, replaceTemplateVariables, getExampleData, renderTemplate
- `src/components/templates/MailTemplateForm.tsx` — Panneau variables, insertion au curseur, prévisualisation, aide
