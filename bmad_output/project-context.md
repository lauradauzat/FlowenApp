---
project_name: 'Flowen App'
user_name: 'Laura'
date: '2026-01-18'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 45
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Framework:**
- Next.js 15 (App Router) - Server Components par défaut
- React 19
- TypeScript (strict mode)

**Styling:**
- Tailwind CSS
- Radix UI (composants headless accessibles)

**Backend:**
- Server Actions pour mutations internes (formulaires, actions utilisateur)
- API Routes pour besoins spécifiques (webhooks, intégrations externes)

**Database & ORM:**
- PostgreSQL 18.1
- Prisma ORM v6.18.0 (préparation v7)

**Authentication:**
- Auth.js v5 avec adapter Prisma

**Validation:**
- Zod pour validation TypeScript-first

**State Management:**
- React Context pour valeurs globales stables (thème, auth, préférences)
- Zustand pour état UI dynamique (modals, formulaires complexes)

**Infrastructure:**
- Vercel (hosting)
- Vercel Postgres (Neon)
- GitHub Actions (CI/CD)

## Critical Implementation Rules

### Language-Specific Rules

**TypeScript:**
- Utiliser strict mode
- Toujours typer les retours de fonctions Server Actions : `Promise<{ success: boolean, data?: T, error?: { code: string, message: string } }>`
- Utiliser `unknown` pour les paramètres non validés, puis valider avec Zod avant utilisation

**Import/Export:**
- Utiliser imports absolus avec alias `@/` (ex: `@/lib/prisma`, `@/components/ui`)
- Exporter les Server Actions avec `'use server'` en haut du fichier
- Exporter les composants Client avec `'use client'` uniquement si nécessaire

**Async/Await:**
- Toujours utiliser `async/await` plutôt que `.then()/.catch()`
- Gérer les erreurs avec try/catch dans les Server Actions et API Routes

### Framework-Specific Rules

**Next.js App Router:**
- **Server Components par défaut** - Utiliser Client Components (`'use client'`) uniquement pour interactivité (hooks, événements, state local)
- Utiliser `useActionState` pour gérer les Server Actions côté client (loading, error, success)
- Utiliser `Suspense` pour les composants qui chargent des données
- Route groups avec parenthèses : `(dashboard)` pour organisation sans affecter l'URL

**React:**
- Utiliser Server Components pour toutes les données serveur (pas de `useEffect` pour fetch)
- Hooks uniquement dans Client Components
- `useState` pour état local à un composant uniquement
- Ne pas utiliser Context pour données serveur (utiliser Server Components)

**Prisma:**
- Toujours utiliser le client singleton depuis `@/lib/prisma/client`
- **CRITIQUE Multi-tenancy** : Toujours filtrer par `userId` dans toutes les requêtes de données personnelles
- Utiliser les helpers Prisma depuis `@/lib/prisma/helpers.ts` pour garantir le filtrage `userId`
- Ne jamais faire de requête sur données personnelles sans `where: { userId }`

**Auth.js:**
- Utiliser `auth()` depuis `@/lib/auth` pour obtenir la session
- Vérifier `session?.user?.id` avant toute opération sur données personnelles
- Middleware Auth.js protège automatiquement les routes, mais toujours vérifier dans Server Actions

### Testing Rules

**Test Organization:**
- Tests co-localisés avec les fichiers : `*.test.ts` ou `*.test.tsx` à côté du fichier source
- OU dans dossier `__tests__/` à côté du fichier
- Tests d'intégration : `*.spec.ts`

**Test Structure:**
- Tests unitaires pour fonctions utilitaires et composants isolés
- Tests d'intégration pour Server Actions et API Routes
- Mocker Prisma avec `jest.mock('@/lib/prisma/client')`
- Toujours tester le filtrage `userId` dans les tests de données personnelles

### Code Quality & Style Rules

**Naming Conventions (CRITIQUE - Respecter strictement):**
- **Database** : `snake_case` pour tables et colonnes (ex: `users`, `user_id`, `created_at`)
- **API** : `camelCase` pour réponses JSON (ex: `userId`, `createdAt`) - Prisma convertit automatiquement
- **Code** : `camelCase` pour variables/fonctions, `PascalCase` pour composants/types
- **Server Actions** : `camelCase` avec verbe d'action (ex: `createProject`, `updateContact`)
- **Constantes** : `UPPER_SNAKE_CASE` (ex: `MAX_CAMPAIGNS`)

**File Organization:**
- Composants dans `src/components/` : `ui/` pour composants réutilisables, `features/` pour composants par feature
- Services backend dans `src/lib/services/` : un fichier par service (ex: `scrapingService.ts`)
- Server Actions dans `src/actions/` : un fichier par domaine (ex: `projectActions.ts`)
- Validations Zod dans `src/lib/validations/` : un fichier par schéma (ex: `project.ts`)

**ESLint/Prettier:**
- Respecter la configuration ESLint du projet
- Formater avec Prettier avant commit

### Development Workflow Rules

**Git:**
- Branches : `feature/`, `fix/`, `refactor/` selon le type de changement
- Commits : Messages descriptifs en français
- PRs : Vérifier que les tests passent avant merge

**Deployment:**
- Vercel déploie automatiquement sur push vers `main`
- Migrations Prisma : Exécuter avant déploiement si schéma modifié
- Variables d'environnement : Configurer dans Vercel dashboard

### Critical Don't-Miss Rules

**Multi-Tenancy (CRITIQUE - Ne JAMAIS oublier):**
- ❌ **NE JAMAIS** faire de requête Prisma sur données personnelles sans `where: { userId }`
- ✅ **TOUJOURS** utiliser les helpers Prisma depuis `@/lib/prisma/helpers.ts`
- ✅ **TOUJOURS** vérifier `session?.user?.id` avant opérations sur données personnelles
- ✅ **TOUJOURS** inclure `userId` dans les créations de données personnelles

**Scraping Asynchrone (CRITIQUE):**
- ❌ **NE JAMAIS** faire de scraping synchrone dans Server Actions (risque timeout)
- ✅ **TOUJOURS** vérifier le cache avant scraping (`public_venue_cache`, `public_contact_cache`)
- ✅ **TOUJOURS** créer un job asynchrone pour le scraping
- ✅ **TOUJOURS** retourner `{ jobId, status: 'pending' }` immédiatement

**Validation (CRITIQUE):**
- ❌ **NE JAMAIS** utiliser des données non validées dans la logique métier
- ✅ **TOUJOURS** valider avec Zod avant logique métier
- ✅ **TOUJOURS** valider dans Server Actions ET API Routes

**Formats de Réponse (CRITIQUE):**
- **Server Actions** : `{ success: boolean, data?: T, error?: { code: string, message: string } }`
- **API Routes** : `NextResponse.json({ data: T }, { status: 200 })` ou `NextResponse.json({ error: { code, message } }, { status: 400|401|404|500 })`
- ❌ **NE JAMAIS** retourner `snake_case` dans les réponses API (toujours `camelCase`)

**Server vs Client Components:**
- ❌ **NE JAMAIS** utiliser `'use client'` pour des composants qui n'ont pas besoin d'interactivité
- ✅ **TOUJOURS** commencer par Server Component, ajouter `'use client'` uniquement si nécessaire
- ✅ **TOUJOURS** utiliser Server Components pour fetch de données

**Gestion d'Erreurs:**
- ✅ **TOUJOURS** utiliser les classes d'erreurs standardisées (`AppError`, `BadRequestError`, etc.)
- ✅ **TOUJOURS** retourner le format d'erreur standardisé
- ❌ **NE JAMAIS** exposer des détails d'erreurs sensibles dans les réponses

**Performance:**
- ✅ **TOUJOURS** utiliser `Suspense` pour les composants qui chargent des données
- ✅ **TOUJOURS** utiliser lazy loading pour les composants lourds
- ❌ **NE JAMAIS** faire de fetch côté client si les données peuvent venir du serveur

**Sécurité:**
- ✅ **TOUJOURS** valider et sanitizer les entrées utilisateur
- ✅ **TOUJOURS** vérifier l'authentification avant opérations sur données personnelles
- ❌ **NE JAMAIS** faire confiance aux données client sans validation serveur

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge during implementation

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

**Last Updated:** 2026-01-18
