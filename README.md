# Shamy Drive — Location premium à Agadir

Site Full-Stack Next.js 15 + Prisma + PostgreSQL (Neon) + Auth.js v5 + Shamy IA.

## Stack
- **Frontend**: Next.js 15.5 App Router, TypeScript strict, Tailwind 4, Framer Motion, Lucide
- **Backend**: Route Handlers, Prisma 6, PostgreSQL Neon, Zod, bcryptjs
- **Auth**: NextAuth v5 (Credentials), rôles USER/ADMIN, middleware protection
- **IA**: OpenAI via `/api/ai` (jamais exposé client)
- **Images**: Cloudinary (upload admin)
- **Email**: Resend (confirmation réservation)
- **Palette stricte**: `#C1272D` rouge accent, `#0A0A0A` noir, `#FFFFFF` blanc (+ gris neutres uniquement)

## Installation locale

```bash
cd shamy-drive
npm install

# 1. Configurer .env
cp .env.example .env
# Renseigner DATABASE_URL, AUTH_SECRET (npx auth secret), OPENAI_API_KEY, CLOUDINARY_*, RESEND_*

# 2. DB
npx prisma db push
npm run db:seed
# Seed crée :
#  admin@shamydrive.ma / Admin123! (ADMIN)
#  client@test.ma / User123! (USER)
#  10 véhicules réalistes 250-400 DH/j (Dacia Logan/Sandero/Duster, Renault Clio, Peugeot 208, Hyundai Accent, Kia Sonet, Haval Jolion) — kilométrage illimité

# 3. Lancer
npm run dev
# http://localhost:3000
```

### Variables d'environnement (.env.example détaillé)
- `DATABASE_URL` : Neon.tech → Create Project → connection string `sslmode=require`
- `AUTH_SECRET` : `npx auth secret` ou `openssl rand -base64 32`
- `AUTH_URL` / `NEXT_PUBLIC_APP_URL` : `http://localhost:3000` en dev, `https://shamydrive.ma` en prod
- `OPENAI_API_KEY` : platform.openai.com → API Keys
- `CLOUDINARY_CLOUD_NAME/ API_KEY/ API_SECRET` : cloudinary.com → Dashboard
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` : resend.com → domaine vérifié `shamydrive.ma` ou `onboarding@resend.dev` en dev

Sans ces clés, le site fonctionne en mode dégradé :
- Shamy IA : fallback lexical sur vraie DB (pas d'hallucination) si `OPENAI_API_KEY` manquante
- Cloudinary : upload refusé, utiliser URL directe `/cars/...` ou image externe
- Resend : logs console au lieu d'email

## Fonctionnalités vérifiées
- Recherche avec vérification disponibilité réelle (`startDate`/`endDate` + exclusion chevauchement)
- Recherche NL (`nl="SUV auto <400 DH 5 places"`)
- Réservation : calcul `days * pricePerDay`, anti-chevauchement transactionnel, statuts PENDING/CONFIRMED/CANCELLED/COMPLETED, annulation 48h
- Shamy IA interroge DB avant de répondre (endpoint `/api/ai`)
- Admin : CRUD voitures, gestion réservations (changement statut), gestion utilisateurs (promouvoir/rétrograder)
- Middleware protège `/compte/*` et `/admin/*`

## Déploiement Vercel
1. Push sur GitHub
2. Vercel → Import Project → Framework Next.js
3. Variables d'environnement : coller le contenu de `.env` (hors `DATABASE_URL` déjà Neon)
4. Build Command : `npx prisma generate && next build`
5. Ajouter domaine `shamydrive.ma`, vérifier `AUTH_URL` et `NEXT_PUBLIC_APP_URL` en `https://...`
6. Cloudinary : ajouter domaine Vercel aux Allowed Origins si besoin
7. Resend : vérifier domaine DNS (SPF/DKIM)

## Logo (nouveau)
- Source : `public/logo/shamy.png` — nouveau logo fourni (voiture rouge + texte noir "Shamy Drive" sur fond transparent/blanc) — déjà placé + généré en `shamy-white.png` (texte blanc pour navbar sombre) et `shamy-red-bg.png` (fond rouge pour OG)
- Variantes :
  - `shamy.png` / `shamy-black.png` : noir, pour fond clair
  - `shamy-white.png` : blanc, pour navbar `#0A0A0A`
  - `shamy-red-bg.png` : 1200×630, rouge `#C1272D` + logo blanc, pour OG/favicon
- OG image : `shamy-red-bg.png` (`app/layout.tsx:8`)

> Si tu refais le logo vectoriel, exporte les 3 variantes en 512×256 PNG transparent + 1200×630 PNG rouge.

## Reste à faire manuellement
- [ ] Placer `shamy.png` haute résolution dans `public/logo/` si tu veux remplacer le placeholder généré
- [ ] Régénérer variantes logo vectorielles précises (si besoin designer)
- [ ] Créer comptes OpenAI / Cloudinary / Resend et renseigner `.env`
- [ ] Vérifier domaine Resend (`noreply@shamydrive.ma`) en production
- [ ] Ajouter vraies photos Cloudinary par voiture via `/admin/voitures` → upload
- [ ] (Optionnel) Remplacer `npm run db:push` par `prisma migrate deploy` en prod

## Tests rapides
```bash
# API cars
curl http://localhost:3000/api/cars | jq
curl "http://localhost:3000/api/cars?nl=SUV%20automatique%20moins%20de%20400" | jq
curl "http://localhost:3000/api/cars?startDate=2026-09-10&endDate=2026-09-12" | jq

# IA fallback (sans clé OpenAI)
curl -X POST http://localhost:3000/api/ai -H "Content-Type: application/json" -d '{"message":"SUV auto 5 places moins de 400 DH"}' | jq

# Login test
# client@test.ma / User123!   ou   admin@shamydrive.ma / Admin123!
```

## Sécurité
- Zod sur toutes les entrées, Prisma paramétrise (anti-injection)
- Mots de passe hashés bcrypt, jamais loggés
- Routes admin vérifiées côté serveur (`auth()` + rôle)
- Aucun secret exposé client, `OPENAI_API_KEY` uniquement serveur
