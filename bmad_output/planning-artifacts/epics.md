---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: 
  - 'bmad_output/planning-artifacts/prd.md'
  - 'bmad_output/planning-artifacts/architecture.md'
  - 'bmad_output/planning-artifacts/ux-design-specification.md'
---

# Flowen App - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Flowen App, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: L'utilisateur peut créer un nouveau projet musical avec une structure préconstruite adaptée aux projets musicaux
FR2: L'utilisateur peut visualiser l'état de ses projets musicaux
FR3: L'utilisateur peut voir les étapes d'un projet musical intégrées dans la structure
FR4: L'utilisateur peut consulter les prochaines étapes à accomplir pour ses projets
FR5: L'utilisateur peut rentrer ses données personnelles (bio, photos, vidéos, liens réseaux sociaux) dans le contexte d'un projet musical
FR6: L'utilisateur peut visualiser la progression de ses projets musicaux
FR7: L'utilisateur peut créer et gérer des fiches de contact avec les attributs pertinents
FR8: L'utilisateur peut créer et gérer des fiches de salle avec les attributs pertinents (nom, capacité, style, région, contacts, etc.)
FR9: L'utilisateur peut établir des connexions relationnelles entre contacts et salles
FR10: L'utilisateur peut visualiser les connexions entre contacts et salles
FR11: L'utilisateur peut modifier les données d'une fiche contact
FR12: L'utilisateur peut modifier les données d'une fiche salle
FR13: L'utilisateur peut archiver une fiche contact ou salle si elle n'est plus utilisable
FR14: L'utilisateur peut identifier visuellement les fiches avec données incomplètes ou erronées
FR15: Le système peut détecter automatiquement l'obsolescence des données (rebounds mail, réponses "n'est plus ici")
FR16: Le système peut scraper automatiquement les données de salles depuis une source configurée
FR17: Le système peut scraper automatiquement les données de contacts depuis une source configurée
FR18: L'utilisateur peut configurer les sources de scraping
FR19: L'utilisateur peut importer des données depuis un fichier CSV
FR20: L'utilisateur peut exporter des données vers un fichier CSV
FR21: Le système peut se connecter à des APIs externes pour récupérer des données de salles/contacts (si disponibles)
FR22: L'utilisateur peut ajouter manuellement des données from scratch
FR23: Le système peut mettre à jour automatiquement les données scrapées
FR24: L'utilisateur peut créer et modifier des templates de mailing
FR25: L'utilisateur peut utiliser des variables dynamiques dans les templates (nom, propriétés de la salle, etc.)
FR26: L'utilisateur peut personnaliser les templates selon les propriétés (capacité, région, style)
FR27: L'utilisateur peut prévisualiser un template avant envoi
FR28: Le système peut générer automatiquement des mails personnalisés à partir des templates et des données de contacts
FR29: L'utilisateur peut sélectionner les contacts/salles cibles pour une campagne de mailing
FR30: L'utilisateur peut filtrer les contacts/salles par région, capacité, style musical
FR31: Le système peut envoyer automatiquement des campagnes de mailing de masse
FR32: L'utilisateur peut lancer une campagne de mailing
FR33: L'utilisateur peut paramétrer les relances automatiques (délais, nombre de relances)
FR34: Le système peut envoyer automatiquement des relances selon les paramètres configurés
FR35: Le système peut arrêter automatiquement les relances si une réponse est reçue
FR36: L'utilisateur peut relancer manuellement une campagne si nécessaire
FR37: Le système peut classifier automatiquement les contacts (répondant/non-répondant)
FR38: L'utilisateur peut visualiser l'état d'une campagne de mailing (envois, réponses, relances)
FR39: L'utilisateur peut voir les envois de mail effectués pour une campagne
FR40: L'utilisateur peut voir les réponses reçues associées à un contact
FR41: L'utilisateur peut voir les réponses reçues associées à une salle
FR42: L'utilisateur peut suivre les dates de tournée obtenues via les campagnes
FR43: Le système peut mettre à jour automatiquement le statut des campagnes (AJAX)
FR44: L'utilisateur peut voir l'historique des échanges avec chaque contact/salle
FR45: L'utilisateur peut visualiser un tableau de bord avec vue d'ensemble de ses projets
FR46: L'utilisateur peut voir les prochaines étapes à accomplir depuis le tableau de bord
FR47: L'utilisateur peut voir l'état des campagnes en cours depuis le tableau de bord
FR48: L'utilisateur peut voir les nouvelles réponses depuis le tableau de bord
FR49: Le système peut organiser les données dans le tableau de bord pour faciliter la prise de décision
FR50: L'utilisateur peut accéder rapidement aux différentes sections depuis le tableau de bord
FR51: Le système peut afficher les informations essentielles en un coup d'œil
FR52: Le système peut identifier et signaler les erreurs de scraping
FR53: L'utilisateur peut corriger les erreurs de scraping détectées
FR54: Le système peut signaler les erreurs lors de l'envoi de campagnes de mailing
FR55: L'utilisateur peut voir les causes des erreurs de campagne
FR56: L'utilisateur peut corriger les erreurs corrigeables (données manquantes, adresses invalides)
FR57: Le système peut notifier l'utilisateur des erreurs nécessitant son attention
FR58: L'utilisateur peut intervenir manuellement pour corriger les données quand nécessaire
FR59: L'utilisateur peut configurer les paramètres de scraping (sources, fréquence)
FR60: L'utilisateur peut configurer les paramètres de relances (délais, nombre)
FR61: L'utilisateur peut modifier les paramètres pertinents des fiches contacts/salles
FR62: L'utilisateur peut paramétrer ce qui est paramétrable dans le tableau de bord
FR63: Le système peut mettre à jour les données sans refresh complet de page (AJAX)
FR64: Le système peut mettre à jour le statut des campagnes en temps réel (AJAX)
FR65: Le système peut synchroniser les données entre différentes sections de l'application

### NonFunctional Requirements

NFR1: Scraping Reliability - Le scraping doit fonctionner de manière fiable. Si le scraping ne fonctionne pas, l'application perd son intérêt principal. Le système doit détecter et signaler les erreurs de scraping, permettre la correction manuelle des erreurs de scraping, et offrir des alternatives (import CSV, APIs, ajout manuel) si le scraping échoue.
NFR2: Data Connection Reliability - La connexion relationnelle entre les données (contacts ↔ salles) est critique et doit être fiable. La connexion relationnelle entre contacts et salles doit être maintenue de manière cohérente, les données doivent rester synchronisées entre les différentes sections de l'application, et les modifications de données doivent être propagées correctement dans toutes les sections concernées.
NFR3: CSV Import/Export - Le système doit pouvoir importer des données depuis des fichiers CSV avec format compatible avec les outils standards, exporter des données vers des fichiers CSV avec format compatible, et gérer les erreurs d'import/export de manière claire pour l'utilisateur.
NFR4: External APIs Integration - Le système doit pouvoir se connecter à des APIs externes pour récupérer des données de salles/contacts (si disponibles), les intégrations API doivent être fiables et gérer les erreurs de connexion de manière appropriée, et le système doit permettre la configuration des sources API.
NFR5: Performance - Temps de chargement acceptable si les résultats sont fiables. Les mises à jour AJAX doivent fonctionner sans bloquer l'interface utilisateur. Les actions utilisateur ne doivent pas être bloquées par des opérations en arrière-plan.
NFR6: Security - Application privée, usage personnel. Hébergement local prévu pour le MVP. À considérer plus tard si ouverture à la communauté (conformité RGPD, sécurité des données).

### Additional Requirements

**Exigences techniques de l'Architecture :**

- Starter Template : Initialisation du projet avec `create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir` (Epic 1 Story 1)
- Infrastructure et déploiement : Vercel pour hosting, Vercel Postgres (Neon) pour base de données
- Authentification : Auth.js v5 avec adapter Prisma dès le départ (même pour MVP personnel) pour éviter refactoring majeur
- Multi-tenancy : Architecture avec `userId` sur toutes les tables personnelles dès le départ
- Base de données : PostgreSQL 18.1 avec Prisma ORM v6.18.0 pour gestion des données relationnelles complexes
- Scraping asynchrone : Jobs en arrière-plan pour éviter timeouts, système de cache pour éviter re-scraping inutile
- Services backend modulaires : scrapingService, emailService, campaignService, templateService
- Server Actions pour mutations internes, API Routes pour besoins spécifiques
- Server Components par défaut, Client Components uniquement pour interactivité
- Mises à jour AJAX pour éviter refresh complets de page
- Gestion d'erreurs standardisée avec classes d'erreurs personnalisées
- Validation Zod sur toutes les entrées avant logique métier
- Monitoring : Vercel Analytics + Logs Vercel pour MVP

**Exigences UX/Design :**

- Design responsive à considérer dès le départ (support mobile navigateurs important pour usage en déplacement)
- Support navigateurs : Tous les navigateurs principaux (Chrome prioritaire, Firefox, Safari, Edge) avec support mobile navigateurs acceptable pour MVP
- Design system : Tailwind CSS + Radix UI (composants headless accessibles)
- Accessibilité : Contraste WCAG AA minimum, navigation clavier, ARIA labels appropriés
- Performance desktop-first : Optimisation pour desktop, mobile acceptable mais secondaire
- Design apaisant et professionnel : Espacement généreux, hiérarchie claire, solidité avant gadgets
- Tableau de bord "what's next" comme cœur de l'expérience utilisateur
- Dualité design : Paramétrage (complet et complexe) vs Suivi (simple et apaisant)
- Transparence sur l'automatisation : Feedback clair sur les actions automatiques sans surcharge

### FR Coverage Map

FR1: Epic 2 - Création projet musical avec structure préconstruite
FR2: Epic 2 - Visualisation état projets musicaux
FR3: Epic 2 - Visualisation étapes projet musical
FR4: Epic 2 - Consultation prochaines étapes
FR5: Epic 2 - Saisie données personnelles (bio, photos, vidéos, liens)
FR6: Epic 2 - Visualisation progression projets musicaux
FR7: Epic 3 - Création et gestion fiches contact
FR8: Epic 3 - Création et gestion fiches salle
FR9: Epic 3 - Connexions relationnelles contacts ↔ salles
FR10: Epic 3 - Visualisation connexions contacts ↔ salles
FR11: Epic 3 - Modification fiche contact
FR12: Epic 3 - Modification fiche salle
FR13: Epic 3 - Archivage fiches contact/salle
FR14: Epic 3 - Identification visuelle fiches avec erreurs
FR15: Epic 3 - Détection automatique obsolescence données
FR16: Epic 4 - Scraping automatique données salles
FR17: Epic 4 - Scraping automatique données contacts
FR18: Epic 4 - Configuration sources scraping
FR19: Epic 4 - Import données depuis CSV
FR20: Epic 4 - Export données vers CSV
FR21: Epic 4 - Connexion APIs externes pour données
FR22: Epic 4 - Ajout manuel données from scratch
FR23: Epic 4 - Mise à jour automatique données scrapées
FR24: Epic 5 - Création et modification templates mailing
FR25: Epic 5 - Variables dynamiques dans templates
FR26: Epic 5 - Personnalisation templates selon propriétés
FR27: Epic 5 - Prévisualisation template avant envoi
FR28: Epic 6 - Génération automatique mails personnalisés
FR29: Epic 6 - Sélection contacts/salles cibles campagne
FR30: Epic 6 - Filtrage contacts/salles (région, capacité, style)
FR31: Epic 6 - Envoi automatique campagnes mailing de masse
FR32: Epic 6 - Lancement campagne mailing
FR38: Epic 6 - Visualisation état campagne (envois, réponses, relances)
FR39: Epic 6 - Visualisation envois mail pour campagne
FR40: Epic 6 - Visualisation réponses associées contact
FR41: Epic 6 - Visualisation réponses associées salle
FR42: Epic 6 - Suivi dates tournée obtenues via campagnes
FR43: Epic 6 - Mise à jour automatique statut campagnes (AJAX)
FR44: Epic 6 - Historique échanges avec contact/salle
FR33: Epic 7 - Paramétrage relances automatiques
FR34: Epic 7 - Envoi automatique relances selon paramètres
FR35: Epic 7 - Arrêt automatique relances si réponse reçue
FR36: Epic 7 - Relance manuelle campagne
FR37: Epic 7 - Classification automatique contacts (répondant/non-répondant)
FR45: Epic 8 - Visualisation tableau de bord vue d'ensemble
FR46: Epic 8 - Visualisation prochaines étapes depuis tableau de bord
FR47: Epic 8 - Visualisation état campagnes en cours depuis tableau de bord
FR48: Epic 8 - Visualisation nouvelles réponses depuis tableau de bord
FR49: Epic 8 - Organisation données tableau de bord pour prise de décision
FR50: Epic 8 - Accès rapide sections depuis tableau de bord
FR51: Epic 8 - Affichage informations essentielles en un coup d'œil
FR52: Epic 9 - Identification et signalement erreurs scraping
FR53: Epic 9 - Correction erreurs scraping détectées
FR54: Epic 9 - Signalement erreurs envoi campagnes mailing
FR55: Epic 9 - Visualisation causes erreurs campagne
FR56: Epic 9 - Correction erreurs corrigeables (données manquantes, adresses invalides)
FR57: Epic 9 - Notification utilisateur erreurs nécessitant attention
FR58: Epic 9 - Intervention manuelle pour corriger données
FR59: Epic 10 - Configuration paramètres scraping (sources, fréquence)
FR60: Epic 10 - Configuration paramètres relances (délais, nombre)
FR61: Epic 10 - Modification paramètres fiches contacts/salles
FR62: Epic 10 - Paramétrage tableau de bord
FR63: Epic 10 - Mise à jour données sans refresh complet (AJAX)
FR64: Epic 10 - Mise à jour statut campagnes temps réel (AJAX)
FR65: Epic 10 - Synchronisation données entre sections application

## Epic List

### Epic 1: Setup Initial et Authentification

L'utilisateur peut initialiser le projet technique et s'authentifier pour accéder à l'application de manière sécurisée.

**FRs couverts:** Setup technique (starter template Next.js), authentification Auth.js v5, configuration base de données PostgreSQL avec Prisma, multi-tenancy avec userId.

**Valeur utilisateur:** Base technique solide permettant l'authentification sécurisée et la séparation des données par utilisateur dès le départ.

**Notes d'implémentation:** 
- Initialisation avec `create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir`
- Configuration Auth.js v5 avec adapter Prisma dès le départ (même pour MVP personnel)
- Architecture multi-tenancy avec `userId` sur toutes les tables personnelles
- Configuration Vercel Postgres (Neon) pour base de données

### Story 1.1: Initialisation du projet Next.js avec starter template

As a développeur,
I want initialiser le projet Flowen App avec le starter template Next.js officiel,
So that j'ai une base technique solide avec TypeScript, Tailwind CSS, App Router et ESLint configurés.

**Acceptance Criteria:**

**Given** que je suis prêt à démarrer le projet Flowen App
**When** j'exécute la commande `npx create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir`
**Then** le projet est créé avec la structure de dossiers `src/` configurée
**And** TypeScript est configuré avec `tsconfig.json`
**And** Tailwind CSS est installé et configuré avec `tailwind.config.ts`
**And** App Router est activé (dossier `src/app/`)
**And** ESLint est configuré avec règles Next.js
**And** le projet démarre sans erreur avec `npm run dev`

### Story 1.2: Configuration Prisma et connexion base de données PostgreSQL

As a développeur,
I want configurer Prisma ORM avec PostgreSQL,
So que je peux gérer les données de manière type-safe avec migrations déclaratives.

**Acceptance Criteria:**

**Given** que le projet Next.js est initialisé
**When** j'installe Prisma (`npm install prisma @prisma/client`) et configure la connexion
**Then** Prisma est installé avec version v6.18.0 ou compatible
**And** le fichier `prisma/schema.prisma` est créé avec provider PostgreSQL
**And** la variable d'environnement `DATABASE_URL` est configurée pour Vercel Postgres (Neon)
**And** les tables de base pour Auth.js sont définies (`users`, `accounts`, `sessions`) dans le schéma Prisma
**And** `prisma generate` génère le client Prisma sans erreur
**And** `prisma migrate dev` crée la première migration avec succès

### Story 1.3: Configuration Auth.js v5 avec adapter Prisma

As a utilisateur,
I want m'authentifier avec Auth.js v5,
So que mes données sont sécurisées et séparées par utilisateur dès le départ.

**Acceptance Criteria:**

**Given** que Prisma est configuré avec les tables Auth.js
**When** j'installe Auth.js v5 (`npm install next-auth@beta`) et configure l'adapter Prisma
**Then** Auth.js v5 est installé avec l'adapter Prisma
**And** le fichier `src/lib/auth.ts` contient la configuration Auth.js avec adapter Prisma
**And** la route API `/api/auth/[...nextauth]/route.ts` est créée et fonctionnelle
**And** au moins un provider d'authentification est configuré (ex: email/password ou OAuth)
**And** les pages de login (`/login`) et signin (`/signin`) sont créées et fonctionnelles
**And** un utilisateur peut s'inscrire et se connecter avec succès
**And** la session utilisateur est créée et stockée dans la base de données

### Story 1.4: Architecture multi-tenancy avec middleware Auth.js

As a développeur,
I want implémenter l'architecture multi-tenancy avec filtrage userId,
So que toutes les données personnelles sont automatiquement filtrées par utilisateur.

**Acceptance Criteria:**

**Given** que Auth.js est configuré et fonctionnel
**When** j'implémente le middleware Auth.js et les helpers Prisma
**Then** le fichier `src/middleware.ts` protège les routes nécessitant authentification
**And** le middleware injecte le `userId` dans toutes les requêtes authentifiées
**And** le fichier `src/lib/prisma/helpers.ts` contient des fonctions helper garantissant le filtrage par `userId`
**And** toutes les requêtes de données personnelles utilisent les helpers Prisma pour filtrer par `userId`
**And** un utilisateur ne peut accéder qu'à ses propres données
**And** la structure de base pour multi-tenancy est prête pour les epics suivants

### Epic 2: Gestion de Projet Musical

L'utilisateur peut créer et gérer ses projets musicaux avec une structure préconstruite adaptée aux besoins musicaux, visualiser l'état et la progression de ses projets, et consulter les prochaines étapes à accomplir.

**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6

**Valeur utilisateur:** L'utilisateur peut organiser ses projets musicaux dans une structure adaptée à la réalité du terrain, avec visibilité claire sur l'état et les prochaines étapes.

**Notes d'implémentation:**
- Structure préconstruite adaptée aux projets musicaux (EP, tournées, etc.)
- Données personnelles (bio, photos, vidéos, liens réseaux sociaux) dans contexte projet
- Visualisation progression et étapes intégrées

### Story 2.1: Création de projet musical avec structure préconstruite

As a musicien,
I want créer un nouveau projet musical avec une structure préconstruite adaptée aux projets musicaux,
So que je peux démarrer rapidement sans avoir à créer la structure manuellement.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de création de projet
**When** je clique sur "Créer un nouveau projet"
**Then** un formulaire de création s'affiche avec les champs essentiels (nom, type de projet, dates)
**And** je peux sélectionner un type de projet préconstruit (EP, Album, Tournée, Single, etc.)
**And** la structure d'étapes correspondant au type de projet est automatiquement créée
**And** après validation, le projet est créé dans la base de données avec `userId` associé
**And** je suis redirigé vers la page de détail du projet créé
**And** le projet apparaît dans ma liste de projets

### Story 2.2: Visualisation de l'état des projets musicaux

As a musicien,
I want visualiser l'état de mes projets musicaux,
So que je peux voir rapidement où j'en suis avec chaque projet.

**Acceptance Criteria:**

**Given** que j'ai créé au moins un projet musical
**When** j'accède à la page de liste des projets
**Then** tous mes projets sont affichés avec leurs informations essentielles (nom, type, statut, dates)
**And** chaque projet affiche son état actuel (en cours, terminé, en attente, etc.)
**And** je peux cliquer sur un projet pour accéder à sa page de détail
**And** les projets sont filtrés automatiquement par mon `userId` (multi-tenancy)
**And** je peux voir la progression globale de chaque projet (pourcentage, étapes complétées)

### Story 2.3: Visualisation des étapes d'un projet musical

As a musicien,
I want voir les étapes d'un projet musical intégrées dans la structure,
So que je comprends le cheminement complet de mon projet.

**Acceptance Criteria:**

**Given** que j'ai créé un projet musical avec structure préconstruite
**When** j'accède à la page de détail du projet
**Then** toutes les étapes du projet sont affichées dans l'ordre chronologique
**And** chaque étape affiche son statut (à faire, en cours, terminée)
**And** les étapes sont adaptées au type de projet (ex: EP = Composition, Enregistrement, Mixage, Mastering, Sortie)
**And** je peux voir les dates prévues et réelles pour chaque étape
**And** je peux marquer une étape comme complétée

### Story 2.4: Consultation des prochaines étapes à accomplir

As a musicien,
I want consulter les prochaines étapes à accomplir pour mes projets,
So que je sais exactement quoi faire ensuite sans me poser de questions.

**Acceptance Criteria:**

**Given** que j'ai plusieurs projets avec différentes étapes
**When** j'accède à la vue "Prochaines étapes" ou au tableau de bord
**Then** les prochaines étapes de tous mes projets sont listées par ordre de priorité/date
**And** chaque prochaine étape affiche le projet associé, l'étape à accomplir, et la date prévue
**And** les étapes déjà complétées ne sont pas affichées dans cette liste
**And** je peux cliquer sur une étape pour accéder directement au projet concerné
**And** les étapes sont triées par urgence (dates proches en premier)

### Story 2.5: Saisie des données personnelles dans le contexte d'un projet

As a musicien,
I want rentrer mes données personnelles (bio, photos, vidéos, liens réseaux sociaux) dans le contexte d'un projet musical,
So que ces informations sont disponibles pour les campagnes de booking et la communication.

**Acceptance Criteria:**

**Given** que j'ai créé un projet musical
**When** j'accède à la section "Données personnelles" du projet
**Then** je peux saisir ma bio artistique pour ce projet
**And** je peux uploader des photos (logo, photos promo, etc.)
**And** je peux ajouter des liens vers des vidéos (YouTube, Vimeo, etc.)
**And** je peux ajouter mes liens réseaux sociaux (Instagram, Facebook, Spotify, etc.)
**And** toutes ces données sont sauvegardées et associées au projet
**And** je peux modifier ces données à tout moment
**And** ces données sont utilisables pour les templates de mailing (FR25)

### Story 2.6: Visualisation de la progression d'un projet musical

As a musicien,
I want visualiser la progression de mes projets musicaux,
So que je peux voir visuellement où j'en suis dans chaque projet.

**Acceptance Criteria:**

**Given** que j'ai un projet avec plusieurs étapes
**When** j'accède à la page de détail du projet
**Then** une visualisation de la progression est affichée (barre de progression, timeline, ou pourcentage)
**And** la progression est calculée automatiquement selon les étapes complétées vs total
**And** je peux voir quelles étapes sont terminées, en cours, ou à venir
**And** la visualisation est mise à jour en temps réel quand je complète une étape
**And** je peux voir les dates importantes (début projet, dates d'étapes, fin prévue)

### Epic 3: Gestion des Contacts et Salles

L'utilisateur peut créer et gérer ses fiches de contact et de salle avec connexions relationnelles, identifier et corriger les erreurs, et archiver les fiches non utilisables.

**FRs couverts:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15

**Valeur utilisateur:** L'utilisateur peut gérer sa base de données de contacts et salles avec connexions relationnelles claires, et maintenir la qualité des données.

**Notes d'implémentation:**
- Connexions relationnelles many-to-many entre contacts et salles
- Identification visuelle des fiches avec données incomplètes/erronées
- Détection automatique obsolescence (rebounds mail, réponses "n'est plus ici")
- Archivage pour fiches non utilisables

### Story 3.1: Création et gestion des fiches de contact

As a musicien,
I want créer et gérer des fiches de contact avec les attributs pertinents,
So que je peux organiser mes contacts pour les campagnes de booking.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de gestion des contacts
**When** je clique sur "Créer un nouveau contact"
**Then** un formulaire s'affiche avec les champs pertinents (nom, prénom, email, téléphone, rôle, notes)
**And** je peux sauvegarder le contact avec toutes les informations
**And** le contact est créé dans la base de données avec `userId` associé
**And** je peux voir la liste de tous mes contacts avec leurs informations essentielles
**And** je peux rechercher et filtrer mes contacts
**And** chaque contact affiche son statut (actif, archivé, avec erreurs)

### Story 3.2: Création et gestion des fiches de salle

As a musicien,
I want créer et gérer des fiches de salle avec les attributs pertinents (nom, capacité, style, région, contacts),
So que je peux organiser les salles cibles pour mes campagnes de booking.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de gestion des salles
**When** je clique sur "Créer une nouvelle salle"
**Then** un formulaire s'affiche avec les champs pertinents (nom, adresse, capacité, style musical, région, site web, notes)
**And** je peux sauvegarder la salle avec toutes les informations
**And** la salle est créée dans la base de données avec `userId` associé
**And** je peux voir la liste de toutes mes salles avec leurs informations essentielles
**And** je peux rechercher et filtrer mes salles (par région, capacité, style)
**And** chaque salle affiche son statut (active, archivée, avec erreurs)

### Story 3.3: Connexions relationnelles entre contacts et salles

As a musicien,
I want établir des connexions relationnelles entre contacts et salles,
So que je comprends qui sont les contacts associés à chaque salle.

**Acceptance Criteria:**

**Given** que j'ai créé des contacts et des salles
**When** j'accède à la page de détail d'une salle
**Then** je peux voir la liste des contacts associés à cette salle
**And** je peux ajouter un contact existant à cette salle
**And** je peux créer un nouveau contact directement depuis la page de la salle
**And** la relation many-to-many est créée dans la base de données (table de jointure)
**And** quand j'accède à la page de détail d'un contact, je peux voir les salles associées
**And** les connexions sont visuellement claires et compréhensibles

### Story 3.4: Visualisation des connexions entre contacts et salles

As a musicien,
I want visualiser les connexions entre contacts et salles,
So que je peux comprendre rapidement la structure de mes relations.

**Acceptance Criteria:**

**Given** que j'ai créé des connexions entre contacts et salles
**When** j'accède à la page de visualisation des connexions
**Then** je peux voir un graphique ou une liste montrant les relations contacts ↔ salles
**And** chaque salle affiche ses contacts associés
**And** chaque contact affiche ses salles associées
**And** je peux naviguer facilement entre contacts et salles via les connexions
**And** la visualisation est claire et ne surcharge pas l'interface

### Story 3.5: Modification des fiches contact et salle

As a musicien,
I want modifier les données d'une fiche contact ou salle,
So que je peux maintenir mes données à jour.

**Acceptance Criteria:**

**Given** que j'ai créé des contacts et des salles
**When** j'accède à la page de détail d'un contact ou d'une salle
**Then** je peux cliquer sur "Modifier" pour éditer les informations
**And** le formulaire pré-rempli avec les données actuelles s'affiche
**And** je peux modifier tous les champs pertinents
**And** après sauvegarde, les modifications sont enregistrées dans la base de données
**And** les modifications sont propagées dans toutes les sections concernées (campagnes, templates, etc.)
**And** je reçois une confirmation de sauvegarde réussie

### Story 3.6: Archivage des fiches contact et salle

As a musicien,
I want archiver une fiche contact ou salle si elle n'est plus utilisable,
So que je peux garder un historique sans encombrer ma liste active.

**Acceptance Criteria:**

**Given** que j'ai des contacts et des salles dans ma base de données
**When** j'accède à la page de détail d'un contact ou d'une salle
**Then** je peux cliquer sur "Archiver"
**And** une confirmation me demande de confirmer l'archivage
**And** après confirmation, la fiche est marquée comme archivée dans la base de données
**And** la fiche archivée n'apparaît plus dans les listes actives par défaut
**And** je peux voir les fiches archivées dans une section séparée "Archivées"
**And** je peux restaurer une fiche archivée si nécessaire
**And** les fiches archivées ne sont pas incluses dans les campagnes de mailing par défaut

### Story 3.7: Identification visuelle des fiches avec erreurs

As a musicien,
I want identifier visuellement les fiches avec données incomplètes ou erronées,
So que je peux rapidement repérer les données nécessitant correction.

**Acceptance Criteria:**

**Given** que j'ai des contacts et des salles dans ma base de données
**When** une fiche a des données incomplètes (champs requis manquants) ou erronées (email invalide, etc.)
**Then** la fiche est marquée visuellement avec un badge ou une icône d'alerte
**And** le badge indique le type d'erreur (données incomplètes, email invalide, etc.)
**And** dans la liste des contacts/salles, les fiches avec erreurs sont mises en évidence
**And** je peux filtrer la liste pour voir uniquement les fiches avec erreurs
**And** quand j'accède à la fiche, les champs problématiques sont clairement identifiés
**And** je peux corriger les erreurs directement depuis la fiche

### Story 3.8: Détection automatique de l'obsolescence des données

As a musicien,
I want que le système détecte automatiquement l'obsolescence des données (rebounds mail, réponses "n'est plus ici"),
So que je peux maintenir la qualité de ma base de données.

**Acceptance Criteria:**

**Given** que j'ai des contacts et des salles dans ma base de données
**When** un email envoyé à un contact rebondit (bounce) ou reçoit une réponse "n'est plus ici"
**Then** le système détecte automatiquement l'obsolescence
**And** la fiche contact est marquée comme "obsolète" ou "email invalide"
**And** je reçois une notification ou un indicateur visuel sur la fiche obsolète
**And** les fiches obsolètes sont identifiées visuellement dans les listes
**And** je peux filtrer pour voir uniquement les fiches obsolètes
**And** je peux corriger ou archiver les fiches obsolètes
**And** le système suggère des actions (corriger email, archiver, etc.)

### Epic 4: Scraping et Import de Données

L'utilisateur peut importer des données automatiquement via scraping, APIs externes, ou manuellement via CSV ou saisie directe, avec mise à jour automatique des données scrapées.

**FRs couverts:** FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23

**Valeur utilisateur:** L'utilisateur peut peupler sa base de données de contacts et salles de manière automatisée ou manuelle, avec flexibilité sur les sources de données.

**Notes d'implémentation:**
- Scraping asynchrone avec jobs en arrière-plan (éviter timeouts)
- Système de cache pour éviter re-scraping inutile
- Import/Export CSV avec format compatible
- Connexion APIs externes si disponibles
- Ajout manuel from scratch toujours possible

### Story 4.1: Configuration des sources de scraping

As a musicien,
I want configurer les sources de scraping pour les données de salles et contacts,
So que le système sait où chercher les données automatiquement.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration du scraping
**When** j'accède à la section "Sources de scraping"
**Then** je peux voir la liste des sources disponibles (sites web, APIs, etc.)
**And** je peux activer ou désactiver chaque source
**And** je peux configurer les paramètres de chaque source (URL, sélecteurs, fréquence)
**And** je peux ajouter une nouvelle source personnalisée
**And** les configurations sont sauvegardées et associées à mon `userId`
**And** je peux tester une source avant de l'activer

### Story 4.2: Scraping automatique des données de salles

As a musicien,
I want que le système scrape automatiquement les données de salles depuis une source configurée,
So que je peux peupler ma base de données sans saisie manuelle.

**Acceptance Criteria:**

**Given** que j'ai configuré au moins une source de scraping pour les salles
**When** je lance un scraping de salles depuis la page de gestion des salles
**Then** un job de scraping asynchrone est créé (évite timeout)
**And** le système vérifie d'abord le cache pour éviter re-scraping inutile
**And** si pas de cache valide, le scraping s'exécute en arrière-plan
**And** le statut du job est visible (pending, running, completed, failed)
**And** après completion, les données scrapées sont importées dans ma base de données
**And** les salles créées sont associées à mon `userId`
**And** je reçois une notification quand le scraping est terminé
**And** je peux voir les résultats du scraping (nombre de salles trouvées, erreurs)

### Story 4.3: Scraping automatique des données de contacts

As a musicien,
I want que le système scrape automatiquement les données de contacts depuis une source configurée,
So que je peux peupler ma base de contacts sans saisie manuelle.

**Acceptance Criteria:**

**Given** que j'ai configuré au moins une source de scraping pour les contacts
**When** je lance un scraping de contacts depuis la page de gestion des contacts
**Then** un job de scraping asynchrone est créé (évite timeout)
**And** le système vérifie d'abord le cache pour éviter re-scraping inutile
**And** si pas de cache valide, le scraping s'exécute en arrière-plan
**And** le statut du job est visible (pending, running, completed, failed)
**And** après completion, les données scrapées sont importées dans ma base de données
**And** les contacts créés sont associés à mon `userId`
**And** je reçois une notification quand le scraping est terminé
**And** je peux voir les résultats du scraping (nombre de contacts trouvés, erreurs)
**And** les contacts scrapés sont automatiquement liés aux salles correspondantes si possible

### Story 4.4: Import de données depuis fichier CSV

As a musicien,
I want importer des données depuis un fichier CSV,
So que je peux utiliser mes données existantes ou des données externes.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page d'import de données
**When** je sélectionne un fichier CSV et choisis le type d'import (contacts ou salles)
**Then** le système valide le format du fichier CSV
**And** je peux mapper les colonnes du CSV aux champs de la base de données
**And** je peux prévisualiser les données avant import
**And** après validation, les données sont importées dans ma base de données
**And** les données importées sont associées à mon `userId`
**And** je reçois un rapport d'import (nombre de lignes importées, erreurs, doublons)
**And** les erreurs d'import sont clairement identifiées et reportées
**And** je peux corriger les erreurs et réimporter si nécessaire

### Story 4.5: Export de données vers fichier CSV

As a musicien,
I want exporter mes données vers un fichier CSV,
So que je peux sauvegarder mes données ou les utiliser dans d'autres outils.

**Acceptance Criteria:**

**Given** que j'ai des contacts et/ou des salles dans ma base de données
**When** j'accède à la page d'export et sélectionne le type de données (contacts, salles, ou les deux)
**Then** je peux choisir les champs à exporter
**And** je peux filtrer les données à exporter (actifs uniquement, par région, etc.)
**And** après validation, un fichier CSV est généré et téléchargé
**And** le format CSV est compatible avec les outils standards (Excel, Google Sheets, etc.)
**And** toutes les données exportées respectent le format attendu
**And** les connexions relationnelles sont préservées dans l'export si possible

### Story 4.6: Connexion aux APIs externes pour récupérer des données

As a musicien,
I want que le système se connecte à des APIs externes pour récupérer des données de salles/contacts,
So que je peux utiliser des sources de données plus fiables que le scraping.

**Acceptance Criteria:**

**Given** qu'une API externe est disponible pour les données de salles/contacts
**When** je configure la connexion à l'API (clé API, endpoint, etc.)
**Then** le système peut se connecter à l'API avec authentification
**And** je peux lancer une récupération de données depuis l'API
**And** les données récupérées sont importées dans ma base de données
**And** les erreurs de connexion API sont gérées et signalées clairement
**And** les données de l'API sont mises en cache pour éviter appels répétés
**And** les données importées sont associées à mon `userId`
**And** je peux voir l'origine des données (scraping, API, import CSV, manuel)

### Story 4.7: Ajout manuel de données from scratch

As a musicien,
I want ajouter manuellement des données from scratch,
So que je peux compléter ma base de données même sans sources automatisées.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de création de contact ou salle
**When** je remplis le formulaire de création manuelle
**Then** je peux saisir toutes les informations nécessaires
**And** la fiche est créée dans ma base de données avec `userId` associé
**And** les données manuelles sont identifiées comme telles (origine = "manuel")
**And** je peux créer des contacts et salles manuellement à tout moment
**And** les fiches créées manuellement fonctionnent exactement comme les fiches scrapées/importées

### Story 4.8: Mise à jour automatique des données scrapées

As a musicien,
I want que le système mette à jour automatiquement les données scrapées,
So que ma base de données reste à jour sans intervention manuelle.

**Acceptance Criteria:**

**Given** que j'ai des données scrapées dans ma base de données
**When** le système détecte que les données doivent être mises à jour (selon fréquence configurée)
**Then** un job de mise à jour automatique est créé
**And** le système vérifie les sources pour les mises à jour
**And** les données modifiées sont mises à jour dans ma base de données
**And** je reçois une notification des mises à jour effectuées
**And** les données obsolètes sont identifiées et signalées
**And** je peux configurer la fréquence de mise à jour automatique
**And** je peux désactiver la mise à jour automatique si nécessaire

### Epic 5: Templates de Mailing

L'utilisateur peut créer et personnaliser des templates de mailing avec variables dynamiques, personnalisation selon propriétés (capacité, région, style), et prévisualisation avant envoi.

**FRs couverts:** FR24, FR25, FR26, FR27

**Valeur utilisateur:** L'utilisateur peut créer des templates de mailing réutilisables et personnalisés pour ses campagnes de booking.

**Notes d'implémentation:**
- Variables dynamiques dans templates (nom, propriétés salle, etc.)
- Personnalisation selon propriétés (capacité, région, style musical)
- Prévisualisation avant envoi pour validation

### Story 5.1: Création et modification de templates de mailing

As a musicien,
I want créer et modifier des templates de mailing,
So que je peux réutiliser des modèles de mails pour mes campagnes de booking.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de gestion des templates
**When** je clique sur "Créer un nouveau template"
**Then** un éditeur de template s'affiche avec un champ pour le sujet et un pour le corps du mail
**And** je peux saisir le texte du template avec mise en forme de base
**And** je peux sauvegarder le template avec un nom descriptif
**And** le template est créé dans la base de données avec `userId` associé
**And** je peux voir la liste de tous mes templates
**And** je peux modifier un template existant
**And** je peux dupliquer un template pour créer une variante
**And** je peux supprimer un template (avec confirmation)

### Story 5.2: Utilisation de variables dynamiques dans les templates

As a musicien,
I want utiliser des variables dynamiques dans mes templates (nom, propriétés de la salle, etc.),
So que mes mails sont personnalisés automatiquement pour chaque destinataire.

**Acceptance Criteria:**

**Given** que je suis en train de créer ou modifier un template
**When** je tape dans l'éditeur de template
**Then** je peux insérer des variables dynamiques via un menu ou une syntaxe spéciale (ex: {{nom_salle}}, {{capacite}}, {{region}}, {{nom_contact}})
**And** une liste des variables disponibles s'affiche (nom salle, capacité, région, style, nom contact, email contact, données projet, etc.)
**And** les variables sont remplacées automatiquement lors de la génération du mail
**And** je peux prévisualiser le template avec des données d'exemple
**And** la syntaxe des variables est claire et documentée
**And** si une variable n'est pas disponible pour un destinataire, elle est remplacée par une valeur par défaut ou laissée vide

### Story 5.3: Personnalisation des templates selon propriétés

As a musicien,
I want personnaliser mes templates selon les propriétés (capacité, région, style),
So que je peux adapter mes messages selon le type de salle ou de contact.

**Acceptance Criteria:**

**Given** que j'ai créé un template de mailing
**When** je configure la personnalisation du template
**Then** je peux définir des variantes du template selon la capacité de la salle (petite, moyenne, grande)
**And** je peux définir des variantes selon la région de la salle
**And** je peux définir des variantes selon le style musical de la salle
**And** le système sélectionne automatiquement la bonne variante lors de la génération du mail
**And** je peux prévisualiser chaque variante avec des données d'exemple
**And** si aucune variante ne correspond, le template par défaut est utilisé

### Story 5.4: Prévisualisation d'un template avant envoi

As a musicien,
I want prévisualiser un template avant envoi,
So que je peux valider le contenu et la personnalisation avant de lancer une campagne.

**Acceptance Criteria:**

**Given** que j'ai créé ou modifié un template
**When** je clique sur "Prévisualiser"
**Then** une prévisualisation du mail généré s'affiche avec des données d'exemple
**And** les variables dynamiques sont remplacées par des valeurs d'exemple réalistes
**And** je peux voir le sujet et le corps du mail formaté
**And** je peux tester avec différentes variantes (selon capacité, région, style)
**And** la prévisualisation montre exactement ce qui sera envoyé
**And** je peux revenir à l'édition si des modifications sont nécessaires

### Epic 6: Campagnes de Booking

L'utilisateur peut lancer des campagnes de mailing ciblées avec sélection et filtrage des contacts/salles, génération automatique de mails personnalisés, envoi automatique, et suivi de l'état des campagnes et des réponses.

**FRs couverts:** FR28, FR29, FR30, FR31, FR32, FR38, FR39, FR40, FR41, FR42, FR43, FR44

**Valeur utilisateur:** L'utilisateur peut lancer des campagnes de booking automatisées avec suivi complet de l'état et des réponses.

**Notes d'implémentation:**
- Génération automatique mails personnalisés depuis templates
- Sélection et filtrage contacts/salles (région, capacité, style)
- Envoi automatique campagnes de masse
- Suivi état campagnes (envois, réponses, relances)
- Historique échanges avec chaque contact/salle
- Mises à jour AJAX pour statut campagnes temps réel

### Story 6.1: Génération automatique de mails personnalisés depuis templates

As a musicien,
I want que le système génère automatiquement des mails personnalisés à partir des templates et des données de contacts,
So que chaque mail est adapté au destinataire sans effort manuel.

**Acceptance Criteria:**

**Given** que j'ai créé un template avec variables dynamiques et que j'ai des contacts/salles dans ma base
**When** je lance une campagne de mailing
**Then** le système génère automatiquement un mail personnalisé pour chaque contact/salle sélectionné
**And** les variables dynamiques sont remplacées par les données réelles du contact/salle
**And** la variante du template appropriée est sélectionnée selon les propriétés (capacité, région, style)
**And** chaque mail généré est unique et personnalisé
**And** les mails générés sont stockés avant envoi pour traçabilité
**And** je peux prévisualiser les mails générés avant envoi

### Story 6.2: Sélection et filtrage des contacts/salles cibles pour campagne

As a musicien,
I want sélectionner et filtrer les contacts/salles cibles pour une campagne de mailing,
So que je peux cibler précisément mes campagnes selon mes critères.

**Acceptance Criteria:**

**Given** que j'ai des contacts et des salles dans ma base de données
**When** je crée une nouvelle campagne de mailing
**Then** je peux voir la liste de tous mes contacts et salles
**And** je peux filtrer par région (sélection multiple)
**And** je peux filtrer par capacité (petite, moyenne, grande)
**And** je peux filtrer par style musical
**And** je peux sélectionner individuellement des contacts ou salles spécifiques
**And** je peux combiner plusieurs filtres pour un ciblage précis
**And** le nombre de destinataires sélectionnés est affiché en temps réel
**And** je peux prévisualiser la liste des destinataires avant de lancer la campagne

### Story 6.3: Lancement d'une campagne de mailing

As a musicien,
I want lancer une campagne de mailing,
So que mes mails sont envoyés automatiquement à tous les destinataires sélectionnés.

**Acceptance Criteria:**

**Given** que j'ai créé une campagne avec template, destinataires sélectionnés, et tout est configuré
**When** je clique sur "Lancer la campagne"
**Then** une confirmation me demande de valider le lancement
**And** après validation, la campagne est marquée comme "en cours"
**And** les mails sont envoyés automatiquement à tous les destinataires sélectionnés
**And** le statut de chaque envoi est tracé (envoyé, échec, en attente)
**And** je reçois une confirmation du lancement avec le nombre de mails envoyés
**And** la campagne apparaît dans ma liste de campagnes avec son statut
**And** je peux voir le progrès de l'envoi en temps réel

### Story 6.4: Envoi automatique de campagnes de mailing de masse

As a musicien,
I want que le système envoie automatiquement des campagnes de mailing de masse,
So que je n'ai pas à envoyer chaque mail manuellement.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne de mailing
**When** la campagne est en cours d'envoi
**Then** le système envoie les mails automatiquement via le service email configuré (SendGrid, Brevo, SMTP)
**And** les mails sont envoyés de manière optimisée (pas tous en même temps pour éviter rate limiting)
**And** chaque envoi est tracé avec timestamp et statut
**And** les erreurs d'envoi sont capturées et signalées (adresse invalide, serveur indisponible, etc.)
**And** le système continue l'envoi même si certains mails échouent
**And** un rapport d'envoi est généré avec statistiques (envoyés, échecs, en attente)
**And** je peux voir le progrès de l'envoi en temps réel

### Story 6.5: Visualisation de l'état d'une campagne de mailing

As a musicien,
I want visualiser l'état d'une campagne de mailing (envois, réponses, relances),
So que je peux suivre l'efficacité de mes campagnes.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne de mailing
**When** j'accède à la page de détail de la campagne
**Then** je peux voir le statut global de la campagne (en cours, terminée, en pause)
**And** je peux voir le nombre de mails envoyés, ouverts, cliqués, répondu
**And** je peux voir le nombre de réponses reçues (positives, négatives, en attente)
**And** je peux voir le nombre de relances effectuées
**And** les statistiques sont mises à jour en temps réel (AJAX)
**And** je peux voir un graphique ou une visualisation de l'état de la campagne
**And** je peux filtrer les destinataires par statut (envoyé, répondu, pas de réponse, erreur)

### Story 6.6: Visualisation des envois de mail pour une campagne

As a musicien,
I want voir les envois de mail effectués pour une campagne,
So que je peux vérifier que tous les mails ont bien été envoyés.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne de mailing
**When** j'accède à la section "Envois" de la campagne
**Then** je peux voir la liste de tous les envois effectués avec timestamp
**And** chaque envoi affiche le destinataire (contact/salle), l'adresse email, et le statut (envoyé, échec)
**And** je peux voir le contenu du mail envoyé pour chaque destinataire
**And** je peux filtrer les envois par statut (envoyé, échec, en attente)
**And** les envois en échec affichent la raison de l'échec
**And** je peux réessayer l'envoi pour les mails en échec si nécessaire

### Story 6.7: Visualisation des réponses associées à un contact ou une salle

As a musicien,
I want voir les réponses reçues associées à un contact ou une salle,
So que je peux suivre l'historique des échanges avec chaque contact/salle.

**Acceptance Criteria:**

**Given** que j'ai reçu des réponses à mes campagnes de mailing
**When** j'accède à la page de détail d'un contact ou d'une salle
**Then** je peux voir toutes les réponses reçues associées à ce contact/salle
**And** chaque réponse affiche la date, le sujet, le contenu, et le type (positive, négative, neutre)
**And** les réponses sont liées à la campagne de mailing correspondante
**And** je peux voir le contexte complet de l'échange (mail envoyé + réponse reçue)
**And** je peux marquer une réponse comme "date obtenue" si c'est une réponse positive
**And** les dates obtenues sont automatiquement ajoutées au projet musical associé

### Story 6.8: Suivi des dates de tournée obtenues via les campagnes

As a musicien,
I want suivre les dates de tournée obtenues via les campagnes,
So que je peux voir les résultats concrets de mes campagnes de booking.

**Acceptance Criteria:**

**Given** que j'ai reçu des réponses positives à mes campagnes de mailing
**When** je marque une réponse comme "date obtenue"
**Then** la date est enregistrée avec les informations de la salle et du contact
**And** la date apparaît dans mon calendrier de tournée
**And** la date est associée au projet musical concerné
**And** je peux voir toutes les dates obtenues depuis le tableau de bord
**And** je peux voir le nombre de dates obtenues par campagne
**And** les statistiques de dates obtenues sont affichées (total, par campagne, par projet)

### Story 6.9: Mise à jour automatique du statut des campagnes (AJAX)

As a musicien,
I want que le statut des campagnes soit mis à jour automatiquement sans refresh de page,
So que je peux suivre mes campagnes en temps réel.

**Acceptance Criteria:**

**Given** que j'ai une campagne de mailing en cours
**When** je consulte la page de la campagne
**Then** le statut de la campagne est mis à jour automatiquement via AJAX (sans refresh complet)
**And** les statistiques (envois, réponses, relances) sont mises à jour en temps réel
**And** les nouvelles réponses apparaissent automatiquement dans la liste
**And** les indicateurs visuels (badges, compteurs) sont mis à jour automatiquement
**And** l'interface reste réactive pendant les mises à jour
**And** je peux continuer à utiliser l'interface pendant les mises à jour

### Story 6.10: Historique des échanges avec chaque contact/salle

As a musicien,
I want voir l'historique des échanges avec chaque contact/salle,
So que je peux comprendre le contexte complet de mes relations.

**Acceptance Criteria:**

**Given** que j'ai envoyé plusieurs campagnes et reçu des réponses
**When** j'accède à la page de détail d'un contact ou d'une salle
**Then** je peux voir l'historique complet de tous les échanges (mails envoyés + réponses reçues)
**And** l'historique est affiché chronologiquement (plus récent en premier)
**And** chaque échange affiche la date, le sujet, le contenu, et le statut
**And** je peux voir à quelle campagne appartient chaque échange
**And** je peux filtrer l'historique par campagne ou par type d'échange
**And** l'historique est complet et traçable pour chaque contact/salle

### Epic 7: Relances Automatiques

L'utilisateur peut paramétrer et activer des relances automatiques avec arrêt automatique si réponse reçue, classification automatique des contacts, et possibilité de relance manuelle.

**FRs couverts:** FR33, FR34, FR35, FR36, FR37

**Valeur utilisateur:** L'utilisateur peut automatiser les relances de ses campagnes de booking sans intervention manuelle, avec contrôle sur les paramètres.

**Notes d'implémentation:**
- Paramétrage relances (délais, nombre de relances)
- Envoi automatique selon paramètres configurés
- Arrêt automatique si réponse reçue
- Classification automatique contacts (répondant/non-répondant)
- Relance manuelle possible si nécessaire

### Story 7.1: Paramétrage des relances automatiques

As a musicien,
I want paramétrer les relances automatiques (délais, nombre de relances),
So que je peux configurer la stratégie de relance selon mes besoins.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration des relances
**When** j'accède à la configuration des relances automatiques
**Then** je peux définir le délai avant la première relance (ex: 15 jours)
**And** je peux définir le délai avant les relances suivantes (ex: 21 jours, 30 jours)
**And** je peux définir le nombre maximum de relances
**And** je peux définir le contenu des relances (utiliser le même template ou un template différent)
**And** les paramètres sont sauvegardés et associés à mon `userId`
**And** je peux avoir des paramètres différents selon le type de campagne
**And** les paramètres par défaut sont proposés mais modifiables

### Story 7.2: Envoi automatique de relances selon paramètres configurés

As a musicien,
I want que le système envoie automatiquement des relances selon les paramètres configurés,
So que je n'ai pas à relancer manuellement chaque contact qui n'a pas répondu.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne avec relances automatiques configurées
**When** le délai configuré est atteint sans réponse reçue
**Then** le système envoie automatiquement une relance au contact/salle
**And** la relance utilise le template configuré (même template ou template de relance)
**And** chaque relance est tracée avec timestamp et statut
**And** le nombre de relances effectuées est suivi pour chaque destinataire
**And** les relances s'arrêtent automatiquement si le nombre maximum est atteint
**And** je reçois une notification quand des relances sont envoyées
**And** je peux voir dans l'historique de la campagne toutes les relances effectuées

### Story 7.3: Arrêt automatique des relances si réponse reçue

As a musicien,
I want que le système arrête automatiquement les relances si une réponse est reçue,
So que je n'envoie pas de relances inutiles aux contacts qui ont déjà répondu.

**Acceptance Criteria:**

**Given** que j'ai une campagne avec relances automatiques activées
**When** un contact répond à un mail de la campagne (positif ou négatif)
**Then** le système détecte automatiquement la réponse
**And** les relances automatiques sont arrêtées pour ce contact spécifique
**And** le contact est marqué comme "répondant" dans la campagne
**And** je reçois une notification de la réponse reçue
**And** le statut de la campagne est mis à jour pour refléter la réponse
**And** les autres contacts continuent à recevoir des relances selon le planning

### Story 7.4: Classification automatique des contacts (répondant/non-répondant)

As a musicien,
I want que le système classe automatiquement les contacts (répondant/non-répondant),
So que je peux facilement identifier qui a répondu et qui n'a pas répondu.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne avec des destinataires
**When** la campagne progresse et des réponses sont reçues
**Then** le système classe automatiquement chaque contact comme "répondant" ou "non-répondant"
**And** les contacts "répondant" sont ceux qui ont répondu (positif ou négatif)
**And** les contacts "non-répondant" sont ceux qui n'ont pas répondu après le délai configuré
**And** la classification est visible dans la liste des destinataires de la campagne
**And** je peux filtrer les destinataires par statut (répondant, non-répondant, en attente)
**And** la classification est mise à jour automatiquement quand une nouvelle réponse arrive

### Story 7.5: Relance manuelle d'une campagne si nécessaire

As a musicien,
I want relancer manuellement une campagne si nécessaire,
So que je peux avoir le contrôle sur les relances même avec l'automatisation.

**Acceptance Criteria:**

**Given** que j'ai une campagne avec des destinataires qui n'ont pas répondu
**When** j'accède à la page de détail de la campagne
**Then** je peux voir les destinataires éligibles pour une relance manuelle
**And** je peux sélectionner des destinataires spécifiques pour relancer
**And** je peux choisir le template à utiliser pour la relance manuelle
**And** après validation, les relances manuelles sont envoyées immédiatement
**And** les relances manuelles sont tracées dans l'historique de la campagne
**And** les relances manuelles n'interfèrent pas avec les relances automatiques programmées

### Epic 8: Tableau de Bord "What's Next"

L'utilisateur peut consulter son tableau de bord pour voir où il en est, identifier les prochaines étapes à accomplir, visualiser l'état des campagnes en cours et les nouvelles réponses, avec organisation des données pour faciliter la prise de décision.

**FRs couverts:** FR45, FR46, FR47, FR48, FR49, FR50, FR51

**Valeur utilisateur:** L'utilisateur peut avoir une vue d'ensemble complète de son projet et savoir exactement quoi faire ensuite, réduisant la charge mentale et éliminant le sentiment "je ne sais pas quoi faire".

**Notes d'implémentation:**
- Tableau de bord "what's next" comme cœur de l'expérience utilisateur
- Vue d'ensemble projets, campagnes, prochaines étapes
- Organisation données pour faciliter prise de décision
- Affichage informations essentielles en un coup d'œil
- Accès rapide sections depuis tableau de bord

### Story 8.1: Visualisation du tableau de bord avec vue d'ensemble des projets

As a musicien,
I want visualiser un tableau de bord avec vue d'ensemble de mes projets,
So que je peux voir rapidement l'état global de tous mes projets musicaux.

**Acceptance Criteria:**

**Given** que je suis authentifié et que j'ai créé des projets musicaux
**When** j'accède au tableau de bord principal
**Then** une vue d'ensemble de tous mes projets est affichée
**And** chaque projet affiche ses informations essentielles (nom, type, statut, progression)
**And** les projets sont organisés de manière claire et visuelle (cartes, liste, etc.)
**And** je peux voir rapidement quels projets sont en cours, terminés, ou en attente
**And** la progression de chaque projet est visible (barre de progression, pourcentage)
**And** je peux cliquer sur un projet pour accéder à sa page de détail
**And** les projets sont filtrés automatiquement par mon `userId` (multi-tenancy)

### Story 8.2: Visualisation des prochaines étapes à accomplir depuis le tableau de bord

As a musicien,
I want voir les prochaines étapes à accomplir depuis le tableau de bord,
So que je sais exactement quoi faire ensuite sans me poser de questions.

**Acceptance Criteria:**

**Given** que j'ai plusieurs projets avec différentes étapes
**When** j'accède au tableau de bord
**Then** une section "What's Next" est affichée en évidence (haut de page)
**And** les prochaines étapes de tous mes projets sont listées par ordre de priorité/date
**And** chaque prochaine étape affiche le projet associé, l'étape à accomplir, et la date prévue
**And** les étapes déjà complétées ne sont pas affichées dans cette liste
**And** je peux cliquer sur une étape pour accéder directement au projet concerné
**And** les étapes sont triées par urgence (dates proches en premier)
**And** la section "What's Next" est mise à jour automatiquement quand je complète une étape

### Story 8.3: Visualisation de l'état des campagnes en cours depuis le tableau de bord

As a musicien,
I want voir l'état des campagnes en cours depuis le tableau de bord,
So que je peux suivre mes campagnes de booking sans naviguer vers une page séparée.

**Acceptance Criteria:**

**Given** que j'ai lancé des campagnes de mailing
**When** j'accède au tableau de bord
**Then** une section "Campagnes en cours" affiche les campagnes actives
**And** chaque campagne affiche son nom, son statut, et ses statistiques essentielles (envois, réponses)
**And** les campagnes sont organisées de manière claire (en cours, terminées, en pause)
**And** je peux voir rapidement les campagnes qui nécessitent mon attention
**And** je peux cliquer sur une campagne pour accéder à sa page de détail
**And** les statistiques des campagnes sont mises à jour automatiquement (AJAX)
**And** les campagnes sont filtrées automatiquement par mon `userId` (multi-tenancy)

### Story 8.4: Visualisation des nouvelles réponses depuis le tableau de bord

As a musicien,
I want voir les nouvelles réponses depuis le tableau de bord,
So que je peux réagir rapidement aux réponses reçues à mes campagnes.

**Acceptance Criteria:**

**Given** que j'ai reçu des réponses à mes campagnes de mailing
**When** j'accède au tableau de bord
**Then** une section "Nouvelles réponses" affiche les réponses récentes
**And** chaque réponse affiche le contact/salle, la campagne associée, et le type de réponse (positive, négative)
**And** les réponses sont triées par date (plus récentes en premier)
**And** je peux voir rapidement les réponses positives (dates obtenues) mises en évidence
**And** je peux cliquer sur une réponse pour voir les détails complets
**And** je peux marquer une réponse comme "lue" pour la retirer de la liste des nouvelles
**And** les nouvelles réponses sont mises à jour automatiquement (AJAX)

### Story 8.5: Organisation des données dans le tableau de bord pour faciliter la prise de décision

As a musicien,
I want que le système organise les données dans le tableau de bord pour faciliter la prise de décision,
So que je peux comprendre rapidement la situation globale et prendre les bonnes décisions.

**Acceptance Criteria:**

**Given** que j'ai des projets, campagnes, et réponses dans mon système
**When** j'accède au tableau de bord
**Then** les données sont organisées de manière hiérarchique et logique
**And** les informations les plus importantes sont mises en évidence (What's Next en haut)
**And** les sections sont clairement séparées visuellement (projets, campagnes, réponses)
**And** la hiérarchie de l'information guide naturellement mon attention
**And** les données sont présentées de manière non redondante mais exhaustive sur l'essentiel
**And** je peux comprendre rapidement l'état global sans surcharge cognitive
**And** le design apaisant facilite la prise de décision

### Story 8.6: Accès rapide aux différentes sections depuis le tableau de bord

As a musicien,
I want accéder rapidement aux différentes sections depuis le tableau de bord,
So que je peux naviguer efficacement dans l'application.

**Acceptance Criteria:**

**Given** que je suis sur le tableau de bord
**When** je veux accéder à une section spécifique (projets, booking, contacts, paramètres)
**Then** une navigation claire est disponible (menu latéral, navigation horizontale, ou liens rapides)
**And** je peux accéder rapidement aux sections principales depuis le tableau de bord
**And** la navigation est cohérente dans toute l'application
**And** je peux revenir facilement au tableau de bord depuis n'importe quelle page
**And** les actions rapides sont disponibles depuis le tableau de bord (créer projet, lancer campagne, etc.)
**And** la navigation préserve le contexte quand c'est pertinent

### Story 8.7: Affichage des informations essentielles en un coup d'œil

As a musicien,
I want que le système affiche les informations essentielles en un coup d'œil,
So que je peux comprendre rapidement la situation sans avoir à chercher.

**Acceptance Criteria:**

**Given** que j'ai des projets, campagnes, et réponses dans mon système
**When** j'accède au tableau de bord
**Then** les informations essentielles sont visibles immédiatement sans scroll (si possible)
**And** les métriques clés sont affichées de manière claire (nombre de projets actifs, campagnes en cours, nouvelles réponses)
**And** les indicateurs visuels (badges, icônes, couleurs) communiquent rapidement l'état
**And** je peux comprendre l'essentiel en 5-10 secondes de consultation
**And** les informations non essentielles sont disponibles mais ne surchargent pas la vue principale
**And** le design apaisant facilite la compréhension rapide

### Epic 9: Gestion des Erreurs et Corrections

L'utilisateur peut identifier et corriger les erreurs du système (scraping, campagnes mailing), avec signalement automatique, visualisation des causes, et possibilité d'intervention manuelle.

**FRs couverts:** FR52, FR53, FR54, FR55, FR56, FR57, FR58

**Valeur utilisateur:** L'utilisateur peut maintenir la qualité des données et corriger les erreurs du système, garantissant la fiabilité de l'outil.

**Notes d'implémentation:**
- Identification et signalement erreurs scraping
- Signalement erreurs envoi campagnes mailing
- Visualisation causes erreurs
- Correction erreurs corrigeables (données manquantes, adresses invalides)
- Notification utilisateur erreurs nécessitant attention
- Intervention manuelle toujours possible

### Story 9.1: Identification et signalement des erreurs de scraping

As a musicien,
I want que le système identifie et signale les erreurs de scraping,
So que je peux corriger les données incorrectes et maintenir la qualité de ma base de données.

**Acceptance Criteria:**

**Given** que j'ai lancé un scraping de données
**When** le scraping rencontre des erreurs (données manquantes, format incorrect, site inaccessible)
**Then** le système identifie automatiquement les erreurs
**And** les erreurs sont signalées visuellement dans l'interface (badges, icônes d'alerte)
**And** une liste des erreurs de scraping est disponible avec détails
**And** chaque erreur affiche le type d'erreur (données manquantes, format incorrect, etc.)
**And** les fiches avec erreurs sont marquées visuellement dans les listes
**And** je reçois une notification des erreurs détectées
**And** je peux filtrer les fiches pour voir uniquement celles avec erreurs

### Story 9.2: Correction des erreurs de scraping détectées

As a musicien,
I want corriger les erreurs de scraping détectées,
So que je peux maintenir la qualité de mes données scrapées.

**Acceptance Criteria:**

**Given** que j'ai des fiches avec des erreurs de scraping détectées
**When** j'accède à une fiche avec erreurs
**Then** les champs problématiques sont clairement identifiés visuellement
**And** je peux modifier directement les données incorrectes dans le formulaire
**And** après correction, je peux sauvegarder les modifications
**And** la fiche est mise à jour et l'erreur est résolue
**And** la fiche n'apparaît plus dans la liste des fiches avec erreurs
**And** je reçois une confirmation de correction réussie
**And** les corrections sont tracées dans l'historique de la fiche

### Story 9.3: Signalement des erreurs lors de l'envoi de campagnes de mailing

As a musicien,
I want que le système signale les erreurs lors de l'envoi de campagnes de mailing,
So que je peux identifier et corriger les problèmes d'envoi.

**Acceptance Criteria:**

**Given** que j'ai lancé une campagne de mailing
**When** des erreurs surviennent lors de l'envoi (adresse invalide, serveur indisponible, etc.)
**Then** le système détecte et signale automatiquement les erreurs
**And** les erreurs sont visibles dans la page de détail de la campagne
**And** chaque erreur affiche le destinataire concerné et la raison de l'échec
**And** les mails en échec sont listés séparément des mails envoyés avec succès
**And** je reçois une notification des erreurs d'envoi
**And** les statistiques de la campagne incluent le nombre d'erreurs
**And** je peux filtrer les destinataires pour voir uniquement ceux avec erreurs

### Story 9.4: Visualisation des causes des erreurs de campagne

As a musicien,
I want voir les causes des erreurs de campagne,
So que je peux comprendre pourquoi certains mails n'ont pas pu être envoyés.

**Acceptance Criteria:**

**Given** que j'ai des erreurs dans une campagne de mailing
**When** j'accède à la section des erreurs de la campagne
**Then** chaque erreur affiche clairement sa cause (adresse email invalide, serveur SMTP indisponible, quota dépassé, etc.)
**And** les causes d'erreur sont expliquées de manière compréhensible
**And** les erreurs sont catégorisées par type (erreurs corrigeables, erreurs temporaires, erreurs définitives)
**And** je peux voir le nombre d'erreurs par type
**And** des suggestions d'actions sont proposées pour chaque type d'erreur
**And** je peux exporter la liste des erreurs si nécessaire

### Story 9.5: Correction des erreurs corrigeables (données manquantes, adresses invalides)

As a musicien,
I want corriger les erreurs corrigeables (données manquantes, adresses invalides),
So que je peux réessayer l'envoi après correction.

**Acceptance Criteria:**

**Given** que j'ai des erreurs corrigeables dans une campagne (adresse invalide, données manquantes)
**When** j'accède à la fiche du contact/salle avec erreur
**Then** je peux corriger directement l'adresse email invalide ou les données manquantes
**And** après correction et sauvegarde, l'erreur est résolue
**And** je peux relancer l'envoi du mail pour ce destinataire depuis la campagne
**And** le mail est envoyé avec succès après correction
**And** l'erreur disparaît de la liste des erreurs de la campagne
**And** je reçois une confirmation de correction et d'envoi réussis

### Story 9.6: Notification de l'utilisateur des erreurs nécessitant son attention

As a musicien,
I want être notifié des erreurs nécessitant mon attention,
So que je peux réagir rapidement aux problèmes.

**Acceptance Criteria:**

**Given** que le système détecte des erreurs nécessitant mon attention
**When** des erreurs critiques sont détectées (scraping échoué, campagne bloquée, etc.)
**Then** je reçois une notification (badge dans l'interface, notification système, ou email selon configuration)
**And** la notification indique le type d'erreur et l'action requise
**And** je peux cliquer sur la notification pour accéder directement à la section concernée
**And** les notifications persistent jusqu'à ce que je les traite ou les marque comme "lues"
**And** je peux voir toutes mes notifications dans une section dédiée
**And** les notifications sont organisées par priorité (critique, importante, informative)

### Story 9.7: Intervention manuelle pour corriger les données quand nécessaire

As a musicien,
I want pouvoir intervenir manuellement pour corriger les données quand nécessaire,
So que je garde le contrôle sur la qualité de mes données même avec l'automatisation.

**Acceptance Criteria:**

**Given** que j'ai des données dans mon système (contacts, salles, projets, campagnes)
**When** je veux corriger ou modifier des données manuellement
**Then** je peux accéder à n'importe quelle fiche et la modifier
**And** tous les formulaires permettent l'édition manuelle des données
**And** je peux corriger les données même si elles n'ont pas d'erreur détectée
**And** les modifications manuelles sont sauvegardées et tracées
**And** les modifications manuelles sont propagées dans toutes les sections concernées
**And** je peux toujours intervenir manuellement, même avec l'automatisation activée
**And** l'intervention manuelle n'interfère pas avec les processus automatiques

### Epic 10: Configuration et Paramétrage

L'utilisateur peut configurer les paramètres du système (scraping, relances, fiches, tableau de bord) et bénéficier de mises à jour AJAX pour une expérience fluide sans refresh complet.

**FRs couverts:** FR59, FR60, FR61, FR62, FR63, FR64, FR65

**Valeur utilisateur:** L'utilisateur peut personnaliser le système selon ses besoins et bénéficier d'une expérience fluide avec mises à jour en temps réel.

**Notes d'implémentation:**
- Configuration paramètres scraping (sources, fréquence)
- Configuration paramètres relances (délais, nombre)
- Modification paramètres fiches contacts/salles
- Paramétrage tableau de bord
- Mises à jour AJAX pour éviter refresh complets
- Synchronisation données entre sections application

### Story 10.1: Configuration des paramètres de scraping (sources, fréquence)

As a musicien,
I want configurer les paramètres de scraping (sources, fréquence),
So que le scraping fonctionne selon mes préférences et besoins.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration du scraping
**When** j'accède aux paramètres de scraping
**Then** je peux configurer les sources de scraping (activer/désactiver, ajouter nouvelles sources)
**And** je peux configurer la fréquence de mise à jour automatique (quotidienne, hebdomadaire, mensuelle, désactivée)
**And** je peux configurer les paramètres spécifiques de chaque source (URL, sélecteurs, délais)
**And** les paramètres sont sauvegardés et associés à mon `userId`
**And** je peux tester les sources avant de les activer
**And** les paramètres par défaut sont proposés mais modifiables
**And** je reçois une confirmation de sauvegarde des paramètres

### Story 10.2: Configuration des paramètres de relances (délais, nombre)

As a musicien,
I want configurer les paramètres de relances (délais, nombre),
So que les relances automatiques fonctionnent selon ma stratégie.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration des relances
**When** j'accède aux paramètres de relances
**Then** je peux configurer les délais entre relances (première relance après X jours, suivantes après Y jours)
**And** je peux configurer le nombre maximum de relances par campagne
**And** je peux configurer le template à utiliser pour les relances (même template ou template spécifique)
**And** je peux avoir des paramètres différents selon le type de campagne
**And** les paramètres sont sauvegardés et associés à mon `userId`
**And** les paramètres par défaut sont proposés mais modifiables
**And** je peux voir un aperçu de la stratégie de relance avec mes paramètres

### Story 10.3: Modification des paramètres pertinents des fiches contacts/salles

As a musicien,
I want modifier les paramètres pertinents des fiches contacts/salles,
So que je peux personnaliser les champs et propriétés selon mes besoins.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration des fiches
**When** j'accède aux paramètres des fiches contacts/salles
**Then** je peux voir quels champs sont disponibles pour les fiches
**And** je peux activer ou désactiver certains champs selon mes besoins
**And** je peux définir quels champs sont obligatoires vs optionnels
**And** je peux personnaliser les valeurs par défaut pour certains champs
**And** les modifications sont appliquées aux nouvelles fiches créées
**And** les fiches existantes conservent leurs données actuelles
**And** les paramètres sont sauvegardés et associés à mon `userId`

### Story 10.4: Paramétrage du tableau de bord

As a musicien,
I want paramétrer le tableau de bord,
So que je peux personnaliser l'affichage selon mes préférences.

**Acceptance Criteria:**

**Given** que je suis authentifié et sur la page de configuration du tableau de bord
**When** j'accède aux paramètres du tableau de bord
**Then** je peux choisir quelles sections afficher (projets, campagnes, réponses, etc.)
**And** je peux réorganiser l'ordre des sections selon mes préférences
**And** je peux configurer le nombre d'éléments à afficher par section
**And** je peux activer ou désactiver certaines fonctionnalités du tableau de bord
**And** les paramètres sont sauvegardés et appliqués immédiatement
**And** je peux réinitialiser les paramètres aux valeurs par défaut si nécessaire
**And** les paramètres sont associés à mon `userId`

### Story 10.5: Mise à jour des données sans refresh complet de page (AJAX)

As a musicien,
I want que les données soient mises à jour sans refresh complet de page,
So que l'expérience utilisateur est fluide et réactive.

**Acceptance Criteria:**

**Given** que je suis sur une page avec des données (contacts, campagnes, projets)
**When** je modifie des données ou que des données sont mises à jour automatiquement
**Then** les mises à jour sont effectuées via AJAX sans refresh complet de la page
**And** seules les parties concernées de la page sont mises à jour
**And** l'interface reste réactive pendant les mises à jour
**And** un indicateur de chargement discret apparaît pendant les mises à jour si nécessaire
**And** les erreurs de mise à jour sont gérées et signalées sans bloquer l'interface
**And** je peux continuer à utiliser l'application pendant les mises à jour

### Story 10.6: Mise à jour du statut des campagnes en temps réel (AJAX)

As a musicien,
I want que le statut des campagnes soit mis à jour en temps réel,
So que je peux suivre mes campagnes sans avoir à rafraîchir la page.

**Acceptance Criteria:**

**Given** que j'ai une campagne de mailing en cours
**When** je consulte la page de la campagne
**Then** le statut de la campagne est mis à jour automatiquement en temps réel via AJAX
**And** les statistiques (envois, réponses, relances) sont mises à jour automatiquement
**And** les nouvelles réponses apparaissent automatiquement dans la liste
**And** les indicateurs visuels (badges, compteurs, barres de progression) sont mis à jour
**And** les mises à jour sont discrètes et n'interrompent pas mon utilisation
**And** je peux voir l'historique des mises à jour si nécessaire
**And** les mises à jour fonctionnent même si je reste longtemps sur la page

### Story 10.7: Synchronisation des données entre différentes sections de l'application

As a musicien,
I want que les données soient synchronisées entre différentes sections de l'application,
So que les informations sont cohérentes partout dans l'application.

**Acceptance Criteria:**

**Given** que je modifie des données dans une section de l'application (ex: modifier un contact)
**When** je navigue vers une autre section qui utilise ces données (ex: campagne de mailing)
**Then** les modifications sont immédiatement visibles dans toutes les sections concernées
**And** les données sont synchronisées automatiquement entre les modules
**And** il n'y a pas de décalage ou d'incohérence entre les sections
**And** les mises à jour sont propagées efficacement sans surcharge
**And** je peux voir les données à jour partout dans l'application
**And** la synchronisation fonctionne même avec plusieurs onglets ouverts
