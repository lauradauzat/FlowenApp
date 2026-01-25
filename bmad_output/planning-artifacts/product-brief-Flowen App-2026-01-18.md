---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ['bmad_output/analysis/brainstorming-session-2026-01-18.md', 'bmad_output/planning-artifacts/research/market-outils-gestion-musiciens-research-2026-01-18.md']
date: 2026-01-18
author: Laura
workflow_completed: true
product_brief_status: "complete"
---

# Product Brief: Flowen App

## Executive Summary

Flowen App est une solution de gestion de projet musical conçue spécifiquement pour les musiciens amateurs et semi-professionnels qui cherchent à mener leurs projets à bien sans être submergés par la charge mentale et la complexité technique des aspects non-artistiques.

**Le problème :** Les musiciens passent une partie trop importante de leur temps et de leur énergie sur des tâches administratives, organisationnelles et de communication (booking, mailing, gestion de planning, documents, budgets) au détriment de leur création artistique. Cette charge mentale non gérable conduit à l'abandon de projets, à la frustration, et empêche de nombreux artistes de réaliser leur potentiel.

**La solution :** Flowen App automatise et simplifie tous les aspects non-artistiques de la gestion d'un projet musical, avec un focus prioritaire sur le booking automatisé avec scraping de données et campagnes de mailing intelligentes. L'outil est conçu comme un véritable gestionnaire de projet adapté spécifiquement aux besoins musicaux, avec des structures préconstruites et paramétrables.

**La différenciation :** Créée d'abord pour un usage personnel par une artiste-développeuse-gestionnaire de projet, Flowen App combine une compréhension profonde des besoins réels avec une approche technique rigoureuse. Contrairement aux outils existants qui se concentrent sur un seul aspect (tournée, CRM, facturation), Flowen App offre une solution intégrée de gestion de projet musical complète.

**Vision à long terme :** Développée initialement comme solution personnelle en version bêta, Flowen App sera mise à disposition de la communauté des musiciens dès lors qu'elle répondra à un besoin généralisé, avec un modèle économique accessible (idéalement gratuit ou avec un pourcentage minimal).

---

## Core Vision

### Problem Statement

Les musiciens amateurs et semi-professionnels en voie de développement sont confrontés à une charge mentale et technique insurmontable lorsqu'ils tentent de mener un projet musical à bien. Cette charge provient de tous les aspects non-artistiques de leur projet : booking de tournées, communication, gestion de planning, gestion d'équipe, mailing, gestion des documents, budgets, etc.

**Le problème fondamental :** Ces musiciens n'ont généralement pas d'équipe pour gérer ces aspects à leur place, mais ils souhaitent faire les choses correctement. Ils se retrouvent donc à devoir être à la fois artistes créatifs ET gestionnaires de projet, administrateurs, commerciaux, et communicateurs - des rôles qui nécessitent des compétences et un temps qu'ils n'ont souvent pas.

**Exemple concret du problème :** Un musicien planifie une tournée de 10 dates en octobre. La complexité du booking (recherche de contacts, mailing personnalisé, relances multiples, suivi des réponses) devient si chronophage et frustrante qu'il n'arrive finalement à organiser que 4 concerts. Résultat : argent perdu, temps perdu, frustration énorme, et envie d'arrêter complètement les tournées.

### Problem Impact

**Impact sur les musiciens individuels :**

- **Abandon de projets** : De nombreux musiciens arrêtent simplement de faire de la musique professionnellement et se contentent de jouer chez eux par plaisir, car la charge est trop importante pour montrer leur travail au public.

- **Frustration permanente** : Des artistes créent de la belle musique mais n'arrivent pas à la faire entendre au public parce qu'ils n'ont pas fait les choses correctement ou trop lentement. Ils vivent dans une frustration constante de ne pas être entendus malgré leur talent.

- **Perte de revenus et d'opportunités** : Tournées ratées, dates manquées, contacts perdus, documents non envoyés à temps - autant d'opportunités qui passent à côté à cause de la complexité de gestion.

- **Épuisement psychologique** : La charge mentale de devoir gérer simultanément création artistique et gestion administrative conduit à l'épuisement, réduisant la capacité créative et la motivation.

**Impact sur l'écosystème musical :**

- **Perte de diversité artistique** : De nombreux talents ne parviennent jamais à émerger simplement parce qu'ils n'arrivent pas à gérer la partie administrative de leur projet.

- **Barrière à l'entrée élevée** : Seuls les musiciens avec des ressources (équipe, budget) ou des compétences particulières en gestion peuvent mener leurs projets à bien, créant une inégalité d'accès.

### Why Existing Solutions Fall Short

**Analyse des solutions existantes :**

D'après la recherche de marché, plusieurs outils existent mais présentent des limitations majeures :

1. **Solutions spécialisées fragmentées** :
   - OTour, Tourmanagement.com : Focus uniquement sur la gestion de tournées/logistique, pas de gestion de projet complète
   - Stage-Radar : Base de données + mailing automatisé mais limité au booking uniquement
   - Mascaron : CRM culturel complet mais tarifs prohibitifs (700-3990€/mois) pour amateurs/semi-professionnels
   - ArtCalendar : Gestion d'événements mais pas adapté aux projets musicaux complets

2. **Absence de solution de gestion de projet musical intégrée** :
   - Aucun outil n'offre une vraie gestion de projet adaptée spécifiquement aux besoins musicaux
   - Les gestionnaires de projet génériques sont trop éloignés de la réalité d'un projet musical
   - Pas de structure préconstruite adaptée aux workflows musicaux

3. **Problèmes d'accessibilité** :
   - Coûts élevés pour les solutions complètes (Mascaron : 700€+/mois)
   - Solutions gratuites limitées ou devenues payantes (ex: Strix Email)
   - Manque de personnalisation pour répondre aux besoins spécifiques

4. **Automatisation insuffisante** :
   - Aucun outil ne combine scraping automatique de données + campagnes de mailing automatisées + relances intelligentes
   - Les outils existants automatisent partiellement mais pas complètement
   - Pas de système qui empêche les oublis et guide l'utilisateur

**Ce qui manque fondamentalement :**

- Une solution qui comprend vraiment les besoins d'un projet musical de A à Z
- Une automatisation maximale du processus de booking (scraping + mailing + relances)
- Une structure adaptée aux projets musicaux avec cases préconstruites paramétrables
- Un outil accessible (gratuit ou très abordable) pour musiciens sans gros budget
- Une approche qui réduit la charge cognitive plutôt que de l'ajouter

### Proposed Solution

Flowen App est une solution de gestion de projet musical complète qui automatise, simplifie et accompagne tous les aspects non-artistiques d'un projet musical, permettant à l'artiste de se concentrer sur sa création.

**Architecture de la solution :**

1. **Gestionnaire de projet musical adapté** :
   - Structure préconstruite spécifiquement pour les projets musicaux
   - Cases et workflows adaptés à la réalité musicale (pas un gestionnaire de projet générique)
   - Paramétrable et modifiable selon les besoins de chaque projet
   - Tableau de bord "what's next" guidant l'utilisateur et réduisant la charge cognitive

2. **Automatisation maximale du booking** (priorité absolue) :
   - Scraping automatique des données de salles et contacts (mise à jour automatique)
   - Base de données relationnelle salles ↔ contacts toujours à jour
   - Campagnes de mailing automatisées avec personnalisation intelligente
   - Relances automatiques paramétrables (15j, 21j, dernière relance)
   - Génération automatique de packages de fichiers pour chaque contexte
   - Détection automatique d'obsolescence des données (rebounds, réponses)

3. **Gestion complète du cycle de vie du projet** :
   - Booking et tournées (automatisé)
   - Enregistrement et sortie (suivi des étapes, coordination)
   - Communication et médias (planification, contacts médias avec processus similaire au booking)
   - Gestion financière (enveloppes budgétaires par étape, suivi en temps réel)
   - Gestion des collaborateurs et documents
   - Calendrier et planification avec rétro-planning et marges intégrées

4. **Réduction de charge cognitive** :
   - Interface qui indique clairement les prochaines étapes
   - Système qui empêche les oublis
   - Automatisation de tout ce qui peut l'être
   - Focus sur l'essentiel pour libérer l'artiste vers la création

**Approche de développement :**

- **Phase 1 - Usage personnel (bêta)** : Développement initial pour usage personnel avec fonctionnalités core (booking automatisé)
- **Phase 2 - Validation** : Utilisation en bêta pour valider l'utilité et répondre aux besoins réels
- **Phase 3 - Ouverture** : Mise à disposition de la communauté dès lors que le besoin est généralisé et validé

### Key Differentiators

**1. Créée par et pour un musicien en développement :**
- Fondée sur une compréhension profonde des besoins réels, pas sur des hypothèses
- Triple casquette unique : artiste + développeuse + gestionnaire de projet
- Résout d'abord un problème personnel réel avant de penser marché

**2. Automatisation complète du booking avec scraping intégré :**
- Aucun concurrent ne combine scraping automatique + mailing automatisé + relances intelligentes
- Base de données toujours à jour avec détection automatique d'obsolescence
- Génération automatique de packages de fichiers selon contexte

**3. Gestionnaire de projet adapté aux besoins musicaux :**
- Structure préconstruite spécifique aux projets musicaux (pas générique)
- Workflows adaptés à la réalité musicale
- Cases et processus paramétrables mais optimisés par défaut

**4. Réduction maximale de charge cognitive :**
- Tableau de bord guidant avec "what's next"
- Système qui empêche les oublis
- Automatisation maximale pour libérer l'artiste vers la création

**5. Accessibilité et personnalisation :**
- Développée d'abord comme solution personnelle, donc très personnalisée
- Modèle économique accessible (gratuit ou très abordable)
- Adaptée aux contraintes des musiciens amateurs/semi-professionnels (budget limité, besoin de simplicité)

**6. Approche itérative basée sur usage réel :**
- Développement guidé par les besoins réels d'utilisation
- Validation continue par l'usage avant ouverture à la communauté
- Amélioration continue basée sur feedback utilisateur réel

**Pourquoi maintenant :**
- Adoption croissante des outils numériques par les musiciens depuis la COVID-19
- Besoin fort de centralisation et simplification identifié
- Technologies de scraping et automatisation matures
- Marché fragmenté avec opportunité de créer une solution intégrée

---

## Target Users

### Primary Users

**Utilisateur Principal : Le Porteur de Projet Musical**

Le porteur de projet est la personne qui pilote et gère l'ensemble de la complexité d'un projet musical. C'est la personne responsable de la communication, du booking, des dates, des enregistrements, de la gestion des partenaires et collaborateurs. Il peut s'agir d'un musicien solo ou d'un membre d'un groupe qui assume cette responsabilité.

**Profil démographique :**
- **Âge** : Principalement 25-35 ans, avec une fourchette de 15 à 60 ans
- **Situation** : Musiciens amateurs ou semi-professionnels en voie de développement
- **Ressources** : Budget limité, pas d'équipe dédiée pour la gestion
- **Niveau musical** : Variable (peu importe pour Flowen App qui se concentre sur le non-musical)

**Profil psychographique :**
- **Personnalité** : Très émotifs, sensibles (typique des musiciens)
- **Organisation** : Pas forcément très organisés ou "carrés" naturellement
- **Technologie** : Érudits en technologie (à l'aise avec réseaux sociaux, outils numériques) mais pas forcément techniques dans la gestion de projet
- **Motivation** : Très motivés, très occupés, passionnés par leur projet musical

**Profil type détaillé - "Laura" (utilisateur premier) :**
- **Âge** : 33 ans
- **Activité** : Développeuse web à 80%, musicienne à 20%
- **Rythme** : Travaille sur la musique tous les vendredis
- **Expérience** : Joue de la musique depuis 14 ans
- **Tournées** : 15 jours de tournée par an
- **Compétences** : Triple casquette (artiste + développeuse + gestionnaire de projet)
- **Usage Flowen App** : Intégration dans le workflow tous les vendredis pour savoir où elle en est du projet et ce qu'elle a à faire

**Problème vécu :**
- Charge mentale insurmontable entre création artistique et gestion administrative
- Difficulté à ne rien oublier dans un projet complexe avec de nombreuses étapes
- Temps perdu sur des tâches répétitives (booking, mailing, relances)
- Frustration face à la complexité de gestion qui empêche de se concentrer sur la création
- Manque de structure adaptée aux projets musicaux (les outils génériques ne correspondent pas)

**Workarounds actuels :**
- Utilisation de multiples outils fragmentés (mails, Excel pour bases de données non à jour, Brevo pour newsletter, Buffer/Meta pour réseaux sociaux)
- Gestion manuelle chronophage du booking (recherche de contacts, mailing, relances)
- Perte d'informations, oublis, documents non envoyés à temps
- Sentiment constant de "ne pas savoir quoi faire ensuite"

**Vision du succès :**
- Ne rien oublier dans le projet grâce à une structure adaptée et un système qui guide
- Réduction drastique de la charge mentale en déléguant la gestion à l'outil
- Gain de temps et efficacité dans l'organisation globale
- Automatisation et accélération de toute la partie booking et classement des données de contact
- Pouvoir se concentrer sur la création artistique plutôt que sur l'administration
- Projets plus performants (choses faites systématiquement et bien faites)
- Production artistique augmentée grâce à la réduction de la perte psychologique

**Rythme de vie et contexte d'usage :**
- **Journée/semaine très cassée** : Parfois en studio, parfois chez soi, parfois en tournée
- **Peu de régularité** dans le rythme de vie
- **Besoin d'accessibilité** : À terme, application mobile pour accès partout (pas dans V1)
- **Usage régulier** : Intégration dans le workflow hebdomadaire (ex: tous les vendredis pour Laura)
- **Usage ponctuel** : Consultation rapide pour savoir "où j'en suis" et "what's next"

**Contraintes spécifiques :**
- Budget limité (besoin d'une solution gratuite ou très abordable)
- Pas d'équipe pour gérer les aspects administratifs
- Besoin de simplicité (pas de courbe d'apprentissage trop raide)
- Besoin de personnalisation (projets musicaux variés selon style, taille, etc.)

### Secondary Users

**Pour la version 1 (bêta personnelle) :**
- Aucun utilisateur secondaire prévu
- Focus exclusif sur le porteur de projet comme seul utilisateur

**Évolution future (post-V1) :**
- Potentiellement des accès pour collaborateurs proches (musiciens du groupe, techniciens)
- À déterminer selon les besoins identifiés lors de l'usage bêta
- Pour le moment, cette dimension est ignorée pour se concentrer sur le porteur de projet

### User Journey

**Journey du Porteur de Projet avec Flowen App :**

**1. Découverte (Phase future - post-bêta) :**
- Découverte via recommandation d'un autre musicien, article/blog, réseaux sociaux
- Constatation du problème : "Je passe trop de temps sur l'admin, pas assez sur la musique"
- Recherche de solutions et découverte de Flowen App
- Comparaison avec alternatives existantes (OTour, Stage-Radar, etc.)

**2. Onboarding (Phase future - post-bêta) :**
- Inscription (idéalement gratuite ou très abordable)
- Configuration initiale : création du premier projet musical
- Découverte de la structure préconstruite adaptée aux projets musicaux
- Paramétrage selon son style musical, type de projet, etc.
- Première utilisation : configuration du scraping de données salles/médias

**3. Usage Core - Booking Automatisé (Priorité absolue) :**
- **Setup initial** : Configuration du scraping de données salles et contacts
- **Automatisation** : Lancement de campagnes de mailing automatisées pour booking
- **Suivi** : Consultation du tableau de bord pour voir les réponses, relances automatiques
- **Génération** : Création automatique de packages de fichiers pour chaque contexte
- **Résultat** : Réduction drastique du temps passé sur le booking (de plusieurs heures à quelques minutes de validation)

**4. Usage Core - Gestion de Projet Quotidienne :**
- **Consultation régulière** : Ouverture de l'outil (ex: tous les vendredis) pour voir "where I am" et "what's next"
- **Guidance** : Le système indique clairement les prochaines étapes à accomplir
- **Prévention d'oubli** : Alertes et rappels pour les étapes critiques
- **Suivi** : Visualisation de la progression du projet (enregistrement, tournée, communication)

**5. Moment "Aha!" - Réalisation de la valeur :**
- **Première tournée réussie** : Réalisation que le booking automatisé a fonctionné, plusieurs dates obtenues sans effort
- **Réduction de charge mentale** : Constatation qu'on ne pense plus constamment à "qu'est-ce que j'ai oublié ?"
- **Gain de temps** : Temps libéré pour la création artistique
- **Efficacité** : Projets mieux organisés, moins d'erreurs, moins d'oublis

**6. Usage Long-Terme - Intégration dans le Workflow :**
- **Routine établie** : Consultation régulière de l'outil (hebdomadaire ou selon besoin)
- **Automatisation complète** : Le système gère automatiquement booking, relances, mises à jour de données
- **Focus création** : L'artiste peut se concentrer sur la musique plutôt que sur l'administration
- **Projets multiples** : Gestion de plusieurs projets musicaux simultanément si nécessaire
- **Évolution** : Utilisation de fonctionnalités supplémentaires (gestion enregistrement, communication, finances) au fur et à mesure des besoins

**Points de friction potentiels à éviter :**
- Courbe d'apprentissage trop raide (doit être intuitif)
- Complexité de configuration initiale (doit être simple)
- Besoin de trop de temps pour setup (doit être rapide)
- Manque de flexibilité (doit être paramétrable)

**Moments de valeur clés :**
- **Réduction immédiate** de la charge mentale grâce au tableau de bord guidant
- **Automatisation du booking** qui libère plusieurs heures par semaine
- **Prévention des oublis** grâce au système de rappels et guidance
- **Gain de temps** mesurable pour se concentrer sur la création

---

## Success Metrics

### User Success Metrics (Version 1 - Bêta Personnelle)

**Critères de succès pour l'usage personnel :**

**1. Adoption et confiance :**
- **Utilisation régulière sans hésitation** : Utilisation tous les vendredis (ou selon rythme établi) sans hésitation
- **Confiance totale dans l'outil** : L'outil devient le centre absolu du projet, source de vérité unique
- **Confiance dans les informations** : Sentiment que l'outil contient toutes les informations nécessaires, rien n'est oublié

**2. Réduction du temps de gestion :**
- **Temps de booking** : Réduction à **5 minutes par semaine maximum** pour toute la gestion du booking
- **Temps de gestion projet** : **5 minutes par semaine maximum** pour la consultation et gestion du projet (en plus du temps dédié à la réalisation)
- **Total temps gestion** : Maximum **10 minutes par semaine** pour toute la partie administrative/organisationnelle

**3. Efficacité du booking :**
- **Réduction à quasi zéro** de l'effort manuel de gestion du booking
- **Objectif concret** : Obtenir **20 dates de tournée à l'année prochaine** avec quasiment zéro effort personnel
- **Automatisation complète** : Les tournées se gèrent "toutes seules" grâce à l'automatisation

**4. Qualité et précision :**
- **Timeline précise** : Avoir une timeline claire et précise du projet
- **Réduction des erreurs** : Passage de **10% d'oubli actuel à 0% d'oubli**
- **Sorties sans frustration** : Réaliser les sorties (enregistrements, tournées) sans frustration ni erreur

**5. Changement de mode :**
- **De la gestion à la réalisation** : Passer du mode "gestion" (dire "il faut que je fasse ça") au mode "réalisation" (faire les choses directement)
- **Réduction de charge mentale** : Sentiment de confiance et absence d'hésitation lors de la connexion à l'outil
- **Focus sur la création** : Temps libéré pour se concentrer sur la partie artistique plutôt que sur l'administration

**Métriques comportementales :**
- **Fréquence d'utilisation** : Utilisation hebdomadaire régulière (ex: tous les vendredis)
- **Durée de session** : Sessions courtes (5-10 minutes) pour consultation et actions rapides
- **Taux de complétion** : Toutes les étapes critiques complétées sans oubli
- **Taux d'erreur** : 0% d'oubli vs 10% actuel

**Métriques de résultat :**
- **Temps économisé** : Plusieurs heures par semaine libérées pour la création
- **Efficacité booking** : 20 dates obtenues par an avec effort minimal
- **Qualité projet** : Projets mieux organisés, moins d'erreurs, moins de frustration

### Business Objectives

**Pour la version 1 (bêta personnelle) :**
- **Aucun objectif business** pour le moment
- **Focus exclusif** sur l'usage personnel et la validation du concept
- **Objectif principal** : Créer un outil qui répond parfaitement aux besoins personnels

**Pour l'évolution future (post-bêta) :**
- **Validation du besoin généralisé** : Confirmer que l'outil répond à un besoin partagé par d'autres musiciens
- **Prêt pour ouverture** : L'outil est utilisé avec succès en bêta et répond aux besoins identifiés
- **Modèle économique** : Déterminer un modèle accessible (idéalement gratuit ou avec pourcentage minimal)

### Key Performance Indicators

**KPIs pour Version 1 (Bêta Personnelle) :**

**1. Adoption et utilisation :**
- **Fréquence d'utilisation** : Utilisation régulière hebdomadaire (objectif : 100% des semaines prévues)
- **Temps de session** : Sessions de 5-10 minutes (objectif : < 10 min/semaine)
- **Taux de confiance** : Sentiment de confiance totale dans l'outil (mesure qualitative)

**2. Efficacité temporelle :**
- **Temps de booking** : ≤ 5 minutes par semaine (objectif : réduction de plusieurs heures à 5 min)
- **Temps de gestion projet** : ≤ 5 minutes par semaine (objectif : consultation rapide)
- **Temps total gestion** : ≤ 10 minutes par semaine (objectif : maximum)

**3. Efficacité booking :**
- **Effort manuel** : Quasi zéro effort personnel requis (objectif : automatisation complète)
- **Nombre de dates obtenues** : 20 dates par an (objectif : avec effort minimal)
- **Taux de réponse** : À mesurer selon les campagnes de mailing automatisées

**4. Qualité et précision :**
- **Taux d'oubli** : 0% (objectif : réduction de 10% actuel à 0%)
- **Taux d'erreur** : 0% d'erreurs dans les projets (objectif : projets sans frustration ni erreur)
- **Précision timeline** : Timeline précise et à jour (mesure qualitative)

**5. Réduction de charge mentale :**
- **Sentiment de confiance** : Connexion sans hésitation, sentiment que tout est là (mesure qualitative)
- **Mode réalisation vs gestion** : Passage du mode "gestion" au mode "réalisation" (mesure qualitative)
- **Focus création** : Temps libéré pour la création artistique (mesure quantitative : heures/semaine)

**KPIs qualitatifs (mesures subjectives mais importantes) :**
- "Je m'y connecte sans hésiter"
- "Je sais que tout est là et que je n'ai rien oublié"
- "J'ai confiance en mon outil"
- "Les tournées se gèrent toutes seules"
- "Je suis dans la réalisation plutôt que dans la gestion"

**KPIs pour évolution future (post-bêta) :**
- À définir selon les besoins identifiés lors de l'usage bêta
- Validation que l'outil répond à un besoin généralisé
- Métriques d'adoption et de satisfaction pour la communauté

---

## MVP Scope

### Core Features

**Fonctionnalités essentielles pour le MVP (Version 1 - Bêta Personnelle) :**

#### **1. Booking Automatisé (Priorité Absolue)**

**Base de données de contacts scrapées :**
- Base de données performante avec contacts scrapées à jour
- Attributs essentiels correctement capturés (nom, capacité, style, région, contacts, etc.)
- Utilisation à bon escient des données scrapées
- Connexion relationnelle entre salles et contacts
- Détection d'obsolescence et mise à jour automatique

**Campagnes de mailing automatisées :**
- Templates de mail préécrits mais modifiables
- Programmes d'envoi préécrits mais modifiables
- Variables personnalisées qui fonctionnent (nom, propriétés de la salle, etc.)
- Personnalisation selon propriétés (capacité, région, style)
- Envoi automatique des campagnes

**Relances automatiques :**
- Système de relances qui fonctionne
- Paramétrage des relances (15j, 21j, dernière relance)
- Classification automatique des contacts (répondant/non-répondant)

**Tableau de booking :**
- Tableau de booking fonctionnel
- Visualisation des campagnes en cours
- Suivi des réponses et statuts
- Gestion des dates obtenues

#### **2. Tableau de Bord "What's Next" (Important pour V1)**

**Raison d'inclusion en MVP :**
- Très important pour réduire la charge cognitive
- Difficile à intégrer après si pas fait en V1
- Essentiel pour créer la confiance et l'adoption

**Fonctionnalités minimales :**
- Vue d'ensemble de l'état des projets
- Prochaines étapes clairement identifiées
- Informations essentielles en un coup d'œil
- Guidance sur ce qu'il faut faire ensuite

#### **3. Gestion de Projet avec Timing et Calendrier**

**Gestion de projet :**
- Structure de projet adaptée aux besoins musicaux
- Idée de timing et calendrier intégrée
- Étapes à suivre pour les différents projets
- Visualisation de la progression

**Bases de données associées :**
- Base de données de contacts (salles) connectée à la gestion de projet
- Base de données relationnelle fonctionnelle
- Données partagées entre gestion de projet et booking

**Fiches contacts simplifiées (MVP) :**
- Fiches contacts/lieux/médias peuvent être simplifiées en MVP
- Données connectées et bien connectées (important)
- Contenu peut être plus léger qu'à terme
- À terme : fiches complètes et bien connectées entre elles (3 typologies : contacts, lieux, médias)

#### **4. UX Claire et Prête à l'Emploi**

**Interface utilisateur :**
- UX claire et bien ficelée
- Mix prêt à l'emploi
- Peut être itérative et améliorée progressivement si pas parfaite dès le début

### Out of Scope for MVP

**Fonctionnalités reportées à V2 ou versions ultérieures :**

**1. Gestion des documents :**
- Stockage centralisé complet des documents
- Gestion avancée des versions de fichiers
- Génération de packages de fichiers (peut être simplifié en MVP)

**2. Gestion des équipes :**
- Comptes collaborateurs
- Partage d'informations avec équipe
- Coordination avec musiciens/techniciens

**3. Gestion des contacts médias :**
- Scraping de données médias
- Campagnes de mailing aux médias
- Module complet contacts médias (similaire au booking)

**4. Gestion financière :**
- Enveloppes budgétaires par étape
- Suivi dépenses/gains en temps réel
- Estimation de viabilité financière

**5. Gestion de l'enregistrement et sortie :**
- Suivi complet du processus d'enregistrement
- Gestion des visuels
- Distribution et coordination des sorties

**6. Gestion de la communication :**
- Planification de contenu multi-plateformes
- Mesure d'impact
- Intégration newsletter

**7. Archives et références :**
- Archivage des anciens projets
- Gestion des références et inspirations

**8. Application mobile :**
- Version mobile de l'application (à terme, pas en V1)

**9. Fiches contacts complètes :**
- Fiches contacts/lieux/médias complètes et sophistiquées (simplifiées en MVP)

### MVP Success Criteria

**Critères de succès pour valider le MVP :**

**1. Booking fonctionne vraiment :**
- Le système de booking automatisé fonctionne de bout en bout
- Les campagnes de mailing sont envoyées automatiquement
- Les relances fonctionnent correctement
- Le scraping fournit des données utilisables

**2. Scraping fonctionne :**
- Le scraping de données salles/contacts fonctionne
- Les données scrapées sont à jour et utilisables
- La base de données est performante avec les bons attributs
- Le scraping est essentiel pour que le booking fonctionne

**3. Gestion de projet fonctionnelle :**
- La structure de projet est adaptée aux besoins musicaux
- Le timing et calendrier sont intégrés et fonctionnels
- Les étapes à suivre sont clairement identifiées

**4. Tableau de bord guidant :**
- Le tableau de bord "what's next" guide efficacement l'utilisateur
- Réduction de la charge cognitive observable
- Confiance dans l'outil développée

**5. Utilisation régulière :**
- Utilisation hebdomadaire régulière sans hésitation
- L'outil devient le centre du projet
- Confiance que toutes les informations sont là

**Critères de validation pour passage post-MVP :**
- Le booking fonctionne et répond aux besoins identifiés
- Réduction mesurable du temps de gestion (objectif : 5 min/semaine booking)
- Confiance totale dans l'outil développée
- Utilisation régulière et adoption établie

### Future Vision

**Vision à long terme (post-MVP) :**

**Phase 2 - Fonctionnalités complémentaires :**
- Gestion complète des contacts médias (scraping + mailing similaire au booking)
- Gestion financière intégrée (enveloppes, suivi temps réel)
- Gestion de l'enregistrement et sortie (suivi complet du processus)
- Gestion de la communication (planification contenu, mesure impact)
- Fiches contacts complètes et sophistiquées (3 typologies bien connectées)

**Phase 3 - Collaboration et équipe :**
- Comptes collaborateurs pour personnes proches
- Partage d'informations et calendrier avec équipe
- Coordination avec musiciens/techniciens

**Phase 4 - Expérience utilisateur avancée :**
- Application mobile pour accès partout
- Génération automatique de packages de fichiers sophistiqués
- Archives et références pour projets passés
- Intégrations API avec outils existants (Meta, Buffer, distro-kids)

**Phase 5 - Ouverture à la communauté :**
- Mise en ligne pour autres musiciens
- Modèle économique accessible (gratuit ou très abordable)
- Scaling de la base de données et infrastructure
- Support communautaire et documentation

**Vision stratégique :**
- Flowen App devient la plateforme de référence pour la gestion de projet musical pour amateurs/semi-professionnels
- Solution complète couvrant tout le cycle de vie d'un projet musical
- Automatisation maximale permettant aux artistes de se concentrer sur la création
- Réduction significative de la charge mentale et du temps administratif pour toute la communauté des musiciens en développement

---
