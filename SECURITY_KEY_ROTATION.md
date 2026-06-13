# 🔐 API-kulcs Rotációs Protokoll — BETVISION

**Státusz:** ⚠️ KÉT API kulcs kompromittálódott (publikus GitHub repóba commitolva).

| Kulcs | Hol volt | Mit ér el | Kockázat |
|---|---|---|---|
| `a8e55…`  | `oddsApiService.ts:6` (server) | The Odds API — élő odds, scores | Havi kvóta égetése, adatlopás |
| `c2e65…`  | `api/sports.ts:15` (Vercel proxy) | api-football.com — élő meccsadatok | Kvóta égetése, Vercel hívások |

## 1. 🚨 AZONNALI: kulcs rotáció a szolgáltatóknál

A régi kulcs már **nem vonható vissza** a git history-ból — ezért minden
szolgáltatónál új kulcsot kell igényelni.

### The Odds API
1. Menj: https://the-odds-api.com → Dashboard → API Keys
2. **Generate New Key** — a régit töröld vagy inaktiváld (ha a UI engedi)
3. Másold az új kulcsot. **NE** írd fájlba soha — csak env-be.

### API-Football
1. Menj: https://www.api-football.com → Dashboard → My API Keys
2. **Rotate key** (új generálása, régi törlése)
3. Másold az új kulcsot. Csak env-be.

## 2. 🔧 Az új kulcsok beállítása

### Lokális fejlesztéshez

```bash
# Server backend (The Odds API)
echo "ODDS_API_KEY=új_odds_kulcs_ide" >> server/.env

# Server backend (API-Football — ha lokálisan is teszteled)
echo "API_FOOTBALL_KEY=új_football_kulcs_ide" >> server/.env
```

### Vercel deploymenthez

```bash
# Be kell állítani a Vercel Dashboardon:
#   VERCEL_API_FOOTBALL_KEY = új_football_kulcs
#
# VAGY gh CLI-vel:
# gh secret set VERCEL_API_FOOTBALL_KEY --repo DeVi00007/BETVISION
```

## 3. 🧹 Git history tisztítás (opcionális, de ajánlott)

A kulcsok benne vannak a git history-ban (`git log -S "a8e5531b"` mutatja).
A `git filter-repo` az egyetlen mód a teljes eltávolításra:

```bash
# 1. Telepítsd: https://github.com/newren/git-filter-repo
#    (pip install git-filter-repo vagy brew install git-filter-repo)

# 2. Klónozz egy FRISS másolatot (ne a meglévőn dolgozz!)
cd /tmp
git clone https://github.com/DeVi00007/BETVISION.git betvision-clean
cd betvision-clean

# 3. Cseréld ki a kulcsokat a history-ban
#    (a kicserélt fájlok NEM lesznek módosítva — a filter-repo
#     a régi commitokban cseréli a sztringet)
git filter-repo --replace-text <(echo "
a8e5531b0522a4fdf01a696cbab69cff==REDACTED_ODDS_API_KEY
c2e659119f7d1c12b7bb8768fa0a9a2f==REDACTED_FOOTBALL_KEY
")

# 4. Ellenőrizd, hogy nincs több kulcs
git log --all -S "a8e5531b"  # Nincs találat ✓
git log --all -S "c2e65911"  # Nincs találat ✓

# 5. Force push (az EGÉSZ történet átíródik!)
git remote add origin https://github.com/DeVi00007/BETVISION.git
git push --force --all --tags

# 6. A csapattársaknak újra kell klónozniuk
```

### Docker/k8s környezetben (ha van)

Ha a kulcsok Docker image-be voltak építve, a kép build cache-t is töröld:
```bash
docker system prune --all --volumes
```

## 4. ✅ Ellenőrzés

Rotáció után:

```bash
# Lokális szerver indítás
cd server && npx tsx src/app.ts

# Ellenőrzés: a /api/ai/tips valós adatot ad-e?
curl http://localhost:4000/api/ai/tips | head -c 200

# Odds API — kvóta ellenőrzés
curl http://localhost:4000/api/ai/portfolio

# Vercel — deploy után: https://betvision.vercel.app/api/sports?endpoint=leagues
```

## 5. 🛡️ Hosszú távú védelem

- **Pre-commit hook** (`.husky/pre-commit`): automatikusan check-elje,
  hogy forráskódban nincs-e regex-re illeszkedő API kulcs.
  ```bash
  # hozzáadva: .husky/pre-commit
  npx --yes secretlint "src/**/*.ts" "server/**/*.ts"
  ```
- **GitHub secret scanning** már alapből aktív, értesít e-mailben.
- **Code review szabály:** `.env`-t vagy process.env-t nem tartalmazó change-nél
  mindig check: "van-e új hardcode-olt kulcs?"

---

**Utolsó frissítés:** 2026. június 14.
**Készítette:** Hermes Agent Security Audit
