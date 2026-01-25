---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
inputDocuments: 
  - 'bmad_output/planning-artifacts/prd.md'
  - 'bmad_output/planning-artifacts/product-brief-Flowen App-2026-01-18.md'
  - 'bmad_output/planning-artifacts/research/market-outils-gestion-musiciens-research-2026-01-18.md'
  - 'bmad_output/analysis/brainstorming-session-2026-01-18.md'
project_name: Flowen App
user_name: Laura
date: 2026-01-18
---

# UX Design Specification Flowen App

**Author:** Laura
**Date:** 2026-01-18

---

## Executive Summary

### Project Vision

Flowen App automatise et simplifie tous les aspects non-artistiques de la gestion d'un projet musical, avec un focus prioritaire sur le booking automatisé via scraping de données et campagnes de mailing intelligentes. 

**Différenciateur clé :** La combinaison unique scraping + booking + mailing + gestion de projet musical - une combinaison qui n'existe pas ailleurs sur le marché.

**Vision utilisateur :** Réduire drastiquement la charge mentale et le temps administratif pour permettre aux musiciens de se concentrer sur la création artistique. L'outil devient la source de vérité unique, éliminant le sentiment de "ne pas savoir quoi faire ensuite" et permettant le passage du mode "gestion" au mode "réalisation".

**Approche :** Outil personnel en bêta pour usage individuel, validation par usage réel avant éventuelle ouverture à la communauté.

### Target Users

**Utilisateur principal :** Porteurs de projets musicaux (musiciens amateurs/semi-professionnels) qui gèrent seuls la complexité administrative de leurs projets.

**Profil type détaillé :**
- **Persona principale (Laura)** : 33 ans, développeuse web à 80%, musicienne à 20%
- **Rythme de travail** : Travaille sur la musique tous les vendredis
- **Triple casquette** : Artiste + développeuse + gestionnaire de projet
- **Contexte** : 15 jours de tournée par an, charge mentale élevée entre création artistique et gestion administrative

**Profil élargi :**
- Musiciens amateurs ou semi-professionnels en voie de développement
- Budget limité, pas d'équipe dédiée pour la gestion
- Érudits en technologie (à l'aise avec réseaux sociaux, outils numériques) mais pas forcément techniques dans la gestion de projet
- Très motivés, très occupés, passionnés par leur projet musical
- Journée/semaine fragmentée (parfois en studio, parfois chez soi, parfois en tournée)

**Contexte d'usage :**
- **Usage régulier** : Intégration dans le workflow hebdomadaire (ex: tous les vendredis)
- **Usage ponctuel** : Consultation rapide pour savoir "où j'en suis" et "what's next"
- **Sessions** : Courtes (5-10 minutes) pour consultation et actions rapides
- **Appareils** : Desktop principal, mobile à terme pour consultation en déplacement

**Problèmes vécus :**
- Charge mentale insurmontable entre création artistique et gestion administrative
- Difficulté à ne rien oublier dans un projet complexe avec de nombreuses étapes
- Temps perdu sur des tâches répétitives (booking, mailing, relances)
- Frustration face à la complexité de gestion qui empêche de se concentrer sur la création
- Manque de structure adaptée aux projets musicaux (les outils génériques ne correspondent pas)

**Vision du succès :**
- Ne rien oublier grâce à une structure adaptée et un système qui guide
- Réduction drastique de la charge mentale en déléguant la gestion à l'outil
- Gain de temps et efficacité dans l'organisation globale
- Automatisation et accélération de toute la partie booking et classement des données de contact
- Pouvoir se concentrer sur la création artistique plutôt que sur l'administration

### Key Design Challenges

**1. Réduction de la charge cognitive**
- Créer une interface qui guide sans surcharger l'utilisateur
- Concevoir un tableau de bord "what's next" vraiment efficace qui élimine le sentiment "je ne sais pas quoi faire"
- Système qui empêche les oublis sans être intrusif ou stressant
- Équilibre entre information complète et simplicité visuelle

**2. Complexité de l'automatisation rendue simple**
- Rendre la configuration du scraping accessible et compréhensible pour des utilisateurs non-techniques
- Paramétrage des templates et relances intuitif malgré la complexité sous-jacente
- Transparence sur ce qui se passe automatiquement sans surcharger l'interface
- Feedback clair sur les actions automatiques pour maintenir la confiance

**3. Gestion de données relationnelles complexe**
- Visualisation claire des connexions salles ↔ contacts dans une interface compréhensible
- Correction des erreurs de scraping simple et non-frustrante
- Identification visuelle efficace des données incomplètes/erronées sans créer d'anxiété
- Équilibre entre vue d'ensemble et détails nécessaires

**4. Multi-contextualité (projet musical vs booking vs médias)**
- Navigation fluide entre différents modules sans perte de contexte
- Cohérence des données partagées entre modules (salles, contacts, projets)
- Vue d'ensemble qui permet de comprendre l'état global sans se perdre dans les détails
- Structure adaptée aux workflows musicaux sans être trop rigide

**5. Performance et fiabilité visibles**
- Indicateurs clairs de fiabilité du scraping pour maintenir la confiance
- Feedback en temps réel sur l'état des campagnes sans être intrusif
- Transparence sur la qualité des données sans créer de doute
- Gestion des erreurs de manière constructive et actionnable

### Design Opportunities

**1. Tableau de bord guidant comme différenciateur majeur**
- Système proactif qui indique clairement les prochaines étapes à accomplir
- Réduction drastique du sentiment "je ne sais pas quoi faire ensuite"
- Avantage concurrentiel fort : aucun concurrent n'offre cette guidance proactive
- Opportunité de créer une expérience vraiment différente qui libère l'utilisateur

**2. Automatisation visible et contrôlable**
- Feedback clair et rassurant sur les actions automatiques en cours
- Contrôle utilisateur maintenu même avec automatisation maximale
- Transparence qui construit la confiance plutôt que de créer de l'anxiété
- Visualisation de la valeur créée par l'automatisation (temps économisé, dates obtenues)

**3. Structure adaptée aux projets musicaux**
- Workflows préconstruits qui correspondent vraiment à la réalité musicale
- Langage et métaphores du domaine musical plutôt que génériques
- Expérience qui "parle" aux musiciens et comprend leurs besoins spécifiques
- Cases et processus paramétrables mais optimisés par défaut pour les projets musicaux

**4. Réduction de charge mentale comme valeur centrale**
- Interface qui réduit activement la charge cognitive plutôt que de l'ajouter
- Système qui empêche les oublis et guide vers l'action
- Automatisation maximale qui libère l'artiste vers la création
- Focus sur l'essentiel pour libérer l'utilisateur mentalement

**5. Expérience de confiance et sérénité**
- Design qui inspire confiance et sérénité plutôt que stress
- Source de vérité unique qui élimine le doute
- Feedback positif sur les progrès et résultats obtenus
- Sentiment de contrôle et de maîtrise même avec automatisation maximale

## Core User Experience

### Defining Experience

**Action principale :** Consultation du tableau de bord "what's next" - action quotidienne ou ad libitum qui constitue le cœur de l'expérience utilisateur. C'est l'interaction la plus fréquente et la plus critique à rendre sans effort.

**Interactions critiques :**
- Consultation hebdomadaire du tableau de bord (action principale)
- Paramétrage et lancement de campagne de booking (action trimestrielle, peut être plus complexe)
- Suivi des campagnes de booking (intégré au tableau de bord, doit être simple)
- Accès aux fiches de contact/lieux/médias (doit être très simple)

**Expérience sans effort :**
- "What's next" immédiat et sans réflexion à l'ouverture
- Ajout/modification de contacts/lieux/médias très simple
- Mise à jour manuelle de données (correction scraping) simple et accessible
- Suivi de l'état des campagnes intégré au tableau de bord, visible en un coup d'œil

**Complexité acceptable :**
- Paramétrage de campagne peut être plus complexe (action trimestrielle isolée, moins fréquente)
- Configuration initiale peut être plus complexe pour le MVP (utilisateur principal fait le paramétrage)

### Platform Strategy

**Plateforme principale :** Web application Desktop - outil essentiellement utilisé sur ordinateur avec interaction clavier/souris.

**Architecture :**
- Architecture permettant migration simple vers application mobile native (React/Next.js → React Native)
- Support mobile navigateurs MVP : acceptable mais pas optimal, focus sur version desktop
- Pas de fonctionnalités hors ligne dans un premier temps

**Technologies d'interaction :**
- AJAX pour mises à jour de données sans refresh complet (contacts, campagnes, tableau de bord)
- Mises à jour partielles pour améliorer l'expérience utilisateur sans rechargement de page

**Priorité de design :**
- Design UX desktop optimisé en priorité
- Design mobile acceptable mais secondaire pour le MVP

### Effortless Interactions

**Interactions sans réflexion :**
- "What's next" immédiat à l'ouverture du tableau de bord
- Compréhension de l'état global du projet en un coup d'œil
- Ajout/modification de contacts/lieux/médias très simple

**Moment magique :**
- Les dates qui tombent "toutes seules" grâce aux réponses positives aux demandes de booking automatisées
- Sensation que l'entièreté du projet est intégrée avec visibilité concrète de ce qui est fait, ce qui reste à faire, et comment vont tous les dossiers

**Automatisation visible :**
- Relances automatiques des campagnes (transparentes mais visibles)
- Détection d'obsolescence des données (signalée mais non intrusive)
- Mise à jour automatique des statuts de campagnes (AJAX, sans refresh)

**Réduction de friction :**
- Templates pré-écrits optimisés pour les campagnes de mailing
- Workflows préconstruits adaptés aux projets musicaux (création EP, sortie EP, tournées, etc.)
- Élimination de la fragmentation entre plusieurs outils (tout dans un seul outil)

### Critical Success Moments

**Moments de réalisation de valeur :**
- **Première consultation du tableau de bord** : L'utilisateur voit immédiatement "what's next" et comprend où il en est
- **Premier lancement de campagne** : La campagne se lance automatiquement avec relances programmées
- **Première date obtenue automatiquement** : Réponse positive reçue sans démarchage manuel - moment magique
- **Consultation régulière** : Chaque consultation hebdomadaire confirme que tout est géré, rien n'est oublié

**Moments make-or-break :**
- **Consultation hebdomadaire du tableau de bord** : Si le "what's next" n'est pas clair, l'outil perd sa valeur principale
- **Paramétrage et lancement de campagne** : Si trop complexe ou frustrant, l'utilisateur abandonne
- **Suivi des campagnes** : Si l'état n'est pas visible facilement, perte de confiance dans l'automatisation

**Succès du premier utilisateur :**
- À la première connexion : Le tableau de bord affiche clairement "what's next"
- Au premier lancement de campagne : La campagne se lance et les relances sont programmées automatiquement
- À la première date obtenue : Réalisation que le système fonctionne et que les tournées se gèrent "toutes seules"

### Experience Principles

**1. Le tableau de bord comme cœur de l'expérience**
- Toute l'expérience tourne autour de la consultation régulière du tableau de bord
- "What's next" doit être immédiat, sans réflexion, et toujours à jour
- Le tableau de bord intègre tous les éléments : projets, campagnes, prochaines étapes

**2. Simplicité pour les actions fréquentes, complexité acceptable pour les rares**
- Actions quotidiennes (consultation, ajout contact) : extrêmement simples
- Actions trimestrielles (paramétrage campagne) : peuvent être plus complexes
- Configuration initiale : peut être complexe pour MVP (utilisateur principal fait le paramétrage)

**3. Spécificité musicale comme différenciateur**
- Workflows préconstruits vraiment adaptés aux projets musicaux (EP, tournées, etc.)
- Langage et métaphores du domaine musical, pas générique
- Templates présents mais adaptables selon besoins spécifiques

**4. Automatisation visible et magique**
- Feedback clair sur ce qui se passe automatiquement (relances, mises à jour)
- Moment magique : dates qui tombent "toutes seules"
- Visibilité concrète de la valeur créée (temps économisé, dates obtenues)

**5. Confiance et sérénité**
- Source de vérité unique : visibilité complète de ce qui est fait, à faire, état de tous les dossiers
- Système qui empêche les oublis sans être intrusif
- Sentiment que tout est géré, rien n'est oublié, on peut se concentrer sur la création

**6. Focus desktop avec architecture évolutive**
- Design optimisé pour desktop (clavier/souris) en priorité
- Architecture permettant migration simple vers mobile
- Mobile MVP acceptable mais secondaire

## Desired Emotional Response

### Primary Emotional Goals

**Sérénité et confiance :**
- Sentiment que tout est géré, rien n'est oublié
- Confiance totale dans l'outil comme source de vérité unique
- Sérénité face à la complexité administrative désormais gérée automatiquement
- Apaisement lors de la consultation du tableau de bord

**Contrôle et maîtrise :**
- Sentiment de contrôle maintenu malgré l'automatisation maximale
- Confiance que les automatisations sont transparentes et adaptables
- Maîtrise sur la correction des erreurs et l'ajustement des paramètres
- Pas d'anxiété liée à une perte de contrôle

**Simplicité et clarté :**
- Tableau de bord reposant et apaisant, sans surcharge cognitive
- Clarté immédiate sur "what's next" sans réflexion
- Simplicité dans le suivi quotidien une fois le paramétrage fait
- Design qui guide et "baby-sit" l'utilisateur sans être intrusif

### Emotional Journey Mapping

**Phase 1 - Paramétrage initial (complexe mais nécessaire) :**
- **Émotion** : Acceptation de la complexité car elle permet une automatisation performante
- **Sentiment** : Investissement dans la configuration pour obtenir un résultat optimal
- **Design** : Espaces de paramétrage complets, peuvent être complexes car action rare

**Phase 2 - Consultation quotidienne du tableau de bord (simple et apaisant) :**
- **Émotion** : Sérénité, confiance, clarté immédiate
- **Sentiment** : "Je sais exactement où j'en suis, je sais quoi faire"
- **Design** : Tableau de bord simple, reposant, orienté utilisateur, guidant

**Phase 3 - Suivi et contrôle (transparent et actionnable) :**
- **Émotion** : Confiance maintenue, contrôle préservé
- **Sentiment** : "Je peux voir ce qui se passe, je peux intervenir si besoin"
- **Design** : Transparence sur l'automatisation, possibilité de correction toujours accessible

**Phase 4 - Moment magique (dates obtenues automatiquement) :**
- **Émotion** : Émerveillement discret, satisfaction de voir que ça fonctionne
- **Sentiment** : "Les tournées se gèrent toutes seules, c'est incroyable"
- **Design** : Feedback clair mais pas gadget, solidité avant tout

**Phase 5 - Retour régulier (confiance renforcée) :**
- **Émotion** : Confiance renforcée, familiarité, efficacité
- **Sentiment** : "Je m'y connecte sans hésiter, je sais que tout est là"
- **Design** : Expérience cohérente, prévisible, rassurante

### Micro-Emotions

**États émotionnels critiques à créer :**

**Confiance (vs Scepticisme) :**
- Confiance totale dans l'outil comme source de vérité unique
- Confiance que l'automatisation fonctionne correctement
- Confiance que les données sont à jour et fiables

**Sérénité (vs Anxiété) :**
- Apaisement face à la complexité administrative désormais gérée
- Sérénité lors de la consultation du tableau de bord
- Absence d'anxiété liée à la perte de contrôle

**Clarté (vs Confusion) :**
- Clarté immédiate sur "what's next" sans réflexion
- Compréhension claire de l'état global du projet
- Absence de confusion sur ce qui est fait, à faire, ou en cours

**Contrôle (vs Impuissance) :**
- Sentiment de contrôle maintenu malgré l'automatisation
- Possibilité de corriger les erreurs et ajuster les paramètres
- Transparence sur ce qui se passe automatiquement

**États émotionnels à éviter :**

**Frustration :**
- Si la correction des erreurs est impossible
- Si le paramétrage est trop complexe sans justification
- Si le tableau de bord n'est pas clair

**Anxiété :**
- Si l'automatisation semble incontrôlable
- Si les données ne sont pas fiables
- Si le système ne guide pas clairement

**Confusion :**
- Si le "what's next" n'est pas évident
- Si l'interface est surchargée d'informations
- Si la navigation entre modules n'est pas claire

### Design Implications

**1. Dualité paramétrage vs suivi :**

**Espaces de paramétrage (complexes mais nécessaires) :**
- Design complet et détaillé pour permettre une automatisation performante
- Complexité acceptable car actions rares (trimestrielles)
- Tous les paramètres nécessaires disponibles aux bons endroits
- Investissement initial pour résultat optimal

**Tableau de bord de suivi (simple et apaisant) :**
- Design simple, reposant, orienté utilisateur
- Guidant et "baby-sitting" sans être intrusif
- Focus sur l'essentiel : "what's next" et état global
- Apaisant visuellement, sans surcharge cognitive

**2. Transparence et contrôle :**

**Transparence sur l'automatisation :**
- Feedback clair sur ce qui se passe automatiquement (relances, mises à jour)
- Visibilité sur l'état des campagnes et des automatisations
- Indicateurs de fiabilité sans créer d'anxiété

**Contrôle utilisateur maintenu :**
- Possibilité de corriger les erreurs toujours accessible
- Paramètres ajustables même après configuration initiale
- Intervention manuelle possible quand nécessaire

**3. Solidité avant gadgets :**

**Pas de visualisations superflues :**
- Éviter les petits suppléments sans valeur ajoutée immédiate
- Pas de gadgets ou animations inutiles
- Focus sur la solidité et la fiabilité avant l'émerveillement

**Feedback essentiel uniquement :**
- Informations vraiment importantes affichées proprement
- Pas de redondance mais exhaustivité sur les valeurs importantes
- Choix judicieux des données à afficher

**4. Choix des données affichées :**

**Tableau de bord non redondant mais exhaustif :**
- Afficher les bonnes données aux bons endroits
- Pas de répétition d'informations
- Exhaustivité sur les valeurs importantes (état projets, campagnes, prochaines étapes)
- Choix clair de ce qui mérite d'être affiché vs ce qui peut être masqué

**5. Design apaisant et reposant :**

**Esthétique visuelle :**
- Design qui inspire sérénité plutôt que stress
- Espacement généreux, pas de surcharge visuelle
- Hiérarchie claire de l'information
- Couleurs et typographie apaisantes

**Expérience guidante :**
- Système qui guide sans être intrusif
- "Baby-sitting" discret mais efficace
- Clarté immédiate sur les actions à prendre

### Emotional Design Principles

**1. Dualité design : complexité pour paramétrage, simplicité pour suivi**
- Espaces de paramétrage complets et détaillés (complexité acceptable pour actions rares)
- Tableau de bord simple, apaisant, reposant (simplicité pour usage quotidien)
- Séparation claire entre les deux modes d'interaction

**2. Transparence et contrôle comme fondations de la confiance**
- Transparence totale sur l'automatisation sans créer d'anxiété
- Contrôle utilisateur toujours maintenu et accessible
- Possibilité de correction et d'ajustement à tout moment

**3. Solidité avant émerveillement**
- Focus sur la fiabilité et la robustesse avant les gadgets
- Pas de visualisations superflues sans valeur ajoutée immédiate
- Design qui inspire confiance par sa solidité

**4. Choix judicieux des données affichées**
- Tableau de bord non redondant mais exhaustif sur l'essentiel
- Affichage des bonnes données aux bons endroits
- Équilibre entre simplicité et exhaustivité

**5. Design apaisant qui réduit la charge cognitive**
- Esthétique visuelle reposante et sereine
- Guidance discrète mais efficace
- Clarté immédiate sans surcharge cognitive

**6. Confiance renforcée par la cohérence**
- Expérience prévisible et cohérente à chaque consultation
- Système fiable qui renforce la confiance au fil du temps
- Familiarité qui crée un sentiment de sécurité

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Monday.com - Gestion de projet :**

**Points forts UX identifiés :**
- Interface claire mais complète et efficace
- Excellente connexion des données entre différents modules
- Hiérarchie de l'information bien pensée
- Choix judicieux de ce qui est affiché et où

**Patterns transférables pour Flowen App :**
- Connexion relationnelle des données visible et compréhensible (salles ↔ contacts)
- Tableau de bord avec informations essentielles bien organisées
- Navigation claire entre différents modules (projets, booking, contacts)

**Spotify for Artists - Application musicale :**

**Points forts UX identifiés :**
- Interface claire mais complète et efficace
- Excellente connexion des données (analytics, releases, audience)
- Design qui comprend le domaine musical
- Visualisation des données pertinentes sans surcharge

**Patterns transférables pour Flowen App :**
- Compréhension du domaine musical dans le design
- Connexion des données entre différents aspects du projet musical
- Interface complète mais claire, pas de surcharge cognitive
- Focus sur les données vraiment importantes pour les musiciens

**Notion - Gestion de projet :**

**Points forts UX identifiés :**
- Flexibilité dans l'organisation
- Système de blocs modulaires
- Navigation claire malgré la complexité

**Patterns transférables pour Flowen App :**
- Flexibilité dans l'organisation des projets musicaux
- Système modulaire pour les workflows préconstruits
- Navigation claire malgré la complexité sous-jacente

**Brevo, Meta, Buffer - Marketing/Communication :**

**Points forts UX identifiés :**
- Interface fonctionnelle pour campagnes automatisées
- Paramétrage de campagnes accessible
- Suivi des résultats clair

**Patterns transférables pour Flowen App :**
- Paramétrage de campagnes de mailing accessible
- Suivi des campagnes intégré au tableau de bord
- Feedback clair sur l'état des campagnes automatisées

### Transferable UX Patterns

**1. Connexion des données visible et efficace :**
- **Source** : Monday.com, Spotify for Artists
- **Application** : Visualisation claire des connexions salles ↔ contacts dans Flowen App
- **Bénéfice** : Compréhension immédiate des relations entre données

**2. Choix judicieux des informations affichées :**
- **Source** : Monday.com, Spotify for Artists
- **Application** : Tableau de bord avec bonnes données aux bons endroits, non redondant mais exhaustif
- **Bénéfice** : Clarté sans surcharge cognitive

**3. Interface claire mais complète :**
- **Source** : Monday.com, Spotify for Artists
- **Application** : Design complet pour paramétrage, simple pour suivi quotidien
- **Bénéfice** : Efficacité sans sacrifier la complétude

**4. Compréhension du domaine dans le design :**
- **Source** : Spotify for Artists
- **Application** : Workflows préconstruits adaptés aux projets musicaux, langage du domaine
- **Bénéfice** : Expérience qui "parle" aux musiciens

**5. Paramétrage accessible malgré la complexité :**
- **Source** : Brevo, Meta, Buffer
- **Application** : Configuration des campagnes de booking accessible même si complète
- **Bénéfice** : Automatisation performante sans frustration

**6. Suivi intégré au tableau de bord :**
- **Source** : Brevo, Buffer
- **Application** : État des campagnes visible directement dans le tableau de bord principal
- **Bénéfice** : Vue d'ensemble sans navigation supplémentaire

### Anti-Patterns to Avoid

**1. Surcharge d'informations sur le tableau de bord :**
- **Anti-pattern** : Afficher trop d'informations simultanément sans hiérarchie claire
- **Pourquoi éviter** : Crée de la confusion et va à l'encontre de l'objectif de sérénité
- **Solution** : Choix judicieux des données essentielles, hiérarchie claire

**2. Navigation complexe entre modules :**
- **Anti-pattern** : Perte de contexte lors de la navigation entre projets, booking, contacts
- **Pourquoi éviter** : Fragmente l'expérience et réduit l'efficacité
- **Solution** : Navigation fluide avec maintien du contexte, données partagées cohérentes

**3. Paramétrage trop simplifié au détriment de la performance :**
- **Anti-pattern** : Simplifier à l'extrême le paramétrage au point de limiter l'automatisation
- **Pourquoi éviter** : Réduit l'efficacité de l'automatisation, frustre l'utilisateur
- **Solution** : Paramétrage complet mais bien organisé, complexité acceptable pour actions rares

**4. Manque de connexion entre données :**
- **Anti-pattern** : Données isolées sans liens visibles (salles séparées des contacts)
- **Pourquoi éviter** : Réduit la compréhension et l'efficacité
- **Solution** : Visualisation claire des connexions relationnelles

**5. Feedback insuffisant sur l'automatisation :**
- **Anti-pattern** : Automatisation invisible, utilisateur ne sait pas ce qui se passe
- **Pourquoi éviter** : Crée de l'anxiété et réduit la confiance
- **Solution** : Transparence sur l'automatisation sans surcharge

**6. Design générique sans spécificité musicale :**
- **Anti-pattern** : Interface générique qui pourrait être pour n'importe quel projet
- **Pourquoi éviter** : Ne répond pas aux besoins spécifiques des musiciens
- **Solution** : Workflows préconstruits adaptés, langage du domaine musical

### Design Inspiration Strategy

**What to Adopt:**

**1. Connexion des données efficace (Monday.com, Spotify for Artists) :**
- Adopter la visualisation claire des relations entre données
- Appliquer à la connexion salles ↔ contacts dans Flowen App
- Bénéfice : Compréhension immédiate, efficacité accrue

**2. Choix judicieux des informations (Monday.com, Spotify for Artists) :**
- Adopter le principe de "bonnes données aux bons endroits"
- Appliquer au tableau de bord : non redondant mais exhaustif sur l'essentiel
- Bénéfice : Clarté sans surcharge cognitive

**3. Interface claire mais complète (Monday.com, Spotify for Artists) :**
- Adopter le principe de complétude sans sacrifier la clarté
- Appliquer à la dualité paramétrage (complet) vs suivi (simple)
- Bénéfice : Efficacité maximale dans les deux contextes

**4. Compréhension du domaine (Spotify for Artists) :**
- Adopter l'approche de design qui comprend le domaine musical
- Appliquer aux workflows préconstruits et au langage utilisé
- Bénéfice : Expérience qui "parle" vraiment aux musiciens

**What to Adapt:**

**1. Paramétrage de campagnes (Brevo, Buffer) :**
- Adapter le pattern de paramétrage de campagnes pour le booking musical
- Simplifier pour le MVP mais garder la complétude nécessaire
- Adapter aux besoins spécifiques du booking (salles, contacts, templates musicaux)

**2. Tableau de bord modulaire (Notion) :**
- Adapter le système modulaire pour les workflows préconstruits musicaux
- Simplifier pour éviter la surcharge mais garder la flexibilité
- Adapter aux besoins spécifiques des projets musicaux

**What to Avoid:**

**1. Surcharge d'informations (anti-pattern) :**
- Éviter d'afficher trop d'informations simultanément
- Focus sur l'essentiel : "what's next" et état global
- Hiérarchie claire de l'information

**2. Navigation fragmentée (anti-pattern) :**
- Éviter la perte de contexte entre modules
- Maintenir la cohérence des données partagées
- Navigation fluide avec contexte préservé

**3. Simplification excessive (anti-pattern) :**
- Éviter de simplifier au point de réduire l'efficacité
- Garder la complétude nécessaire pour l'automatisation performante
- Complexité acceptable pour actions rares (paramétrage)

**4. Design générique (anti-pattern) :**
- Éviter l'interface générique qui ne comprend pas le domaine musical
- Adapter vraiment aux besoins spécifiques des musiciens
- Workflows préconstruits vraiment adaptés aux projets musicaux

**Design Principles Extracted:**

**1. Clarté avant simplicité :**
- La clarté vient du choix judicieux des informations, pas de la simplification excessive
- Interface claire mais complète plutôt que simple mais limitée

**2. Connexion visible des données :**
- Les relations entre données doivent être visibles et compréhensibles
- Connexion salles ↔ contacts claire dans l'interface

**3. Efficacité et fiabilité comme priorités :**
- L'efficacité et la fiabilité font revenir les utilisateurs
- Design qui maximise ces deux aspects

**4. Compréhension du domaine :**
- Le design doit comprendre le domaine musical
- Workflows et langage adaptés aux musiciens

**5. Dualité paramétrage/suivi :**
- Paramétrage complet mais bien organisé (actions rares)
- Suivi simple et apaisant (usage quotidien)

## Design System Foundation

### Design System Choice

**Choix : Tailwind CSS + Radix UI**

Combinaison de Tailwind CSS (système de design utilitaire) et Radix UI (composants headless React) pour Flowen App.

### Rationale for Selection

**1. Unicité visuelle :**
- Contrôle total du design avec Tailwind CSS
- Pas de contraintes visuelles d'un design system pré-construit
- Personnalisation complète pour créer un design vraiment adapté aux projets musicaux
- Permet la dualité design : paramétrage (complexe) vs suivi (simple et apaisant)

**2. Stack technique maîtrisée :**
- Tailwind CSS : déjà connu par l'équipe de développement
- React : expertise existante
- Radix UI : composants headless React avec logique d'accessibilité intégrée, style contrôlé par Tailwind

**3. Solidité et accessibilité :**
- Radix UI fournit des composants accessibles (Dialog, Dropdown, Tabs, Select, etc.)
- Tailwind CSS offre une base solide et performante
- Focus sur la fonctionnalité et la fiabilité, pas sur les gadgets

**4. Parfait pour le contexte :**
- Desktop-first avec possibilité de migration mobile native
- Design classique et propre inspiré de Monday.com et Spotify for Artists
- Flexibilité pour créer des interfaces complètes (paramétrage) et simples (suivi)

**5. Écosystème React mature :**
- Compatible avec Next.js (architecture cible pour migration React Native)
- Migration vers React Native facilitée
- Communauté active et documentation complète

### Implementation Approach

**Structure technique :**

**Tailwind CSS :**
- Configuration personnalisée avec design tokens (couleurs, typographie, espacements)
- Thème adapté aux objectifs émotionnels (sérénité, confiance, clarté)
- Classes utilitaires pour rapidité de développement
- Design tokens pour cohérence visuelle

**Radix UI :**
- Composants headless pour fonctionnalités complexes (Dialog, Dropdown, Tabs, Select, etc.)
- Accessibilité intégrée (ARIA, keyboard navigation, focus management)
- Style complètement contrôlé par Tailwind CSS
- Composants de base : Dialog, DropdownMenu, Tabs, Select, Checkbox, RadioGroup, etc.

**Architecture :**
- Design tokens personnalisés dans Tailwind config
- Composants React réutilisables basés sur Radix UI + Tailwind
- Système de composants modulaire pour cohérence
- Thème adaptatif pour paramétrage (complet) vs suivi (simple)

### Customization Strategy

**1. Design tokens personnalisés :**
- Couleurs : palette apaisante et professionnelle (inspirée de Monday.com, Spotify for Artists)
- Typographie : hiérarchie claire, lisibilité optimale
- Espacements : généreux pour design apaisant, pas de surcharge visuelle
- Ombres et bordures : subtiles pour sérénité

**2. Composants personnalisés :**
- Tableau de bord : composants spécifiques pour "what's next" et vue d'ensemble
- Paramétrage : composants complets pour configuration (formulaires complexes)
- Suivi : composants simples et apaisants pour consultation quotidienne
- Connexions de données : visualisation claire des relations salles ↔ contacts

**3. Patterns spécifiques au domaine musical :**
- Workflows préconstruits : composants adaptés aux projets musicaux
- Langage du domaine : labels et terminologie musicale
- Visualisations adaptées : campagnes de booking, suivi de projets musicaux

**4. Dualité design :**
- Mode paramétrage : composants complets, formulaires détaillés
- Mode suivi : composants simplifiés, interface apaisante
- Navigation claire entre les deux modes

**5. Accessibilité et performance :**
- Accessibilité intégrée via Radix UI
- Performance optimisée avec Tailwind (purge CSS, optimisations)
- Responsive design pour desktop-first avec support mobile acceptable

## 2. Core User Experience

### 2.1 Defining Experience

**L'expérience centrale : "J'ai mon project manager sur mon ordinateur"**

Flowen App est conçu comme un project manager dédié, personnalisé, expert en tournées et projets musicaux. L'expérience centrale est la consultation du tableau de bord qui répond immédiatement à deux questions essentielles : "Où j'en suis ?" et "Quelle est la prochaine étape ?"

**Phrase clé utilisateur :**
"J'ai mon project manager sur mon ordinateur" - l'application devient le gestionnaire de projet personnel, expert et centralisé pour tous les aspects d'un projet musical.

**Expérience centrale :**
- Consultation quotidienne du tableau de bord
- Vision immédiate de l'état global du projet
- Identification claire de la prochaine étape à accomplir
- Confiance que tout est géré, rien n'est oublié

**Première fonctionnalité charnière :**
La gestion du booking automatisé est la première fonctionnalité charnière qui démontre la valeur de l'outil global. Elle sert de fondation pour toutes les fonctionnalités futures qui seront centralisées dans le tableau de bord.

### 2.2 User Mental Model

**Modèle mental actuel :**
Les utilisateurs gèrent actuellement leurs projets musicaux avec des outils fragmentés :
- Outils de management de projet (génériques, pas adaptés musique)
- Outils de gestion de mailing (Brevo, etc.)
- Outils de gestion de campagnes de communication (Meta, Buffer)
- Outils de gestion de tournée (spécialisés mais isolés)

**Modèle mental désiré :**
Un outil global centralisé qui :
- Comprend vraiment les projets musicaux (expertise domaine)
- Centralise toutes les fonctionnalités dans un tableau de bord unique
- Devient le project manager personnel et expert
- Guide clairement vers les prochaines étapes

**Attentes utilisateur :**
- Tableau de bord qui guide et indique clairement "what's next"
- Visibilité complète de l'état global du projet en un coup d'œil
- Confiance que l'outil comprend vraiment la réalité du terrain musical
- Système qui empêche les oublis et guide vers l'action

**Points de confusion potentiels :**
- Si les workflows proposés ne correspondent pas à la réalité du terrain musical
- Si les interfaces et inputs ne reflètent pas les besoins réels des musiciens
- Si l'outil devient inutilisable car trop éloigné de la pratique réelle

**Solution :**
- Workflows préconstruits vraiment adaptés aux projets musicaux
- Interfaces et inputs qui correspondent à la réalité du terrain
- Validation continue que l'outil reste utilisable et pertinent

### 2.3 Success Criteria

**Critères de succès pour l'expérience centrale :**

**1. Clarté immédiate :**
- L'utilisateur sait exactement où il en est dès l'ouverture du tableau de bord
- La prochaine étape est clairement identifiée sans réflexion
- Pas de confusion sur ce qui est fait, à faire, ou en cours

**2. Confiance totale :**
- L'utilisateur a confiance que tout est géré, rien n'est oublié
- Le système guide efficacement sans être intrusif
- Sentiment que l'outil comprend vraiment les besoins musicaux

**3. Efficacité :**
- Consultation rapide (5-10 minutes) pour comprendre l'état global
- Actions claires et accessibles depuis le tableau de bord
- Pas de navigation complexe pour trouver l'information essentielle

**4. Pertinence :**
- Les workflows correspondent à la réalité du terrain musical
- Les interfaces et inputs sont adaptés aux besoins réels
- L'outil reste utilisable et pertinent dans la pratique

**5. Centralisation :**
- Toutes les fonctionnalités accessibles depuis le tableau de bord
- Pas de fragmentation entre différents outils
- Source de vérité unique pour le projet musical

**Indicateurs de succès :**
- Utilisation régulière sans hésitation (ex: tous les vendredis)
- Sentiment "je sais exactement où j'en suis et quoi faire"
- Confiance totale dans l'outil comme project manager personnel
- Réduction de la charge mentale observable

### 2.4 Novel UX Patterns

**Patterns établis à utiliser :**

**1. Tableau de bord centralisé (pattern établi) :**
- Pattern familier des outils de gestion de projet (Monday.com, Notion)
- Innovation : adaptation spécifique aux projets musicaux avec workflows préconstruits
- Twist unique : guidance proactive "what's next" plutôt que simple affichage

**2. Navigation modulaire (pattern établi) :**
- Pattern familier de navigation entre modules (projets, booking, contacts)
- Innovation : données partagées cohérentes entre modules, pas de fragmentation
- Twist unique : tableau de bord qui intègre tous les modules sans perte de contexte

**3. Paramétrage de campagnes (pattern établi) :**
- Pattern familier des outils de marketing (Brevo, Buffer)
- Innovation : adaptation au booking musical avec scraping intégré
- Twist unique : automatisation complète avec relances intelligentes

**Patterns novateurs à introduire :**

**1. Guidance proactive "what's next" :**
- Pattern novateur : système qui indique proactivement les prochaines étapes
- Éducation utilisateur : clarté immédiate, pas besoin d'apprentissage
- Métaphore familière : project manager personnel qui guide

**2. Workflows préconstruits adaptés au domaine musical :**
- Pattern novateur : workflows vraiment adaptés aux projets musicaux (EP, tournées, etc.)
- Éducation utilisateur : workflows intuitifs car ils correspondent à la réalité
- Métaphore familière : structure de projet musical comme dans la vraie vie

**3. Dualité design paramétrage/suivi :**
- Pattern novateur : deux modes distincts (complexe pour paramétrage, simple pour suivi)
- Éducation utilisateur : séparation claire entre les deux modes
- Métaphore familière : configuration vs utilisation quotidienne

**Combinaison innovante :**
- Combiner patterns établis (tableau de bord, navigation modulaire) avec patterns novateurs (guidance proactive, workflows musicaux)
- Créer une expérience vraiment différente tout en restant familière

### 2.5 Experience Mechanics

**Mécaniques de l'expérience centrale : Consultation du tableau de bord**

**1. Initiation :**

**Comment l'utilisateur commence :**
- Connexion à Flowen App (usage régulier hebdomadaire ou ponctuel)
- Arrivée immédiate sur le tableau de bord principal
- Pas d'écran d'accueil ou de navigation préalable nécessaire

**Ce qui invite à commencer :**
- Besoin de savoir "où j'en suis" dans le projet
- Besoin de connaître la prochaine étape à accomplir
- Vérification que tout est géré, rien n'est oublié

**2. Interaction :**

**Ce que l'utilisateur fait :**
- Consulte le tableau de bord en un coup d'œil
- Lit les informations essentielles : état des projets, campagnes en cours, prochaines étapes
- Identifie rapidement les actions à prendre

**Contrôles utilisés :**
- Vue d'ensemble du tableau de bord (scroll si nécessaire)
- Clics sur les éléments pour accéder aux détails si besoin
- Actions rapides directement depuis le tableau de bord

**Réponse du système :**
- Affichage immédiat des informations essentielles
- Hiérarchie claire : "what's next" en évidence
- Feedback visuel sur l'état des automatisations (campagnes, relances)

**3. Feedback :**

**Ce qui indique le succès :**
- Clarté immédiate sur "où j'en suis" et "what's next"
- Sentiment de confiance que tout est géré
- Compréhension de l'état global sans confusion

**Comment l'utilisateur sait que ça fonctionne :**
- Les prochaines étapes sont clairement identifiées
- L'état des projets et campagnes est visible
- Pas de sentiment d'oubli ou de confusion

**Si erreur ou confusion :**
- Navigation vers les détails pour clarifier
- Possibilité de corriger les données si nécessaire
- Système qui guide vers la résolution

**4. Completion :**

**Comment l'utilisateur sait qu'il a terminé :**
- A compris où il en est et quelle est la prochaine étape
- A pris connaissance des informations essentielles
- Sentiment de confiance et de clarté

**Résultat réussi :**
- Utilisateur sait exactement quoi faire ensuite
- Confiance que tout est géré, rien n'est oublié
- Réduction de la charge mentale

**Ce qui suit :**
- Action sur la prochaine étape identifiée (si nécessaire)
- Ou fermeture de l'application avec confiance
- Retour régulier pour consultation suivante

**Mécaniques secondaires : Actions depuis le tableau de bord**

**Actions rapides :**
- Accès direct aux modules principaux (projets, booking, contacts)
- Actions contextuelles depuis le tableau de bord
- Navigation fluide sans perte de contexte

**Suivi des automatisations :**
- Visibilité sur l'état des campagnes en cours
- Feedback sur les relances automatiques
- Indicateurs de fiabilité du scraping

## Visual Design Foundation

### Color System

**Palette principale - Neutres apaisants :**

**Couleurs de base (inspirées de Monday.com et Spotify for Artists) :**
- **Background principal** : Blanc pur (#FFFFFF) ou gris très clair (#FAFAFA) pour sérénité
- **Background secondaire** : Gris clair (#F5F5F5) pour différenciation subtile
- **Texte principal** : Gris foncé (#1A1A1A) pour lisibilité optimale
- **Texte secondaire** : Gris moyen (#6B7280) pour hiérarchie
- **Bordures** : Gris très clair (#E5E7EB) pour séparation subtile

**Couleurs sémantiques :**

**Primaire (confiance et action) :**
- **Primaire** : Bleu professionnel (#2563EB) - inspire confiance et professionnalisme
- **Primaire hover** : Bleu plus foncé (#1D4ED8)
- **Primaire light** : Bleu très clair (#DBEAFE) pour backgrounds subtils

**États fonctionnels :**
- **Succès** : Vert apaisant (#10B981) - pour confirmations et états positifs
- **Avertissement** : Orange doux (#F59E0B) - pour alertes non-critiques
- **Erreur** : Rouge doux (#EF4444) - pour erreurs, utilisé avec parcimonie
- **Info** : Bleu clair (#3B82F6) - pour informations et feedback

**Couleurs spécifiques au domaine musical :**
- **Accent musical** : Violet subtil (#7C3AED) - pour éléments spécifiques musique (optionnel, utilisé avec parcimonie)
- **Accent booking** : Teal professionnel (#14B8A6) - pour éléments liés au booking

**Accessibilité :**
- Tous les contrastes respectent WCAG AA minimum (4.5:1 pour texte normal, 3:1 pour texte large)
- Couleurs d'état accessibles même pour daltonisme (utilisation de formes et icônes en complément)

**Mapping sémantique :**
- **Primary** : Actions principales, liens importants, CTA
- **Success** : Confirmations, états positifs, accomplissements
- **Warning** : Alertes non-critiques, actions nécessitant attention
- **Error** : Erreurs, actions critiques nécessitant correction
- **Info** : Informations, feedback système, états neutres

### Typography System

**Choix de polices :**

**Police principale - Inter (ou système similaire) :**
- Police sans-serif moderne et professionnelle
- Excellente lisibilité à toutes les tailles
- Support complet des caractères
- Inspiration : Monday.com utilise des polices similaires (Inter, System UI)

**Police secondaire - System fonts :**
- Fallback vers les polices système pour performance
- Cohérence avec l'écosystème utilisateur

**Échelle typographique (basée sur ratio 1.25 - Major Third) :**

**Hiérarchie :**
- **H1 - Display** : 3.052rem (48.8px) - Titres principaux, hero sections
- **H2 - Heading Large** : 2.441rem (39px) - Sections principales
- **H3 - Heading Medium** : 1.953rem (31.2px) - Sous-sections
- **H4 - Heading Small** : 1.563rem (25px) - Titres de cartes, modules
- **H5 - Heading XS** : 1.25rem (20px) - Titres de sous-éléments
- **Body Large** : 1.125rem (18px) - Texte important, introductions
- **Body** : 1rem (16px) - Texte principal, contenu standard
- **Body Small** : 0.875rem (14px) - Métadonnées, labels secondaires
- **Caption** : 0.75rem (12px) - Légendes, notes, texte très petit

**Poids de police :**
- **Regular (400)** : Texte principal, contenu standard
- **Medium (500)** : Emphase légère, labels importants
- **Semibold (600)** : Titres de sections, éléments importants
- **Bold (700)** : Titres principaux, CTA, éléments critiques

**Hauteurs de ligne :**
- **Titres** : 1.2 (compact pour hiérarchie)
- **Body** : 1.6 (confortable pour lecture)
- **Petit texte** : 1.5 (équilibré)

**Espacement typographique :**
- Espacement généreux entre paragraphes (1.5rem)
- Marges cohérentes autour des titres
- Hiérarchie visuelle claire par taille et poids

**Tone :**
- Professionnel mais accessible
- Moderne sans être trop trendy
- Apaisant et rassurant
- Clarté avant tout

### Spacing & Layout Foundation

**Système d'espacement (basé sur 8px) :**

**Échelle d'espacement :**
- **0.5** : 4px - Espacement très serré (éléments liés)
- **1** : 8px - Espacement de base (espacement minimal)
- **2** : 16px - Espacement standard (entre éléments)
- **3** : 24px - Espacement moyen (sections)
- **4** : 32px - Espacement large (groupes d'éléments)
- **5** : 40px - Espacement très large (sections principales)
- **6** : 48px - Espacement extra-large (conteneurs)
- **8** : 64px - Espacement hero (grandes sections)
- **10** : 80px - Espacement maximum (séparations majeures)

**Application :**
- Espacement généreux pour design apaisant (minimum 16px entre éléments)
- Hiérarchie claire par espacement (plus d'espace = plus d'importance)
- Cohérence dans toute l'application

**Système de grille :**

**Desktop (priorité) :**
- **Container max-width** : 1280px (confortable pour desktop)
- **Grille** : 12 colonnes avec gutters de 24px
- **Marges latérales** : 32px minimum (responsive)
- **Breakpoints** : 
  - Mobile : 640px
  - Tablet : 768px
  - Desktop : 1024px
  - Large : 1280px

**Layout principles :**

**1. Espacement généreux :**
- Design apaisant avec espacement généreux entre éléments
- Pas de surcharge visuelle
- Respiration visuelle pour réduire la charge cognitive

**2. Hiérarchie claire :**
- Hiérarchie visuelle évidente par taille, espacement et couleur
- "What's next" toujours en évidence
- Information essentielle immédiatement visible

**3. Cohérence modulaire :**
- Composants avec espacement cohérent
- Réutilisation des mêmes valeurs d'espacement
- Système prévisible et rassurant

**4. Focus desktop :**
- Layout optimisé pour desktop (clavier/souris)
- Support mobile acceptable mais secondaire
- Largeur de contenu confortable pour consultation

**5. Flexibilité :**
- Grille flexible pour différents types de contenu
- Adaptation selon contexte (paramétrage vs suivi)
- Responsive mais desktop-first

**Composants spacing :**

**Tableau de bord :**
- Padding container : 32px
- Espacement entre sections : 40px
- Espacement entre cartes : 24px
- Padding interne cartes : 24px

**Paramétrage :**
- Padding container : 40px (plus d'espace pour complexité)
- Espacement entre champs : 24px
- Espacement entre sections : 48px

**Suivi :**
- Padding container : 32px
- Espacement réduit mais généreux : 16-24px
- Design apaisant et reposant

### Accessibility Considerations

**Contraste et lisibilité :**
- Tous les contrastes respectent WCAG AA minimum (4.5:1 pour texte normal, 3:1 pour texte large)
- Texte sur fonds colorés vérifié pour accessibilité
- Tailles de police minimum : 14px pour body, 16px recommandé

**Navigation clavier :**
- Tous les éléments interactifs accessibles au clavier
- Ordre de tabulation logique
- Indicateurs de focus visibles (via Radix UI)

**ARIA et sémantique :**
- Structure HTML sémantique
- Labels ARIA appropriés (via Radix UI)
- Rôles et états correctement définis

**Couleurs et daltonisme :**
- Pas de dépendance uniquement à la couleur pour communiquer l'information
- Utilisation d'icônes et formes en complément
- Patterns visuels distincts pour différents états

**Responsive et accessibilité mobile :**
- Tailles de touch targets minimum 44x44px
- Espacement suffisant entre éléments interactifs
- Support des gestes et interactions tactiles

**Performance et accessibilité :**
- Chargement progressif pour ne pas bloquer l'interface
- Feedback visuel pour les actions en cours
- Messages d'erreur clairs et actionnables

## Design Direction Decision

### Design Directions Explored

**Direction choisie : Design apaisant et professionnel**

Basée sur les fondations visuelles établies et inspirée de Monday.com et Spotify for Artists, la direction de design retenue privilégie la clarté, la sérénité et la confiance.

**Caractéristiques principales :**
- Design moderne et professionnel sans être trop trendy
- Espacement généreux pour réduire la charge cognitive
- Hiérarchie visuelle claire avec "what's next" en évidence
- Solidité et fiabilité avant gadgets et animations

### Chosen Direction

**Style visuel : "Apaisant et professionnel"**

**Layout :**
- Tableau de bord centralisé comme point d'entrée principal
- Hiérarchie claire : "what's next" toujours visible en haut
- Sections modulaires avec espacement généreux
- Navigation latérale ou horizontale selon contexte

**Densité visuelle :**
- Design aéré avec espacement généreux (minimum 16px entre éléments)
- Pas de surcharge visuelle
- Respiration visuelle pour apaisement
- Focus sur l'essentiel

**Composants :**
- Cartes avec bordures subtiles et ombres légères
- Typographie claire avec hiérarchie évidente
- Couleurs apaisantes (neutres dominants, accents subtils)
- Interactions discrètes mais efficaces

**Navigation :**
- Navigation modulaire entre projets, booking, contacts
- Contexte préservé lors de la navigation
- Breadcrumbs ou navigation claire pour orientation
- Actions rapides depuis le tableau de bord

**Dualité design :**
- Mode paramétrage : composants complets, formulaires détaillés, espacement large
- Mode suivi : composants simplifiés, interface apaisante, focus sur l'essentiel
- Transition claire entre les deux modes

### Design Rationale

**Pourquoi cette direction :**

**1. Alignement avec les objectifs émotionnels :**
- Design apaisant qui inspire sérénité et confiance
- Clarté immédiate sans surcharge cognitive
- Professionnalisme qui inspire confiance

**2. Inspiration des références :**
- Monday.com : connexion des données efficace, interface claire mais complète
- Spotify for Artists : compréhension du domaine musical, design moderne
- Combinaison des meilleurs aspects des deux références

**3. Support de l'expérience centrale :**
- Tableau de bord qui guide efficacement vers "what's next"
- Hiérarchie visuelle qui met en évidence les prochaines étapes
- Design qui réduit la charge cognitive plutôt que de l'ajouter

**4. Cohérence avec les contraintes techniques :**
- Compatible avec Tailwind CSS + Radix UI
- Design desktop-first avec support mobile acceptable
- Performance optimisée sans gadgets superflus

**5. Différenciation :**
- Design vraiment adapté aux projets musicaux (pas générique)
- Guidance proactive "what's next" comme différenciateur
- Solidité et fiabilité avant émerveillement

### Implementation Approach

**Structure de layout :**

**Tableau de bord principal :**
- Header avec navigation principale
- Section "What's Next" en évidence (haut de page)
- Sections modulaires : Projets, Campagnes, Contacts
- Sidebar ou navigation contextuelle selon besoin

**Composants principaux :**
- Cards pour projets et campagnes (bordures subtiles, ombres légères)
- Badges pour états et statuts (couleurs sémantiques)
- Buttons avec styles cohérents (primary, secondary, ghost)
- Forms avec espacement généreux et labels clairs

**Navigation :**
- Navigation principale : Projets, Booking, Contacts, Paramètres
- Navigation contextuelle : selon le module actif
- Breadcrumbs pour orientation dans les sections complexes
- Actions rapides depuis le tableau de bord

**Responsive :**
- Desktop-first : layout optimisé pour écrans larges
- Mobile acceptable : adaptation pour consultation ponctuelle
- Breakpoints : 640px (mobile), 768px (tablet), 1024px (desktop), 1280px (large)

**États et interactions :**
- Hover states discrets mais visibles
- Focus states clairs pour accessibilité clavier
- Loading states pour actions asynchrones
- Error states avec messages clairs et actionnables

**Animations :**
- Transitions subtiles (pas d'animations flashy)
- Micro-interactions pour feedback utilisateur
- Pas de gadgets ou animations superflues
- Focus sur la solidité et la fiabilité
