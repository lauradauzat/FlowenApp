# Epic 8: Tableau de bord "What's Next" - Résumé

**Status**: Epic 8 complète  
**Stories couvertes**: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7

## Ce qui existait déjà

- **Page d'accueil** (`/`) : "Tableau de bord", section **Prochaines étapes** (top 5, lien vers `/next-steps`)
- **Page /next-steps** : liste des prochaines étapes (Story 8.2)
- **Actions rapides** : Créer projet, Voir projets, Prochaines étapes
- **Statistiques** : Projets actifs, Étapes à faire
- **Header** : navigation complète (Tableau de bord, Projets, Contacts, Salles, Templates, Campagnes, Dates de tournée, Connexions, Paramètres)

## Ce qui a été ajouté (Epic 8)

### Nouvelles actions (`campaignActions`)

- **getDashboardCampaigns(limit?)**  
  Campagnes `RUNNING` en priorité, puis `COMPLETED` récentes, avec stats (total, sent, failed, pending, responses). Utilisé pour la section "Campagnes en cours" du tableau de bord.

- **getRecentResponses(limit?)**  
  Dernières `CampaignResponse` de l’utilisateur (campaign, contact, venue, type, receivedAt, isDateObtained). Utilisé pour la section "Nouvelles réponses".

### Tableau de bord (`/`)

- **Bouton « Actualiser »** (8.3, 8.4) : en haut à droite ; `RefreshDashboardButton` appelle `router.refresh()` pour recharger les données.

- **Section « Mes projets »** (Story 8.1) : 3 derniers projets (nom, type), liens vers détail, « Voir tout » / « Créer un projet » si 0.

- **Ordre et hiérarchie** (Story 8.5) : (1) Prochaines étapes, (2) Nouvelles réponses, (3) Campagnes en cours ; cartes avec `shadow-sm`.

- **Section "Campagnes en cours"** (Story 8.3)  
  - Affichée si au moins une campagne RUNNING ou COMPLETED.  
  - Pour chaque campagne : nom, statut (En cours / Terminée), envois (sent/total), réponses, échecs.  
  - Lien vers la campagne et "Voir tout" vers `/campaigns`.

- **Section "Nouvelles réponses"** (Story 8.4)  
  - Affichée si au moins une réponse.  
  - Pour chaque réponse : contact, salle, type (Positif / Négatif / Neutre), campagne, date, badge "Date obtenue" si `isDateObtained`.  
  - Lien vers la campagne.

- **Actions rapides** (Story 8.6)  
  - Ajout de **Nouvelle campagne** (`/campaigns/new`) et **Voir les campagnes** (`/campaigns`).

- **Statistiques** (Story 8.7)  
  - **Campagnes en cours** : nombre de campagnes RUNNING.  
  - **Dernières réponses** : nombre de réponses récentes affichées (si > 0).

## Hors scope (optionnel)

- **« Marquer comme lue »** (8.4) : non implémenté ; les réponses restent dans le top N.

## Fichiers

- `src/actions/campaignActions.ts` : `getDashboardCampaigns`, `getRecentResponses`
- `src/app/page.tsx` : Prochaines étapes, Nouvelles réponses, Campagnes en cours ; Mes projets ; Actions rapides ; Statistiques ; `RefreshDashboardButton` ; ordre des sections et `shadow-sm` (8.5)
- `src/components/dashboard/RefreshDashboardButton.tsx` : bouton client qui appelle `router.refresh()`
