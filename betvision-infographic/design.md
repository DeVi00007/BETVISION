# BETVISION Infografika — Design Dokumentum

## 1. Profil Alapvonal Nyilatkozat

- **Profil választás**: `profiles/strategic.md` — Projekt bemutató / pitch deck
- **Választás indoklása**: A BETVISION egy sportfogadási platform projekt bemutatója, ami magában foglalja a versenytárs elemzést, technológiai stack-et, kulcsfunkciókat, üzleti modellt és jövőbeli fejlesztéseket.
- **Referált dimenziók**: Információsűrűség (közepes-magas), adat-orientált vizualizáció, key numbers kiemelése, strukturált narratíva
- **Eltérések**: A színpaletta a BETVISION dark theme-hez igazodik (neon zöld + mély fekete), nem a klasszikus tanácsadói kék. A sporttéma miatt a Jersey15 fontot is használjuk számokhoz.

## 2. Stílus Alapvonal Nyilatkozat

- **Stílus horgony**: Dark mode tech startup pitch deck + sports betting app UI aesthetics
- **Referált dimenziók**: 
  - Színpaletta: A BETVISION weboldal sötét témája (fekete háttér + neon zöld/cyan accent)
  - Elrendezés: Grid-alapú, modern, minimális deko
  - Információsűrűség: Közepes-magas, adatokkal alátámasztva

## 3. Stílus Részletek

### Színdizájn
- **Színvilág**: Sötét, kontrasztos, neon accents
- **Hőmérséklet**: Hideg alaptónus, meleg zöld accent
- **Színek**:
  - primary: `#00FF94` — Neon zöld (CTA, kiemelések, odds-ok)
  - secondary: `#888888` — Szürke (másodlagos szöveg)
  - accent: `#00CCFF` — Cyan (diagramok, linkek)
  - background: `#050505` — Mély fekete (háttér)
  - surface: `#111111` — Felszín (kártyák)
  - surface2: `#1A1A1A` — Emelt felszín
  - text: `#FFFFFF` — Fehér szöveg
  - gold: `#FFD700` — Arany (érmedál, kiemelések)

### Betűk
- **Címek**: "Liter" — Modern, tiszta, sans-serif, authority
- **Számok/KPI-k**: "Jersey15" — Sportos, mez-stílusú számok
- **Szöveg**: "MiSans" — Tiszta, modern, jól olvasható
- **Méret hierarchia**:
  - Nagy számok: 52-64px (Jersey15)
  - Címek: 32-40px (Liter)
  - Alcímek: 22-26px (Liter)
  - Szöveg: 18-20px (MiSans)
  - Annotations: 13-14px (MiSans)

### Konténerek
- Kártyák: Sharp-cornered rectangles, nincs rounded corner
- Szegély: Subtle 1px border `rgba(255,255,255,0.08)`
- Kitöltés: `#111111` vagy `#1A1A1A`

### Képstílus
- Iconok: Solid stílus, Font Awesome, zöld/cyan színek
- Táblázatok: Minimal, dark header + alternating dark rows
- Diagramok: Neon zöld/cyan színek, sötét háttér

## 4. Layout Rendszer

- **Oldal méret**: 1280 x 720 (16:9)
- **Margók**: 60px oldalt, 50px felül/alul
- **Globális elemek**: Oldalszám alsó jobb sarokban, BETVISION logó felső bal sarokban
- **Speciális oldalak**: Cover Hero design (nagy cím + dekoratív elemek), Final page CTA
- **Tartalmi oldalak**: Grid layout, kártyák, ikonok

## 5. Stílus Használati Szabályok

- `$title` — Oldal címek, felső címsor
- `$subtitle` — Alcímek, szekció címek
- `$body` — Fő szövegtartalom
- `$bigNumber` — Nagy KPI számok (Jersey15)
- `$caption` — Kisebb annotációs szöveg
- `$primary` — Neon zöld szöveg/kiemelés
- `$accent` — Cyan szöveg/kiemelés

## 6. Kockázati Tiltások

- ❌ Ne használj kerekített sarkokat (a BETVISION design sharp-cornered)
- ❌ Ne használj világos hátteret — minden oldal sötét
- ❌ Ne használj alacsony kontrasztú szöveget
- ❌ Body font ne legyen kisebb 18px-nél
- ❌ Ne használj több mint 3 színt egy diagramon
- ❌ Ne legyen túl sok szöveg egy oldalon — bullet points és számok

## 7. Theme Definíció

```yaml
theme:
  colors:
    primary: "#00FF94"
    secondary: "#888888"
    accent: "#00CCFF"
    background: "#050505"
    surface: "#111111"
    surface2: "#1A1A1A"
    text: "#FFFFFF"
    gold: "#FFD700"
    border: "rgba(255,255,255,0.08)"
  textStyles:
    title:
      fontSize: 36
      color: "$text"
      fontFamily: "Liter"
      letterSpacing: 1
    subtitle:
      fontSize: 22
      color: "$secondary"
      fontFamily: "Liter"
    body:
      fontSize: 18
      color: "$text"
      fontFamily: "MiSans"
      lineHeight: 1.5
    bigNumber:
      fontSize: 56
      color: "$primary"
      fontFamily: "Jersey15"
    caption:
      fontSize: 14
      color: "$secondary"
      fontFamily: "MiSans"
      lineHeight: 1.4
  tableStyles:
    default:
      fontSize: 16
      fontFamily: "MiSans"
      headerFill: "$surface2"
      headerColor: "$primary"
      headerBold: true
      bodyFill: ["$surface", "$background"]
      bodyColor: "$text"
      border:
        style: solid
        width: 1
        color: "#1A1A1A"
```
