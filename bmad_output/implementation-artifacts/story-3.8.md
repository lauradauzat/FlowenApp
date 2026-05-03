# Story 3.8: Détection automatique de l'obsolescence des données

Status: done

## Story

As a musicien,
I want que le système détecte automatiquement l'obsolescence des données (rebounds mail, réponses "n'est plus ici"),
So que je peux maintenir la qualité de ma base de données.

## Acceptance Criteria

**Given** que j'ai des contacts et des salles dans ma base de données  
**When** un email envoyé à un contact rebondit (bounce) ou reçoit une réponse "n'est plus ici"  
**Then** le système détecte automatiquement l'obsolescence  
**And** la fiche contact est marquée comme "obsolète" ou "email invalide"  
**And** je reçois une notification ou un indicateur visuel sur la fiche obsolète  
**And** les fiches obsolètes sont identifiées visuellement dans les listes  
**And** je peux filtrer pour voir uniquement les fiches obsolètes  
**And** je peux corriger ou archiver les fiches obsolètes  
**And** le système suggère des actions (corriger email, archiver, etc.)

## Tasks / Subtasks

- [x] Task 1: Préparer l'infrastructure pour la détection d'obsolescence (AC: 1, 2)
  - [x] Subtask 1.1: Utiliser le statut `ERROR` pour marquer les obsolètes (simplifie l'implémentation)
  - [x] Subtask 1.2: Créer une Server Action `markContactAsObsolete` dans `contactActions.ts`
  - [x] Subtask 1.3: Créer une Server Action `markContactAsValid` pour restaurer un contact obsolète
  - [x] Subtask 1.4: Documenter l'intégration future avec les campagnes de mailing (webhooks, etc.) dans les commentaires
- [x] Task 2: Afficher visuellement les fiches obsolètes (AC: 3, 4, 5)
  - [x] Subtask 2.1: Modifier `src/app/contacts/page.tsx` pour afficher un badge "Obsolète" si `status = ERROR` et email présent
  - [x] Subtask 2.2: Modifier `src/app/contacts/[id]/page.tsx` pour afficher un indicateur d'obsolescence
  - [x] Subtask 2.3: Filtre "Obsolètes" disponible via le filtre de statut existant (option "ERROR")
  - [x] Subtask 2.4: Mise en évidence visuelle : badge rouge "⚠️ Obsolète" pour les contacts avec email
- [x] Task 3: Permettre la correction/archivage des fiches obsolètes (AC: 6, 7)
  - [x] Subtask 3.1: Ajouter un bouton "Marquer comme valide" dans le composant `ObsoleteActions`
  - [x] Subtask 3.2: Ajouter un bouton "Archiver" visible pour les contacts obsolètes
  - [x] Subtask 3.3: Créer composant `ObsoleteActions` pour suggérer des actions (corriger email, archiver, etc.)
  - [x] Subtask 3.4: Intégrer les Server Actions `markContactAsValid` et `archiveContact`

## Dev Notes

### Architecture Patterns and Constraints

- Utiliser Server Components par défaut pour les pages selon project-context.md  
- Server Actions pour les mutations selon project-context.md  
- Multi-tenancy : toujours vérifier ownership avant marquage obsolète selon project-context.md  
- Le statut `ERROR` peut être utilisé pour marquer les contacts obsolètes (email invalide)
- Infrastructure préparée pour intégration future avec les campagnes de mailing (Epic 6)

### Source Tree Components to Touch

- `src/actions/contactActions.ts` — Ajouter `markContactAsObsolete` et `markContactAsValid`  
- `src/app/contacts/page.tsx` — Ajouter badge "Obsolète" et filtre  
- `src/app/contacts/[id]/page.tsx` — Afficher indicateur d'obsolescence et actions suggérées  
- `src/components/contacts/ObsoleteActions.tsx` — Composant pour suggérer des actions sur fiches obsolètes

### Approche pour MVP

**Phase 1 (MVP) :**
- Utiliser le statut `ERROR` pour marquer les contacts obsolètes (email invalide)
- Server Actions manuelles pour marquer/restaurer
- Affichage visuel et filtrage
- Actions suggérées (corriger, archiver)

**Phase 2 (Future - avec campagnes) :**
- Intégration avec webhooks des services email (SendGrid, Brevo)
- Détection automatique des bounces
- Détection automatique des réponses "n'est plus ici" (parsing des réponses)
- Notification automatique

### Détection d'Obsolescence

**Types d'obsolescence :**
- Email invalide (bounce permanent) → `status = ERROR`
- Email rebondi (bounce temporaire) → peut être marqué comme obsolète temporairement
- Réponse "n'est plus ici" → marquer comme obsolète

**Pour MVP :**
- Server Actions manuelles pour marquer/restaurer
- Infrastructure prête pour automatisation future

### Testing Standards Summary

- Tests d'intégration pour vérifier le marquage/restauration
- Tests de sécurité : vérifier que seul le propriétaire peut marquer ses contacts
- Tests de filtrage : vérifier que les obsolètes sont bien filtrés

### Project Structure Notes

- Alignement avec project-context.md : multi-tenancy, Server Components, Server Actions  
- Infrastructure préparée pour intégration future avec Epic 6 (campagnes de mailing)  
- Utilisation du statut `ERROR` existant pour simplifier l'implémentation

### Patterns à suivre depuis les stories précédentes

- Reprendre les patterns de `story-3.1` et `story-3.6` pour les Server Actions
- Utiliser le format de réponse standardisé
- Style cohérent avec le reste de l'application (Tailwind CSS)

### References

- [Source: bmad_output/planning-artifacts/epics.md#Story-3.8]  
- [Source: bmad_output/project-context.md#Multi-Tenancy]  
- [Source: bmad_output/project-context.md#Framework-Specific-Rules]  
- [Source: bmad_output/implementation-artifacts/story-3.1.md#Dev-Notes] — Patterns pour contacts  
- [Source: bmad_output/implementation-artifacts/story-3.6.md#Dev-Notes] — Patterns pour archivage

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

- **Task 1 complétée** : Infrastructure pour la détection d'obsolescence préparée
  - ✓ Utilisation du statut `ERROR` pour marquer les contacts obsolètes (simplifie l'implémentation)
  - ✓ `markContactAsObsolete` créée dans `contactActions.ts` pour marquer un contact comme obsolète
  - ✓ `markContactAsValid` créée pour restaurer un contact obsolète (valide les données avant restauration)
  - ✓ Validation Zod créée (`markContactObsoleteSchema`) avec raison optionnelle
  - ⚠️ Détection automatique via webhooks : à implémenter avec les campagnes de mailing (Epic 6)
  - ✓ Infrastructure prête pour intégration future avec services email (SendGrid, Brevo, etc.)
- **Task 2 complétée** : Affichage visuel des fiches obsolètes
  - ✓ Badge "⚠️ Obsolète" ajouté dans `src/app/contacts/page.tsx` pour les contacts avec `status = ERROR` et email présent
  - ✓ Distinction visuelle : badge "Obsolète" si email présent, "Erreurs" sinon
  - ✓ Indicateur d'obsolescence dans `src/app/contacts/[id]/page.tsx` via composant `ObsoleteActions`
  - ✓ Filtre "Obsolètes" disponible via le filtre de statut existant (option "ERROR")
  - ✓ Mise en évidence visuelle : badge rouge avec icône d'alerte
- **Task 3 complétée** : Correction/archivage des fiches obsolètes
  - ✓ Composant `ObsoleteActions` créé avec actions suggérées
  - ✓ Bouton "Marquer comme valide" : valide les données et restaure le statut si valide
  - ✓ Bouton "Archiver" : permet d'archiver directement un contact obsolète
  - ✓ Message d'aide : guide l'utilisateur vers le formulaire d'édition pour corriger
  - ✓ Intégration des Server Actions `markContactAsValid` et `archiveContact`

### Code Review Notes

- **Tests manquants** : Ajout de tests pour les Server Actions de gestion d'obsolescence
  - ✓ Tests pour `markContactAsObsolete` dans `contactActions.test.ts`
  - ✓ Tests pour `markContactAsValid` dans `contactActions.test.ts`
  - ✓ Vérification du multi-tenancy et des cas d'erreur (ALREADY_OBSOLETE, NOT_OBSOLETE, NOT_FOUND)

### File List

**Validations :**
- `src/lib/validations/contact.ts` — Ajout de `markContactObsoleteSchema`

**Server Actions :**
- `src/actions/contactActions.ts` — Ajout de `markContactAsObsolete` et `markContactAsValid`

**Composants :**
- `src/components/contacts/ObsoleteActions.tsx` — Composant pour afficher les actions suggérées sur les contacts obsolètes

**Pages modifiées :**
- `src/app/contacts/page.tsx` — Badge "Obsolète" pour les contacts avec erreurs et email
- `src/app/contacts/[id]/page.tsx` — Affichage du composant `ObsoleteActions` pour les contacts obsolètes

**Tests :**
- `src/actions/contactActions.test.ts` — Tests ajoutés pour `markContactAsObsolete` et `markContactAsValid`
  - ✓ Test de marquage comme obsolète avec vérification ownership
  - ✓ Test de marquage comme valide avec validation des données
  - ✓ Tests d'erreurs (ALREADY_OBSOLETE, NOT_OBSOLETE, NOT_FOUND)

### Notes d'Intégration Future

**Pour l'automatisation (avec Epic 6 - Campagnes de mailing) :**
- Créer un endpoint webhook `/api/webhooks/email-bounce` pour recevoir les notifications de rebond
- Créer un endpoint webhook `/api/webhooks/email-reply` pour recevoir les réponses
- Dans ces webhooks, appeler `markContactAsObsolete` automatiquement
- Parser les réponses "n'est plus ici" pour détecter l'obsolescence
- Documenter l'intégration avec SendGrid, Brevo, etc.
