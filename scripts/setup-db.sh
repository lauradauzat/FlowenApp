#!/bin/bash

# Script d'aide pour configurer la base de données PostgreSQL

echo "🚀 Configuration de la base de données PostgreSQL pour Flowen App"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé."
    echo ""
    echo "Options d'installation :"
    echo "1. macOS (Homebrew): brew install postgresql@18"
    echo "2. Cloud (Neon): https://neon.tech (gratuit)"
    echo "3. Cloud (Supabase): https://supabase.com (gratuit)"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL est installé"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env 2>/dev/null || echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/flowen_app?schema=public\"" > .env
    echo "AUTH_SECRET=\"$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")\"" >> .env
fi

echo "📋 Étapes suivantes :"
echo ""
echo "1. Configurez DATABASE_URL dans .env"
echo "   Option locale :"
echo "   DATABASE_URL=\"postgresql://user:password@localhost:5432/flowen_app?schema=public\""
echo ""
echo "   Option cloud (Neon) :"
echo "   DATABASE_URL=\"postgresql://user:password@host.neon.tech/dbname?sslmode=require\""
echo ""
echo "2. Créez la base de données (si locale) :"
echo "   psql postgres"
echo "   CREATE DATABASE flowen_app;"
echo "   \\q"
echo ""
echo "3. Exécutez la migration :"
echo "   npx prisma migrate dev --name init"
echo ""
echo "4. Vérifiez avec Prisma Studio :"
echo "   npx prisma studio"
echo ""
