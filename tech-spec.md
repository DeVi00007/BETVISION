# BETVISION — Műszaki Specifikáció

## Dependenciák

### Production csomagok

| Csomag | Verzió | Indoklás |
|--------|--------|----------|
| react | ^19.1.0 | UI keretrendszer |
| react-dom | ^19.1.0 | React DOM renderer |
| react-router-dom | ^7.6.0 | SPA routing (Home, AI Tips, Calculator, Analytics, Leaderboard) |
| three | ^0.175.0 | WebGL 3D motor — hero wireframe stadium, probability wheel, background mesh |
| @react-three/fiber | ^9.1.0 | React integráció Three.js-hez (deklaratív 3D scene graph) |
| @react-three/drei | ^10.0.0 | R3F helper komponensek (OrbitControls, Line, Html, useTexture, stb.) |
| @react-three/postprocessing | ^3.0.0 | Bloom effekt a hero scene-hez (UnrealBloom) |
| gsap | ^3.13.0 | Animációs motor — timeline-ok, ScrollTrigger, entrance animációk |
| lenis | ^1.3.0 | Smooth scroll (inerciás görgetés) |
| zustand | ^5.0.0 | Global state management (bet slip, user, live odds cache) |
| react-countup | ^6.5.0 | Számláló animáció statisztikákhoz (15,000+ → count up) |

### Development csomagok

| Csomag | Verzió | Indoklás |
|--------|--------|----------|
| typescript | ^5.8.0 | TypeScript fordító |
| vite | ^6.3.0 | Build eszköz |
| @vitejs/plugin-react | ^4.5.0 | React Vite plugin (Babel alapú Fast Refresh) |
| tailwindcss | ^4.1.0 | CSS keretrendszer |
| @tailwindcss/vite | ^4.1.0 | Tailwind Vite integráció |
| @types/react | ^19.1.0 | React típusdefiníciók |
| @types/react-dom | ^19.1.0 | React DOM típusdefiníciók |
| @types/three | ^0.175.0 | Three.js típusdefiníciók |

### Fontok (Google Fonts CDN)
- **Inter** (400, 500, 600, 700, 800, 900) — Headline + Body
- **JetBrains Mono** (400, 700) — Számok, odds-ok, kalkulátor

---

## Komponens Inventár

### Layout (oldalszintű, minden oldalon megosztott)

| Komponens | Forrás | Megjegyzés |
|-----------|--------|------------|
| Navigation | Saját | Fixed top bar, 72px, backdrop-blur, hamburger mobilen |
| Footer | Saját | 4-oszlopos grid, 18+ figyelmeztetés |
| CustomCursor | Saját | 8px kör, mix-blend-mode: difference, lerp követés, rejtve mobilen |
| PageTransition | Saját | fade-out (0.2s) → fade-in + translateY (0.4s), React csoport-animáció |
| Layout | Saját | Wrapper: Navigation + {children} + Footer + CustomCursor, Lenis init |

### Szekciók (oldal-specifikus, teljes szélességű)

**Home:**
- HeroSection — 100vh, WebGL háttér (WireframeStadium), content overlay
- LiveOddsStreamSection — 60/40 kétoszlop, odds grid + kiemelt meccs
- AITipsterSection — 3 oszlop feature grid
- CalculatorPreviewSection — 50/50 kétoszlop, lebegő kalkulátor widget
- CommunityTrustSection — statisztikák + testimonial grid
- CTABanner — radiális gradiens háttér

**AI Tips:**
- AITipsHeroSection — 60vh, középre igazított, filter tabok
- TipsListSection — függőleges lista AI tipp kártyákból
- AIPerformanceSection — 4 metrika kártya + 30 napos vonaldiagram

**Calculator:**
- CalculatorInterface — kétpaneles layout (65% / 35%), 3 mód (Szelvény / Bankroll / Stratégia)
- OddsProbabilityWheel — 3D kör diagram, háttér dekoráció a bal panelen

**Analytics:**
- MatchAnalyticsView — tab-os elrendezés (Áttekintés / Statisztika / AI Elemzés / H2H / Kereszt)

**Leaderboard:**
- LeaderboardTable — rendezhető táblázat, heti/havi/éves/örök filterek

### Újrafelhasználható komponensek (több helyen használt)

| Komponens | Használat | Jellemzők |
|-----------|-----------|-----------|
| OddsDisplayCell | LiveOddsStream, CalculatorPreview, AITips | 80×48px, JetBrains Mono, színeszedés odds érték szerint, flash animáció live frissítéskor |
| AIConfidenceBadge | LiveOddsStream, AITips, Analytics | 24px pill, gradiens háttér confidence szerint, pulzálás >85%-nál |
| MatchCard | LiveOddsStreamSection | Ligánév, csapatok, odds sor, AI badge, meta |
| WebGLBackgroundMesh | AI Tips, Calculator, Analytics, Leaderboard | Alacsony poli gradiens mesh, 5-8% opacity, háttér atmoszféra |
| SectionHeader | Minden section | Cím + opcionális al_cím + zöld pulzáló pont |

### 3D Komponensek (React Three Fiber)

| Komponens | Szülő | Leírás |
|-----------|-------|--------|
| WireframeStadium | HeroSection | 200+ élű drótváz arena, forgó kamera, egér-parallaxis, bloom post-processing |
| FloatingDataParticles | WireframeStadium | 50 fényes pont (desktop), felfelé sodródó adat-"részecskék" |
| OddsProbabilityWheel | CalculatorInterface | 3D körszeletes valószínűség-eloszlás, lassú forgás, hover kiemelés |
| BackgroundGradientMesh | WebGLBackgroundMesh | 50×50 vertex mesh, sinus hullám displacement, accent színek |

---

## Animációs Terv

| Animáció | Könyvtár | Implementáció | Komplexitás |
|----------|----------|---------------|-------------|
| **Hero Wireframe Stadium** (3D wireframe arena, kamera orbitálás, egér-parallaxis, bloom) | @react-three/fiber + drei + postprocessing | Egyedi R3F scene: drótváz geometria (vagy Wireframe komponens), OrbitControls autoRotate, onPointerMove kamera offset lerp, EffectComposer + UnrealBloom | 🔒 High |
| **Floating Data Particles** (fényes pontok felfelé sodródva) | @react-three/fiber | Points geometria, vertex shader vagy CPU pozíció update, 50 particle desktop / 20 mobile | 🔒 High |
| **3D Odds Probability Wheel** (körszeletes eloszlás, 3D) | @react-three/fiber | CylinderGeometry szegmensek, külön mesh-ek színes anyaggal, lassó Y-forgás, raycaster hover kiemelés | 🔒 High |
| **Background Gradient Mesh** (alacsony poli, hullámzó vertexek) | @react-three/fiber | PlaneGeometry 50×50 szegmens, useFrame vertex displacement sin/cos alapján, accent szín-lerp | Medium |
| **Odds Live Update Flash** (szám villanás + nyíl megjelenés) | CSS + React state | CSS keyframe: háttér accent zöld 30% → 0%, 0.3s; React state toggle frissítéskor | Low |
| **AI Confidence Pulse** (zöld fény pulzálás >85%) | CSS | CSS @keyframes box-shadow glow, 2s infinite | Low |
| **Section Entrance Animations** (fade + translateY, stagger) | GSAP ScrollTrigger | IntersectionObserver wrapper, gsap.from() opacity+translateY, stagger 0.08-0.12s, ease power2.out | Medium |
| **Stats Count Up** (számok 0-ról indulva) | react-countup | CountUp komponens start={0} end={value}, duration 1.5s, ScrollTrigger inView indítás | Low |
| **Custom Cursor** (lerp követés, expand interaktívnál) | requestAnimationFrame | RAF loop: cursor pozíció lerp (0.15 faktor), CSS class toggle data-attribute alapján interaktív elemeken | Medium |
| **Page Transitions** (fade out → fade in) | GSAP | React Transition Group vagy React Router outlet wrapper, gsap timeline: out 0.2s, in 0.4s translateY | Medium |
| **Calculator Float** (lebegő widget ±6px) | CSS | CSS @keyframes translateY, 4s ease-in-out infinite | Low |
| **Live Stats Dot Pulse** (zöld pont pulzálás) | CSS | CSS @keyframes scale + opacity, 2s infinite | Low |
| **Nav Underline Slide** (hover alatti vonal) | CSS | CSS ::after + width transition 0.3s cubic-bezier | Low |
| **Card Hover Lift** (translateY -4px + árnyék) | CSS | CSS transition: transform 0.3s, box-shadow 0.3s | Low |
| **Hero Content Stagger** (badge → cím → alcím → CTA → stats) | GSAP | Egyedi timeline: seqenciális fade+translateY, 0.15s stagger | Medium |
| **Mobile Menu Slide** (jobbról beúszó overlay) | GSAP | gsap.from translateX(100%), 0.3s ease power2.out | Low |

---

## Állapotkezelés (Zustand)

### Store-ok

**BetSlipStore** — Fogadási szelvény kezelése
- `items: BetItem[]` — hozzáadott tétek listája
- `stake: number` — tét összege
- `addItem(match, market, odds)`, `removeItem(id)`, `clear()`, `setStake(amount)`
- `totalOdds: computed` — összesített odds szorzás
- `potentialWinnings: computed` — várható nyeremény

**LiveOddsStore** — Élő odds-ok cache
- `odds: Record<string, OddsEntry>` — matchId → odds mapping
- `updateOdds(matchId, newOdds)` — WebSocket szimulációhoz
- `lastUpdated: number` — timestamp az UI flash animációhoz

**UserStore** — Felhasználói állapot
- `isLoggedIn: boolean`, `username: string | null`, `isPremium: boolean`
- `login()`, `logout()`

### Adatfolyam
- LiveOddsStore szimulálja a WebSocket frissítéseket (setInterval, random odds változások) — ez triggereli az OddsDisplayCell flash animációt
- BetSlipStore minden oldalon elérhető (jobb oldali sidebar a Calculator oldalon, mini panel máshol)

---

## WebGL Architektúra

### 3 Scene típus

| Scene | Használat | Komponensek |
|-------|-----------|-------------|
| **HeroScene** | Home HeroSection | WireframeStadium + FloatingDataParticles + Bloom post-processing |
| **CalculatorScene** | Calculator bal panel | OddsProbabilityWheel, 30% opacity, overlay mögött |
| **BackgroundScene** | Minden más oldal | BackgroundGradientMesh, 5-8% opacity, teljes háttér |

### Teljesítmény szabályok
- HeroScene: max 50 particle (desktop), 20 (mobile — 768px alatt detection)
- BackgroundScene: mesh alacsony vertex szám (50×50), egyszerű anyagok
- Minden R3F scene: `<Canvas>` dpr={1} (vagy dpr={[1, 2]} retina esetén)
- Bloom post-processing csak HeroScene-nél (költéges, ne használjuk máshol)
- Canvas-ok lazy mount: nem renderelünk 3D-t, amíg a section nincs viewport közelében (drei `<View>` vagy IntersectionObserver)

---

## Routing

| Útvonal | Oldal | Layout jellemzők |
|---------|-------|------------------|
| `/` | Home | HeroScene (full WebGL), WebGL háttér nincs |
| `/ai-tippek` | AI Tips | BackgroundScene (subtle mesh), AITipsHeroSection |
| `/kalkulator` | Calculator | BackgroundScene (subtle mesh), CalculatorInterface + OddsProbabilityWheel |
| `/elemzesek/:matchId` | Analytics | BackgroundScene, MatchAnalyticsView |
| `/ranglista` | Leaderboard | BackgroundScene, LeaderboardTable |

---

## Egyéb Architektúra Döntések

### Mock adatok
Minden odds, tipp, statisztika és meccs-adat statikus JSON mock fájlokból érkezik. Nincs backend integráció. A "live" odds frissítést `setInterval` szimulálja random ±0.05 odds változtatással 5-15 másodpercenként.

### SVG ikonok
Minden ikon (sport ikonok, nav ikonok, feature ikonok, stb.) inline SVG komponensekként implementált. Nincs ikon könyvtár függőség. 2px stroke, outline stílus.

### Diagramok
Minden diagram (teljesítmény görbe, probability bár chart, H2H pie chart, radar chart, stb.) natív SVG `<path>`, `<rect>`, `<circle>` elemekkel rajzolt, nem használunk charting library-t. A designban szereplő egyszerű chart-ok (1-5 darab) nem indokolják külső könyvtár betöltését.

### Responsive töréspontok
- Desktop: >= 1024px (teljes layout, 3D effektek)
- Tablet: 768px - 1023px (kétoszlop → egyszerűsített)
- Mobile: < 768px (egyoszlop, hamburger menü, WebGL particle csökkentés, CustomCursor rejtve)
