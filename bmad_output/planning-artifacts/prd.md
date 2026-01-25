---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments: 
  - 'bmad_output/planning-artifacts/product-brief-Flowen App-2026-01-18.md'
  - 'bmad_output/planning-artifacts/research/market-outils-gestion-musiciens-research-2026-01-18.md'
  - 'bmad_output/analysis/brainstorming-session-2026-01-18.md'
workflowType: 'prd'
briefCount: 1
researchCount: 1
brainstormingCount: 1
projectDocsCount: 0
classification:
  projectType: 'web_app'
  domain: 'gestion_projet_musical'
  complexity: 'medium_high'
  projectContext: 'greenfield'
  businessModel: 'personal_tool_beta'
---

# Product Requirements Document - Flowen App

**Author:** Laura
**Date:** 2026-01-18

## Executive Summary

Flowen App est une solution de gestion de projet musical conçue spécifiquement pour les musiciens amateurs et semi-professionnels. L'outil automatise et simplifie tous les aspects non-artistiques de la gestion d'un projet musical, avec un focus prioritaire sur le booking automatisé avec scraping de données et campagnes de mailing intelligentes.

**Différenciateur clé :** Combo innovant scraping + booking + mailing + gestion de projet musical - une combinaison qui n'existe pas ailleurs sur le marché.

**Utilisateur cible :** Porteurs de projets musicaux (musiciens amateurs/semi-professionnels) qui gèrent seuls la complexité administrative de leurs projets.

**Vision :** Réduire drastiquement la charge mentale et le temps administratif pour permettre aux musiciens de se concentrer sur la création artistique.

**Approche :** Outil personnel en bêta pour usage individuel, validation par usage réel avant éventuelle ouverture à la communauté.

## Success Criteria

### User Success

**Moments "Aha!" et adoption :**
- **Usage quotidien établi** : L'outil devient partie intégrante du workflow quotidien
- **Interface claire et compréhensible** : Interface utile, intuitive, qui guide naturellement l'utilisateur
- **Référence pour les prochaines étapes** : L'outil devient la source de vérité pour savoir "quelles sont les prochaines étapes à suivre"
- **Retombées concrètes** : Dates obtenues via mailing automatique sans démarchage manuel - preuve tangible que le système fonctionne

**Réduction de charge mentale :**
- **Élimination de la question "qu'est-ce que je dois faire ensuite ?"** : L'outil guide clairement et indique les actions à suivre
- **Passage du mode "gestion" au mode "réalisation"** : L'utilisateur passe de la planification à l'action concrète

**Booking automatisé (définition opérationnelle) :**
Le booking est considéré comme automatisé lorsque l'utilisateur n'a qu'à :
- Corriger les erreurs du scraping sur les recherches
- Personnaliser ou modifier quelques templates
- Appuyer sur "lancer le booking"
- Tout fonctionne automatiquement (relances incluses)
- Récolter les résultats sans effort supplémentaire

**Mesures spécifiques :**
- **20 dates/an** : Objectif concret pour l'utilisateur principal (adaptable pour d'autres artistes selon leurs objectifs)
- **≤ 10 min/semaine** : Idéal pour la gestion quotidienne (pas critique)
- **Paramétrage initial** : Peut prendre plus de temps au démarrage, mais une fois configuré, l'outil nécessite surtout de la consultation
- **Travail effectif ailleurs** : L'outil gère la gestion et le suivi, le travail créatif se fait en dehors de l'outil

**Confiance totale :**
- **Utilisation exhaustive et complète** : Tout est dans l'outil (comme une to-do list de confiance)
- **Source de vérité unique** : Si des éléments manquent, la confiance s'effrite et l'outil devient inutile
- **Mesure de confiance** : Utilisation régulière et complète sans hésitation, sentiment que toutes les informations nécessaires sont présentes

### Business Success

**Indicateurs de prêt à partager (phase bêta personnelle) :**
- **Usage personnel total, complet, validé** : Utilisation intensive pendant minimum 3 mois
- **Retours positifs** : Booking qui se fait tout seul avec résultats concrets
- **Utilisation "religieuse"** : Utilisation régulière et systématique qui prouve la valeur
- **Validation du concept** : Preuve par l'usage réel que l'outil répond aux besoins identifiés

**Critères de validation pour ouverture future :**
- Concept validé par usage personnel prolongé
- Fonctionnalités core (booking automatisé) opérationnelles et efficaces
- Confiance totale développée dans l'outil
- Prêt à réfléchir à une version publique avec comptes clients (sans nécessairement de paiement)

### Technical Success

**Critiques (non négociables) :**
- **Fiabilité du scraping** : Données correctes, mises à jour automatiques, détection d'obsolescence fonctionnelle
- **Connexion entre bases de données** : Bons champs, bien connectés, utilisés à bon escient - c'est ce qui fait la valeur de l'outil

**Moins critiques (acceptables) :**
- **Temps de chargement** : Acceptable si les résultats sont là et fiables

**Contraintes techniques :**
- Aucune contrainte technique non négociable identifiée dans l'immédiat
- Architecture permettant migration future vers mobile native (choix technologiques adaptés)

### Measurable Outcomes

**Métriques comportementales :**
- **Fréquence d'utilisation** : Utilisation quotidienne ou hebdomadaire régulière (ex: tous les vendredis)
- **Durée de session** : Sessions courtes (5-10 minutes) pour consultation et actions rapides
- **Taux de complétion** : Toutes les étapes critiques complétées sans oubli
- **Taux d'erreur** : 0% d'oubli vs 10% actuel (réduction mesurable)

**Métriques de résultat :**
- **Temps économisé** : Plusieurs heures par semaine libérées pour la création
- **Efficacité booking** : 20 dates obtenues par an avec effort minimal
- **Qualité projet** : Projets mieux organisés, moins d'erreurs, moins de frustration

**Métriques qualitatives (subjectives mais importantes) :**
- "Je m'y connecte sans hésiter"
- "Je sais que tout est là et que je n'ai rien oublié"
- "J'ai confiance en mon outil"
- "Les tournées se gèrent toutes seules"
- "Je suis dans la réalisation plutôt que dans la gestion"

## Product Scope

### MVP - Minimum Viable Product

**Essentiel pour que l'outil soit utile :**

**1. Booking automatisé (priorité absolue) :**
- Scraping de données salles et contacts
- Base de données relationnelle salles ↔ contacts
- Campagnes de mailing automatisées avec personnalisation
- Relances automatiques paramétrables
- Génération automatique de packages de fichiers pour booking
- Détection automatique d'obsolescence des données

**2. Interface utilisateur avec informations sur le projet :**
- Tableau de bord "what's next" guidant l'utilisateur
- Vue d'ensemble de l'état des projets
- Prochaines étapes clairement identifiées
- Informations essentielles en un coup d'œil

**3. Interface pour remplir les informations personnelles :**
- Système pré-écrit, modifiable et paramétrable
- Calcul automatique de : quoi faire, quand, pourquoi, où
- Structure adaptée aux projets musicaux (pas générique)
- Cases et workflows adaptés à la réalité musicale

**4. Gestion de projet avec timing et calendrier :**
- Structure de projet adaptée aux besoins musicaux
- Timing et calendrier intégrés
- Étapes à suivre pour les différents projets
- Visualisation de la progression

**5. Bases de données associées :**
- Base de données de contacts (salles) connectée à la gestion de projet
- Base de données relationnelle fonctionnelle
- Données partagées entre gestion de projet et booking

### Growth Features (Post-MVP)

**Fonctionnalités pour rendre le produit compétitif :**
- Gestion complète des contacts médias (scraping + mailing similaire au booking)
- Gestion financière intégrée (enveloppes budgétaires, suivi temps réel)
- Gestion de l'enregistrement et sortie (suivi complet du processus)
- Gestion de la communication (planification contenu, mesure impact)
- Fiches contacts complètes et sophistiquées (3 typologies bien connectées)
- Application mobile native (accès partout)

### Vision (Future)

**Vision à long terme :**
- Comptes collaborateurs pour personnes proches
- Partage d'informations et calendrier avec équipe
- Coordination avec musiciens/techniciens
- Intégrations API avec outils existants (Meta, Buffer, distro-kids)
- Archives et références pour projets passés
- Génération automatique de packages de fichiers sophistiqués
- Ouverture à la communauté avec modèle économique accessible (gratuit ou très abordable)

## User Journeys

### Persona Principale : Laura

**Profil :**
- 33 ans, développeuse web à 80%, musicienne à 20%
- Travaille sur la musique tous les vendredis
- Triple casquette : artiste + développeuse + gestionnaire de projet
- 15 jours de tournée par an
- Charge mentale élevée entre création artistique et gestion administrative

**Contexte émotionnel :**
- Avant Flowen App : Frustration, charge mentale, sentiment de ne pas savoir quoi faire ensuite
- Après Flowen App : Confiance, sérénité, sentiment que tout est sous contrôle

---

### Parcours 1 : Paramétrage Initial - Première Configuration

**Scène d'ouverture :**
Vendredi soir, Laura ouvre Flowen App pour la première fois. Elle a un projet musical en cours et veut organiser une tournée pour l'année prochaine. Elle se sent submergée par toutes les tâches à gérer.

**Action montante :**
1. Création du premier projet musical dans Flowen App
2. Découverte de la structure préconstruite adaptée aux projets musicaux
3. Configuration des informations personnelles (bio, photos, vidéos, liens réseaux sociaux)
4. Paramétrage du scraping : sélection des sources de données salles/contacts
5. Configuration des templates de mailing : personnalisation des modèles pré-écrits
6. Définition des paramètres de relances (15j, 21j, dernière relance)
7. Test d'une première campagne sur quelques salles pilotes

**Climax :**
Laura lance sa première campagne de booking automatisée. Le système scrape les données, génère les mails personnalisés, et les envoie automatiquement. Elle voit le tableau de bord afficher "Campagne lancée - 25 mails envoyés".

**Résolution :**
Laura comprend que l'outil va gérer le booking pour elle. Elle peut se concentrer sur la création pendant que le système fait les relances automatiques. Elle se sent soulagée de ne plus avoir à gérer manuellement chaque contact.

**Besoins révélés :**
- Interface de création de projet avec structure préconstruite
- Formulaire de configuration des informations personnelles
- Interface de configuration du scraping (sources, paramètres)
- Éditeur de templates de mailing avec variables dynamiques
- Paramétrage des relances automatiques
- Tableau de bord de suivi des campagnes

---

### Parcours 2 : Usage Régulier - Consultation Hebdomadaire

**Scène d'ouverture :**
Vendredi matin, Laura ouvre Flowen App comme chaque semaine. Elle veut savoir où elle en est de son projet et ce qu'elle doit faire cette semaine.

**Action montante :**
1. Connexion à Flowen App
2. Visualisation du tableau de bord "what's next" : vue d'ensemble de l'état des projets
3. Consultation des prochaines étapes clairement identifiées
4. Vérification des réponses aux campagnes de booking : nouvelles dates obtenues
5. Consultation du calendrier : visualisation des dates confirmées et des échéances
6. Actions rapides : validation d'une date, ajout d'une note, mise à jour d'un statut

**Climax :**
Laura découvre qu'elle a obtenu 3 nouvelles dates de tournée cette semaine grâce aux relances automatiques, sans avoir eu à faire quoi que ce soit. Le système a géré les relances et les réponses.

**Résolution :**
Laura sait exactement où elle en est, ce qu'elle doit faire ensuite, et elle a des résultats concrets. Elle se sent en confiance et sereine. Elle peut passer le reste de sa journée à travailler sur la création plutôt que sur l'administration.

**Besoins révélés :**
- Tableau de bord "what's next" avec vue d'ensemble
- Identification claire des prochaines étapes
- Visualisation des résultats des campagnes (réponses, dates obtenues)
- Calendrier intégré avec dates et échéances
- Actions rapides depuis le tableau de bord
- Système de notifications pour les nouvelles réponses

---

### Parcours 3 : Lancement d'une Campagne de Booking

**Scène d'ouverture :**
Laura a préparé son projet et veut lancer une campagne de booking pour une tournée en octobre. Elle a configuré ses templates et ses paramètres de relances.

**Action montante :**
1. Accès au module de booking depuis le tableau de bord
2. Sélection des salles cibles : filtrage par région, capacité, style musical
3. Vérification des données scrapées : consultation des fiches salles/contacts
4. Correction des erreurs du scraping : modification des données incomplètes ou erronées
5. Personnalisation des templates : ajustement des modèles pour cette campagne spécifique
6. Génération automatique des packages de fichiers : sélection des éléments à inclure (bio, photos, vidéos, etc.)
7. Lancement de la campagne : validation et envoi automatique

**Climax :**
Laura appuie sur "Lancer la campagne". Le système envoie automatiquement 50 mails personnalisés à des salles ciblées. Elle voit le statut "Campagne lancée - 50 mails envoyés - Relances programmées".

**Résolution :**
Laura sait que le système va gérer toutes les relances automatiquement. Elle n'a plus qu'à consulter les réponses au fur et à mesure. Elle se sent libérée de cette charge mentale et peut se concentrer sur autre chose.

**Besoins révélés :**
- Interface de sélection et filtrage des salles cibles
- Visualisation et édition des fiches salles/contacts
- Système de correction des données scrapées
- Éditeur de templates avec prévisualisation
- Génération automatique de packages de fichiers
- Interface de lancement de campagne avec confirmation
- Système de relances automatiques programmées

---

### Parcours 4 : Gestion des Erreurs du Scraping

**Scène d'ouverture :**
Laura consulte les données scrapées et découvre que certaines fiches salles ont des informations manquantes ou erronées. Elle veut corriger ces erreurs pour que le système fonctionne correctement.

**Action montante :**
1. Consultation de la liste des salles scrapées
2. Identification des fiches avec données incomplètes ou erronées (marquées visuellement)
3. Ouverture d'une fiche avec erreurs
4. Correction manuelle des données : remplissage des champs manquants, correction des erreurs
5. Validation des corrections : sauvegarde des données corrigées
6. Alternative : archivage de la fiche si les informations sont introuvables et non utilisables

**Climax :**
Laura corrige les données manquantes et valide. Le système met à jour la fiche et elle peut maintenant l'utiliser dans ses campagnes de booking.

**Résolution :**
Laura a confiance dans les données de son système. Elle sait qu'elle peut toujours corriger ce que le scraping n'a pas trouvé ou a mal interprété. Le système reste fiable grâce à sa capacité d'intervention.

**Besoins révélés :**
- Identification visuelle des fiches avec données incomplètes/erronées
- Interface d'édition des fiches salles/contacts
- Validation et sauvegarde des corrections
- Option d'archivage pour fiches non utilisables
- Système de notification des erreurs de scraping

---

### Parcours 5 : Consultation Ponctuelle - "Où j'en suis ?"

**Scène d'ouverture :**
Laura est en déplacement et veut rapidement vérifier où elle en est de son projet sans avoir à se connecter longtemps.

**Action montante :**
1. Connexion rapide à Flowen App
2. Visualisation du tableau de bord en un coup d'œil
3. Consultation des informations essentielles : prochaines étapes, dates importantes, réponses récentes
4. Action rapide si nécessaire : validation d'une réponse, ajout d'une note

**Climax :**
En 2 minutes, Laura sait exactement où elle en est, ce qu'elle doit faire, et elle a pris connaissance des nouvelles réponses. Elle se sent rassurée et peut continuer sa journée.

**Résolution :**
Laura a confiance que tout est à jour dans l'outil. Elle n'a pas besoin de se connecter souvent, mais quand elle le fait, elle trouve toutes les informations nécessaires rapidement.

**Besoins révélés :**
- Interface rapide et claire pour consultation ponctuelle
- Affichage des informations essentielles en un coup d'œil
- Actions rapides depuis le tableau de bord
- Performance : chargement rapide même en déplacement

---

### Parcours 6 : Gestion des Erreurs de Campagne de Mailing

**Scène d'ouverture :**
Laura lance une campagne de mailing et découvre qu'il y a eu des erreurs lors de l'envoi. Elle veut comprendre ce qui s'est passé et corriger le problème.

**Action montante :**
1. Consultation du tableau de bord de suivi des campagnes
2. Identification des erreurs : visualisation des mails qui n'ont pas pu être envoyés
3. Analyse des causes d'erreur : données manquantes, adresses invalides, problèmes de connexion
4. Correction des erreurs corrigeables : modification des données, correction des adresses
5. Relance de la campagne ou envoi manuel des mails corrigés

**Climax :**
Laura corrige les erreurs et relance la campagne. Le système informe clairement de l'état de la campagne et des actions nécessaires.

**Résolution :**
Laura a confiance que le système l'informe toujours des problèmes et lui donne les moyens de les corriger. Elle peut intervenir quand nécessaire pour assurer le bon fonctionnement.

**Besoins révélés :**
- Système de notification des erreurs de campagne
- Visualisation claire des erreurs et de leurs causes
- Interface de correction des erreurs corrigeables
- Possibilité de relancer une campagne après correction
- Informations détaillées sur l'état de chaque campagne

---

### Journey Requirements Summary

**Capacités principales identifiées par les parcours :**

1. **Gestion de projet :**
   - Création de projet avec structure préconstruite adaptée aux projets musicaux
   - Tableau de bord "what's next" guidant l'utilisateur
   - Calendrier intégré avec dates et échéances
   - Visualisation de la progression du projet

2. **Booking automatisé :**
   - Scraping de données salles/contacts avec détection d'erreurs
   - Base de données relationnelle avec édition manuelle
   - Campagnes de mailing automatisées avec personnalisation
   - Relances automatiques programmées
   - Génération automatique de packages de fichiers
   - Suivi et visualisation des résultats

3. **Gestion des données :**
   - Visualisation et édition des fiches salles/contacts
   - Correction des erreurs de scraping
   - Archivage des fiches non utilisables
   - Identification visuelle des données incomplètes/erronées
   - Validation et sauvegarde des corrections

4. **Configuration :**
   - Paramétrage des informations personnelles (bio, photos, vidéos, liens)
   - Configuration du scraping (sources, paramètres)
   - Éditeur de templates de mailing avec variables dynamiques
   - Paramétrage des relances automatiques
   - Personnalisation des packages de fichiers

5. **Interface utilisateur :**
   - Design clair, utile et compréhensible
   - Actions rapides depuis le tableau de bord
   - Notifications des nouvelles réponses et erreurs
   - Performance pour consultation rapide
   - Interface adaptée à la consultation ponctuelle

6. **Gestion des erreurs :**
   - Système de notification des erreurs (scraping, mailing)
   - Visualisation claire des erreurs et de leurs causes
   - Interface de correction des erreurs corrigeables
   - Possibilité d'intervention manuelle quand nécessaire

## Domain-Specific Requirements

### Compliance & Regulatory

**Version bêta (V1) :**
- Aucune réglementation spécifique à respecter pour le moment

**Versions futures (à considérer) :**
- **Légalité du scraping des données** : À vérifier lors de l'ouverture à la communauté
- **Conformité RGPD** : À considérer si données personnelles de contacts sont collectées/scrapées

### Technical Constraints

**Sécurité :**
- Pas de contraintes de sécurité particulières pour la V1

**Performance :**
- Pas d'exigences de performance spécifiques (temps de chargement acceptable si résultats fiables)

**Disponibilité :**
- Pas de besoins de disponibilité particuliers pour la V1

### Integration Requirements

**Version bêta (V1) :**
- Aucune intégration de système externe prévue pour le moment

**Opportunités futures :**
- **APIs spécifiques au secteur musical** : Si des APIs existent avec des données sur les salles de spectacle ou contacts, les intégrer (plus efficace que le scraping)
- À rechercher et évaluer si de telles APIs existent

### Data Management

**Import/Export :**
- Fonctionnalité d'import de données (CSV notamment) pour intégrer des bases de données existantes
- Fonctionnalité d'export de données pour permettre la portabilité des données

### Risk Mitigations

**Risques identifiés :**
- **Données obsolètes** : Contacts/salles qui ne sont plus actifs
- **Contacts invalides** : Adresses email incorrectes, contacts qui ne répondent plus

**Mitigations nécessaires :**
- Détection automatique d'obsolescence (rebounds mail, réponses "n'est plus ici")
- Système de validation et correction manuelle des données
- Archivage des fiches non utilisables
- Interface permettant à l'utilisateur de corriger les données invalides

## Innovation & Novel Patterns

### Detected Innovation Areas

**Combo innovant principal :**
Le combo scraping + booking + mailing + gestion de projet musical est l'aspect le plus innovant et différenciant. Cette combinaison n'existe pas ailleurs selon les recherches de marché effectuées.

**Éléments du combo innovant :**
1. Scraping automatique des données salles/contacts
2. Booking automatisé avec campagnes de mailing
3. Relances intelligentes programmées
4. Gestion de projet adaptée spécifiquement aux besoins musicaux

**Approche :**
- Dynamique personnelle : création d'un outil pour usage personnel, pas de dynamique de marché
- Validation par l'usage réel : si ça fonctionne pour l'utilisateur, c'est un succès
- Focus sur la résolution du problème personnel plutôt que sur le positionnement marché

### Market Context & Competitive Landscape

**Positionnement :**
- Aucun outil similaire trouvé ou connu
- Les outils existants (OTour, Stage-Radar, Mascaron) ne combinent pas ces éléments
- Différenciation claire : automatisation complète du processus de booking avec gestion de projet intégrée

**Contexte :**
- Pas de recherche approfondie de concurrence nécessaire (approche personnelle)
- Focus sur la résolution du problème personnel plutôt que sur le positionnement marché

### Validation Approach

**Validation par l'usage :**
- Usage personnel intensif pendant minimum 3 mois
- Résultats concrets : dates obtenues via booking automatisé
- Confiance totale développée dans l'outil
- Utilisation régulière et systématique

**Critères de validation :**
- Le scraping fonctionne et fournit des données utilisables
- Les campagnes de mailing sont envoyées automatiquement
- Les relances fonctionnent correctement
- Le booking se fait "tout seul" avec résultats concrets

### Risk Mitigation

**Risque principal :**
- Si le scraping ne fonctionne pas, l'application perd vraiment de son intérêt
- Le scraping est critique pour la valeur de l'outil

**Mitigations :**
1. Recherche et intégration d'APIs disponibles (si elles existent, plus efficace que le scraping)
2. Fonctionnalité d'import de données (CSV) pour intégrer des bases de données existantes
3. Ajout manuel de données from scratch
4. Modification manuelle des données existantes
5. Approche multi-sources : ne pas dépendre uniquement du scraping

**Stratégie de mitigation :**
- Approche en parallèle : développer scraping, APIs, import, et ajout manuel simultanément
- Ne pas mettre tous les œufs dans le même panier (scraping uniquement)
- Assurer la flexibilité : l'utilisateur peut toujours ajouter/corriger les données manuellement

**Plan B si le scraping échoue :**
- Utiliser les APIs disponibles
- Importer des données existantes
- Ajout manuel des données
- L'outil reste utilisable même sans scraping parfait

## Web App Specific Requirements

### Project-Type Overview

Flowen App est une application web multi-pages (MPA) conçue pour être accessible via navigateur, avec une architecture permettant une migration future vers mobile native.

### Technical Architecture Considerations

**Architecture :**
- **Type d'application :** Multi-Page Application (MPA)
- **Structure :** Pages séparées pour différentes fonctionnalités :
  - Page(s) pour la gestion de projet (peut être une seule page avec éléments affichés différemment/en parallèle)
  - Page(s) séparées pour le booking (module distinct)
  - Pages séparées pour les autres features futures (pas dans le MVP)
- **Choix technologique :** Architecture permettant migration future vers mobile native (React/Next.js → React Native)

**Browser Support :**
- Tous les navigateurs principaux (Chrome, Firefox, Safari, Edge)
- Chrome prioritaire
- Support mobile (navigateurs mobiles) à prendre en compte dès le départ
- **Note :** Support navigateurs et mobile pas critiques pour le MVP, mais important de les considérer dès le départ pour éviter de se bloquer plus tard

**SEO Strategy :**
- Aucun SEO nécessaire pour la V1
- Application privée (connexion requise)
- Pas de pages publiques à indexer

**Real-Time & Updates :**
- Pas de besoin de fonctionnalités temps réel générales
- Mises à jour AJAX pour éviter les refresh complets :
  - Mises à jour de données (ex: fiches contacts)
  - Mises à jour liées au mailing (statut des campagnes, nouvelles réponses)
- Approche : mises à jour partielles plutôt que refresh complet de page

**Accessibility :**
- Pas de priorité pour la V1
- Application privée, usage personnel
- À considérer plus tard si nécessaire

### Implementation Considerations

**Performance :**
- Temps de chargement acceptable si résultats fiables
- Optimisation pour consultation rapide et ponctuelle
- Mises à jour AJAX pour améliorer l'expérience utilisateur

**Responsive Design :**
- Design responsive à considérer dès le départ
- Support mobile navigateurs important pour usage en déplacement
- Pas critique pour MVP mais à prévoir pour éviter refactoring plus tard

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach :** MVP orienté résolution de problème (booking fonctionnel) avec expérience utilisateur importante

**Priorités :**
1. Booking fonctionnel (must-have absolu)
2. Tableau de bord "what's next" (très important, mais peut être moins fonctionnel que le booking)
3. Expérience utilisateur : importante mais secondaire par rapport au booking fonctionnel

**Philosophie :** Mieux vaut un tableau de bord moins fonctionnel qu'un booking moins fonctionnel

**Resource Requirements :**
- MVP focalisé sur le booking fonctionnel (scope maîtrisé)
- Tableau de bord simplifié acceptable pour MVP
- Développement progressif après validation du concept

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Paramétrage initial (configuration scraping, templates, relances)
- Lancement d'une campagne de booking
- Suivi des campagnes et réponses
- Gestion des erreurs (correction données scrapées)
- Consultation ponctuelle (tableau de bord de base)

**Must-Have Capabilities - Booking Automatisé :**

1. **Gestion des données :**
   - Fiches de contact bien structurées
   - Fiches de salle bien structurées
   - Connexion relationnelle contact ↔ salle (critique)
   - Possibilité de modifier les paramètres pertinents

2. **Scraping (simplifié pour MVP) :**
   - Une source qui fonctionne (on développera plus tard pour aller plus loin)
   - Import de données (CSV)
   - Connexion API (si disponible)

3. **Templates et paramétrage :**
   - Paramétrage de templates de mailing
   - Paramètres dans templates (variables dynamiques)
   - Paramétrage de relances (ex: 15 jours après si pas de réponse)

4. **Relances automatiques :**
   - Relances automatiques paramétrables
   - Arrêt automatique si réponse reçue
   - Possibilité de relancer manuellement si nécessaire

5. **Suivi et visualisation :**
   - Suivi des envois de mail
   - Suivi des retours associés au contact
   - Suivi des retours associés aux salles
   - Visualisation de l'état des campagnes

**Must-Have Capabilities - Tableau de Bord (moins fonctionnel mais important) :**

1. **Structure de projet musical :**
   - Toutes les étapes d'un projet musical intégrées
   - Prompting utilisateur à rentrer ses données personnelles
   - Organisation des données dans le tableau de bord (critique)

2. **Affichages décisionnels :**
   - Bons affichages pour prendre les bonnes décisions au bon moment
   - Choix de ce qui est paramétrable dans le tableau de bord (critique)

3. **Vue d'ensemble :**
   - État des projets
   - Prochaines étapes (version simplifiée acceptable pour MVP)

### Post-MVP Features

**Phase 2 (Post-MVP - Growth) :**
- Développement du scraping pour aller chercher de plus en plus loin (sources multiples)
- Tableau de bord "what's next" plus fonctionnel et guidant
- Gestion complète des contacts médias (scraping + mailing similaire au booking)
- Gestion financière intégrée (enveloppes budgétaires, suivi temps réel)
- Génération automatique de packages de fichiers sophistiqués

**Phase 3 (Expansion - Vision) :**
- Gestion de l'enregistrement et sortie (suivi complet du processus)
- Gestion de la communication (planification contenu, mesure impact)
- Fiches contacts complètes et sophistiquées (3 typologies bien connectées)
- Application mobile native
- Comptes collaborateurs pour personnes proches
- Intégrations API avec outils existants (Meta, Buffer, distro-kids)

### Risk Mitigation Strategy

**Technical Risks :**

1. **Scraping (risque le plus élevé) :**
   - Mitigation : Approche simplifiée au MVP (une source qui fonctionne)
   - Plan B : Import de données, connexion API, ajout manuel
   - Développement progressif : développer pour aller plus loin après MVP

2. **Connexion des données (important) :**
   - Mitigation : Design soigné de la base de données relationnelle dès le départ
   - Focus sur la connexion contact ↔ salle comme fondation
   - Tests approfondis de la connexion des données

3. **Choix de ce qui est paramétrable dans le tableau de bord (important) :**
   - Mitigation : Réflexion approfondie sur ce qui doit être paramétrable vs fixe
   - Itération basée sur usage réel
   - Flexibilité dans l'architecture pour ajuster plus tard

4. **Organisation des données dans le tableau de bord (important) :**
   - Mitigation : Design UX soigné de l'organisation des données
   - Hiérarchie claire de l'information
   - Tests utilisateur pour valider l'organisation

**Market Risks :**
- Pas de risque marché pour la V1 (approche personnelle)
- Validation par usage réel personnel

**Resource Risks :**
- MVP focalisé sur le booking fonctionnel (scope maîtrisé)
- Tableau de bord simplifié acceptable pour MVP
- Développement progressif après validation du concept

## Functional Requirements

**Note critique :** Cette section définit le contrat de capacité pour tout le travail en aval. Toute capacité non listée ici n'existera pas dans le produit final.

### Gestion de Projet Musical

- FR1: L'utilisateur peut créer un nouveau projet musical avec une structure préconstruite adaptée aux projets musicaux
- FR2: L'utilisateur peut visualiser l'état de ses projets musicaux
- FR3: L'utilisateur peut voir les étapes d'un projet musical intégrées dans la structure
- FR4: L'utilisateur peut consulter les prochaines étapes à accomplir pour ses projets
- FR5: L'utilisateur peut rentrer ses données personnelles (bio, photos, vidéos, liens réseaux sociaux) dans le contexte d'un projet musical
- FR6: L'utilisateur peut visualiser la progression de ses projets musicaux

### Gestion des Données (Contacts et Salles)

- FR7: L'utilisateur peut créer et gérer des fiches de contact avec les attributs pertinents
- FR8: L'utilisateur peut créer et gérer des fiches de salle avec les attributs pertinents (nom, capacité, style, région, contacts, etc.)
- FR9: L'utilisateur peut établir des connexions relationnelles entre contacts et salles
- FR10: L'utilisateur peut visualiser les connexions entre contacts et salles
- FR11: L'utilisateur peut modifier les données d'une fiche contact
- FR12: L'utilisateur peut modifier les données d'une fiche salle
- FR13: L'utilisateur peut archiver une fiche contact ou salle si elle n'est plus utilisable
- FR14: L'utilisateur peut identifier visuellement les fiches avec données incomplètes ou erronées
- FR15: Le système peut détecter automatiquement l'obsolescence des données (rebounds mail, réponses "n'est plus ici")

### Scraping et Import de Données

- FR16: Le système peut scraper automatiquement les données de salles depuis une source configurée
- FR17: Le système peut scraper automatiquement les données de contacts depuis une source configurée
- FR18: L'utilisateur peut configurer les sources de scraping
- FR19: L'utilisateur peut importer des données depuis un fichier CSV
- FR20: L'utilisateur peut exporter des données vers un fichier CSV
- FR21: Le système peut se connecter à des APIs externes pour récupérer des données de salles/contacts (si disponibles)
- FR22: L'utilisateur peut ajouter manuellement des données from scratch
- FR23: Le système peut mettre à jour automatiquement les données scrapées

### Templates et Mailing

- FR24: L'utilisateur peut créer et modifier des templates de mailing
- FR25: L'utilisateur peut utiliser des variables dynamiques dans les templates (nom, propriétés de la salle, etc.)
- FR26: L'utilisateur peut personnaliser les templates selon les propriétés (capacité, région, style)
- FR27: L'utilisateur peut prévisualiser un template avant envoi
- FR28: Le système peut générer automatiquement des mails personnalisés à partir des templates et des données de contacts
- FR29: L'utilisateur peut sélectionner les contacts/salles cibles pour une campagne de mailing
- FR30: L'utilisateur peut filtrer les contacts/salles par région, capacité, style musical
- FR31: Le système peut envoyer automatiquement des campagnes de mailing de masse
- FR32: L'utilisateur peut lancer une campagne de mailing

### Relances Automatiques

- FR33: L'utilisateur peut paramétrer les relances automatiques (délais, nombre de relances)
- FR34: Le système peut envoyer automatiquement des relances selon les paramètres configurés
- FR35: Le système peut arrêter automatiquement les relances si une réponse est reçue
- FR36: L'utilisateur peut relancer manuellement une campagne si nécessaire
- FR37: Le système peut classifier automatiquement les contacts (répondant/non-répondant)

### Suivi et Visualisation des Campagnes

- FR38: L'utilisateur peut visualiser l'état d'une campagne de mailing (envois, réponses, relances)
- FR39: L'utilisateur peut voir les envois de mail effectués pour une campagne
- FR40: L'utilisateur peut voir les réponses reçues associées à un contact
- FR41: L'utilisateur peut voir les réponses reçues associées à une salle
- FR42: L'utilisateur peut suivre les dates de tournée obtenues via les campagnes
- FR43: Le système peut mettre à jour automatiquement le statut des campagnes (AJAX)
- FR44: L'utilisateur peut voir l'historique des échanges avec chaque contact/salle

### Tableau de Bord

- FR45: L'utilisateur peut visualiser un tableau de bord avec vue d'ensemble de ses projets
- FR46: L'utilisateur peut voir les prochaines étapes à accomplir depuis le tableau de bord
- FR47: L'utilisateur peut voir l'état des campagnes en cours depuis le tableau de bord
- FR48: L'utilisateur peut voir les nouvelles réponses depuis le tableau de bord
- FR49: Le système peut organiser les données dans le tableau de bord pour faciliter la prise de décision
- FR50: L'utilisateur peut accéder rapidement aux différentes sections depuis le tableau de bord
- FR51: Le système peut afficher les informations essentielles en un coup d'œil

### Gestion des Erreurs et Corrections

- FR52: Le système peut identifier et signaler les erreurs de scraping
- FR53: L'utilisateur peut corriger les erreurs de scraping détectées
- FR54: Le système peut signaler les erreurs lors de l'envoi de campagnes de mailing
- FR55: L'utilisateur peut voir les causes des erreurs de campagne
- FR56: L'utilisateur peut corriger les erreurs corrigeables (données manquantes, adresses invalides)
- FR57: Le système peut notifier l'utilisateur des erreurs nécessitant son attention
- FR58: L'utilisateur peut intervenir manuellement pour corriger les données quand nécessaire

### Configuration et Paramétrage

- FR59: L'utilisateur peut configurer les paramètres de scraping (sources, fréquence)
- FR60: L'utilisateur peut configurer les paramètres de relances (délais, nombre)
- FR61: L'utilisateur peut modifier les paramètres pertinents des fiches contacts/salles
- FR62: L'utilisateur peut paramétrer ce qui est paramétrable dans le tableau de bord

### Mises à Jour et Synchronisation

- FR63: Le système peut mettre à jour les données sans refresh complet de page (AJAX)
- FR64: Le système peut mettre à jour le statut des campagnes en temps réel (AJAX)
- FR65: Le système peut synchroniser les données entre différentes sections de l'application

## Non-Functional Requirements

### Reliability

**Critical Requirements:**

- **Scraping Reliability:** Le scraping doit fonctionner de manière fiable. Si le scraping ne fonctionne pas, l'application perd son intérêt principal.
  - Le système doit détecter et signaler les erreurs de scraping
  - Le système doit permettre la correction manuelle des erreurs de scraping
  - Le système doit offrir des alternatives (import CSV, APIs, ajout manuel) si le scraping échoue

- **Data Connection Reliability:** La connexion relationnelle entre les données (contacts ↔ salles) est critique et doit être fiable.
  - La connexion relationnelle entre contacts et salles doit être maintenue de manière cohérente
  - Les données doivent rester synchronisées entre les différentes sections de l'application
  - Les modifications de données doivent être propagées correctement dans toutes les sections concernées

### Integration

**CSV Import/Export:**
- Le système doit pouvoir importer des données depuis des fichiers CSV avec format compatible avec les outils standards
- Le système doit pouvoir exporter des données vers des fichiers CSV avec format compatible
- Le système doit gérer les erreurs d'import/export de manière claire pour l'utilisateur

**External APIs:**
- Le système doit pouvoir se connecter à des APIs externes pour récupérer des données de salles/contacts (si disponibles)
- Les intégrations API doivent être fiables et gérer les erreurs de connexion de manière appropriée
- Le système doit permettre la configuration des sources API

### Performance

**Note:** Performance secondaire pour le MVP - pas d'actions critiques nécessitant une rapidité particulière.

- Temps de chargement acceptable si les résultats sont fiables
- Les mises à jour AJAX doivent fonctionner sans bloquer l'interface utilisateur
- Les actions utilisateur ne doivent pas être bloquées par des opérations en arrière-plan

### Security

**Note:** Pas de contraintes de sécurité particulières pour le MVP.

- Application privée, usage personnel
- Hébergement local prévu pour le MVP
- À considérer plus tard si ouverture à la communauté (conformité RGPD, sécurité des données)
