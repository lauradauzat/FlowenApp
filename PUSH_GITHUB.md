# Pousser le projet sur GitHub (lauradauzat/FlowenApp)

Suis ces étapes **dans ton terminal** (Terminal, iTerm, etc.) en étant à la racine du projet.

---

## 1. Vérifier que `.env` n’est pas versionné

Le fichier `.gitignore` a été mis à jour pour ignorer `.env` (mots de passe, clés API). Vérifie :

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"
grep -E "^\.env" .gitignore
```

Tu dois voir `.env` et `.env*.local`. Si ce n’est pas le cas, ajoute au moins :

```
.env
.env*.local
```

dans la section « local env files » de `.gitignore`.

---

## 2. Initialiser Git et ajouter la remote

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"

# Créer le dépôt
git init
git branch -M main

# Branche le repo vide GitHub
git remote add origin https://github.com/lauradauzat/FlowenApp.git
```

---

## 3. Premier commit et push

```bash
# Tout ajouter (sauf ce qui est dans .gitignore)
git add .

# Voir ce qui sera commité (vérifier qu’il n’y a pas .env)
git status

# Premier commit
git commit -m "Initial: FlowenApp (Epics 1-7)"

# Envoyer sur GitHub (branche main)
git push -u origin main
```

À la première `git push`, GitHub peut demander une authentification (connexion ou Personal Access Token). Suis les instructions affichées.

---

## 4. Vérification

- Ouvre : https://github.com/lauradauzat/FlowenApp  
- Tu dois voir le code, `package.json`, `prisma/`, `src/`, `vercel.json`, etc.
- **Important** : le fichier `.env` ne doit **pas** apparaître dans le dépôt.

---

## 5. Ensuite : Vercel

Une fois le push fait :

1. Va sur [vercel.com](https://vercel.com) → **Add New Project**
2. **Import** le dépôt `lauradauzat/FlowenApp`
3. Vercel détecte Next.js ; ajoute les **Variables d’environnement** (comme dans `.env`) :
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `AUTH_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `CRON_SECRET` (pour le cron des relances)
4. **Deploy**

---

## En cas de problème

- **« remote origin already exists »** :  
  `git remote remove origin` puis refaire `git remote add origin https://github.com/lauradauzat/FlowenApp.git`

- **Authentification GitHub** :  
  Si le mot de passe est refusé, utilise un [Personal Access Token](https://github.com/settings/tokens) (scopes `repo`) à la place du mot de passe.

- **`.env` poussé par erreur** :  
  Il faut le retirer de l’historique et le garder dans `.gitignore` ; demande de l’aide pour cette opération si besoin.
