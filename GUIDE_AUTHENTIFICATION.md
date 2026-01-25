# Guide : Configuration et Test de l'Authentification

## 🎯 Objectif

Configurer la base de données PostgreSQL et tester les fonctionnalités d'inscription et de connexion.

---

## 📋 Étape 1 : Choisir une option de base de données

### Option A : Base de données locale (PostgreSQL)

**Avantages :** Gratuit, rapide, contrôle total  
**Inconvénients :** Nécessite PostgreSQL installé

#### 1.1 Installer PostgreSQL (si pas déjà installé)

```bash
# macOS avec Homebrew
brew install postgresql@18
brew services start postgresql@18

# Vérifier l'installation
psql --version
```

#### 1.2 Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Dans le terminal PostgreSQL, exécuter :
CREATE DATABASE flowen_app;
CREATE USER flowen_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE flowen_app TO flowen_user;
\q
```

#### 1.3 Configurer DATABASE_URL

Éditer le fichier `.env` et mettre à jour :

```env
DATABASE_URL="postgresql://flowen_user:votre_mot_de_passe_securise@localhost:5432/flowen_app?schema=public"
```

---

### Option B : Base de données cloud Neon (Recommandé pour débuter)

**Avantages :** Gratuit, pas d'installation, prêt en 2 minutes  
**Inconvénients :** Nécessite une connexion internet

#### 1.1 Créer un compte Neon

1. Aller sur https://neon.tech
2. Cliquer sur "Sign Up" (gratuit)
3. Créer un nouveau projet
4. **Copier la connection string** (format : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

#### 1.2 Configurer DATABASE_URL

Éditer le fichier `.env` et coller la connection string :

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

---

## 🔐 Étape 2 : Configurer AUTH_SECRET

Générer un secret pour Auth.js :

```bash
# Dans le terminal, à la racine du projet
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copier le résultat et l'ajouter dans `.env` :

```env
AUTH_SECRET="le_secret_genere_ici"
```

**Exemple généré :** `0keWTgxgVrngT2BauITGAIn2PjK2deZnEKE8poNp8ns=`

---

## 🗄️ Étape 3 : Créer les tables dans la base de données

### 3.1 Vérifier la connexion

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"
npx prisma db pull
```

Si vous voyez une erreur, vérifiez votre `DATABASE_URL` dans `.env`.

### 3.2 Créer la migration initiale

```bash
npx prisma migrate dev --name init
```

Cette commande va :
- ✅ Créer le dossier `prisma/migrations/`
- ✅ Générer les tables : `users`, `accounts`, `sessions`, `verification_tokens`
- ✅ Régénérer le client Prisma

**Résultat attendu :**
```
✔ Generated Prisma Client
✔ Applied migration `20250118_init`
```

### 3.3 Vérifier que les tables sont créées

```bash
npx prisma studio
```

Ouvrir http://localhost:5555 dans votre navigateur. Vous devriez voir les 4 tables.

---

## 🧪 Étape 4 : Tester l'authentification

### 4.1 Démarrer le serveur de développement

```bash
npm run dev
```

Le serveur démarre sur http://localhost:3000

### 4.2 Tester l'inscription

1. Ouvrir http://localhost:3000
2. Vous serez **automatiquement redirigé vers `/login`** (middleware)
3. Cliquer sur "Créer un compte" ou aller sur http://localhost:3000/signin
4. Remplir le formulaire :
   - **Nom :** Test User
   - **Email :** test@example.com
   - **Mot de passe :** test123456
5. Cliquer sur "S'inscrire"
6. Vous serez redirigé vers `/login` avec un message de succès

### 4.3 Tester la connexion

1. Sur la page `/login`, entrer :
   - **Email :** test@example.com
   - **Mot de passe :** test123456
2. Cliquer sur "Se connecter"
3. Vous serez redirigé vers `/` (page d'accueil)

### 4.4 Vérifier dans la base de données

```bash
npx prisma studio
```

Vérifier que :
- ✅ Un utilisateur existe dans la table `users` avec email `test@example.com`
- ✅ Une session existe dans la table `sessions` après connexion
- ✅ Un compte existe dans la table `accounts` (si nécessaire)

---

## ✅ Checklist de vérification

- [ ] PostgreSQL installé et démarré (si local) OU compte Neon créé
- [ ] `DATABASE_URL` configuré dans `.env`
- [ ] `AUTH_SECRET` configuré dans `.env`
- [ ] Migration Prisma exécutée avec succès (`npx prisma migrate dev`)
- [ ] Tables créées dans la base de données (vérifier avec `npx prisma studio`)
- [ ] Serveur de développement démarré (`npm run dev`)
- [ ] Inscription fonctionne (créer un compte)
- [ ] Connexion fonctionne (se connecter)
- [ ] Session créée dans la base de données (vérifier avec Prisma Studio)

---

## 🐛 Dépannage

### Erreur : "Can't reach database server"

**Solution :**
- Vérifier que PostgreSQL est démarré : `brew services list` (macOS)
- Vérifier que la `DATABASE_URL` est correcte dans `.env`
- Vérifier que le port 5432 est accessible

### Erreur : "Authentication failed"

**Solution :**
- Vérifier le nom d'utilisateur et le mot de passe dans `DATABASE_URL`
- Vérifier les permissions de l'utilisateur PostgreSQL

### Erreur : "Database does not exist"

**Solution :**
- Créer la base de données manuellement (voir Étape 1.2)

### Erreur : "AUTH_SECRET is missing"

**Solution :**
- Générer et ajouter `AUTH_SECRET` dans `.env` (voir Étape 2)

### Erreur : "Migration failed"

**Solution :**
- Vérifier que la base de données est vide ou réinitialiser : `npx prisma migrate reset`
- Vérifier que `DATABASE_URL` pointe vers la bonne base de données

---

## 📝 Commandes utiles

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

# Générer le client Prisma
npx prisma generate
```

---

## 🎉 Prochaines étapes

Une fois l'authentification testée et fonctionnelle :

1. ✅ Story 1.1 : Initialisation Next.js - **Complétée**
2. ✅ Story 1.2 : Configuration Prisma - **Complétée**
3. ✅ Story 1.3 : Configuration Auth.js - **Complétée**
4. ✅ Story 1.4 : Architecture multi-tenancy - **Complétée**
5. 🚀 **Epic 2** : Gestion de Projet Musical (prochaine étape)

---

## 💡 Astuce

Pour un développement rapide, utilisez **Neon** (option B) :
- Pas d'installation nécessaire
- Gratuit jusqu'à 0.5 GB
- Configuration en 2 minutes
- Parfait pour le développement et les tests
