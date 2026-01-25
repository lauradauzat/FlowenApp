---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: 
  - 'bmad_output/planning-artifacts/prd.md'
  - 'bmad_output/planning-artifacts/product-brief-Flowen App-2026-01-18.md'
  - 'bmad_output/planning-artifacts/ux-design-specification.md'
  - 'bmad_output/planning-artifacts/research/market-outils-gestion-musiciens-research-2026-01-18.md'
workflowType: 'architecture'
project_name: 'Flowen App'
user_name: 'Laura'
date: '2026-01-18'
lastStep: 8
status: 'complete'
completedAt: '2026-01-18'
---

# Architecture Decision Document

_Ce document se construit de manière collaborative à travers une découverte étape par étape. Les sections sont ajoutées au fur et à mesure que nous travaillons ensemble sur chaque décision architecturale._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Le projet Flowen App comprend 65 exigences fonctionnelles organisées en 9 catégories principales :

- **Gestion de projet musical** (6 FRs) : Création de projets avec structure préconstruite, visualisation d'état, gestion des étapes et progression
- **Gestion des données** (9 FRs) : Fiches contacts/salles avec connexions relationnelles, édition, archivage, détection d'obsolescence
- **Scraping et import** (8 FRs) : Scraping automatique de données, import CSV, connexion APIs externes, ajout manuel
- **Templates et mailing** (9 FRs) : Création/modification de templates avec variables dynamiques, personnalisation, génération automatique de mails
- **Relances automatiques** (5 FRs) : Paramétrage, envoi automatique, arrêt si réponse reçue, classification automatique
- **Suivi et visualisation** (7 FRs) : État des campagnes, historique des échanges, suivi des dates obtenues, mises à jour AJAX
- **Tableau de bord** (7 FRs) : Vue d'ensemble, "what's next", guidage utilisateur, organisation des données
- **Gestion des erreurs** (7 FRs) : Détection, signalement, correction manuelle, notifications
- **Configuration** (4 FRs) : Paramétrage scraping, relances, personnalisation tableau de bord

**Non-Functional Requirements:**

Les NFRs critiques qui façonneront l'architecture :

- **Fiabilité du scraping** (critique) : Le scraping est essentiel pour la valeur de l'outil. Architecture doit permettre détection d'erreurs, correction manuelle, et alternatives (import CSV, APIs, ajout manuel)
- **Fiabilité de la connexion des données** (critique) : La connexion relationnelle contacts ↔ salles est critique. Architecture doit garantir cohérence, synchronisation, et propagation des modifications
- **Performance** (secondaire MVP) : Temps de chargement acceptable si résultats fiables. Mises à jour AJAX pour éviter refresh complets
- **Sécurité** : Application privée, usage personnel pour MVP. Pas de contraintes particulières mais architecture extensible pour conformité RGPD future
- **Intégration** : Import/Export CSV, connexion APIs externes (si disponibles). Architecture modulaire pour intégrations futures

**Scale & Complexity:**

- **Primary domain** : Application web full-stack (frontend React/Next.js + backend API + base de données relationnelle)
- **Complexity level** : Medium-High (selon classification PRD)
- **Estimated architectural components** :
  - Frontend React/Next.js (MPA architecture)
  - Backend API REST/GraphQL
  - Base de données relationnelle (PostgreSQL recommandé pour relations complexes)
  - Service de scraping (asynchrone, avec gestion d'erreurs)
  - Service de mailing/email (campagnes automatisées)
  - Service de relances automatiques (scheduling/queue)
  - Système de templates (moteur de templates avec variables dynamiques)
  - Service de détection d'obsolescence (monitoring, validation)

### Technical Constraints & Dependencies

**Contraintes architecturales identifiées :**

- **Migration mobile native** : Architecture doit permettre migration future vers React Native (choix React/Next.js pour compatibilité)
- **Support navigateurs** : Multi-navigateurs (Chrome prioritaire, Firefox, Safari, Edge) avec support mobile navigateurs acceptable pour MVP
- **Design system** : Tailwind CSS + Radix UI (déjà choisi dans UX spec)
- **Performance desktop-first** : Optimisation pour desktop, mobile acceptable mais secondaire

**Dépendances techniques :**

- **Stack frontend** : React/Next.js (pour migration React Native future)
- **Design system** : Tailwind CSS + Radix UI (composants headless accessibles)
- **Base de données** : Relationnelle requise pour connexions complexes salles ↔ contacts (PostgreSQL recommandé)
- **Services externes** : 
  - APIs de scraping (à identifier et intégrer)
  - Service email pour campagnes (SMTP ou service tiers comme SendGrid, Brevo)
  - Potentiellement APIs externes pour données salles/contacts (si disponibles)

**Contraintes de fiabilité critiques :**

- Le scraping doit être fiable ou avoir des alternatives (import CSV, APIs, ajout manuel)
- La connexion relationnelle des données doit être maintenue de manière cohérente
- Les automatisations (relances, détection obsolescence) doivent être transparentes et contrôlables

### Cross-Cutting Concerns Identified

**1. Fiabilité et résilience du scraping :**
- Architecture modulaire permettant multiples sources de données (scraping, APIs, import CSV, ajout manuel)
- Système de détection d'erreurs et validation des données scrapées
- Interface de correction manuelle toujours accessible
- Plan B si scraping échoue (alternatives fonctionnelles)

**2. Gestion des données relationnelles complexes :**
- Modèle de données bien conçu pour connexions salles ↔ contacts ↔ projets ↔ campagnes
- Synchronisation des données entre modules (projets, booking, contacts)
- Propagation cohérente des modifications dans toutes les sections concernées
- Intégrité référentielle garantie

**3. Automatisation transparente et contrôlable :**
- Services de relances automatiques avec scheduling fiable
- Détection d'obsolescence avec notifications non-intrusives
- Feedback clair sur l'état des automatisations sans surcharge cognitive
- Contrôle utilisateur maintenu (possibilité d'intervention manuelle)

**4. Performance et expérience utilisateur :**
- Mises à jour AJAX pour éviter refresh complets (contacts, campagnes, tableau de bord)
- Chargement rapide pour consultation ponctuelle (5-10 minutes)
- Architecture modulaire pour chargement progressif
- Optimisation desktop-first avec support mobile acceptable

**5. Extensibilité et évolutivité :**
- Architecture modulaire pour fonctionnalités post-MVP (médias, finances, enregistrement)
- Migration mobile native facilitée (choix React/Next.js)
- Intégrations API futures (Meta, Buffer, distro-kids)
- Système de plugins/extensions potentiel pour personnalisation

**6. Sécurité et conformité (futures) :**
- Architecture extensible pour conformité RGPD (si ouverture à la communauté)
- Gestion sécurisée des données personnelles (contacts scrapés)
- Authentification et autorisation (si multi-utilisateurs futurs)

## Starter Template Evaluation

### Primary Technology Domain

Application web full-stack basée sur l'analyse des exigences du projet.

### Starter Options Considered

**Starter officiel Next.js (`create-next-app`)** : Starter recommandé et maintenu activement par Vercel, aligné avec les préférences techniques identifiées dans la spécification UX.

**Alternatives considérées :**
- Starters communautaires (T3 Stack, etc.) : Non retenus car le starter officiel répond aux besoins et évite les dépendances supplémentaires
- Starters avec backend intégré : Non nécessaires car architecture backend sera décidée séparément

### Selected Starter: create-next-app

**Rationale for Selection:**

1. **Alignement avec préférences techniques** : Tailwind CSS inclus par défaut, compatible avec Radix UI (à ajouter manuellement)
2. **Migration React Native facilitée** : Stack React/Next.js compatible avec migration future vers React Native
3. **Maintenance et support** : Starter officiel maintenu activement par l'équipe Next.js/Vercel
4. **Bonnes pratiques intégrées** : Structure moderne avec App Router, Server Components, optimisations automatiques
5. **Performance** : Turbopack par défaut pour développement rapide, optimisations de production intégrées
6. **Extensibilité** : Architecture modulaire permettant ajout de fonctionnalités futures

**Initialization Command:**

```bash
npx create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript configuré par défaut avec configuration stricte
- React 19 + Next.js 15 (versions actuelles en 2025)
- Node.js runtime pour Server Components et API routes

**Styling Solution:**
- Tailwind CSS configuré et prêt à l'emploi
- Configuration dans `tailwind.config.ts` (ou CSS-first avec Tailwind v4)
- Compatible avec Radix UI (à installer et configurer après initialisation)
- Note : Tailwind v4 disponible, mise à jour manuelle possible si souhaité

**Build Tooling:**
- Turbopack comme bundler par défaut (plus rapide que Webpack)
- Optimisations automatiques : code-splitting, static optimization, prefetching
- Support des Server Components et Client Components avec boundaries claires
- Build de production optimisé avec minification et tree-shaking

**Testing Framework:**
- Non inclus par défaut dans le starter
- Recommandation pour ajout : Vitest + React Testing Library (unit/integration), Playwright (E2E)
- Configuration de tests à ajouter selon besoins du projet

**Code Organization:**
- App Router structure (recommandé, moderne)
- Organisation modulaire avec layouts et route groups
- Dossier `src/` pour organisation claire (`--src-dir` flag)
- Import alias `@/*` configuré par défaut
- Séparation claire Server Components / Client Components

**Development Experience:**
- Hot reloading avec Turbopack pour développement rapide
- ESLint configuré avec règles Next.js (ou Biome en option)
- Configuration TypeScript prête avec types Next.js
- Structure de projet standardisée et documentée
- Support des variables d'environnement (`.env.local`, etc.)

**Note:** L'initialisation du projet avec cette commande devrait être la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Base de données PostgreSQL avec multi-tenancy (`userId` sur toutes les tables personnelles)
- Authentification Auth.js dès le départ (même pour MVP personnel)
- Scraping asynchrone avec système de cache
- Architecture modulaire pour services backend

**Important Decisions (Shape Architecture):**
- ORM Prisma pour gestion des données
- Server Actions pour mutations internes, API Routes pour besoins spécifiques
- Gestion d'état hybride (React Context + Zustand)
- Optimisations de performance (lazy loading, Suspense)

**Deferred Decisions (Post-MVP):**
- Rate limiting (ajout si nécessaire)
- Jobs asynchrones avancés (queue system) - commencer synchrone pour MVP
- Monitoring avancé (Sentry) - commencer avec Vercel Analytics
- Cache Redis (ajout si nécessaire)

### Data Architecture

**Database Choice:**
- **PostgreSQL 18.1** (version stable actuelle, support jusqu'en 2030)
- Rationale : Base de données relationnelle robuste pour connexions complexes salles ↔ contacts ↔ projets ↔ campagnes. Support JSON pour flexibilité. Transition facile depuis MySQL.

**ORM Choice:**
- **Prisma ORM v6.18.0** (préparation v7)
- Rationale : Plus accessible pour débuter avec un ORM, documentation riche, Prisma Studio, migrations déclaratives, écosystème mature. Compatible avec Next.js 15.

**Data Modeling Approach:**
- **Modèle relationnel normalisé** avec clés étrangères explicites
- Relations many-to-many pour salles ↔ contacts (via table de jointure)
- Relations one-to-many pour projets ↔ campagnes, projets ↔ contacts
- Champs JSON pour données flexibles (templates, configurations)
- **Multi-tenancy** : Champ `userId` sur toutes les tables de données personnelles
- **Historique séparé** : Table dédiée `campaign_history` pour l'historique des campagnes et échanges

**Data Validation Strategy:**
- **Zod** pour validation TypeScript-first
- Validation côté client et serveur
- Intégration naturelle avec Prisma
- Validation avant logique métier dans toutes les routes API et Server Actions

**Migration Approach:**
- **Prisma Migrate** pour migrations déclaratives
- Migrations versionnées dans Git
- Environnements séparés (dev, staging, prod)
- Tests de migrations avant déploiement

**Caching Strategy:**
- **Pas de cache dédié pour MVP** (utiliser cache Next.js pour pages statiques)
- **Cache des données scrapées** : Table `public_venue_cache` et `public_contact_cache` pour données publiques API partagées entre utilisateurs
- **Cache applicatif** : Vérifier si données déjà scrapées avant nouveau scraping
- Ajout Redis plus tard si nécessaire pour performance

**Scraping Architecture (Critique):**
- **Scraping asynchrone** : Jobs en arrière-plan pour éviter timeouts et optimiser les coûts
- **Système de cache** : Vérifier cache avant scraping, éviter re-scraping inutile
- **Sources multiples** : Scraping, APIs externes, import CSV, ajout manuel
- **Détection d'obsolescence** : Validation automatique des données scrapées
- **Interface de correction** : Correction manuelle toujours accessible

### Authentication & Security

**Authentication Method:**
- **Auth.js v5** (anciennement NextAuth.js) avec adapter Prisma
- Rationale : Installé dès le départ même pour MVP personnel pour éviter refactoring majeur. Architecture multi-utilisateurs prête dès le départ. Compatible avec Prisma et Next.js 15.

**Multi-Tenancy Architecture:**
- **Modèle avec `userId`** sur toutes les tables de données personnelles
- Middleware Auth.js pour protéger les routes et injecter le `userId`
- Helpers Prisma pour filtrer automatiquement par `userId`
- Tables séparées pour données publiques (cache API) sans `userId`

**Data Separation:**
- **Données personnelles** (avec `userId`) : projets, contacts, salles, médias, campagnes, templates, historique
- **Données publiques** (sans `userId`) : cache des données API publiques partagées entre utilisateurs

**API Security Strategy:**
- Validation Zod sur toutes les routes API
- Gestion d'erreurs standardisée (ne pas exposer informations sensibles)
- Headers de sécurité configurés dès le départ (CSP, X-Frame-Options, etc.)
- Rate limiting différé pour MVP (ajout si nécessaire)

**Data Encryption:**
- HTTPS automatique (géré par Vercel)
- PostgreSQL gère le chiffrement au repos si configuré
- Pas de chiffrement applicatif supplémentaire pour MVP

### API & Communication Patterns

**API Design Patterns:**
- **Approche hybride** :
  - **Server Actions** pour mutations internes (formulaires, actions utilisateur) : création/modification projets, contacts, campagnes, templates
  - **API Routes** pour besoins spécifiques : webhooks, intégrations externes, endpoints publics si nécessaire

**Error Handling Standards:**
- **Classes d'erreurs personnalisées** : `AppError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ValidationError`
- **Pour Server Actions** : Retourner `{ success: boolean, error?: { code, message } }` pour erreurs attendues, utiliser `useActionState` côté client
- **Pour API Routes** : Wrapper `withErrorHandler` pour centraliser la gestion, codes HTTP appropriés (400, 401, 404, 500, etc.)
- **Validation** : Zod pour valider toutes les entrées avant logique métier

**Rate Limiting Strategy:**
- Différé pour MVP (ajout si nécessaire après lancement)
- Solution simple comme `next-rate-limit` ou `@upstash/ratelimit` pour plus tard
- Limites différentes selon endpoints (scraping plus strict que consultation)

**Communication Between Services:**
- **Modules TypeScript séparés** (pas de microservices pour MVP) : `scrapingService`, `emailService`, `campaignService`, `templateService`
- Appelés depuis Server Actions ou API Routes
- **Jobs asynchrones** : Commencer synchrone pour MVP, ajouter queue system (BullMQ, etc.) plus tard si nécessaire pour tâches longues (scraping, envoi campagnes)

**API Documentation:**
- Documentation inline dans le code (JSDoc/TypeScript) pour MVP
- Documentation externe (Swagger/OpenAPI) si API publique plus tard

### Frontend Architecture

**State Management Approach:**
- **Approche hybride** :
  - **React Context** pour valeurs globales stables : thème, préférences utilisateur, état d'authentification
  - **Zustand** pour état UI dynamique : modals, formulaires complexes, état de navigation
  - **Server Components** pour données serveur : pas de gestion d'état client pour données API/DB

**Component Architecture:**
- **Server Components par défaut** : Pages, layouts, composants statiques, récupération de données
- **Client Components uniquement quand nécessaire** : Formulaires interactifs, boutons avec état local, modals, dropdowns, tooltips, composants utilisant `useState`, `useEffect`, événements navigateur
- **Pattern recommandé** : Isoler Client Components en bas de l'arbre (petits widgets interactifs), éviter de transformer composants parents entiers en Client Components

**Routing Strategy:**
- **App Router** (déjà choisi via starter `create-next-app`)
- Structure modulaire avec route groups pour organisation claire

**Performance Optimization:**
- **Server Components** : Utiliser `<Suspense>` pour streaming et états de chargement, cache avec `revalidate` pour données qui changent peu, fetch parallèle quand possible
- **Client Components** : Lazy loading avec `dynamic()` pour composants lourds (éditeurs, graphiques)
- **Images** : Utiliser `<Image>` de Next.js avec optimisation automatique, formats modernes (WebP, AVIF)

**Bundle Optimization:**
- Code splitting automatique de Next.js (chaque route = chunk séparé)
- Lazy loading avec `dynamic()` pour composants lourds non critiques
- Analyse de bundle avec `@next/bundle-analyzer` si nécessaire

### Infrastructure & Deployment

**Hosting Strategy:**
- **Vercel** (intégration native Next.js, déploiements automatiques, gratuit pour usage personnel)
- Rationale : Optimisé pour Next.js 15, preview URLs automatiques, CDN global, scaling automatique. Plan gratuit (Hobby) suffisant pour MVP personnel.

**Database Hosting:**
- **Vercel Postgres (Neon)** (intégration Vercel, branches automatiques pour previews, scale-to-zero)
- Rationale : Intégration directe avec Vercel, branches automatiques pour previews, gratuit pour usage personnel (0,5 GB storage, 5 GB transfert/mois). Plan gratuit suffisant pour MVP.

**CI/CD Pipeline:**
- **GitHub Actions** pour CI (lint, type-check, tests sur PRs)
- **Vercel** pour CD (déploiement automatique depuis GitHub)
- Workflow : PR → Lint + Type-check + Tests → Merge vers `main` → Build + Deploy automatique Vercel
- Preview URLs automatiques pour chaque PR (via Vercel)

**Environment Configuration:**
- **Development** : `.env.local` (local, pas commité)
- **Production** : Variables d'environnement dans Vercel (interface ou CLI)
- Variables à gérer : `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, clés API externes (scraping, email, etc.)
- Sécurité : Jamais de secrets dans le code, utiliser secrets GitHub Actions pour CI, variables Vercel pour production

**Monitoring and Logging:**
- **Vercel Analytics** : Intégré, métriques de base (traffic, performance)
- **Logs Vercel** : Logs d'erreurs et de requêtes
- **Sentry (optionnel)** : Monitoring d'erreurs plus avancé (ajout plus tard si nécessaire)
- Décision : Commencer avec Vercel Analytics + Logs Vercel pour MVP

**Scaling Strategy:**
- **Scaling automatique** via Vercel + Neon pour MVP
- Vercel scale automatiquement selon trafic
- PostgreSQL (Neon) scale automatiquement (scale-to-zero)
- Ajouter Redis pour cache si nécessaire
- Ajouter queue system (BullMQ, etc.) pour jobs asynchrones si nécessaire

**Cost Optimization:**
- **Plan gratuit Vercel** : 0€/mois (100 GB transfert/mois, suffisant pour MVP personnel)
- **Plan gratuit Vercel Postgres** : 0€/mois (0,5 GB storage, 5 GB transfert/mois, suffisant pour MVP)
- **Optimisations critiques** :
  - Scraping asynchrone pour éviter timeouts et optimiser coûts
  - Cache des données scrapées pour éviter re-scraping inutile
  - Nettoyage régulier des données obsolètes
  - Surveillance de l'usage pour détecter dépassements

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialisation projet avec `create-next-app`
2. Configuration Prisma + PostgreSQL (Vercel Postgres)
3. Configuration Auth.js avec adapter Prisma
4. Modèle de données avec multi-tenancy (`userId` sur toutes les tables)
5. Services backend (scraping, email, campagnes) avec scraping asynchrone et cache
6. Server Actions pour mutations internes
7. Frontend avec Server Components par défaut, Client Components pour interactivité
8. Optimisations de performance (lazy loading, Suspense)

**Cross-Component Dependencies:**
- **Scraping asynchrone** → Nécessite système de jobs/queue (commencer simple, évoluer si nécessaire)
- **Cache des données scrapées** → Tables `public_venue_cache` et `public_contact_cache` partagées entre utilisateurs
- **Multi-tenancy** → Toutes les requêtes doivent filtrer par `userId` (helpers Prisma)
- **Auth.js** → Middleware pour protéger routes et injecter `userId` dans toutes les requêtes
- **Server Actions** → Utilisent services backend (scraping, email, campagnes) qui doivent respecter multi-tenancy

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
15+ zones où les agents IA pourraient faire des choix différents, nécessitant des patterns stricts pour garantir la cohérence.

### Naming Patterns

**Database Naming Conventions:**
- **Tables** : `snake_case` (ex: `users`, `music_projects`, `venue_contacts`, `campaign_history`)
- **Colonnes** : `snake_case` (ex: `user_id`, `created_at`, `email_address`, `venue_name`)
- **Relations Prisma** : `camelCase` pour les champs de relation (ex: `user`, `projects`, `campaigns`, `venue`)
- **Index** : `idx_<table>_<column>` (ex: `idx_users_email`, `idx_projects_user_id`)
- Rationale : Conventions PostgreSQL standard, Prisma gère la conversion automatique vers camelCase dans le code TypeScript

**API Naming Conventions:**
- **Endpoints** : **Pluriel** (ex: `/api/users`, `/api/projects`, `/api/campaigns`, `/api/venues`)
- **Paramètres dynamiques** : `[id]` dans Next.js App Router (ex: `/api/users/[id]/route.ts`)
- **Query parameters** : `camelCase` (ex: `?userId=123&includeProjects=true&status=active`)
- **Headers** : `kebab-case` avec préfixe si custom (ex: `X-Request-ID`, `Content-Type`)
- Rationale : REST standard (pluriel), cohérent avec Next.js App Router, conventions HTTP

**Code Naming Conventions:**
- **Composants React** : `PascalCase` (ex: `UserCard`, `ProjectDashboard`, `CampaignList`, `VenueSelector`)
- **Fichiers composants** : `PascalCase.tsx` (ex: `UserCard.tsx`, `ProjectDashboard.tsx`)
- **Fichiers utilitaires** : `camelCase.ts` (ex: `formatDate.ts`, `validateEmail.ts`, `scrapeVenues.ts`)
- **Variables et fonctions** : `camelCase` (ex: `userId`, `getUserData`, `isLoading`, `createCampaign`)
- **Constantes** : `UPPER_SNAKE_CASE` (ex: `MAX_CAMPAIGNS`, `DEFAULT_PAGE_SIZE`, `SCRAPING_TIMEOUT`)
- **Types/Interfaces** : `PascalCase` (ex: `User`, `Project`, `Campaign`, `ScrapingJob`)
- **Server Actions** : `camelCase` avec verbe d'action (ex: `createProject`, `updateContact`, `sendCampaign`, `scrapeVenues`)
- Rationale : Conventions TypeScript/React standard, clarté et cohérence

### Structure Patterns

**Project Organization:**
```
src/
  app/                          # Next.js App Router (routes)
    (dashboard)/                # Route groups
      page.tsx                  # Tableau de bord principal
      projects/
        page.tsx                # Liste des projets
        [id]/
          page.tsx              # Détail d'un projet
      booking/
        page.tsx                # Module booking
        campaigns/
          page.tsx              # Campagnes de mailing
      contacts/
        page.tsx                # Gestion des contacts
        venues/
          page.tsx              # Gestion des salles
    api/                        # API Routes
      scraping/
        route.ts                # Endpoints scraping
      campaigns/
        route.ts                # Endpoints campagnes
    layout.tsx                  # Layout global avec Auth
  components/                   # Composants React
    ui/                         # Composants UI réutilisables (Radix UI)
      button.tsx
      dialog.tsx
      form.tsx
    features/                   # Composants par feature
      projects/
        ProjectCard.tsx
        ProjectForm.tsx
      campaigns/
        CampaignList.tsx
        CampaignForm.tsx
      contacts/
        ContactCard.tsx
        VenueCard.tsx
  lib/                          # Utilitaires et helpers
    prisma/
      client.ts                 # Client Prisma singleton
      helpers.ts                # Helpers pour filtrage userId
    services/                   # Services backend
      scrapingService.ts        # Service de scraping asynchrone
      emailService.ts           # Service de mailing
      campaignService.ts        # Service de campagnes
      templateService.ts        # Service de templates
    utils/                      # Utilitaires généraux
      formatDate.ts
      validateEmail.ts
    validations/                # Schémas Zod
      project.ts
      contact.ts
      campaign.ts
    errors.ts                   # Classes d'erreurs personnalisées
    auth.ts                     # Configuration Auth.js
  types/                        # Types TypeScript partagés
    index.ts
    project.ts
    campaign.ts
  stores/                       # Stores Zustand
    uiStore.ts                  # État UI (modals, etc.)
    formStore.ts                # État formulaires complexes
  actions/                      # Server Actions
    projectActions.ts
    campaignActions.ts
    contactActions.ts
```

**Services Backend Organization:**
- **Emplacement** : `lib/services/` par service
- **Structure** : Un fichier par service (ex: `scrapingService.ts`, `emailService.ts`)
- **Pattern** : Module TypeScript avec fonctions exportées, pas de classes
- **Exemple** :
```typescript
// lib/services/scrapingService.ts
export async function scrapeVenues(userId: string, source: string) { ... }
export async function checkCache(source: string) { ... }
export async function createScrapingJob(userId: string, type: string) { ... }
```

**Test Organization:**
- **Co-localisés** avec les fichiers (ex: `UserCard.test.tsx` à côté de `UserCard.tsx`)
- **OU** dans dossier `__tests__/` à côté du fichier
- **Structure** : `*.test.ts` ou `*.test.tsx` pour tests unitaires, `*.spec.ts` pour tests d'intégration
- Rationale : Facilite la maintenance, évite les fichiers perdus

### Format Patterns

**Server Actions - Response Format:**
```typescript
// Succès
{ success: true, data: T }

// Erreur attendue
{ success: false, error: { code: string, message: string } }

// Exemple concret
{ success: true, data: { id: '123', name: 'Projet Musical' } }
{ success: false, error: { code: 'VALIDATION_ERROR', message: 'Le nom est requis' } }
```
- Rationale : Format uniforme, facile à gérer avec `useActionState`, type-safe avec TypeScript

**API Routes - Response Format:**
```typescript
// Succès
NextResponse.json({ data: T }, { status: 200 })

// Erreur
NextResponse.json(
  { error: { code: string, message: string } },
  { status: 400|401|404|500 }
)

// Exemple concret
NextResponse.json({ data: { id: '123', name: 'Projet' } }, { status: 200 })
NextResponse.json(
  { error: { code: 'NOT_FOUND', message: 'Projet introuvable' } },
  { status: 404 }
)
```
- Rationale : Format REST standard, codes HTTP appropriés, cohérent avec Server Actions

**Date Formats:**
- **Format** : ISO 8601 strings (ex: `"2026-01-18T12:00:00Z"`)
- **Stockage DB** : `timestamp` PostgreSQL avec timezone
- **Affichage UI** : Format localisé selon préférences utilisateur
- Rationale : Standard international, facile à parser, support timezone

**JSON Field Naming:**
- **camelCase** dans les réponses API (ex: `userId`, `createdAt`, `emailAddress`, `venueName`)
- **Conversion automatique** Prisma (DB `snake_case` → API `camelCase`)
- **Consistance** : Toujours utiliser camelCase dans les réponses, jamais snake_case
- Rationale : Conventions JavaScript/TypeScript, cohérence avec le code frontend

### Communication Patterns

**Multi-Tenancy - UserId Filtering:**
```typescript
// Helper Prisma standardisé (lib/prisma/helpers.ts)
export async function getProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { userId }, // TOUJOURS filtrer par userId
  });
}

// Pattern à suivre : TOUJOURS inclure userId dans where clause
// Règle absolue : Toutes les requêtes de données personnelles doivent filtrer par userId
// Vérification : Utiliser helpers Prisma pour garantir le filtrage
```

**Scraping Asynchrone Pattern:**
```typescript
// Structure d'un job de scraping (types/scraping.ts)
interface ScrapingJob {
  id: string;
  userId: string;
  type: 'venues' | 'contacts' | 'media';
  status: 'pending' | 'running' | 'completed' | 'failed';
  source: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  resultCount?: number;
}

// Service de scraping avec cache (lib/services/scrapingService.ts)
export async function scrapeVenues(userId: string, source: string) {
  // 1. Vérifier cache d'abord
  const cached = await getCachedVenues(source);
  if (cached && !isCacheExpired(cached)) {
    return { success: true, data: cached.data, fromCache: true };
  }
  
  // 2. Créer job asynchrone (éviter timeout)
  const job = await createScrapingJob(userId, 'venues', source);
  
  // 3. Traiter en arrière-plan
  processScrapingJob(job.id); // Non-bloquant
  
  return { success: true, data: { jobId: job.id, status: 'pending' } };
}

// Règles :
// - TOUJOURS vérifier le cache avant scraping
// - TOUJOURS créer un job asynchrone pour éviter timeouts
// - Stocker l'état du job dans la base de données
```

**State Management Patterns:**
- **React Context** : Pour valeurs globales stables (thème, préférences utilisateur, état auth)
- **Zustand** : Pour état UI dynamique (modals, formulaires complexes, état navigation)
- **Server Components** : Pour données serveur (pas d'état client pour données API/DB)
- **Local state** : `useState` pour état local à un composant
- Rationale : Séparation claire des responsabilités, éviter la surcharge

### Process Patterns

**Error Handling Pattern:**
```typescript
// Classes d'erreurs standardisées (lib/errors.ts)
export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Ressource introuvable') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

// Server Action avec gestion d'erreurs
export async function createProject(data: unknown, userId: string) {
  try {
    // 1. Validation
    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return { 
        success: false, 
        error: { code: 'VALIDATION_ERROR', message: validated.error.message } 
      };
    }

    // 2. Logique métier
    const project = await prisma.project.create({
      data: { ...validated.data, userId },
    });

    return { success: true, data: project };
  } catch (error) {
    // 3. Gestion erreurs
    if (error instanceof AppError) {
      return { 
        success: false, 
        error: { code: error.code || 'APP_ERROR', message: error.message } 
      };
    }
    // Erreur inattendue
    console.error('Unexpected error:', error);
    return { 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Une erreur est survenue' } 
    };
  }
}
```

**Loading State Patterns:**
- **Server Actions** : Utiliser `useActionState` pour gérer loading/error/success
- **API Routes** : Utiliser `useState` + `useEffect` pour loading
- **Naming** : `isLoading`, `isPending`, `isSubmitting` selon contexte
- **UI** : Afficher spinner/skeleton pendant loading, désactiver boutons pendant submit
- Rationale : Patterns Next.js 15 standard, UX cohérente

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Filtrer par `userId`** dans toutes les requêtes de données personnelles (utiliser helpers Prisma)
2. **Utiliser les classes d'erreurs standardisées** (`AppError`, `BadRequestError`, etc.)
3. **Retourner le format de réponse standard** (`{ success, data?, error? }` pour Server Actions)
4. **Vérifier le cache avant scraping** (éviter re-scraping inutile)
5. **Créer des jobs asynchrones pour le scraping** (éviter timeouts, optimiser coûts)
6. **Utiliser les conventions de nommage définies** (tables snake_case, code camelCase, etc.)
7. **Organiser les fichiers selon la structure définie** (services dans `lib/services/`, etc.)
8. **Valider toutes les entrées avec Zod** avant logique métier
9. **Utiliser Server Components par défaut**, Client Components uniquement pour interactivité
10. **Respecter les formats de dates** (ISO 8601 dans API, timestamp dans DB)

**Pattern Enforcement:**

- **ESLint rules** : Configurer des règles pour conventions de nommage
- **TypeScript types** : Types stricts pour garantir les formats de réponse
- **Helpers Prisma** : Fonctions helper pour garantir le filtrage `userId`
- **Code review** : Vérifier la cohérence des patterns dans les PRs
- **Documentation** : Ce document d'architecture comme référence pour tous les agents

### Pattern Examples

**Good Example - Server Action:**
```typescript
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validations/project';
import { UnauthorizedError, ValidationError } from '@/lib/errors';

export async function createProject(data: unknown) {
  // 1. Vérifier authentification
  const session = await auth();
  if (!session?.user?.id) {
    return { 
      success: false, 
      error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } 
    };
  }

  // 2. Validation avec Zod
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { 
      success: false, 
      error: { 
        code: 'VALIDATION_ERROR', 
        message: validated.error.errors.map(e => e.message).join(', ') 
      } 
    };
  }

  // 3. Logique métier avec filtrage userId
  try {
    const project = await prisma.project.create({
      data: {
        ...validated.data,
        userId: session.user.id, // TOUJOURS inclure userId
      },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Erreur lors de la création' } 
    };
  }
}
```

**Good Example - Scraping Service:**
```typescript
// lib/services/scrapingService.ts
import { prisma } from '@/lib/prisma';
import { createScrapingJob, updateJobStatus } from '@/lib/services/jobService';

export async function scrapeVenues(userId: string, source: string) {
  // 1. Vérifier cache
  const cached = await prisma.publicVenueCache.findFirst({
    where: { source, updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
  
  if (cached) {
    return { success: true, data: cached.data, fromCache: true };
  }

  // 2. Créer job asynchrone
  const job = await createScrapingJob(userId, 'venues', source);
  
  // 3. Traiter en arrière-plan (non-bloquant)
  processScrapingJob(job.id).catch(error => {
    console.error('Scraping job failed:', error);
    updateJobStatus(job.id, 'failed', error.message);
  });

  return { success: true, data: { jobId: job.id, status: 'pending' } };
}
```

**Anti-Patterns to Avoid:**

- ❌ **Oublier de filtrer par `userId`** dans les requêtes → Risque de fuite de données entre utilisateurs
- ❌ **Scraping synchrone dans Server Action** → Risque de timeout, consommation excessive
- ❌ **Formats de réponse différents** entre Server Actions → Incohérence, difficulté de maintenance
- ❌ **Noms de fichiers/tables inconsistants** → Confusion, erreurs de compilation
- ❌ **Validation après logique métier** → Risque de corruption de données
- ❌ **Pas de vérification de cache avant scraping** → Coûts inutiles, performance dégradée
- ❌ **Client Components pour données serveur** → Bundle size inutile, performance dégradée

## Project Structure & Boundaries

### Complete Project Directory Structure

```
flowen-app/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .env.local                    # Variables d'environnement locales (pas commité)
├── .env.example                  # Exemple de variables d'environnement
├── .gitignore
├── .github/
│   └── workflows/
│       ├── pr-checks.yml         # Lint, type-check, tests sur PRs
│       └── deploy.yml            # Build et déploiement sur main
├── prisma/
│   ├── schema.prisma             # Schéma Prisma avec multi-tenancy
│   ├── migrations/               # Migrations Prisma
│   └── seed.ts                   # Seed de données de test (optionnel)
├── public/
│   ├── favicon.ico
│   └── assets/                   # Assets statiques (images, etc.)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css           # Styles globaux Tailwind
│   │   ├── layout.tsx            # Layout racine (Server Component)
│   │   ├── page.tsx              # Page d'accueil (redirection vers dashboard)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # Route Auth.js
│   │   │   ├── scraping/
│   │   │   │   ├── route.ts      # Endpoints scraping (GET, POST)
│   │   │   │   └── [jobId]/
│   │   │   │       └── route.ts  # Statut d'un job de scraping
│   │   │   ├── campaigns/
│   │   │   │   ├── route.ts      # Liste/création campagnes
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts  # Détail/modification campagne
│   │   │   │       └── send/
│   │   │   │           └── route.ts  # Lancement campagne
│   │   │   ├── contacts/
│   │   │   │   ├── route.ts      # Liste/création contacts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # Détail/modification contact
│   │   │   ├── venues/
│   │   │   │   ├── route.ts      # Liste/création salles
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # Détail/modification salle
│   │   │   └── projects/
│   │   │       ├── route.ts      # Liste/création projets
│   │   │       └── [id]/
│   │   │           └── route.ts # Détail/modification projet
│   │   ├── (dashboard)/          # Route group pour dashboard
│   │   │   ├── layout.tsx        # Layout dashboard avec navigation
│   │   │   ├── page.tsx          # Tableau de bord principal (FR45-51)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx      # Liste des projets (FR2)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Création projet (FR1)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Détail projet (FR3, FR6)
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # Édition projet
│   │   │   ├── booking/
│   │   │   │   ├── page.tsx      # Module booking principal
│   │   │   │   ├── campaigns/
│   │   │   │   │   ├── page.tsx  # Liste campagnes (FR38)
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx  # Création campagne (FR32)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Détail campagne (FR38-44)
│   │   │   │   └── templates/
│   │   │   │       ├── page.tsx  # Liste templates (FR24)
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx  # Création template (FR24)
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx  # Édition template (FR24-27)
│   │   │   ├── contacts/
│   │   │   │   ├── page.tsx      # Liste contacts (FR7)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Création contact (FR7, FR22)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Détail contact (FR11, FR14, FR40, FR44)
│   │   │   ├── venues/
│   │   │   │   ├── page.tsx      # Liste salles (FR8)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Création salle (FR8, FR22)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Détail salle (FR12, FR14, FR41, FR44)
│   │   │   └── settings/
│   │   │       ├── page.tsx      # Paramètres généraux
│   │   │       ├── scraping/
│   │   │       │   └── page.tsx  # Configuration scraping (FR18, FR59)
│   │   │       ├── campaigns/
│   │   │       │   └── page.tsx  # Configuration relances (FR33, FR60)
│   │   │       └── profile/
│   │   │           └── page.tsx  # Données personnelles (FR5)
│   │   └── (auth)/               # Route group pour authentification
│   │       ├── login/
│   │       │   └── page.tsx      # Page de connexion
│   │       └── signin/
│   │           └── page.tsx      # Page d'inscription
│   ├── components/
│   │   ├── ui/                   # Composants UI réutilisables (Radix UI)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   ├── features/             # Composants par feature
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardOverview.tsx      # Vue d'ensemble (FR45)
│   │   │   │   ├── WhatsNext.tsx              # "What's next" (FR46)
│   │   │   │   ├── ActiveCampaigns.tsx        # Campagnes en cours (FR47)
│   │   │   │   └── RecentResponses.tsx         # Nouvelles réponses (FR48)
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx             # Carte projet (FR2)
│   │   │   │   ├── ProjectList.tsx             # Liste projets
│   │   │   │   ├── ProjectForm.tsx             # Formulaire projet (FR1)
│   │   │   │   ├── ProjectTimeline.tsx         # Timeline projet (FR3, FR6)
│   │   │   │   └── ProjectSteps.tsx            # Étapes projet (FR4)
│   │   │   ├── campaigns/
│   │   │   │   ├── CampaignCard.tsx            # Carte campagne
│   │   │   │   ├── CampaignList.tsx            # Liste campagnes (FR38)
│   │   │   │   ├── CampaignForm.tsx            # Formulaire campagne (FR32)
│   │   │   │   ├── CampaignStatus.tsx           # Statut campagne (FR38-39)
│   │   │   │   ├── CampaignHistory.tsx         # Historique (FR44)
│   │   │   │   └── CampaignFilters.tsx          # Filtres (FR29-30)
│   │   │   ├── templates/
│   │   │   │   ├── TemplateEditor.tsx          # Éditeur template (FR24)
│   │   │   │   ├── TemplatePreview.tsx        # Prévisualisation (FR27)
│   │   │   │   └── TemplateVariables.tsx        # Variables dynamiques (FR25-26)
│   │   │   ├── contacts/
│   │   │   │   ├── ContactCard.tsx             # Carte contact (FR7)
│   │   │   │   ├── ContactList.tsx             # Liste contacts
│   │   │   │   ├── ContactForm.tsx             # Formulaire contact (FR7, FR11)
│   │   │   │   ├── ContactDetail.tsx           # Détail contact (FR40, FR44)
│   │   │   │   └── ContactStatusBadge.tsx       # Badge statut (FR14)
│   │   │   ├── venues/
│   │   │   │   ├── VenueCard.tsx               # Carte salle (FR8)
│   │   │   │   ├── VenueList.tsx               # Liste salles
│   │   │   │   ├── VenueForm.tsx               # Formulaire salle (FR8, FR12)
│   │   │   │   ├── VenueDetail.tsx             # Détail salle (FR41, FR44)
│   │   │   │   ├── VenueConnections.tsx        # Connexions contacts (FR9-10)
│   │   │   │   └── VenueStatusBadge.tsx        # Badge statut (FR14)
│   │   │   ├── scraping/
│   │   │   │   ├── ScrapingJobStatus.tsx       # Statut job scraping
│   │   │   │   ├── ScrapingConfig.tsx          # Configuration (FR18)
│   │   │   │   └── ScrapingErrors.tsx          # Erreurs scraping (FR52-53)
│   │   │   └── shared/
│   │   │       ├── DataImport.tsx              # Import CSV (FR19)
│   │   │       ├── DataExport.tsx              # Export CSV (FR20)
│   │   │       └── ArchiveButton.tsx           # Archivage (FR13)
│   │   └── layout/
│   │       ├── Header.tsx                      # Header avec navigation
│   │       ├── Sidebar.tsx                     # Navigation latérale
│   │       └── Footer.tsx                      # Footer
│   ├── lib/
│   │   ├── prisma/
│   │   │   ├── client.ts                       # Client Prisma singleton
│   │   │   └── helpers.ts                      # Helpers pour filtrage userId
│   │   ├── services/                           # Services backend
│   │   │   ├── scrapingService.ts              # Scraping asynchrone + cache (FR16-17, FR23)
│   │   │   ├── emailService.ts                 # Service de mailing (FR31)
│   │   │   ├── campaignService.ts             # Service de campagnes (FR32, FR34-35)
│   │   │   ├── templateService.ts             # Service de templates (FR28)
│   │   │   ├── jobService.ts                   # Gestion jobs asynchrones
│   │   │   └── cacheService.ts                 # Gestion cache données scrapées
│   │   ├── utils/                               # Utilitaires généraux
│   │   │   ├── formatDate.ts
│   │   │   ├── validateEmail.ts
│   │   │   ├── formatCurrency.ts
│   │   │   └── constants.ts                    # Constantes partagées
│   │   ├── validations/                        # Schémas Zod
│   │   │   ├── project.ts                      # Validation projets
│   │   │   ├── contact.ts                      # Validation contacts
│   │   │   ├── venue.ts                        # Validation salles
│   │   │   ├── campaign.ts                     # Validation campagnes
│   │   │   └── template.ts                     # Validation templates
│   │   ├── errors.ts                           # Classes d'erreurs personnalisées
│   │   ├── auth.ts                             # Configuration Auth.js
│   │   └── api.ts                              # Helpers API (format réponses)
│   ├── types/                                  # Types TypeScript partagés
│   │   ├── index.ts
│   │   ├── project.ts
│   │   ├── contact.ts
│   │   ├── venue.ts
│   │   ├── campaign.ts
│   │   ├── template.ts
│   │   └── scraping.ts                         # Types pour jobs scraping
│   ├── stores/                                 # Stores Zustand
│   │   ├── uiStore.ts                          # État UI (modals, etc.)
│   │   └── formStore.ts                        # État formulaires complexes
│   ├── actions/                                # Server Actions
│   │   ├── projectActions.ts                   # Actions projets (FR1-6)
│   │   ├── campaignActions.ts                  # Actions campagnes (FR32, FR36)
│   │   ├── contactActions.ts                   # Actions contacts (FR7, FR11-13)
│   │   ├── venueActions.ts                     # Actions salles (FR8, FR12-13)
│   │   ├── templateActions.ts                  # Actions templates (FR24-27)
│   │   ├── scrapingActions.ts                  # Actions scraping (FR16-18, FR23)
│   │   └── importExportActions.ts              # Import/Export CSV (FR19-20)
│   └── middleware.ts                           # Middleware Next.js (Auth.js)
```

### Architectural Boundaries

**API Boundaries:**

**External API Endpoints:**
- `/api/auth/[...nextauth]` : Authentification Auth.js
- `/api/scraping` : Endpoints scraping (initiation, statut jobs)
- `/api/campaigns` : Gestion campagnes (CRUD, lancement)
- `/api/contacts` : Gestion contacts (CRUD)
- `/api/venues` : Gestion salles (CRUD)
- `/api/projects` : Gestion projets (CRUD)

**Internal Service Boundaries:**
- `lib/services/` : Services backend isolés (scraping, email, campagnes, templates)
- `lib/prisma/` : Couche d'accès aux données (client Prisma + helpers)
- `actions/` : Server Actions pour mutations internes
- `app/api/` : API Routes pour endpoints externes ou besoins spécifiques

**Authentication Boundaries:**
- Middleware Auth.js (`src/middleware.ts`) : Protection routes, injection `userId`
- Helpers Prisma (`lib/prisma/helpers.ts`) : Filtrage automatique par `userId`
- Server Actions : Vérification session dans chaque action

**Component Boundaries:**

**Frontend Component Communication:**
- Server Components : Récupération données, rendu initial
- Client Components : Interactivité, formulaires, modals
- Props : Communication Server → Client (données sérialisables uniquement)
- Server Actions : Invocation depuis Client Components pour mutations

**State Management Boundaries:**
- React Context : Valeurs globales stables (thème, auth) - Provider dans layout
- Zustand : État UI dynamique (modals, formulaires) - Stores dans `stores/`
- Server State : Géré par Server Components, pas d'état client pour données DB

**Service Boundaries:**

**Service Communication Patterns:**
- Services backend (`lib/services/`) : Modules TypeScript avec fonctions exportées
- Appelés depuis Server Actions ou API Routes uniquement
- Pas d'appel direct depuis Client Components
- Chaque service = responsabilité unique (scraping, email, campagnes, etc.)

**Scraping Service Boundaries:**
- `scrapingService.ts` : Gestion scraping asynchrone + cache
- `jobService.ts` : Gestion jobs asynchrones (création, statut, mise à jour)
- `cacheService.ts` : Gestion cache données publiques scrapées
- Communication : Server Actions → Services → Prisma → DB

**Data Boundaries:**

**Database Schema Boundaries:**
- Tables personnelles (avec `userId`) : `users`, `projects`, `contacts`, `venues`, `campaigns`, `templates`, `campaign_history`
- Tables publiques (sans `userId`) : `public_venue_cache`, `public_contact_cache`
- Relations : Many-to-many via tables de jointure (`venue_contacts`)

**Data Access Patterns:**
- Prisma Client : Accès unique via singleton (`lib/prisma/client.ts`)
- Helpers Prisma : Fonctions helper garantissant filtrage `userId`
- Validation : Zod avant écriture en DB
- Cache : Vérification cache avant scraping, stockage dans tables publiques

**Caching Boundaries:**
- Cache données scrapées : Tables `public_venue_cache` et `public_contact_cache`
- Cache Next.js : Pages statiques, ISR pour données qui changent peu
- Pas de cache Redis pour MVP (ajout si nécessaire)

### Requirements to Structure Mapping

**Feature/FR Category Mapping:**

**Gestion de Projet Musical (FR1-6):**
- Components : `src/components/features/projects/`
- Server Actions : `src/actions/projectActions.ts`
- API Routes : `src/app/api/projects/`
- Pages : `src/app/(dashboard)/projects/`
- Database : Tables `projects`, `project_steps` (via Prisma schema)
- Validations : `src/lib/validations/project.ts`

**Gestion des Données Contacts/Salles (FR7-15):**
- Components : `src/components/features/contacts/`, `src/components/features/venues/`
- Server Actions : `src/actions/contactActions.ts`, `src/actions/venueActions.ts`
- API Routes : `src/app/api/contacts/`, `src/app/api/venues/`
- Pages : `src/app/(dashboard)/contacts/`, `src/app/(dashboard)/venues/`
- Database : Tables `contacts`, `venues`, `venue_contacts` (jointure)
- Validations : `src/lib/validations/contact.ts`, `src/lib/validations/venue.ts`
- Services : Détection obsolescence dans `scrapingService.ts` (FR15)

**Scraping et Import (FR16-23):**
- Components : `src/components/features/scraping/`, `src/components/features/shared/DataImport.tsx`
- Server Actions : `src/actions/scrapingActions.ts`, `src/actions/importExportActions.ts`
- API Routes : `src/app/api/scraping/`
- Services : `src/lib/services/scrapingService.ts`, `src/lib/services/cacheService.ts`
- Pages : `src/app/(dashboard)/settings/scraping/`
- Database : Tables `scraping_jobs`, `public_venue_cache`, `public_contact_cache`

**Templates et Mailing (FR24-32):**
- Components : `src/components/features/templates/`, `src/components/features/campaigns/`
- Server Actions : `src/actions/templateActions.ts`, `src/actions/campaignActions.ts`
- Services : `src/lib/services/templateService.ts`, `src/lib/services/emailService.ts`, `src/lib/services/campaignService.ts`
- Pages : `src/app/(dashboard)/booking/templates/`, `src/app/(dashboard)/booking/campaigns/`
- Database : Tables `templates`, `campaigns`
- Validations : `src/lib/validations/template.ts`, `src/lib/validations/campaign.ts`

**Relances Automatiques (FR33-37):**
- Services : `src/lib/services/campaignService.ts` (logique relances)
- Database : Table `campaign_history` pour suivi relances
- Jobs : Gestion via `jobService.ts` pour relances programmées

**Suivi et Visualisation (FR38-44):**
- Components : `src/components/features/campaigns/CampaignStatus.tsx`, `CampaignHistory.tsx`
- Pages : `src/app/(dashboard)/booking/campaigns/[id]/page.tsx`
- Database : Table `campaign_history` pour historique complet
- Updates AJAX : Via Server Actions avec `useActionState`

**Tableau de Bord (FR45-51):**
- Components : `src/components/features/dashboard/`
- Page : `src/app/(dashboard)/page.tsx`
- Server Components : Récupération données depuis Prisma
- Updates AJAX : Via Server Actions pour mises à jour temps réel

**Gestion des Erreurs (FR52-58):**
- Components : `src/components/features/scraping/ScrapingErrors.tsx`
- Services : Gestion erreurs dans tous les services
- Classes d'erreurs : `src/lib/errors.ts`
- UI : Affichage erreurs via `useActionState` dans composants

**Configuration (FR59-62):**
- Pages : `src/app/(dashboard)/settings/`
- Server Actions : Actions de configuration dans services respectifs

**Mises à Jour AJAX (FR63-65):**
- Server Actions : Toutes les mutations via Server Actions
- Client Components : Utilisation `useActionState` pour updates
- Optimistic Updates : Via Zustand stores si nécessaire

**Cross-Cutting Concerns:**

**Authentification (Auth.js):**
- Configuration : `src/lib/auth.ts`
- Middleware : `src/middleware.ts`
- Routes : `src/app/api/auth/[...nextauth]/route.ts`
- Database : Tables `users`, `accounts`, `sessions` (gérées par Prisma adapter)

**Multi-Tenancy:**
- Helpers : `src/lib/prisma/helpers.ts` (fonctions garantissant filtrage `userId`)
- Pattern : Toutes les requêtes via helpers Prisma
- Vérification : Linter ou types TypeScript pour garantir filtrage

**Scraping Asynchrone:**
- Services : `src/lib/services/scrapingService.ts`, `src/lib/services/jobService.ts`
- Database : Table `scraping_jobs` pour état des jobs
- Cache : Tables `public_venue_cache`, `public_contact_cache`

**Gestion d'Erreurs:**
- Classes : `src/lib/errors.ts` (AppError, BadRequestError, etc.)
- Pattern : Utilisation dans tous les Server Actions et API Routes
- UI : Affichage via `useActionState` dans Client Components

### Integration Points

**Internal Communication:**

**Server Components → Client Components:**
- Props sérialisables (données, pas fonctions)
- Server Actions passées comme props pour mutations
- Pattern : Server Component récupère données, passe à Client Component pour interactivité

**Client Components → Server Actions:**
- Invocation directe via `useActionState` ou `formAction`
- Format de réponse standardisé : `{ success, data?, error? }`
- Gestion loading/error via hooks React

**Services → Database:**
- Via Prisma Client (`lib/prisma/client.ts`)
- Helpers Prisma pour filtrage `userId`
- Transactions pour opérations complexes

**External Integrations:**

**Scraping Sources:**
- APIs externes : Intégration dans `scrapingService.ts`
- Import CSV : Via `importExportActions.ts`
- Ajout manuel : Via formulaires contacts/salles

**Email Service:**
- Service tiers (SendGrid, Brevo, etc.) : Configuration dans `emailService.ts`
- SMTP : Alternative si service tiers non utilisé
- Webhooks : Réception réponses emails (si supporté par service)

**APIs Externes (Futures):**
- Meta, Buffer, distro-kids : Intégrations dans `lib/services/` (à créer)
- Structure modulaire pour ajout facile

**Data Flow:**

**Scraping Flow:**
1. Utilisateur demande scraping → Server Action `scrapeVenues()`
2. Server Action → `scrapingService.checkCache()` (vérifie cache)
3. Si cache valide → Retour données cache
4. Si pas de cache → `scrapingService.createJob()` (crée job asynchrone)
5. Job traité en arrière-plan → `scrapingService.processJob()`
6. Résultats stockés dans cache + tables personnelles (avec `userId`)
7. Notification utilisateur via mise à jour statut job

**Campaign Flow:**
1. Utilisateur crée campagne → Server Action `createCampaign()`
2. Server Action → Validation Zod → `campaignService.create()`
3. Utilisateur lance campagne → Server Action `sendCampaign()`
4. Server Action → `campaignService.send()` → `emailService.sendBatch()`
5. Emails envoyés → Statut mis à jour dans DB
6. Relances programmées via `jobService.scheduleFollowup()`
7. Réponses reçues → Webhook ou polling → Mise à jour statut
8. UI mise à jour via AJAX (Server Actions)

**Project Flow:**
1. Utilisateur crée projet → Server Action `createProject()`
2. Validation → Création dans DB avec `userId`
3. Affichage → Server Component récupère projets filtrés par `userId`
4. Mises à jour → Via Server Actions avec validation

### File Organization Patterns

**Configuration Files:**
- Root : `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.json`
- Environment : `.env.local` (local, pas commité), `.env.example` (template)
- Prisma : `prisma/schema.prisma`, `prisma/migrations/`
- Auth.js : Configuration dans `src/lib/auth.ts`

**Source Organization:**
- Feature-based : Composants organisés par feature (`components/features/projects/`, etc.)
- Type-based : Services dans `lib/services/`, validations dans `lib/validations/`
- Route-based : Pages organisées selon routes Next.js App Router
- Rationale : Équilibre entre organisation par feature et réutilisabilité

**Test Organization:**
- Co-localisés : `*.test.ts` ou `*.test.tsx` à côté des fichiers
- Structure : Tests unitaires co-localisés, tests d'intégration dans `__tests__/` si nécessaire
- Fixtures : Données de test dans `__fixtures__/` si nécessaire

**Asset Organization:**
- Static assets : `public/assets/` (images, fichiers statiques)
- Component assets : Assets spécifiques à un composant dans dossier composant si nécessaire
- Rationale : Assets globaux dans `public/`, assets spécifiques co-localisés

### Development Workflow Integration

**Development Server Structure:**
- Next.js dev server : `npm run dev` (Turbopack activé)
- Hot reloading : Automatique pour Server et Client Components
- Prisma Studio : `npx prisma studio` pour visualisation DB
- Structure : Permet développement itératif rapide

**Build Process Structure:**
- Build : `npm run build` (Next.js build avec optimisations)
- Output : `.next/` (build output, pas commité)
- Standalone : Option `output: 'standalone'` pour déploiement Docker si nécessaire
- Prisma : Génération client Prisma dans build (`prisma generate`)

**Deployment Structure:**
- Vercel : Déploiement automatique depuis GitHub
- Environment : Variables d'environnement configurées dans Vercel
- Database : Vercel Postgres (Neon) avec migrations automatiques
- Preview : URLs automatiques pour chaque PR

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

Toutes les décisions architecturales sont cohérentes et compatibles :

- ✅ **Next.js 15 + React 19** : Compatible avec Prisma, Auth.js, Tailwind CSS, Radix UI
- ✅ **PostgreSQL + Prisma** : Compatible avec Next.js Server Components, Auth.js adapter Prisma disponible
- ✅ **Auth.js + Prisma** : Adapter Prisma officiel disponible, support multi-tenancy natif
- ✅ **Server Actions + API Routes** : Approche hybride cohérente, Server Actions pour mutations internes, API Routes pour besoins spécifiques
- ✅ **Scraping asynchrone + Cache** : Compatible avec architecture Next.js, jobs asynchrones via services backend
- ✅ **Multi-tenancy** : Architecture cohérente avec filtrage `userId` sur toutes les tables personnelles
- ✅ **Vercel + Vercel Postgres** : Intégration native, déploiement automatique, branches automatiques

**Pattern Consistency:**

Les patterns d'implémentation supportent toutes les décisions architecturales :

- ✅ **Naming conventions** : Cohérentes entre DB (snake_case), API (camelCase), Code (camelCase/PascalCase)
- ✅ **Structure patterns** : Organisation par feature alignée avec App Router Next.js
- ✅ **Format patterns** : Formats de réponse standardisés pour Server Actions et API Routes
- ✅ **Communication patterns** : Multi-tenancy garantie via helpers Prisma, scraping asynchrone documenté
- ✅ **Process patterns** : Gestion d'erreurs cohérente, loading states standardisés

**Structure Alignment:**

La structure du projet supporte toutes les décisions architecturales :

- ✅ **App Router** : Structure alignée avec Next.js 15 App Router (route groups, layouts)
- ✅ **Services backend** : Organisation modulaire dans `lib/services/` pour scraping, email, campagnes
- ✅ **Multi-tenancy** : Helpers Prisma dans `lib/prisma/helpers.ts` pour garantir filtrage `userId`
- ✅ **Scraping asynchrone** : Structure pour jobs (`jobService.ts`) et cache (`cacheService.ts`)
- ✅ **Server/Client Components** : Séparation claire avec Server Components par défaut

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

Toutes les 65 exigences fonctionnelles sont couvertes architecturalement :

**Gestion de Projet Musical (FR1-6) ✅**
- FR1 (Création projet) : `projectActions.ts` + `ProjectForm.tsx` + Page `projects/new/`
- FR2 (Visualisation projets) : Server Component `projects/page.tsx` + `ProjectList.tsx`
- FR3 (Étapes projet) : `ProjectSteps.tsx` + `ProjectTimeline.tsx`
- FR4 (Prochaines étapes) : `WhatsNext.tsx` dans dashboard
- FR5 (Données personnelles) : Page `settings/profile/` + formulaire
- FR6 (Progression) : `ProjectTimeline.tsx` + visualisation progression

**Gestion des Données (FR7-15) ✅**
- FR7-8 (Création contacts/salles) : `contactActions.ts` + `venueActions.ts` + formulaires
- FR9-10 (Connexions) : Table `venue_contacts` + `VenueConnections.tsx`
- FR11-12 (Modification) : Server Actions `updateContact()` + `updateVenue()`
- FR13 (Archivage) : `ArchiveButton.tsx` + logique archivage dans services
- FR14 (Identification erreurs) : `ContactStatusBadge.tsx` + `VenueStatusBadge.tsx`
- FR15 (Détection obsolescence) : `scrapingService.ts` + logique détection dans `campaignService.ts`

**Scraping et Import (FR16-23) ✅**
- FR16-17 (Scraping automatique) : `scrapingService.ts` avec jobs asynchrones
- FR18 (Configuration scraping) : Page `settings/scraping/` + `ScrapingConfig.tsx`
- FR19-20 (Import/Export CSV) : `importExportActions.ts` + `DataImport.tsx` + `DataExport.tsx`
- FR21 (APIs externes) : Architecture modulaire dans `scrapingService.ts` pour intégrations
- FR22 (Ajout manuel) : Formulaires contacts/salles avec Server Actions
- FR23 (Mise à jour auto) : Jobs asynchrones + cache dans `scrapingService.ts`

**Templates et Mailing (FR24-32) ✅**
- FR24 (Création templates) : `templateActions.ts` + `TemplateEditor.tsx`
- FR25-26 (Variables dynamiques) : `TemplateVariables.tsx` + `templateService.ts`
- FR27 (Prévisualisation) : `TemplatePreview.tsx` + logique prévisualisation
- FR28 (Génération mails) : `templateService.ts` + `emailService.ts`
- FR29-30 (Sélection/Filtrage) : `CampaignFilters.tsx` + logique filtrage
- FR31 (Envoi automatique) : `campaignService.ts` + `emailService.ts`
- FR32 (Lancement campagne) : `campaignActions.ts` + Page `campaigns/new/`

**Relances Automatiques (FR33-37) ✅**
- FR33 (Paramétrage) : Page `settings/campaigns/` + configuration relances
- FR34 (Envoi automatique) : `campaignService.ts` + `jobService.ts` pour scheduling
- FR35 (Arrêt si réponse) : Logique dans `campaignService.ts` + table `campaign_history`
- FR36 (Relance manuelle) : Server Action `relaunchCampaign()` dans `campaignActions.ts`
- FR37 (Classification) : Logique classification dans `campaignService.ts`

**Suivi et Visualisation (FR38-44) ✅**
- FR38-39 (État campagne) : `CampaignStatus.tsx` + Server Component récupérant données
- FR40-41 (Réponses contact/salle) : `ContactDetail.tsx` + `VenueDetail.tsx` + historique
- FR42 (Suivi dates) : Table `campaign_history` + visualisation dans dashboard
- FR43 (Mises à jour AJAX) : Server Actions + `useActionState` pour updates temps réel
- FR44 (Historique) : `CampaignHistory.tsx` + table `campaign_history`

**Tableau de Bord (FR45-51) ✅**
- FR45 (Vue d'ensemble) : `DashboardOverview.tsx` + Page `(dashboard)/page.tsx`
- FR46 (Prochaines étapes) : `WhatsNext.tsx` avec logique calcul prochaines étapes
- FR47 (Campagnes en cours) : `ActiveCampaigns.tsx` dans dashboard
- FR48 (Nouvelles réponses) : `RecentResponses.tsx` dans dashboard
- FR49-51 (Organisation données) : Structure dashboard avec composants modulaires

**Gestion des Erreurs (FR52-58) ✅**
- FR52-53 (Erreurs scraping) : `ScrapingErrors.tsx` + gestion erreurs dans `scrapingService.ts`
- FR54-55 (Erreurs campagne) : Gestion erreurs dans `campaignService.ts` + affichage UI
- FR56 (Correction erreurs) : Formulaires édition avec validation Zod
- FR57 (Notifications) : Système notifications via `useActionState` + affichage erreurs
- FR58 (Intervention manuelle) : Tous les formulaires permettent correction manuelle

**Configuration (FR59-62) ✅**
- FR59 (Config scraping) : Page `settings/scraping/` + Server Actions configuration
- FR60 (Config relances) : Page `settings/campaigns/` + configuration relances
- FR61 (Paramètres fiches) : Formulaires contacts/salles avec champs paramétrables
- FR62 (Paramètres dashboard) : Configuration dashboard dans `settings/` (futur)

**Mises à Jour AJAX (FR63-65) ✅**
- FR63-64 (Mises à jour AJAX) : Server Actions + `useActionState` pour toutes les mutations
- FR65 (Synchronisation) : Architecture modulaire avec services partagés garantit synchronisation

**Non-Functional Requirements Coverage:**

Tous les NFRs sont adressés architecturalement :

- ✅ **Fiabilité du scraping** : Architecture asynchrone + cache + alternatives (import CSV, APIs, ajout manuel)
- ✅ **Fiabilité connexion données** : Modèle relationnel Prisma + intégrité référentielle + helpers garantissant cohérence
- ✅ **Performance** : Server Components par défaut, lazy loading, Suspense, cache Next.js
- ✅ **Sécurité** : Auth.js pour authentification, validation Zod, filtrage `userId` garanti
- ✅ **Intégration** : Architecture modulaire pour APIs externes, import/export CSV documenté
- ✅ **Extensibilité** : Architecture modulaire permet ajout fonctionnalités futures
- ✅ **Migration mobile** : Stack React/Next.js compatible avec React Native

### Implementation Readiness Validation ✅

**Decision Completeness:**

Toutes les décisions critiques sont documentées avec versions :

- ✅ **Technologies** : Next.js 15, React 19, PostgreSQL 18.1, Prisma v6.18.0, Auth.js v5, Tailwind CSS, Radix UI
- ✅ **Infrastructure** : Vercel, Vercel Postgres (Neon), GitHub Actions
- ✅ **Patterns** : Naming, structure, formats, communication, processus tous documentés
- ✅ **Exemples** : Exemples concrets fournis pour Server Actions, scraping, multi-tenancy

**Structure Completeness:**

La structure du projet est complète et spécifique :

- ✅ **Arborescence complète** : Tous les fichiers et dossiers définis avec mapping FRs
- ✅ **Boundaries** : API, Component, Service, Data boundaries tous définis
- ✅ **Integration points** : Points d'intégration internes et externes documentés
- ✅ **Data flow** : Flux de données documentés (scraping, campagnes, projets)

**Pattern Completeness:**

Tous les points de conflit potentiels sont adressés :

- ✅ **Naming** : Conventions complètes pour DB, API, Code, Server Actions
- ✅ **Structure** : Organisation complète avec exemples concrets
- ✅ **Formats** : Formats de réponse standardisés avec exemples
- ✅ **Communication** : Patterns multi-tenancy, scraping asynchrone, state management
- ✅ **Process** : Gestion d'erreurs, loading states, validation tous documentés

### Gap Analysis Results

**Critical Gaps:**
Aucun gap critique identifié. Toutes les décisions nécessaires pour l'implémentation sont prises.

**Important Gaps (À documenter pendant l'implémentation):**
- **Schéma Prisma détaillé** : Le schéma Prisma complet sera créé pendant l'implémentation (structure des tables documentée)
- **Configuration Auth.js détaillée** : Configuration complète Auth.js avec providers sera faite pendant setup
- **Service email spécifique** : Choix du service email (SendGrid, Brevo, etc.) sera fait pendant implémentation
- **Sources scraping spécifiques** : Identification des sources de scraping sera faite pendant développement

**Nice-to-Have Gaps (Améliorations futures):**
- **Tests** : Structure de tests définie, tests unitaires/intégration à ajouter pendant développement
- **Documentation API** : Documentation API externe si API publique (Swagger/OpenAPI)
- **Monitoring avancé** : Sentry pour monitoring d'erreurs (déjà identifié comme optionnel pour MVP)
- **Queue system avancé** : BullMQ ou équivalent pour jobs asynchrones (déjà identifié comme différé)

### Validation Issues Addressed

**Aucun problème critique identifié.** L'architecture est cohérente, complète et prête pour l'implémentation.

**Points de vigilance pour l'implémentation :**
1. **Scraping asynchrone** : S'assurer que les jobs sont bien traités en arrière-plan (éviter timeouts)
2. **Multi-tenancy** : Utiliser systématiquement les helpers Prisma pour garantir filtrage `userId`
3. **Cache scraping** : Toujours vérifier le cache avant nouveau scraping
4. **Validation** : Valider toutes les entrées avec Zod avant logique métier

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium-High)
- [x] Technical constraints identified (migration mobile, multi-tenancy)
- [x] Cross-cutting concerns mapped (scraping, multi-tenancy, automatisation)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions (PostgreSQL 18.1, Prisma v6.18.0, Next.js 15, etc.)
- [x] Technology stack fully specified (Next.js, Prisma, Auth.js, Tailwind, Radix UI)
- [x] Integration patterns defined (Server Actions + API Routes, services backend)
- [x] Performance considerations addressed (Server Components, lazy loading, cache)

**✅ Implementation Patterns**

- [x] Naming conventions established (DB snake_case, API/Code camelCase)
- [x] Structure patterns defined (feature-based organization)
- [x] Communication patterns specified (multi-tenancy, scraping asynchrone)
- [x] Process patterns documented (error handling, loading states, validation)

**✅ Project Structure**

- [x] Complete directory structure defined (tous les fichiers mappés)
- [x] Component boundaries established (Server vs Client Components)
- [x] Integration points mapped (services, API, data flow)
- [x] Requirements to structure mapping complete (65 FRs mappés)

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **HIGH** - Architecture complète, cohérente, et tous les patterns définis

**Key Strengths:**

1. **Architecture multi-tenancy prête dès le départ** : Évite refactoring majeur plus tard
2. **Scraping asynchrone + cache** : Optimise les coûts et évite les timeouts
3. **Patterns complets et cohérents** : Garantit implémentation cohérente par agents IA
4. **Structure détaillée** : Mapping complet FRs → fichiers/dossiers facilite l'implémentation
5. **Stack moderne et maintenu** : Next.js 15, Prisma, Auth.js - technologies à jour et bien supportées
6. **Extensibilité** : Architecture modulaire permet ajout fonctionnalités futures facilement

**Areas for Future Enhancement:**

1. **Tests** : Ajouter tests unitaires/intégration pendant développement
2. **Monitoring** : Ajouter Sentry pour monitoring d'erreurs avancé (post-MVP)
3. **Queue system** : Migrer vers BullMQ ou équivalent pour jobs asynchrones avancés (si nécessaire)
4. **Cache Redis** : Ajouter Redis pour cache si performance nécessite (post-MVP)
5. **Documentation API** : Documentation Swagger/OpenAPI si API publique (futur)

### Implementation Handoff

**AI Agent Guidelines:**

- **Suivre toutes les décisions architecturales** exactement comme documenté dans ce document
- **Utiliser les patterns d'implémentation** de manière cohérente dans tous les composants
- **Respecter la structure du projet** et les boundaries définis
- **Référencer ce document** pour toutes les questions architecturales
- **Garantir multi-tenancy** : Toujours filtrer par `userId` via helpers Prisma
- **Scraping asynchrone** : Toujours vérifier cache avant scraping, créer jobs asynchrones
- **Validation** : Toujours valider avec Zod avant logique métier
- **Formats de réponse** : Respecter les formats standardisés pour Server Actions et API Routes

**First Implementation Priority:**

1. **Initialisation projet** : `npx create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir`
2. **Configuration Prisma** : Setup Prisma + PostgreSQL (Vercel Postgres)
3. **Configuration Auth.js** : Setup Auth.js avec adapter Prisma
4. **Schéma Prisma** : Créer schéma avec multi-tenancy (`userId` sur toutes les tables personnelles)
5. **Services backend** : Créer structure services (scraping, email, campagnes) avec scraping asynchrone et cache
6. **Premiers composants** : Tableau de bord et gestion projets (FR1-6, FR45-51)

**Implementation Sequence Recommended:**

1. Setup initial (projet, Prisma, Auth.js)
2. Modèle de données (schéma Prisma avec multi-tenancy)
3. Services backend core (scraping avec cache, email, campagnes)
4. Server Actions pour mutations
5. Composants frontend (Server Components par défaut)
6. Intégration et tests

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-18
**Document Location:** bmad_output/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping (65 FRs fully mapped)
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- **Architectural decisions made:** Technology stack (Next.js 15, React 19, PostgreSQL 18.1, Prisma v6.18.0, Auth.js v5), Infrastructure (Vercel, Vercel Postgres), Communication patterns (Server Actions + API Routes), Multi-tenancy architecture, Scraping asynchrone + cache
- **Implementation patterns defined:** Naming conventions (DB snake_case, API/Code camelCase), Structure patterns (feature-based organization), Communication patterns (multi-tenancy helpers, scraping asynchrone), Process patterns (error handling, loading states, validation)
- **Architectural components specified:** Frontend (Server/Client Components), Backend (Services, Server Actions, API Routes), Data (Prisma ORM, PostgreSQL), Auth (Auth.js v5), Infrastructure (Vercel deployment)
- **Requirements fully supported:** 65 Functional Requirements (FRs) + all Non-Functional Requirements (NFRs)

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions (Next.js 15, React 19, PostgreSQL 18.1, Prisma v6.18.0, Auth.js v5, Tailwind CSS, Radix UI)
- Consistency rules that prevent implementation conflicts (naming conventions, format standards, multi-tenancy patterns)
- Project structure with clear boundaries (feature-based organization, Server vs Client Components)
- Integration patterns and communication standards (Server Actions for internal mutations, API Routes for external needs)

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing Flowen App. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**

1. **Initialisation projet** : `npx create-next-app@latest flowen-app --ts --tailwind --app --eslint --src-dir`
2. **Configuration Prisma** : Setup Prisma + PostgreSQL (Vercel Postgres)
3. **Configuration Auth.js** : Setup Auth.js avec adapter Prisma
4. **Schéma Prisma** : Créer schéma avec multi-tenancy (`userId` sur toutes les tables personnelles)
5. **Services backend** : Créer structure services (scraping, email, campagnes) avec scraping asynchrone et cache
6. **Premiers composants** : Tableau de bord et gestion projets (FR1-6, FR45-51)

**Development Sequence:**

1. Initialize project using documented starter template (`create-next-app`)
2. Set up development environment per architecture (Prisma, Auth.js, Vercel Postgres)
3. Implement core architectural foundations (multi-tenancy helpers, scraping service with cache, email service)
4. Build features following established patterns (Server Components by default, Server Actions for mutations)
5. Maintain consistency with documented rules (naming conventions, format standards, multi-tenancy filtering)

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts (Next.js 15 + Prisma + Auth.js + Vercel)
- [x] Technology choices are compatible (PostgreSQL 18.1 + Prisma v6.18.0, React 19 + Next.js 15)
- [x] Patterns support the architectural decisions (multi-tenancy patterns support Auth.js, scraping patterns support async architecture)
- [x] Structure aligns with all choices (App Router structure supports Server Components, feature-based organization supports modularity)

**✅ Requirements Coverage**

- [x] All functional requirements are supported (65 FRs mapped to specific files/directories)
- [x] All non-functional requirements are addressed (fiabilité scraping, multi-tenancy, performance, sécurité)
- [x] Cross-cutting concerns are handled (scraping asynchrone, multi-tenancy, automatisation)
- [x] Integration points are defined (APIs externes, import/export CSV, services backend)

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable (versions specified: Next.js 15, Prisma v6.18.0, etc.)
- [x] Patterns prevent agent conflicts (naming conventions, format standards, multi-tenancy helpers)
- [x] Structure is complete and unambiguous (complete directory tree with all files mapped)
- [x] Examples are provided for clarity (Server Actions, scraping service, multi-tenancy helpers)

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction. Decisions were adapted based on user feedback (multi-tenancy from day one, scraping asynchrone + cache).

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly. Naming conventions, format standards, and multi-tenancy patterns prevent conflicts.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs (65 FRs) to technical implementation (specific files and directories).

**🏗️ Solid Foundation**
The chosen starter template (`create-next-app`) and architectural patterns provide a production-ready foundation following current best practices (Next.js 15 App Router, Server Components, Prisma ORM).

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
