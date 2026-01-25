# Guide de Test de l'Authentification

## ✅ Configuration terminée

- ✅ Base de données Neon PostgreSQL configurée
- ✅ Migration Prisma appliquée (`20260118214452_init`)
- ✅ Tables créées : `users`, `accounts`, `sessions`, `verification_tokens`
- ✅ AUTH_SECRET configuré

---

## 🧪 Tester l'authentification

### Étape 1 : Démarrer le serveur

```bash
cd "/Users/mrscapuche/Mrs Capuche/Code/FlowenApp"
npm run dev
```

Le serveur démarre sur http://localhost:3000

### Étape 2 : Tester l'inscription

1. Ouvrir http://localhost:3000 dans votre navigateur
2. Vous serez **automatiquement redirigé vers `/login`** (grâce au middleware)
3. Cliquer sur **"Créer un compte"** ou aller directement sur http://localhost:3000/signin
4. Remplir le formulaire d'inscription :
   - **Nom :** Test User
   - **Email :** test@example.com
   - **Mot de passe :** test123456 (minimum 6 caractères)
5. Cliquer sur **"S'inscrire"**
6. Vous devriez être redirigé vers `/login` avec un message de succès

### Étape 3 : Tester la connexion

1. Sur la page `/login`, entrer les identifiants :
   - **Email :** test@example.com
   - **Mot de passe :** test123456
2. Cliquer sur **"Se connecter"**
3. Vous devriez être redirigé vers `/` (page d'accueil)

### Étape 4 : Vérifier dans la base de données

Ouvrir Prisma Studio pour visualiser les données :

```bash
npx prisma studio
```

Ouvrir http://localhost:5555 dans votre navigateur.

**Vérifications à faire :**

1. **Table `users`** :
   - ✅ Un utilisateur avec email `test@example.com`
   - ✅ Nom : `Test User`

2. **Table `sessions`** :
   - ✅ Une session active après connexion
   - ✅ `user_id` correspond à l'ID de l'utilisateur créé
   - ✅ `expires` est dans le futur

3. **Table `accounts`** :
   - ✅ Un compte créé (si nécessaire pour Credentials provider)

---

## 🔍 Tests supplémentaires

### Test 1 : Protection des routes

1. Se déconnecter (si connecté)
2. Essayer d'accéder à http://localhost:3000
3. ✅ Vous devriez être redirigé vers `/login`

### Test 2 : Redirection après connexion

1. Essayer d'accéder à http://localhost:3000 sans être connecté
2. Vous êtes redirigé vers `/login?callbackUrl=/`
3. Se connecter
4. ✅ Vous devriez être redirigé vers `/` (callbackUrl)

### Test 3 : Connexion avec mauvais identifiants

1. Sur `/login`, entrer un email qui n'existe pas
2. ✅ Un message d'erreur devrait s'afficher : "Email ou mot de passe incorrect"

### Test 4 : Inscription avec email existant

1. Essayer de créer un compte avec `test@example.com` (déjà utilisé)
2. ✅ Un message d'erreur devrait s'afficher : "Cet email est déjà utilisé"

---

## ✅ Checklist de vérification

- [ ] Serveur de développement démarré (`npm run dev`)
- [ ] Redirection automatique vers `/login` si non authentifié
- [ ] Inscription fonctionne (créer un compte)
- [ ] Connexion fonctionne (se connecter)
- [ ] Redirection vers `/` après connexion
- [ ] Utilisateur créé dans la table `users` (vérifier avec Prisma Studio)
- [ ] Session créée dans la table `sessions` (vérifier avec Prisma Studio)
- [ ] Protection des routes fonctionne (middleware)

---

## 🎉 Résultat attendu

Si tous les tests passent, vous avez :

✅ **Story 1.1** : Initialisation Next.js - **Complétée**  
✅ **Story 1.2** : Configuration Prisma - **Complétée**  
✅ **Story 1.3** : Configuration Auth.js - **Complétée**  
✅ **Story 1.4** : Architecture multi-tenancy - **Complétée**  

**Epic 1 terminé !** 🚀

---

## 🚀 Prochaines étapes

Une fois l'authentification testée et fonctionnelle, vous pouvez passer à :

**Epic 2 : Gestion de Projet Musical**
- Story 2.1 : Création de projet musical avec structure préconstruite
- Story 2.2 : Visualisation de l'état des projets musicaux
- Etc.

---

## 💡 Commandes utiles

```bash
# Visualiser la base de données
npx prisma studio

# Voir le statut des migrations
npx prisma migrate status

# Réinitialiser la base de données (ATTENTION : supprime toutes les données)
npx prisma migrate reset

# Générer le client Prisma
npx prisma generate
```
