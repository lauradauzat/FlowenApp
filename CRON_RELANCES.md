# Guide : Cron des relances automatiques (Epic 7)

Ce guide explique comment activer le **cron** qui envoie les relances automatiques pour les campagnes (`relanceEnabled`, `status = COMPLETED`).

---

## 1. Générer un secret

Génère une valeur pour `CRON_SECRET` (une seule fois) :

```bash
openssl rand -base64 32
```

Exemple de sortie : `K7x...abc=`. Garde cette valeur de côté.

---

## 2. Configurer la variable d’environnement sur Vercel

1. Ouvre ton projet sur [vercel.com](https://vercel.com) → **Settings** → **Environment Variables**.
2. Ajoute une variable :
   - **Name** : `CRON_SECRET`
   - **Value** : la valeur générée à l’étape 1
   - **Environments** : coche **Production** (et **Preview** si tu veux tester en préview).
3. Enregistre.

> **Comportement Vercel** : dès que `CRON_SECRET` existe, Vercel l’envoie dans le header `Authorization: Bearer <CRON_SECRET>` quand il appelle ton cron. La route `/api/relances/process` vérifie ce token.

---

## 3. Vérifier `vercel.json`

Le fichier `vercel.json` à la racine du projet définit le cron :

```json
{
  "crons": [
    {
      "path": "/api/relances/process",
      "schedule": "0 8 * * *"
    }
  ]
}
```

- **path** : l’URL appelée (en GET) : `https://ton-domaine.vercel.app/api/relances/process`
- **schedule** : expression cron `0 8 * * *` = **tous les jours à 8 h 00 UTC**.

### Ajuster l’horaire

Pour changer l’heure (toujours en UTC) :

| Objectif           | Schedule     |
|-------------------|-------------|
| Tous les jours 8h UTC | `0 8 * * *` |
| Tous les jours 6h UTC | `0 6 * * *` |
| Tous les jours 18h UTC | `0 18 * * *` |
| Tous les lundis 9h UTC | `0 9 * * 1` |

Pour 9h en France (UTC+1 en hiver, UTC+2 en été) :
- Hiver : `0 8 * * *` (8h UTC = 9h Paris)
- Été : `0 7 * * *` (7h UTC = 9h Paris)

Tu peux choisir une valeur fixe (ex. `0 8 * * *`) et l’adapter une fois que tu connais le fuseau visé.

---

## 4. Déployer

Après avoir :

- ajouté `CRON_SECRET` dans les variables d’environnement Vercel,
- (optionnel) modifié `schedule` dans `vercel.json`,

redéploie le projet (push sur la branche reliée à Vercel, ou **Redeploy** depuis le dashboard).

---

## 5. Tester le cron

### a) Depuis Vercel (après déploiement)

1. **Vercel** → ton projet → **Settings** → **Crons**.
2. Tu dois voir le job avec `path` et `schedule`.
3. Les exécutions apparaissent dans les **Logs** / **Functions** au moment du trigger.

### b) À la main (GET avec `CRON_SECRET`)

Remplace `TON_CRON_SECRET` et `TON_DOMAINE` par tes valeurs :

```bash
curl -X GET "https://TON_DOMAINE.vercel.app/api/relances/process" \
  -H "Authorization: Bearer TON_CRON_SECRET"
```

Réponses possibles :

- **200** + JSON du type `{ "campaigns": 1, "sent": 3, "failed": 0, "skipped": 5 }` → succès.
- **401** → token absent ou incorrect (vérifier `CRON_SECRET`).
- **503** → `CRON_SECRET` non défini en env sur Vercel.

---

## 6. En local

Pour tester sans Vercel :

1. Dans `.env` (ou `.env.local`) :
   ```env
   CRON_SECRET=la-même-valeur-que-sur-vercel
   ```
2. Puis :
   ```bash
   curl -X GET "http://localhost:3000/api/relances/process" \
     -H "Authorization: Bearer la-même-valeur-que-sur-vercel"
   ```

---

## Récap

| Étape | Action |
|-------|--------|
| 1 | `openssl rand -base64 32` → garder la valeur |
| 2 | Vercel → **Settings** → **Environment Variables** : `CRON_SECRET` = cette valeur |
| 3 | Vérifier (ou adapter) `vercel.json` → `path` et `schedule` |
| 4 | Redéployer le projet |
| 5 | Contrôler dans **Crons** / **Logs** ou via `curl` avec `Authorization: Bearer <CRON_SECRET>` |

Si `CRON_SECRET` n’est pas défini, la route renverra **503** et le cron ne pourra pas traiter les relances.
