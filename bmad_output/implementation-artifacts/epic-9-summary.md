# Epic 9: Gestion des Erreurs et Corrections - Résumé

**Status**: Implémentation partielle (Stories 9.1, 9.2 partiel, 9.3, 9.4, 9.5)  
**Stories couvertes**: 9.1, 9.2 (déjà en place), 9.3, 9.4, 9.5

## Ce qui existait déjà

- **Campagnes** : `CampaignSend` avec `status` (PENDING, SENT, FAILED), `errorMessage` ; filtre « Échecs » ; bouton « Réessayer » (`retryCampaignSend`) ; stats avec `failed`.
- **Scraping** : `ScrapingJob` avec `status`, `errorMessage` ; `ScrapingJobStatus` affiche l’erreur pour FAILED.
- **Contacts / Salles** : `ContactErrors`, `VenueErrors` (validation) ; formulaires d’édition manuelle (9.7).

## Ce qui a été ajouté (Epic 9)

### 9.1 – Identification et signalement des erreurs de scraping

- **Section « Jobs en échec »** sur `/settings/scraping` : liste des derniers `ScrapingJob` en `FAILED` (limit 10) avec `errorMessage`, source, date. Lien « Voir la source » vers `/settings/scraping/[id]/edit`.
- Données via `getUserScrapingJobsAction({ status: 'FAILED', limit: 10 })`.

### 9.3, 9.4 – Signalement et causes des erreurs de campagne

- **`categorizeSendError`** (`src/lib/errors/campaignSendErrors.ts`) : à partir de `errorMessage`, retourne `{ type, label, suggestion }` avec des motifs (email invalide, domaine, refus, quota, timeout, SMTP, config). Types : `corrigeable`, `temporaire`, `definitif`.
- Dans **CampaignDetail**, pour chaque envoi en **FAILED** : affichage du **label** et de la **suggestion** en plus du message brut.

### 9.5 – Correction des erreurs corrigeables

- **`getCampaignSends`** : champs ajoutés `contactId`, `venueId` (depuis `campaignRecipient`).
- Dans **CampaignDetail**, pour chaque envoi en FAILED : lien **« Corriger le contact »** → `/contacts/[contactId]`, à côté de « Réessayer ».

### 9.4 – Export des erreurs

- Bouton **« Exporter les échecs (CSV) »** dans la section Envois de `CampaignDetail`, affiché lorsqu’il existe au moins un envoi FAILED.
- Export côté client : colonnes Contact, Salle, Email, Erreur, Type, Suggestion (Type et Suggestion via `categorizeSendError`). Encodage UTF-8 avec BOM.

## Hors scope (optionnel)

- **9.2** : filtre « Fiches avec erreurs » sur les listes /contacts et /venues (validation par fiche).
- **9.6** : notifications (badge global, centre de notifications, priorité).
- **9.7** : déjà couvert par l’édition manuelle dans les formulaires.

## Fichiers

- `src/lib/errors/campaignSendErrors.ts` : `categorizeSendError`
- `src/app/settings/scraping/page.tsx` : section « Jobs en échec », `getUserScrapingJobsAction({ status: 'FAILED' })`
- `src/actions/campaignActions.ts` : `getCampaignSends` avec `contactId`, `venueId`
- `src/components/campaigns/CampaignDetail.tsx` : `categorizeSendError`, lien « Corriger le contact », « Exporter les échecs (CSV) », types `Send` avec `contactId`/`venueId`
