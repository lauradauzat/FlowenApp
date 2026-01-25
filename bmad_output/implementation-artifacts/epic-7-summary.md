# Epic 7: Relances automatiques - Résumé

**Status**: Implémentation faite  
**Stories couvertes**: 7.1 (paramétrage), 7.2 (envoi auto), 7.3 (arrêt si réponse), 7.4 (classification + filtre), 7.5 (relance manuelle)

## À faire de ton côté

1. **Appliquer la migration**
   ```bash
   npx prisma migrate deploy
   ```
   (Migration: `20260123180000_add_relances_epic7`)

2. **Variables d'environnement**
   - **CRON_SECRET** (optionnel) : pour sécuriser `POST /api/relances/process`. À définir si tu configures un cron (ex. Vercel Cron) qui envoie `Authorization: Bearer <CRON_SECRET>`.

3. **Cron** (optionnel) : planifier l’appel à `POST /api/relances/process` (ex. une fois par jour). Ex. Vercel : `vercel.json` avec un cron qui appelle cette URL avec le header `Authorization: Bearer ${CRON_SECRET}`.

---

## Ce qui a été livré

### Schéma Prisma

- **Campaign** (nouveaux champs)  
  - `relanceEnabled` (Boolean, défaut false)  
  - `relanceFirstDelayDays` (Int?, délai avant 1ère relance en jours)  
  - `relanceNextDelayDays` (Int?, délai entre relances suivantes)  
  - `relanceMax` (Int?, nombre max de relances)  
  - `relanceTemplateId` (String?, FK vers MailTemplate)  
  - Relation `relanceTemplate` (optionnelle) ; `mailTemplate` renommée en relation `"MainTemplate"`  
- **MailTemplate** : `campaignsAsMain`, `campaignsAsRelance` (remplace `campaigns`)  
- **CampaignSend** : `sendOrder` (Int, défaut 0) — 0 = envoi initial, 1+ = relance  

### Validations (`updateCampaignSchema`)

- `relanceEnabled?`, `relanceFirstDelayDays?`, `relanceNextDelayDays?`, `relanceMax?`, `relanceTemplateId?.nullable()`  
- **sendManualRelancesSchema** : `campaignId`, `recipientIds[]`, `templateId?`

### Actions (`campaignActions`)

- **updateCampaign** : persiste les champs relance en DRAFT  
- **launchCampaign** : crée les `CampaignSend` avec `sendOrder: 0`  
- **getCampaign(id, filters?)**  
  - Champs relance dans la campagne  
  - Par destinataire : `hasResponse`, `numRelances`, `lastSendAt`, `lastSendOrder`, `classification` (`repondant` | `non_repondant` | `en_attente`)  
  - `filters.classification` pour filtrer les destinataires  
- **sendManualRelances** : pour des `recipientIds` (CampaignRecipient), vérifie éligibilité (pas de réponse, `numRelances < relanceMax`), rendu sujet/corps (template choisi ou relance/principal), création `CampaignSend` avec `sendOrder = numRelances + 1`, envoi et mise à jour SENT/FAILED  

### API

- **POST /api/relances/process**  
  - À appeler par un cron (ex. Vercel Cron).  
  - Auth : `Authorization: Bearer <CRON_SECRET>`.  
  - Campagnes : `relanceEnabled = true`, `status = COMPLETED`.  
  - Pour chaque destinataire : exclut si `CampaignResponse` ; `numRelances < relanceMax` ; `nextDue = lastSendAt + (numRelances === 0 ? relanceFirstDelayDays : relanceNextDelayDays)` ; si `now >= nextDue` : création `CampaignSend` (sujet/corps depuis `relanceTemplate` ou `mailTemplate`), `sendOrder = numRelances + 1`, envoi, SENT/FAILED.  

### Logique partagée

- **processRelances** (`src/lib/relances/processRelances.ts`) : logique du cron (sans auth), utilisée par la route `POST /api/relances/process`.

### UI (`CampaignDetail`)

- **DRAFT**  
  - Bloc « Paramètres de relances » :  
    - Activer les relances  
    - Délai 1ère relance (jours), Délai relances suivantes (jours), Nombre max de relances  
    - Template de relance : select (« Même que l’envoi initial » = null, ou un MailTemplate)  
  - Sauvegarde via `updateCampaign`.  

- **RUNNING / COMPLETED**  
  - **Destinataires** : liste avec badge de classification (Répondant / Non-répondant / En attente) et nb de relances.  
  - Filtre : Tous | Répondant | Non-répondant | En attente.  
  - **Relance manuelle** (si `relanceEnabled`) :  
    - Liste des destinataires éligibles (sans réponse, `numRelances < relanceMax`)  
    - Cases à cocher, choix du template (option « Par défaut » = template de relance ou envoi initial)  
    - Bouton « Envoyer la relance » → `sendManualRelances`  

### Page `campaigns/[id]`

- Récupère `getMailTemplates` et passe `mailTemplates` à `CampaignDetail` pour les selects (template de relance, relance manuelle).

---

## Fichiers principaux

- `prisma/schema.prisma` (champs relance, `sendOrder`, relations `MainTemplate` / `RelanceTemplate`)  
- `prisma/migrations/20260123180000_add_relances_epic7/migration.sql`  
- `src/lib/validations/campaign.ts` (champs relance, `sendManualRelancesSchema`)  
- `src/actions/campaignActions.ts` (updateCampaign, getCampaign+classification, launchCampaign sendOrder, sendManualRelances, `computeClassification`)  
- `src/lib/relances/processRelances.ts`  
- `src/app/api/relances/process/route.ts`  
- `src/app/campaigns/[id]/page.tsx` (getMailTemplates, `mailTemplates`)  
- `src/components/campaigns/CampaignDetail.tsx` (paramètres relances DRAFT, Destinataires + filtre, Relance manuelle)  
- `.env.example` (CRON_SECRET commenté)
