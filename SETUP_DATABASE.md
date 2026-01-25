# Guide de Configuration de la Base de Données

Ce guide vous aide à configurer PostgreSQL et tester l'authentification.

## Option 1 : Base de données locale (PostgreSQL installé)

### Étape 1 : Vérifier que PostgreSQL est installé

```bash
# Vérifier la version
psql --version

# Si non installé sur macOS :
brew install postgresql@18
brew services start postgresql@18
```

### Étape 2 : Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Dans le terminal PostgreSQL, créer la base de données
CREATE DATABASE flowen_app;
CREATE USER flowen_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE flowen_app TO flowen_user;
\q
```

### Étape 3 : Configurer DATABASE_URL

Mettre à jour le fichier `.env` :

```env
DATABASE_URL="postgresql://flowen_user:votre_mot_de_passe_securise@localhost:5432/flowen_app?schema=public"
```

## Option 2 : Base de données cloud (Neon / Vercel Postgres)

### Étape 1 : Créer un compte Neon (gratuit)

1. Aller sur https://neon.tech
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Copier la connection string (format : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### Étape 2 : Configurer DATABASE_URL

Mettre à jour le fichier `.env` avec la connection string de Neon :

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

## Option 3 : Vercel Postgres (pour production)

1. Aller sur https://vercel.com
2. Créer un projet Vercel Postgres
3. Copier la connection string depuis le dashboard Vercel
4. Mettre à jour `.env` avec cette connection string

---

## Étapes communes (après configuration DATABASE_URL)

### Étape 1 : Vérifier la connexion

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"
npx prisma db pull
```

Si cela fonctionne, la connexion est bonne.

### Étape 2 : Créer la migration initiale

```bash
npx prisma migrate dev --name init
```

Cette commande va :
- Créer le dossier `prisma/migrations/`
- Générer les tables dans la base de données (users, accounts, sessions, verification_tokens)
- Régénérer le client Prisma

### Étape 3 : Vérifier que les tables sont créées

```bash
# Ouvrir Prisma Studio pour visualiser la base de données
npx prisma studio
```

Vous devriez voir les tables : `users`, `accounts`, `sessions`, `verification_tokens`

### Étape 4 : Générer le client Prisma (si nécessaire)

```bash
npx prisma generate
```

### Étape 5 : Configurer AUTH_SECRET

Générer un secret pour Auth.js :

```bash
# Option 1 : Avec openssl
openssl rand -base64 32

# Option 2 : Avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ajouter dans `.env` :

```env
AUTH_SECRET="votre_secret_genere_ici"
```

### Étape 6 : Tester l'authentification

1. Démarrer le serveur de développement :

```bash
npm run dev
```

2. Ouvrir http://localhost:3000
3. Vous devriez être redirigé vers `/login` (middleware)
4. Aller sur http://localhost:3000/signin
5. Créer un compte avec :
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : test123456
6. Après inscription, vous serez redirigé vers `/login`
7. Se connecter avec les mêmes identifiants
8. Vous devriez être redirigé vers `/` (page d'accueil)

### Étape 7 : Vérifier dans la base de données

```bash
npx prisma studio
```

Vérifier que :
- Un utilisateur a été créé dans la table `users`
- Une session a été créée dans la table `sessions` après connexion

---

## Dépannage

### Erreur : "Can't reach database server"

- Vérifier que PostgreSQL est démarré : `brew services list` (macOS)
- Vérifier que la DATABASE_URL est correcte
- Vérifier que le port 5432 est accessible

### Erreur : "Authentication failed"

- Vérifier le nom d'utilisateur et le mot de passe dans DATABASE_URL
- Vérifier les permissions de l'utilisateur PostgreSQL

### Erreur : "Database does not exist"

- Créer la base de données manuellement (voir Option 1, Étape 2)

### Erreur : "AUTH_SECRET is missing"

- Générer et ajouter AUTH_SECRET dans `.env`

---

## Commandes utiles

```bash
# Voir le statut des migrations
npx prisma migrate status

# Réinitialiser la base de données (ATTENTION : supprime toutes les données)
npx prisma migrate reset

# Visualiser la base de données
npx prisma studio

# Formater le schéma Prisma
npx prisma format

# Valider le schéma Prisma
npx prisma validate
```
