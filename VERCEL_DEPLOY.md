# BETVISION - Vercel Deploy Dokumentáció

## Áttekintés

Ez a dokumentum részletesen leírja a BETVISION frontend alkalmazás Vercel-re történő deploy-olásának lépéseit. 
A projekt egy Vite + React (TypeScript) SPA, amely:

- **Vercel Serverless Function** API-val (`api/sports.ts`) az api-football.com proxyhoz
- **ÚJ: Kvantitatív VB modul** backend (`server/`) amely Express-en fut és Poisson/Elo/Kelly számításokat végez
- **Frontend** React 19 + Tailwind + shadcn/ui

> ⚠️ **Fontos:** A kvantitatív VB modul (`server/src/services/quantitativeModel.ts`) 
> **nem** Vercel Serverless Function-ként fut — az a BETVISION backend része (Express, port 4000).
> A Vercel deploy jelenleg csak a frontend statikus fájljait + a `api/sports.ts` Serverless 
> Function-t deploy-olja. A backend külön fut (helyben vagy VPS-en).

---

## 1. Előfeltételek

- **Vercel fiók** — regisztráció: https://vercel.com
- **GitHub repository** — a kód fel lesz push-olva ide: `https://github.com/DeVi00007/BETVISION.git`
- **API-Football kulcs** — https://www.api-football.com (szükséges az éles működéshez)

### Helyi környezet (opcionális)

- Vercel CLI telepítve (jelenlegi verzió: 54.5.0)
- Node.js (a project `package.json` alapján)

---

## 2. Környezeti változók (Environment Variables)

Az alkalmazás egyetlen környezeti változót használ:

| Változó neve | Leírás | Kötelező |
|---|---|---|
| `VERCEL_API_FOOTBALL_KEY` | API-Football API kulcs (api-football.com) | Igen (élesben) |

### Helyi fejlesztéshez

1. Másold a `.env.example` fájlt `.env` néven:
   ```bash
   cp .env.example .env
   ```
2. Töltsd ki a `VERCEL_API_FOOTBALL_KEY` értéket az API kulcsoddal.

### Vercel-en (éles környezet)

A környezeti változókat **nem** a `vercel.json`-ban, hanem a **Vercel Dashboard-on** kell beállítani:

1. Menj a projekt Vercel Dashboard oldalára
2. **Settings → Environment Variables**
3. Add hozzá:
   - **Name:** `VERCEL_API_FOOTBALL_KEY`
   - **Value:** (az API-Football kulcs)
   - **Environments:** Production, Preview, Development

---

## 3. Vercel Deploy lépései

### 3.1. Automatikus deploy (GitHub integration) — AJÁNLOTT

1. **Push-old a kódot GitHub-ra:**
   ```bash
   git push origin main
   ```

2. **Vercel Dashboard-on:**
   - Kattints: **Add New → Project**
   - Importáld a `DeVi00007/BETVISION` repository-t
   - **Framework Preset:** `Vite` (automatikusan felismeri)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** Add hozzá a `VERCEL_API_FOOTBALL_KEY`-t (lásd fent)
   - Kattints: **Deploy**

3. Vercel automatikusan érzékeli a `vercel.json`-t és beállítja a Serverless Function-t (`api/sports.ts`).

### 3.2. Manuális deploy Vercel CLI-vel

Ha a CLI-t szeretnéd használni:

```bash
# Bejelentkezés Vercel-be (böngésző nyílik meg)
vercel login

# Projekt linkelése
vercel link

# Deploy (preview)
vercel

# Éles deploy
vercel --prod
```

**Fontos:** A `vercel deploy` előtt a környezeti változókat a Dashboard-on add hozzá (lásd 2. pont).

---

## 4. `vercel.json` konfiguráció

A meglévő `vercel.json` tartalmazza a szükséges beállításokat:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "api/sports.ts": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    { "source": "/api/sports", "destination": "/api/sports" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Magyarázat:
- `framework: "vite"` — Vercel tudja, hogy Vite projekt
- `functions.api/sports.ts.maxDuration: 10` — Serverless Function timeout 10 másodperc (API-Football hívásokhoz)
- `rewrites` — SPA routing: minden kérés az `index.html`-re megy, kivéve az `/api/sports`-ot

---

## 5. Domain konfiguráció

Egyedi domain beállítása (pl. `betvision.hu` vagy `betvision.example.com`):

1. **Vercel Dashboard → Project → Settings → Domains**
2. Add hozzá a kívánt domain nevet
3. Vercel megadja a DNS beállításokat (CNAME record)
4. A DNS szolgáltatónál (pl. Cloudflare, Namecheap):
   - Hozz létre egy **CNAME** record-ot:
     - **Name:** `@` vagy `www` (attól függően)
     - **Target:** `cname.vercel-dns.com`
5. Várj pár percet, amíg a DNS propagálódik
6. Vercel automatikusan SSL tanúsítványt állít ki (Let's Encrypt)

---

## 6. Verziókezelés és .gitignore

A `.gitignore` frissítve lett az alábbi bejegyzésekkel:

```
.env
.env.local
.env.production
```

A `.env.example` **nincs** ignorálva, így az commit-olható és megosztható a csapattal.

---

## 7. Hibaelhárítás

### 7.1. Build hiba Vercel-en

Ellenőrizd a build logokat a Vercel Dashboard → Deployments → kattints a deploy-ra → **View Build Logs**.

### 7.2. API 502-es hiba

Ha az `/api/sports` endpoint 502-t ad:
1. Ellenőrizd, hogy a `VERCEL_API_FOOTBALL_KEY` környezeti változó be van-e állítva
2. Ellenőrizd, hogy az API kulcs érvényes-e
3. Ellenőrizd a Serverless Function logokat: Vercel Dashboard → Functions

### 7.3. Vercel CLI nincs telepítve

```bash
npm install -g vercel
```

---

## 8. Összefoglalás

| Tétel | Állapot |
|---|---|
| Vercel CLI | ✅ Telepítve (54.5.0) |
| `vercel.json` | ✅ Konfigurálva |
| `package.json` | ✅ Rendben |
| `.env.example` | ✅ Létrehozva |
| `.gitignore` | ✅ Frissítve (.env hozzáadva) |
| GitHub remote | ✅ `DeVi00007/BETVISION.git` |
| Vercel bejelentkezés | ❌ **Nincs** — `vercel login` szükséges |
| API kulcs env-ben | ❌ **Dashboard-on kell beállítani** |

**Következő lépések:**
1. Állítsd be a `VERCEL_API_FOOTBALL_KEY` környezeti változót a Vercel Dashboard-on
2. Push-old a kódot GitHub-ra
3. Vercel-en: Import Project → válaszd a BETVISION repository-t → Deploy
4. (Opcionális) Állíts be egyedi domaint
