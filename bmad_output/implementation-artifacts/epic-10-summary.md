# Epic 10: Configuration et Paramétrage - Résumé

**Status**: Implémentation partielle (Stories 10.1, 10.2, 10.4 ; 10.5–10.7 partiels)  
**Stories couvertes**: 10.1 (paramètres scraping), 10.2 (relances par défaut), 10.4 (paramétrage tableau de bord)

## Modèle et migration

- **`UserSettings`** (Prisma) : 1–1 avec `User`, table `user_settings`.
  - **Relances** : `relanceFirstDelayDays`, `relanceNextDelayDays`, `relanceMax`, `relanceTemplateId`.
  - **Tableau de bord** : `dashboardLimitNextSteps`, `dashboardLimitCampaigns`, `dashboardLimitResponses`, `dashboardShowNextSteps`, `dashboardShowResponses`, `dashboardShowCampaigns`, `dashboardShowMesProjets`.
  - **Scraping (Story 10.1)** : `scrapingAutoUpdateEnabled` (Boolean), `scrapingDefaultFrequency` (`daily`|`weekly`|`monthly`|null).
- **Migrations** : `20260125220000_add_user_settings`, `20260125230000_add_scraping_to_user_settings`.

## Actions et validation

- **`src/lib/validations/userSettings.ts`** : `updateUserSettingsSchema` (objets optionnels `relance`, `dashboard`, `scraping`).
- **`src/actions/userSettingsActions.ts`** :
  - `getUserSettings()` : renvoie les réglages ou des valeurs par défaut (`toData` / `DEFAULTS`).
  - `updateUserSettings(input)` : upsert `UserSettings` pour `relance`, `dashboard` et/ou `scraping`.

## Pages et composants

- **`SettingsNav`** (`src/components/settings/SettingsNav.tsx`) : liens Scraping | Relances | Tableau de bord.
- **`/settings/scraping`** : `SettingsNav`, `ScrapingGlobalSettingsForm` (10.1), contenu scraping (sources, jobs en échec).
- **`/settings/relances`** : `SettingsNav` + `RelancesSettingsForm` (délai 1re relance, délai entre relances, nombre max, template par défaut). Données : `getUserSettings` + `getMailTemplates`.
- **`/settings/dashboard`** : `SettingsNav` + `DashboardSettingsForm` (toggles Prochaines étapes, Nouvelles réponses, Campagnes, Mes projets ; limites 1–20 pour les trois premiers). Données : `getUserSettings`.

## Intégrations

### Relances par défaut (Story 10.2)

- **`/campaigns/[id]`** : `getUserSettings()`, construction de `relanceDefaults` (firstDelayDays, nextDelayDays, max, templateId), passage à `CampaignDetail`.
- **`CampaignDetail`** : prop optionnelle `relanceDefaults`. En statut **DRAFT**, les champs relance (délai 1re, délai entre, max, template) sont préremplis avec `relanceDefaults` lorsque la campagne n’a pas encore de valeur. `useEffect` de sync utilise aussi `relanceDefaults` si la campagne est nulle.

### Tableau de bord (Story 10.4)

- **`/` (page d’accueil)** : `getUserSettings()`, puis :
  - **Limites** : `dashboardLimitNextSteps`, `dashboardLimitCampaigns`, `dashboardLimitResponses` pour `slice` / `getDashboardCampaigns(limit)`, `getRecentResponses(limit)`.
  - **Affichage** : `dashboardShowNextSteps`, `dashboardShowResponses`, `dashboardShowCampaigns`, `dashboardShowMesProjets` pour afficher ou masquer chaque section.

### Story 10.1 – Paramètres de scraping (sources, fréquence)

- **UserSettings** : `scrapingAutoUpdateEnabled` (défaut true), `scrapingDefaultFrequency` (défaut pour nouvelles sources : `daily`|`weekly`|`monthly`|null).
- **`ScrapingGlobalSettingsForm`** sur `/settings/scraping` : interrupteur « Activer les mises à jour automatiques », fréquence par défaut pour les nouvelles sources.
- **`getSourcesDueForUpdate`** et **`triggerAutoUpdates`** : si `scrapingAutoUpdateEnabled === false` pour l’utilisateur, renvoient `[]` (aucune mise à jour auto).
- **Création de source** (`/settings/scraping/new`) : le champ « Fréquence » est prérempli avec `scrapingDefaultFrequency` si défini.

## Hors scope (pour l’instant)

- **10.3** : configuration des champs des fiches contacts/salles (champs visibles, obligatoires, etc.).
- **10.5–10.7** : AJAX avancé ; déjà en place : `router.refresh()` après mutations, polling `process-send` sur la page campagne RUNNING. Pas de sync multi-onglets ni de mises à jour ciblées sans refresh.

## Fichiers principaux

| Fichier | Rôle |
|--------|------|
| `prisma/schema.prisma` | `UserSettings`, relation `User.userSettings` |
| `prisma/migrations/20260125220000_add_user_settings/migration.sql` | Création `user_settings` |
| `prisma/migrations/20260125230000_add_scraping_to_user_settings/migration.sql` | Colonnes scraping (10.1) |
| `src/lib/validations/userSettings.ts` | `updateUserSettingsSchema` |
| `src/actions/userSettingsActions.ts` | `getUserSettings`, `updateUserSettings` |
| `src/components/settings/SettingsNav.tsx` | Nav Scraping / Relances / Tableau de bord |
| `src/components/settings/RelancesSettingsForm.tsx` | Formulaire paramètres relances |
| `src/components/settings/DashboardSettingsForm.tsx` | Formulaire paramètres tableau de bord |
| `src/app/settings/relances/page.tsx` | Page paramètres relances |
| `src/app/settings/dashboard/page.tsx` | Page paramètres tableau de bord |
| `src/app/settings/scraping/page.tsx` | `SettingsNav`, `ScrapingGlobalSettingsForm`, contenu scraping |
| `src/app/settings/scraping/new/page.tsx` | `defaultFrequency` depuis UserSettings → `ScrapingSourceForm` |
| `src/components/settings/ScrapingGlobalSettingsForm.tsx` | Formulaire mise à jour auto + fréquence par défaut |
| `src/lib/services/scrapingService.ts` | `getSourcesDueForUpdate` / `triggerAutoUpdates` tiennent compte de `scrapingAutoUpdateEnabled` |
| `src/app/page.tsx` | Tableau de bord avec config `UserSettings` |
| `src/app/campaigns/[id]/page.tsx` | `getUserSettings`, `relanceDefaults` → `CampaignDetail` |
| `src/components/campaigns/CampaignDetail.tsx` | `relanceDefaults` pour préremplissage DRAFT |

## Déploiement

- Appliquer la migration : `npx prisma migrate deploy` (ou `npx prisma migrate dev` en dev).
- Aucune variable d’environnement supplémentaire pour Epic 10.
