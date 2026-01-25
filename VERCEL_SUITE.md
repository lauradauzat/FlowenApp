# Suite du déploiement Vercel

Tu as créé le projet Vercel (connecté à GitHub) et ajouté **CRON_SECRET**. Voici les étapes suivantes.

---

## 1. Ajouter les autres variables d’environnement

Dans Vercel : **ton projet** → **Settings** → **Environment Variables**.

Ajoute **toutes** ces variables (avec les valeurs de ton `.env` local, adaptées pour la prod si besoin) :

| Variable | Où la trouver | Exemple |
|----------|---------------|---------|
| **DATABASE_URL** | Ta base Neon (connexion **pooled**) | `postgresql://...@...-pooler...neon.tech/neondb?sslmode=require` |
| **AUTH_SECRET** | `npx auth secret` ou `openssl rand -base64 32` | Une longue chaîne aléatoire |
| **RESEND_API_KEY** | [resend.com](https://resend.com) → API Keys | `re_...` |
| **EMAIL_FROM** | L’expéditeur des mails | `Mrs Capuche <mrs.capuche@gmail.com>` |
| **CRON_SECRET** | Déjà fait ✅ | La valeur que tu as générée |

Coche **Production** (et **Preview** si tu veux les mêmes variables en préview).

> **DATABASE_URL_UNPOOLED** : inutile sur Vercel pour le build. Tu l’utiliseras en local pour `prisma migrate deploy` vers la prod.

---

## 2. Vérifier le build (optionnel en local)

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"
npm run build
```

Si le build passe, Vercel a toutes les chances de réussir. Le script `build` lance `prisma generate` puis `next build`.

---

## 3. Appliquer les migrations sur la base de production

Si ta **DATABASE_URL** (Neon) sur Vercel pointe vers la **même** base que en local, les migrations sont peut‑être déjà appliquées.

Sinon, une seule fois (ou à chaque nouvelle migration) :

```bash
# Avec ton .env qui pointe vers la base de PROD (ou un .env.production)
npx prisma migrate deploy
```

`DATABASE_URL` ou `DATABASE_URL_UNPOOLED` doit cibler la base Neon de prod.

---

## 4. Déclencher un déploiement

- **Automatique** : un `git push` sur la branche reliée à Vercel (souvent `main`) redéploie.
- **À la main** : Vercel → **Deployments** → **Redeploy** sur le dernier déploiement.

Après la 1ère variable ajoutée, un **Redeploy** est souvent nécessaire pour que les nouvelles variables soient prises en compte.

---

## 5. Vérifier que tout fonctionne

1. **Site** : ouvre l’URL fournie par Vercel (ex. `https://flowen-app-xxx.vercel.app`) et vérifie que l’app se charge (login, pages, etc.).
2. **Cron** : Vercel → **Settings** → **Crons** : le job `/api/relances/process` doit apparaître. Les exécutions sont visibles dans les **Logs** / **Functions** à l’heure planifiée (ex. 8h UTC).

---

## 6. En cas d’échec du build

- **« Cannot find module 'resend' »** : vérifier que `resend` est bien dans `dependencies` (pas seulement `devDependencies`) dans `package.json`. C’est déjà le cas.
- **« CRON_SECRET non configuré »** : la route cron renvoie 503 si `CRON_SECRET` n’est pas définie. Vérifier qu’elle est bien en **Production** (et **Preview** si tu testes une preview).
- **Erreur Prisma** : `prisma generate` est dans le `build` ; si la base n’est pas accessible au build, ce n’est en général pas bloquant (le client est généré sans DB). Les erreurs de connexion apparaissent au **runtime** si `DATABASE_URL` est faux.

---

## Récap

| Étape | Action |
|-------|--------|
| 1 | **Settings** → **Environment Variables** : `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` (+ `CRON_SECRET` déjà fait) |
| 2 | (Optionnel) `npm run build` en local |
| 3 | `npx prisma migrate deploy` vers la base de prod (si besoin) |
| 4 | **Redeploy** (ou push) pour prendre en compte les variables |
| 5 | Tester l’URL du projet et le cron dans **Crons** / **Logs** |
