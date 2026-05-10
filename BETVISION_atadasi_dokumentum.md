# BETVISION — Projekt Atadasi Dokumentum
**Verzio:** 3.0 (Kristalygomb tema)
**Datum:** 2026-05-10
**Statusz:** UI prototipus, elo weboldal, API integraciora var
**URL:** https://nbnxqtkhr3qe.kimi.page

---

## 1. Projekt attekintes

A BETVISION egy AI-vezerelt sportfogadasi intelligencia platform UI prototipusa. A weboldal modern 3D vizualizaciokkal, AI tippmix tippekkel, elo odds adatokkal, profi kalkulatorral es kozossegi ranglistaval rendelkezik. Az oldal a magyar sportfogadasi piac hianyossagait celozza meg: atlathatosag, AI predikcio, szemelyre szabas es interaktiv 3D elmeny.

**Celkozonseg:** 22-45 eves magyar sportfogadok (Tippmix/TippmixPro felhasznalok)
**Nyelv:** Magyar
**Design tema:** Cyber-stadium (elektromos kek + narancssarga, sotet ejszakai kek hatter)

---

## 2. KESZ — Funkcionalis komponensek

### 2.1 Oldalak (5 db)

| # | Oldal | Utvonal | Statusz |
|---|-------|---------|---------|
| 1 | **Fooldal (Home)** | `/` | KESZ — 7 szekcio |
| 2 | **AI Tippek** | `/ai-tippek` | KESZ — szurok, kockazati profil, teljesitmeny dashboard |
| 3 | **Kalkulator** | `/kalkulator` | KESZ — 3 mod (Szelveny, Bankroll, Strategia) + bet slip sidebar |
| 4 | **Elemzesek** | `/elemzesek/:matchId` | KESZ — 5 tab (Attekintes, Statisztika, AI Elemzes, H2H, Kereszt) |
| 5 | **Ranglista** | `/ranglista` | KESZ — podium + tablazat, 4 period szuro |

### 2.2 Fooldai szekciok (7 db)

| # | Szekcio | Leiras |
|---|---------|--------|
| 1 | **Hero** | Kristalygomb hatterkep, focim, alcim, CTA gombok, elo statok |
| 2 | **Elo Odds Stream** | 6 meccs kartya + kiemelt meccs (Barca-Real), elo odds flash |
| 3 | **AI Tipster** | 3 feature karta + War Room kep + AI demo CTA |
| 4 | **Kalkulator elonezet** | Lebegő kalkulator widget + 4 feature lista |
| 5 | **Kozosseg & Bizalom** | 4 animalt KPI + 3 testimonial + Nyeremenyszelveny kep |
| 6 | **Arazas** | 3 csomag (Ingyenes/PRO/PRO+) feature listakkal |
| 7 | **Felelosseg** | 5 pillér + 18+ figyelmeztetes + segelyvonal |
| 8 | **CTA Banner** | Goloeroem hatterkep, regisztracios CTA |

### 2.3 Navigacio & Layout

- Fix top navigacio (backdrop-blur, 72px)
- 6 menupont: ELO ODDS, AI TIPPEK, KALKULATOR, ELEMZESEK, RANGLISTA, ARAZAS
- Mobil hamburger menu (full-screen overlay)
- Footer (4-oszlop: Logo, Oldalak, Jogi, Kozosseg + 18+ figyelmeztetes)

### 2.4 Interaktiv elemek

| Komponens | Funkcio |
|-----------|---------|
| **Odds Display Cell** | 80x48px odds kijelzo, flash animacio valtozaskor, szin kodolas |
| **AI Confidence Badge** | 24px pill, gradiens (zold/sarga/piros), pulse >85%-nal |
| **Bet Slip (Kosar)** | Zustand store — hozzaadas, eltavolitas, torles, nyeremenyszamitas |
| **Kalkulator** | 8 odds input, tet mezo, valos ideju szamitas (osszesitett odds, nyeremeny, profit, ROI) |
| **Bankroll mod** | Kelly-kritérium leiras, tet szazalek slider, kockazat szintek |
| **Strategia mod** | 4 strategia gomb (Martingale, Fibonacci, Flat, Kelly) |
| **AI Kockazati Profil** | 3 szint valaszto (Ovatos/Kiegyensulyozott/Meresz) az AI Tippek oldalon |
| **Blockchain Audit Badge** | "AUDITALT" cimke minden AI tipp kartyán |
| **Scroll animaciok** | IntersectionObserver-triggered fade-in + translateY |
| **Live odds szimulacio** | setInterval, 5-15 mp-kent random +-0.05 odds valtozas |

---

## 3. TECHNOLOGIAI STACK

```
Frontend:        React 19 + TypeScript + Vite
Styling:         Tailwind CSS v3.4 + shadcn/ui komponensek (40+)
3D:              Three.js + React Three Fiber + Drei + Postprocessing
Animacio:        GSAP + Lenis (smooth scroll)
Allapotkezeles:  Zustand
Routing:         React Router DOM v7
Betuk:           Inter (Google Fonts) + JetBrains Mono
Build eszkoz:    Vite v7
Node verzio:     20.x
```

### 3.1 Konyvtarak (package.json)

| Konyvtar | Verzio | Cél |
|----------|--------|-----|
| react | ^19.1.0 | UI keretrendszer |
| react-dom | ^19.1.0 | React DOM renderer |
| react-router-dom | ^7.6.0 | SPA routing |
| three | ^0.175.0 | WebGL 3D motor |
| @react-three/fiber | ^9.1.0 | Deklarativ 3D React-ben |
| @react-three/drei | ^10.0.0 | R3F helper komponensek |
| @react-three/postprocessing | ^3.0.0 | Bloom effekt |
| gsap | ^3.13.0 | Animacios motor |
| lenis | ^1.3.0 | Smooth scroll |
| zustand | ^5.0.0 | Global state management |
| react-countup | ^6.5.0 | Szamlalo animacio |
| lucide-react | — | Ikonok (UI komponensekhez) |
| tailwindcss | ^3.4.19 | CSS keretrendszer |
| typescript | ^5.8.0 | Tipusellenorzes |
| vite | ^7.2.4 | Build eszkoz |

---

## 4. MOCK / KITALALT (nem valos adatok)

### 4.1 Adatforrasok (mind mock)

| Komponens | Mi a mock | Megjegyzes |
|-----------|-----------|------------|
| **Elo odds** | Statikus JSON (`mockData.ts`) | 6 meccs, kezzel megadott odds-ok |
| **AI Confidence %** | Fix szamok (65-91%) | Nincs mogotte ML modell |
| **AI Pick (1/X/2)** | Kezzel megadott a mock adatokban | Nem AI generalt |
| **AI Elemzes szoveg** | Kezzel irt magyar szoveg | 3-5 mondatos elemzesek |
| **Elo meccsek szama** | "1,247" | Fix szam |
| **Aktiv felhasznalok** | "8,592" | Fix szam |
| **Nyeresi arany** | "68%" | Marketing allitas |
| **Elemzett meccsek** | "2.4M+" | Marketing allitas |
| **Testimoniálok** | Kitalalt nevek es szovegek | 3 db (Kovacs Peter, Szabo Anna, Nagy Gabor) |
| **Ranglista** | Kitalalt felhasznalok | 10 sor, fix profit/nyeresi % |
| **AI teljesitmeny** | 30 napos history tomb | Fix adatok, nem valos |
| **Live odds frissites** | `setInterval + Math.random()` | Szimulalt valtozas, nem valos WS |
| **Featured match score** | "Barcelona 2-1 Real Madrid" | Fix, nem valos |
| **Match statisztikak** | Shots, possession, xG | Mock szamok |

### 4.2 Nem mukodo gombok/funkciok

| Gomb/Funkcio | Mi tortenik jelenleg | Mi kellene |
|-------------|---------------------|------------|
| "REGISZTRACIO" gomb | Nincs funkcioja | Backend auth + adatbazis |
| "BELEPES" gomb | Nincs funkcioja | Login form + JWT token |
| "Tipp hozzaadasa" | Bet slip-be teszi | TippmixPro API bekotese |
| "NYEREMENY KISZAMITASA" | Szamol, de nem fogad | Valodi fogadasi rendszer |
| Prémium csomag vásárlása | Nincs fizetési kapu | Stripe/Barion integráció |
| Push értesítések | Nincs implementálva | Firebase Cloud Messaging |

---

## 5. KELL MEGCSINALNI — Fejlesztési feladatok

### 5.1 Kritikus (elso kor)

| # | Feladat | Becsles | Függoseg |
|---|---------|---------|----------|
| 1 | **Backend API (Node.js/Python)** | 2-3 het | — |
| 2 | **Adatbazis (PostgreSQL)** | 3-5 nap | Backend |
| 3 | **Felhasznaloi autentikáció (JWT)** | 3-5 nap | Backend + DB |
| 4 | **Valos odds API integráció** | 1-2 het | Szerzodes API szolgaltatoval |
| 5 | **WebSocket elo odds stream** | 3-5 nap | Odds API |
| 6 | **AI predikciós motor (Python/ML)** | 2-4 het | Tortenelmi adatok |
| 7 | **TippmixPro API szerzodes** | 1-3 honap | Jogi folyamat |

### 5.2 Fontos (masodik kor)

| # | Feladat | Becsles |
|---|---------|---------|
| 8 | Fizetési rendszer (Stripe/Barion) | 3-5 nap |
| 9 | Email értesítési rendszer | 2-3 nap |
| 10 | Push értesítések (Firebase) | 3-5 nap |
| 11 | Jelszo-visszaallitas (email) | 1-2 nap |
| 12 | Felhasznaloi profil oldal | 2-3 nap |
| 13 | Fogadasi elozmenyek naploja | 3-5 nap |
| 14 | Tipster marketplace | 2-3 het |

### 5.3 Bovites (harmadik kor)

| # | Feladat | Becsles |
|---|---------|---------|
| 15 | iOS/Android app (React Native) | 3-4 het |
| 16 | Többsportos AI (tenisz, kosar, jégkorong, e-sport) | 2-3 het |
| 17 | API platform (B2B) | 2-3 het |
| 18 | Nemzetközi bovites | 2-4 het |
| 19 | AR funkció | 4-6 het |
| 20 | Blockchain tipp naplozas | 2-3 het |
| 21 | Platform token (Web3) | 4-6 het |

---

## 6. KEPFELHASZNALAS

| Kep fajl | Elhelyezes | Hasznalat |
|----------|-----------|-----------|
| `hero-ball-v2.png` | Hero szekcio hattere | Kristalygomb + tenyer, object-center, 50% opacity |
| `goal-celebration.jpg` | CTA Banner hattere | Goloeroem, 30% opacity + gradient overlay |
| `winner-ticket-hd.png` | Community Trust szekcio | Nyeremenyszelveny, 2K felbontas, border container |
| `war-room.jpg` | AI Tipster szekcio | AI elemzo kozpont, gradient overlay alulrol |

---

## 7. KONYVTARSTRUKTURA

```
/mnt/agents/output/app/
├── public/
│   ├── hero-ball-v2.png          — Hero hatter
│   ├── goal-celebration.jpg       — CTA hatter
│   ├── winner-ticket-hd.png       — Nyeremeny szelveny
│   ├── war-room.jpg               — AI War Room
│   └── ... (build output)
├── src/
│   ├── components/
│   │   ├── Navigation.tsx         — Fix top nav
│   │   ├── Footer.tsx             — Lablec
│   │   ├── OddsDisplayCell.tsx    — Odds kijelzo cella
│   │   ├── AIConfidenceBadge.tsx  — AI badge pill
│   │   ├── SectionHeader.tsx      — Szekcio fejlec
│   │   ├── RiskProfileSelector.tsx — 3-szintu kockazat valaszto
│   │   └── three/
│   │       └── WireframeStadium.tsx — 3D Crystal Ball scene
│   ├── sections/
│   │   ├── HeroSection.tsx        — Hero (+3D)
│   │   ├── LiveOddsStreamSection.tsx — Elo odds grid
│   │   ├── AITipsterSection.tsx   — AI feature-ok + War Room kep
│   │   ├── CalculatorPreviewSection.tsx — Kalkulator preview
│   │   ├── CommunityTrustSection.tsx — Statok + testimonialok + szelveny kep
│   │   ├── PricingSection.tsx     — 3 arazasi csomag
│   │   ├── ResponsibleGamingSection.tsx — Felelosseg 5 pillér
│   │   └── CTABanner.tsx          — Regisztracios CTA (+ goloeroem kep)
│   ├── pages/
│   │   ├── HomePage.tsx           — Fooldal (8 szekcio)
│   │   ├── AITipsPage.tsx         — AI Tippek oldal
│   │   ├── CalculatorPage.tsx     — Kalkulator oldal
│   │   ├── AnalyticsPage.tsx      — Elemzesek oldal
│   │   └── LeaderboardPage.tsx    — Ranglista oldal
│   ├── stores/
│   │   ├── betSlipStore.ts        — Fogadasi kosar (Zustand)
│   │   └── liveOddsStore.ts       — Elo odds cache (Zustand)
│   ├── data/
│   │   └── mockData.ts            — OSSZES mock adat
│   ├── App.tsx                    — Router + Layout
│   ├── main.tsx                   — Entry point
│   ├── index.css                  — Global stilusok + Tailwind
│   └── App.css                    — App-specifikus stilusok
├── index.html                     — SEO meta tag-ekkel
├── tailwind.config.js             — Design token-ek (bv: colors)
├── vite.config.ts                 — Vite konfig
├── tsconfig.json                  — TypeScript konfig
└── package.json                   — Fuggosegek
```

---

## 8. SEO META ADATOK

```html
<title>BETVISION — AI Sportfogadás | Tippmix Tippek | Elo Odds | Kalkulator</title>
<meta name="description" content="AI tippmix tippek, sportfogadás elemzes, elo odds es profi kalkulator egy platformon. 68% sikeressegi arany. Ingyenes regisztracio.">
<meta name="keywords" content="tippmix tippek, sportfogadas, AI tippek, odds elemzes, tippmix kalkulator, fogadasi strategia, elo odds">
```

---

## 9. JOGI MEGJEGYZESEK

- **18+ figyelmeztetes** megjelenik a Footer-ben es a Felelosseg szekcioban
- **"Szerencsejatek fuggoseget okozhat"** szoveg minden oldalon
- Segelyvonal: 06-80-200-288 | jatekfelelosseg.hu
- A platform NEM szervez sajat fogadast — kizarolag tanacsado szerepet tolt be
- Minden fogadas a Szerencsejatek Zrt. (TippmixPro) legalis rendszeren keresztul tortenik
- **Tippmix** vedjegy a Szerencsejatek Zrt. tulajdona

---

## 10. HOZZAFERESI ADATOK

| Adat | Ertek |
|------|-------|
| **Elo URL** | https://nbnxqtkhr3qe.kimi.page |
| **Projekt mappa** | /mnt/agents/output/app/ |
| **Infografika** | /mnt/agents/output/betvision-infographic/betvision.pptd |
| **Build parancs** | `cd /mnt/agents/output/app && npm run build` |
| **Deploy** | /mnt/agents/output/app/dist/ mappa (static) |
| **Node verzio** | 20.x |

---

Keszult: 2026-05-10
Keszito: AI asszisztens (Kimi)
