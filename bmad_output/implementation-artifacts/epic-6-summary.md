# Epic 6: Campagnes de Booking - Résumé

**Status**: Epic 6 complète. Actions de setup requises (voir ci‑dessous)  
**Stories couvertes**: 6.1–6.10

## À faire de ton côté

1. **Installer la dépendance Resend**
   ```bash
   npm install
   ```
   (Le package `resend` est dans `package.json`; le build échoue tant qu'il n'est pas installé.)

2. **Appliquer la migration**
   ```bash
   npx prisma migrate deploy
   ```
   (Migration: `20260123170000_add_campaigns`)

3. **Variables d'environnement** (tu as déjà ajouté les variables Resend dans `.env.example`)  
   - `RESEND_API_KEY`  
   - `EMAIL_FROM`  
   À renseigner dans `.env` ou `.env.local` pour que l'envoi d'emails fonctionne.

---

## Ce qui a été livré

### Modèles Prisma
- **Campaign** : name, mailTemplateId, projectId?, status (DRAFT, RUNNING, COMPLETED, PAUSED)
- **CampaignRecipient** : (campaign, contact, venue) — 1 mail par (contact, salle)
- **CampaignSend** : sujet/corps rendus, statut (PENDING, SENT, FAILED), sentAt, errorMessage
- **CampaignResponse** : type (POSITIVE, NEGATIVE, NEUTRAL), content, receivedAt, isDateObtained
- **TourDate** : projectId, campaignId, contactId, venueId, date, notes

### Services et logique
- **emailService** : envoi via Resend (`RESEND_API_KEY`, `EMAIL_FROM`)
- **buildTemplateData** : contact + venue + projet → données pour `replaceTemplateVariables`
- **Génération des mails** : variante de template via `selectTemplateVariant` (capacité, région, style) + `renderTemplate`

### Actions (campaignActions)
- getCampaigns, getCampaign (avec stats), createCampaign, updateCampaign, deleteCampaign
- getCampaignFilterOptions (regions, styles depuis les salles)
- computeRecipientsFromFilters, setRecipients, setRecipientsFromFilters
- launchCampaign (création des CampaignSend PENDING + passage en RUNNING)
- previewRenderedMail
- getCampaignSends, retryCampaignSend
- createCampaignResponse, updateCampaignResponse
- getResponsesForContact, getResponsesForVenue
- getExchangesForContact, getExchangesForVenue (envois + réponses, triés par date)
- createTourDate, getTourDates, deleteTourDate

### API
- `POST /api/campaigns/[id]/process-send` : envoie des PENDING par lots (10), passe la campagne en COMPLETED quand il n'y a plus de PENDING.

### Pages
- `/campaigns` : liste des campagnes
- `/campaigns/new` : création (nom, template, projet) → redirection vers `/campaigns/[id]`
- `/campaigns/[id]` :  
  - **DRAFT** : filtres (région, capacité, style), "Appliquer les filtres", liste des destinataires, prévisualisation d'un mail, "Lancer la campagne"  
  - **RUNNING** : stats, barre de progression, liste des envois, **polling** vers `process-send`, section « Ajouter une réponse » (saisie manuelle)
  - **COMPLETED** : stats, liste des envois (filtre par statut), "Réessayer" pour les échecs, section « Ajouter une réponse »
- `/tour-dates` : liste des dates de tournée (getTourDates)

### Contact et Venue
- **Fiche Contact** : section "Historique des échanges" (`getExchangesForContact` + `ExchangeHistory`). `ExchangeHistory` reçoit `projects` (`getProjectsForSelect`) ; pour chaque réponse : si `isDateObtained` → affichage « ✓ Date obtenue » ; sinon, si la réponse a `campaignId`/`contactId`/`venueId` et `projects.length > 0` → bouton **Marquer date obtenue** (`MarkDateObtainedButton` : projet, date, notes → `createTourDate` + `updateCampaignResponse({ isDateObtained: true })`).
- **Fiche Venue** : idem avec `getExchangesForVenue` et `projects`.

### Navigation
- Liens **Campagnes** et **Dates de tournée** dans le Header.

---

## Complété (finalisation Epic 6)

- **Marquer date obtenue** : `MarkDateObtainedButton` sur les réponses (fiches Contact/Venue) : sélection projet (`getProjectsForSelect`), date, notes → `createTourDate` puis `updateCampaignResponse({ isDateObtained: true })`.
- **Saisie des réponses** : formulaire « Saisir une réponse reçue » dans `CampaignDetail` (RUNNING/COMPLETED) : destinataire, type, sujet optionnel, contenu, date de réception → `createCampaignResponse`.
- **Relances** : implémentées dans l'Epic 7.

---

## Fichiers principaux

- `prisma/schema.prisma` : Campaign, CampaignRecipient, CampaignSend, CampaignResponse, TourDate
- `prisma/migrations/20260123170000_add_campaigns/`
- `src/lib/services/emailService.ts`
- `src/lib/campaigns/buildTemplateData.ts`
- `src/lib/validations/campaign.ts`
- `src/actions/campaignActions.ts`
- `src/app/api/campaigns/[id]/process-send/route.ts`
- `src/app/campaigns/page.tsx`, `campaigns/new/page.tsx`, `campaigns/[id]/page.tsx`
- `src/app/tour-dates/page.tsx`
- `src/components/campaigns/CampaignNewForm.tsx`, `CampaignDetail.tsx`, `ExchangeHistory.tsx`, `MarkDateObtainedButton.tsx`
- `src/actions/projectActions.ts` : `getProjectsForSelect`
