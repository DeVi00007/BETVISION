# BETVISION Backtest

Valós, out-of-sample modellértékelés lezárt VB-meccseken. Ez **váltja ki** a
korábbi körkörös `monte_carlo_validation.ts`-t (ami a saját modell-valószínűségből
mintázott → semmit sem bizonyított).

## Adatforrás

A `data/historical/international_results.csv` NINCS a repóban (3.6 MB, gitignore-olt).
Letöltés a [martj42/international_results](https://github.com/martj42/international_results)
nyílt adatkészletből (49 000+ valós nemzetközi meccs, 1872–napjainkig):

```bash
mkdir -p server/data/historical
curl -sL "https://raw.githubusercontent.com/martj42/international_results/master/results.csv" \
  -o server/data/historical/international_results.csv
```

## Futtatás

A `server/` mappából (a path `process.cwd()`-ből számolódik):

```bash
npx tsx src/backtest/calibrate.ts
```

## Mit csinál

1. **Rolling Elo** — a csapaterősséget CSAK a meccs előtti nemzetközi
   meccsekből számolja (időrendben), így **nincs lookahead bias**.
2. **Grid search** — a Dixon-Coles ρ és a gólskála paramétereket a tanuló
   tornákon (VB 2014+2018) hangolja, log-loss minimumra.
3. **Out-of-sample teszt** — a kalibrált paramétereket a VB 2022-n értékeli,
   amit a modell SOHA nem látott.
4. **Pontossági mértékek** — multinomiális log-loss (elsődleges), Brier,
   ECE, reliability-diagram.

## Eddigi eredmény (őszinte)

- A grid search **ρ=0**-t választott → az Elo-only feature-készleten a
  Dixon-Coles nem javított.
- A modell **NEM veri érdemben a naiv alaprátát** tiszta 1X2-ben.
- **Túlbecsül a magas-confidence sávban** (60–70%: modell 65.8% → valóság 47.1%).

Ezért a `quantitativeModel.ts` `shrinkToMarket()` védelmet kapott: a value/Kelly
számítás a piac felé húzott valószínűségből történik (λ=0.5), amíg a CLV élesben
nem igazol valódi edge-et. Az Elo önmagában gyenge prediktor — több feature kell
(forma, xG, pihenő, utazás, H2H).
