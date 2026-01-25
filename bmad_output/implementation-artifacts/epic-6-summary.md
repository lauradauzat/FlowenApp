# Epic 6: Campagnes de Booking - Résumé

**Status**: Implémentation faite, 2 actions manuelles requises (voir ci‑dessous)  
**Stories couvertes**: 6.1–6.10

## À faire de ton côté

1. **Installer la dépendance Resend**
   ```bash
   npm install
   ```
   (Le package `resend` est dans `package.json`; le build échoue tant qu’il n’est pas installé.)

2. **Appliquer la migration**
   ```bash
   npx prisma migrate deploy
   ```
   (Migration: `20260123170000_add_campaigns`)

3. **Variables d’environnement** (tu as déjà ajouté les variables Resend dans `.env.example`)  
   - `RESEND_API_KEY`  
   - `EMAIL_FROM`  
   À renseigner dans `.env` ou `.env.local` pour que l’envoi d’emails fonctionne.

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
- `POST /api/campaigns/[id]/process-send` : envoie des PENDING par lots (10), passe la campagne en COMPLETED quand il n’y a plus de PENDING.

### Pages
- `/campaigns` : liste des campagnes
- `/campaigns/new` : création (nom, template, projet) → redirection vers `/campaigns/[id]`
- `/campaigns/[id]` :  
  - **DRAFT** : filtres (région, capacité, style), “Appliquer les filtres”, liste des destinataires, prévisualisation d’un mail, “Lancer la campagne”  
  - **RUNNING** : stats, barre de progression, liste des envois, **polling** vers `process-send` tant que la campagne est RUNNING  
  - **COMPLETED** : stats, liste des envois (filtre par statut), “Réessayer” pour les échecs
- `/tour-dates` : liste des dates de tournée (getTourDates)

### Contact et Venue
- **Fiche Contact** : section “Historique des échanges” (`getExchangesForContact` + `ExchangeHistory`)
- **Fiche Venue** : section “Historique des échanges” (`getExchangesForVenue` + `ExchangeHistory`)

### Navigation
- Liens **Campagnes** et **Dates de tournée** dans le Header.

---

## À compléter plus tard (hors scope actuel)

- **Marquer une réponse comme “date obtenue”** : `updateCampaignResponse(isDateObtained: true)` + `createTourDate` — l’UI (bouton + formulaire date/projet) peut être ajoutée sur la fiche Contact/Venue ou dans le détail de campagne.
- **Saisie des réponses** : `createCampaignResponse` existe ; formulaire “Ajouter une réponse” (manuel) à brancher (p. ex. dans la détail de campagne ou sur Contact/Venue).
- **Relances** : prévues dans l’Epic 7.

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
- `src/components/campaigns/CampaignNewForm.tsx`, `CampaignDetail.tsx`, `ExchangeHistory.tsx`
