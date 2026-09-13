# ElimuBora — Deploy kwenye Vercel

## 1. Hakikisha `.env` (local dev) — faili hii haipakiwi kwenye Vercel

```
# Database
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...

# CORS — origins zilizokubaliwa
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# SMTP (kwa forgot-password)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=...
```

## 2. Njia za Deploy kwenye Vercel

### Njia A: GitHub (inapendekezwa)

1. Push project yote kwenye GitHub repo
2. Kwenye https://vercel.com/new, chagua repo hiyo
3. **Framework Preset:** `Vite` (Vercel itaandika moja kwa moja kutoka `vercel.json`)
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Kabla ya kubonyeza Deploy, jaza **Environment Variables** (angalia hapa chini)

### Njia B: Vercel CLI

```bash
npm i -g vercel
vercel
# fuata maswali; tumia `vercel --prod` kwa production
```

### Njia C: Drag & drop `dist` tu (siyo project mzima!)

Kwenye https://vercel.com/new, pakia **folder `dist`** pekee.

> **Muhtasari:** Ikiwa uli-deploy project mzima kama static files, `index.html` ya
> dev iliyopakiwa inarejelea `/src/main.tsx` ambayo haipo kwenye production —
> ndiyo maana ukurasa ulikuwa mtupu (404).

## 3. Environment Variables za kujaza kwenye Vercel

Nenda **Settings → Environment Variables** (chagua Production, Preview na Development) ongeza zifuatazo:

| Jina | Thamani |
|------|---------|
| `DB_HOST` | Host ya database yako (mfano host ya Aiven/PlanetScale/hosting yako) |
| `DB_PORT` | `3306` |
| `DB_USER` | Jina la mtumiaji wa database |
| `DB_PASSWORD` | Nenosiri la database |
| `DB_NAME` | Jina la database |
| `CLIENT_ORIGIN` | `https://elimubora.vercel.app` (au domain yako ya production; ongeza na comma kama kuna zaidi ya moja) |
| `SMTP_HOST` | Host ya email server (mfano `smtp.gmail.com`) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Barua pepe ya kutuma |
| `SMTP_PASSWORD` | Nenosiri la barua pepe (kwa Gmail tumia **App Password**, siyo nenosiri la kawaida) |
| `SMTP_FROM` | Barua pepe inayoonekana kama mtumaji (mfano `ElimuBora <noreply@elimubora.app>`) |

## 4. Domain

Baada ya deploy, kwenye **Settings → Domains**, ongeza domain yako
(mfano `elimubora.vercel.app` au domain yako ya kawaida kama `elimubora.app`).

## 5. Database — kumbuka

Kwenye Vercel serverless, connection inafunguliwa upya kwenye kila function.
**connectionLimit: 10** kwenye `server/db.ts` inatosha. Hakikisha:

- Database host inakubali connections kutoka mtandao (siyo `localhost` tu)
- Ikiwa host yako ina IP allowlist, ongeza anwani za Vercel au tumia host
  inayokubali connections zote (mfano PlanetScale, Aiven, Railway)
