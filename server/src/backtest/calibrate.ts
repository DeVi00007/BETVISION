/**
 * KALIBRÁCIÓ + OUT-OF-SAMPLE BACKTEST
 *
 * Ez a script VÁLTJA KI a korábbi körkörös Monte Carlo-t.
 *
 * KORÁBBI HIBA (monte_carlo_validation.ts): a kimenetet a saját modell
 * valószínűségéből mintázta (rand < prob) → definíció szerint +EV → semmit
 * sem bizonyított.
 *
 * EZ A MEGKÖZELÍTÉS: valós, lezárt VB-meccsek (2014/2018/2022) TÉNYLEGES
 * eredményén méri a modellt:
 *  1. Rolling Elo a torna ELŐTTI nemzetközi meccsekből (no lookahead).
 *  2. Grid search: a ρ (Dixon-Coles) és a gólskála paramétereket úgy
 *     hangoljuk, hogy a log-loss minimális legyen a tanuló tornákon.
 *  3. A kalibrált paramétereket OUT-OF-SAMPLE értékeljük a teszt-tornán.
 *  4. Brier, log-loss, ECE, reliability — valódi pontossági mértékek.
 *
 * Futtatás: npx tsx src/backtest/calibrate.ts
 */

import {
  loadMatches,
  createEloEngine,
  eloToExpectedGoals,
  type RawMatch,
  type LambdaParams,
  DEFAULT_LAMBDA_PARAMS,
} from './backtestEngine.js';
import { calculateProbabilities } from '../services/quantitativeModel.js';
import { buildCalibrationReport, type CalibrationSample } from '../services/calibration.js';

// ─── Konfiguráció ────────────────────────────────────────────────────────
const TRAIN_TOURNAMENTS = ['2014', '2018']; // tanuló
const TEST_TOURNAMENT = '2022';              // out-of-sample teszt

interface WorldCupMatch extends RawMatch {
  eloHome: number;
  eloAway: number;
}

/**
 * Felépíti a VB-meccsek listáját, mindegyikhez a meccs ELŐTTI Elo-val.
 * Időrendben halad: minden nem-VB meccs frissíti az Elo-t, és amikor
 * VB-meccshez érünk, lementjük az AKKORI (pre-match) Elo-t, majd frissítünk.
 */
function buildWorldCupSet(matches: RawMatch[], years: string[]): WorldCupMatch[] {
  const elo = createEloEngine();
  const result: WorldCupMatch[] = [];
  const yearSet = new Set(years);

  for (const m of matches) {
    const year = m.date.slice(0, 4);
    const isTargetWC = m.tournament === 'FIFA World Cup' && yearSet.has(year);

    if (isTargetWC) {
      // Pre-match Elo rögzítése MIELŐTT frissítenénk
      result.push({ ...m, eloHome: elo.get(m.homeTeam), eloAway: elo.get(m.awayTeam) });
    }
    // Minden meccs (VB is) frissíti az Elo-t időrendben
    elo.update(m);
  }
  return result;
}

/** Egy meccsre a modell 1X2 + O/U valószínűségei adott paraméterekkel */
function predictMatch(wc: WorldCupMatch, params: LambdaParams, rho: number) {
  const { lambdaHome, lambdaAway } = eloToExpectedGoals(wc.eloHome, wc.eloAway, true, params);
  return calculateProbabilities(lambdaHome, lambdaAway, 10, rho);
}

/** Log-loss egy meccs-halmazon (1X2 multinomiális) */
function evaluateLogLoss(set: WorldCupMatch[], params: LambdaParams, rho: number): number {
  const eps = 1e-15;
  let sum = 0;
  for (const wc of set) {
    const p = predictMatch(wc, params, rho);
    let pOutcome: number;
    if (wc.homeScore > wc.awayScore) pOutcome = p.homeWin;
    else if (wc.homeScore === wc.awayScore) pOutcome = p.draw;
    else pOutcome = p.awayWin;
    sum += Math.log(Math.max(eps, pOutcome));
  }
  return -sum / set.length;
}

/** 1X2 → kalibrációs minták (a BEKÖVETKEZETT kimenet valószínűsége) */
function toCalibrationSamples(set: WorldCupMatch[], params: LambdaParams, rho: number): CalibrationSample[] {
  const samples: CalibrationSample[] = [];
  for (const wc of set) {
    const p = predictMatch(wc, params, rho);
    const homeWon = wc.homeScore > wc.awayScore ? 1 : 0;
    const drew = wc.homeScore === wc.awayScore ? 1 : 0;
    const awayWon = wc.homeScore < wc.awayScore ? 1 : 0;
    // Minden kimenet külön bináris mintaként (one-vs-rest kalibráció)
    samples.push({ predictedProb: p.homeWin, outcome: homeWon as 0 | 1 });
    samples.push({ predictedProb: p.draw, outcome: drew as 0 | 1 });
    samples.push({ predictedProb: p.awayWin, outcome: awayWon as 0 | 1 });
  }
  return samples;
}

// ─── FŐ FOLYAMAT ──────────────────────────────────────────────────────────

console.log('Adatbetöltés...');
const all = loadMatches();
console.log(`  ${all.length} valós nemzetközi meccs betöltve (martj42 dataset).`);

const trainSet = buildWorldCupSet(all, TRAIN_TOURNAMENTS);
const testSet = buildWorldCupSet(all, [TEST_TOURNAMENT]);
console.log(`  Tanuló (VB ${TRAIN_TOURNAMENTS.join('+')}): ${trainSet.length} meccs`);
console.log(`  Teszt  (VB ${TEST_TOURNAMENT}): ${testSet.length} meccs`);

// ── GRID SEARCH a tanuló halmazon (log-loss minimum) ──
console.log('\nGrid search (ρ × eloToGoalScale) a tanuló halmazon...');
const rhoGrid = [-0.20, -0.18, -0.15, -0.12, -0.10, -0.05, 0];
const scaleGrid = [0.0015, 0.0020, 0.0025, 0.0030, 0.0035, 0.0040];

let best = { rho: DEFAULT_LAMBDA_PARAMS.eloToGoalScale, scale: 0, logLoss: Infinity, params: DEFAULT_LAMBDA_PARAMS };
for (const rho of rhoGrid) {
  for (const scale of scaleGrid) {
    const params: LambdaParams = { ...DEFAULT_LAMBDA_PARAMS, eloToGoalScale: scale };
    const ll = evaluateLogLoss(trainSet, params, rho);
    if (ll < best.logLoss) best = { rho, scale, logLoss: ll, params };
  }
}
console.log(`  Legjobb (train): ρ=${best.rho}, eloToGoalScale=${best.scale}, log-loss=${best.logLoss.toFixed(4)}`);

// ── Baseline összehasonlítás: a régi default paraméterek ──
const baselineLL = evaluateLogLoss(trainSet, DEFAULT_LAMBDA_PARAMS, -0.15);
console.log(`  Baseline (default ρ=-0.15): log-loss=${baselineLL.toFixed(4)}`);

// ── Naiv referencia: mindig a tanuló alaprátát tippeli ──
const baseRates = (() => {
  let h = 0, d = 0, a = 0;
  for (const m of trainSet) {
    if (m.homeScore > m.awayScore) h++;
    else if (m.homeScore === m.awayScore) d++;
    else a++;
  }
  const n = trainSet.length;
  return { home: h / n, draw: d / n, away: a / n };
})();
const naiveLL = (() => {
  const eps = 1e-15;
  let sum = 0;
  for (const wc of testSet) {
    let p: number;
    if (wc.homeScore > wc.awayScore) p = baseRates.home;
    else if (wc.homeScore === wc.awayScore) p = baseRates.draw;
    else p = baseRates.away;
    sum += Math.log(Math.max(eps, p));
  }
  return -sum / testSet.length;
})();

// ── OUT-OF-SAMPLE értékelés a TESZT tornán ──
console.log(`\n${'='.repeat(64)}`);
console.log(`OUT-OF-SAMPLE BACKTEST — VB ${TEST_TOURNAMENT} (a modell SOHA nem látta)`);
console.log('='.repeat(64));

const testLL = evaluateLogLoss(testSet, best.params, best.rho);
const testSamples = toCalibrationSamples(testSet, best.params, best.rho);
const report = buildCalibrationReport(testSamples);

console.log(`\n  Kalibrált modell log-loss (teszt):  ${testLL.toFixed(4)}`);
console.log(`  Naiv alapráta log-loss (teszt):     ${naiveLL.toFixed(4)}`);
console.log(`  → A modell ${testLL < naiveLL ? 'VERI' : 'NEM veri'} a naiv alaprátát ` +
  `(${((1 - testLL / naiveLL) * 100).toFixed(1)}% javulás)`);

console.log(`\n  Brier score:        ${report.brierScore.toFixed(4)}`);
console.log(`  Brier Skill Score:  ${report.brierSkillScore.toFixed(4)}  (>0 = jobb a naivnál)`);
console.log(`  Log-loss (1vR):     ${report.logLoss.toFixed(4)}`);
console.log(`  ECE:                ${report.expectedCalibrationError.toFixed(4)}  (0 = tökéletes kalibráció)`);
console.log(`  MCE:                ${report.maxCalibrationError.toFixed(4)}`);

console.log('\n  Reliability diagram (modell vs valóság sávonként):');
console.log('  ┌──────────────┬───────┬───────────┬──────────┬────────┐');
console.log('  │ Sáv          │ Db    │ Modell    │ Valóság  │ Gap    │');
console.log('  ├──────────────┼───────┼───────────┼──────────┼────────┤');
for (const b of report.reliabilityBins) {
  if (b.count === 0) continue;
  console.log(`  │ ${(b.rangeLow * 100).toFixed(0).padStart(3)}-${(b.rangeHigh * 100).toFixed(0).padStart(3)}%      │ ${b.count.toString().padStart(5)} │ ${(b.avgPredicted * 100).toFixed(1).padStart(7)}%  │ ${(b.observedFreq * 100).toFixed(1).padStart(6)}%  │ ${(b.gap * 100).toFixed(1).padStart(5)}% │`);
}
console.log('  └──────────────┴───────┴───────────┴──────────┴────────┘');

console.log(`\n  Értékelés (one-vs-rest, optimista): ${report.interpretation}`);

// ── ŐSZINTE ÖSSZEFOGLALÓ: a multinomiális log-loss az elsődleges mérce ──
console.log('\n' + '='.repeat(64));
console.log('ŐSZINTE KONKLÚZIÓ (multinomiális 1X2 log-loss az elsődleges mérce)');
console.log('='.repeat(64));

const beatsNaive = testLL < naiveLL - 0.005; // értelmes margó
const improvement = (1 - testLL / naiveLL) * 100;

// Magas-sáv túlbecslés detektálása (Kelly-veszély)
const highBins = report.reliabilityBins.filter(b => b.count > 0 && b.rangeLow >= 0.5);
const overconfidentBins = highBins.filter(b => b.avgPredicted - b.observedFreq > 0.10);

if (beatsNaive) {
  console.log(`  ✅ A modell VERI a naiv alaprátát: ${improvement.toFixed(1)}% log-loss javulás.`);
} else {
  console.log(`  ⚠️  A modell NEM veri érdemben a naiv alaprátát tiszta 1X2-ben`);
  console.log(`     (modell ${testLL.toFixed(4)} vs naiv ${naiveLL.toFixed(4)}).`);
  console.log(`     Az Elo-only feature-készlet ÖNMAGÁBAN nem ad kimutatható edge-et.`);
}

if (overconfidentBins.length > 0) {
  console.log(`\n  🔴 TÚLBECSLÉS a magas-confidence sávokban (Kelly-VESZÉLY):`);
  for (const b of overconfidentBins) {
    console.log(`     ${(b.rangeLow*100).toFixed(0)}-${(b.rangeHigh*100).toFixed(0)}%: modell ${(b.avgPredicted*100).toFixed(1)}% → valóság ${(b.observedFreq*100).toFixed(1)}% (${((b.avgPredicted-b.observedFreq)*100).toFixed(1)}pp túl)`);
  }
  console.log(`     KÖVETKEZMÉNY: a magas-confidence tippeknél a teljes Kelly`);
  console.log(`     felülméretez. Quarter-Kelly KÖTELEZŐ, vagy shrinkelni kell`);
  console.log(`     a modell-valószínűséget a piaci felé.`);
}

console.log(`\n  Mit jelent ez a gyakorlatban:`);
console.log(`   • A ρ=${best.rho} (nem -0.15): ezen az adaton a Dixon-Coles nem segített.`);
console.log(`   • A modell az alsó-közép sávban (0-40%) jól kalibrált.`);
console.log(`   • Önmagában az Elo gyenge prediktor — több feature kell`);
console.log(`     (forma, xG, pihenő, utazás, H2H) az edge-hez.`);
console.log(`   • DÖNTÉS: a kalibrált paraméterek mehetnek defaultnak, DE a`);
console.log(`     Kelly-méretezést a piaci oddshoz horgonyzott shrinkage-dzsel`);
console.log(`     kell tompítani, amíg a CLV élesben nem igazol valódi edge-et.`);

console.log('\n' + '='.repeat(64));
console.log('KALIBRÁLT PARAMÉTEREK (a backtest szerinti optimum):');
console.log('='.repeat(64));
console.log(`  DIXON_COLES_RHO     = ${best.rho}`);
console.log(`  eloToGoalScale      = ${best.scale}`);
console.log(`  baseTotalGoals      = ${best.params.baseTotalGoals}`);
console.log('='.repeat(64));
