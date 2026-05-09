# Sky Charter Mongolia

Премиум хувийн нислэгийн захиалгын системийн жишиг хэрэгжүүлэлт. Sky Charter Mongolia LLC-д
зориулан **Cessna 208B EX** болон **Airbus H145T2** онгоцоор Монгол даяар захиалгат
нислэг үйлчилгээг цахимжуулах зорилготой.

- **Хэрэглэгчийн вэб** — Hero, газрын зурагтай хайлт, instant quote, 3 алхамт захиалга, төлбөр (mock).
- **Удирдлагын самбар** — Захиалга, парк, байршил, хэрэглэгчид, хоосон нислэг, тайлан.
- **Нисгэгчийн портал** — Өнөөдрийн нислэг, manifest, logbook, цаг агаар.
- **Олон хэл** — Монгол (үндсэн) + English.
- **Dark / Light mode**.

## Технологи

| Давхарга | Сонголт |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript, standalone output) |
| Styling | TailwindCSS v4 |
| Auth | NextAuth (Credentials) |
| DB | PostgreSQL 16 + Prisma ORM |
| Map | Leaflet + react-leaflet (OSM tiles) |
| Charts | Recharts |
| Deploy | Docker Compose + Nginx (DigitalOcean droplet) |

## Хөгжүүлэлт (local)

```bash
# 1. Postgres-г локалд асаах
docker run -d --name scm-pg -e POSTGRES_USER=skycharter -e POSTGRES_PASSWORD=skycharter \
  -e POSTGRES_DB=skycharter -p 5432:5432 postgres:16-alpine

# 2. .env үүсгэх
cp .env.example .env

# 3. Багц суулгах
npm install

# 4. DB схем + seed
npx prisma migrate deploy
npx tsx prisma/seed.ts

# 5. Сервер ажиллуулах
npm run dev
# → http://localhost:3000
```

### Демо хэрэглэгчид

| Үүрэг | Имэйл | Нууц үг |
|---|---|---|
| Админ | admin@skycharter.mn | `Admin@2026` |
| Нисгэгч | pilot@skycharter.mn | `Pilot@2026` |
| Үйлчлүүлэгч | demo@skycharter.mn | `Demo@2026` |

## DigitalOcean droplet дээр deploy

Droplet хаяг: `168.144.41.111`

### 1. Droplet бэлдэх (нэг удаа)

```bash
ssh root@168.144.41.111
apt-get update
apt-get install -y docker.io docker-compose-plugin git
mkdir -p /opt/skycharter
```

### 2. Repo татах

```bash
cd /opt/skycharter
git clone -b claude/skycharter-mongolia-deploy-cjJGs \
  https://github.com/temuujinhub/skycharter.git .
```

### 3. Production env

```bash
cp deploy/.env.production.example deploy/.env.production
# Доорх утгуудыг засна:
#   POSTGRES_PASSWORD=<уртын аюулгүй нууц үг>
#   NEXTAUTH_URL=http://168.144.41.111
#   NEXTAUTH_SECRET=$(openssl rand -base64 32)
nano deploy/.env.production
```

### 4. Deploy

```bash
bash deploy/deploy.sh
# Build → Postgres healthcheck → migrate → seed (анх удаа)
```

Гарч ирвэл http://168.144.41.111 руу нэвтэрнэ үү.

### Дахин deploy (шинэчлэлийн дараа)

```bash
cd /opt/skycharter
git pull
bash deploy/deploy.sh
```

## Архитектур

```
Browser → Nginx (port 80) → Next.js standalone (port 3000) → Prisma → Postgres
                                            ↓
                                       Mock QPay API
```

## Бүтэц

- `app/` — Next.js App Router (хуудаснууд + API routes)
- `components/` — Дахин ашиглагдах UI
- `lib/` — Auth, Prisma, pricing, distance, mock payment, i18n
- `messages/` — `mn.json`, `en.json` орчуулга
- `prisma/` — Schema, migrations, seed
- `deploy/` — Dockerfile, docker-compose, nginx, deploy.sh

## Үнийн алгоритм

PDF судалгааны §2.2-т нийцүүлэн:

```
distance     = haversine(from, to)              # км
flightHours  = distance / cruiseSpeed           # цаг
basePrice    = flightHours * aircraft.hourlyRate
fees         = from.landingFee + to.landingFee
total        = round(basePrice + fees - emptyLegDiscount)
```

## Лицензи

© 2026 Sky Charter Mongolia LLC. Зөвхөн дотоод хэрэгцээнд.
