#!/usr/bin/env bash
# Sky Charter Mongolia — DigitalOcean droplet deploy
#
# Usage on the droplet (after cloning the repo and copying .env):
#   cd /opt/skycharter
#   bash deploy/deploy.sh
#
# Prereqs on droplet (Ubuntu 24.04+):
#   apt-get update && apt-get install -y docker.io docker-compose-plugin git
#
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f deploy/.env.production ]]; then
  echo "❌ deploy/.env.production missing. Copy .env.production.example and set values."
  exit 1
fi

# Note: we deliberately do NOT `source` the env file here — values may contain
# spaces or special characters (e.g. base64 secrets with '+' '/' '=').
# Docker Compose reads the file directly via --env-file, which is robust.

echo "🛠  Building images…"
docker compose -f deploy/docker-compose.yml --env-file deploy/.env.production build

echo "🚀 Starting services…"
docker compose -f deploy/docker-compose.yml --env-file deploy/.env.production up -d

echo "⏳ Waiting for postgres…"
for i in {1..30}; do
  if docker compose -f deploy/docker-compose.yml exec -T postgres pg_isready -U skycharter -d skycharter > /dev/null 2>&1; then
    echo "✅ Postgres ready"; break
  fi
  sleep 2
done

echo "📦 Running migrations…"
docker compose -f deploy/docker-compose.yml --env-file deploy/.env.production exec -T app npx prisma migrate deploy

# Seed only if Users table is empty
echo "🌱 Checking if seed needed…"
COUNT=$(docker compose -f deploy/docker-compose.yml exec -T postgres psql -U skycharter -d skycharter -t -c 'SELECT COUNT(*) FROM "User";' 2>/dev/null | tr -d ' \n' || echo "0")
if [[ "$COUNT" == "0" || -z "$COUNT" ]]; then
  echo "🌱 Seeding…"
  docker compose -f deploy/docker-compose.yml --env-file deploy/.env.production exec -T app npx tsx prisma/seed.ts
else
  echo "ℹ️  DB already seeded ($COUNT users), skipping."
fi

echo ""
echo "✅ Deploy complete."
echo "   → http://168.144.41.111"
echo ""
echo "Login credentials:"
echo "   Admin:    admin@skycharter.mn / Admin@2026"
echo "   Pilot:    pilot@skycharter.mn / Pilot@2026"
echo "   Customer: demo@skycharter.mn  / Demo@2026"
