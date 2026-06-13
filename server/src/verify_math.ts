/**
 * Verifikációs teszt az új matematikai magra.
 * Futtatás: npx tsx src/verify_math.ts
 */
import { calculateProbabilities, calculateExpectedGoals, DIXON_COLES_RHO } from './services/quantitativeModel.js';
import { buildCalibrationReport, type CalibrationSample } from './services/calibration.js';
import { summarizeClv, type ClvRecord } from './services/clv.js';

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail: string = '') {
  if (cond) { console.log(`  ✅ ${name} ${detail}`); pass++; }
  else { console.log(`  ❌ ${name} ${detail}`); fail++; }
}

console.log('\n=== 1. NORMALIZÁLT VALÓSZÍNŰSÉGI TÉR ===');
const p = calculateProbabilities(1.5, 1.1);
const sum1x2 = p.homeWin + p.draw + p.awayWin;
const sumOU = p.over25 + p.under25;
check('1X2 összege = 1', Math.abs(sum1x2 - 1) < 1e-9, `(Σ=${sum1x2.toFixed(8)})`);
check('Over+Under = 1 (KORÁBBAN ELTÖRT!)', Math.abs(sumOU - 1) < 1e-9, `(Σ=${sumOU.toFixed(8)})`);
check('O/U ugyanabból a térből mint 1X2', Math.abs(sum1x2 - sumOU) < 1e-9, `(diff=${Math.abs(sum1x2-sumOU).toExponential(2)})`);

console.log('\n=== 2. DIXON-COLES MECHANIZMUS (explicit ρ=-0.15) ===');
// A DC default most ρ=0 (backteszt szerint), de a MECHANIZMUS helyességét
// explicit ρ=-0.15-tel teszteljük: negatív ρ-nak emelnie kell a döntetlent.
const pPoisson = calculateProbabilities(1.2, 1.0, 10, 0);
const pDC = calculateProbabilities(1.2, 1.0, 10, -0.15);
check('DC (ρ=-0.15) növeli a döntetlen valószínűségét', pDC.draw > pPoisson.draw,
  `(ρ=0 X=${(pPoisson.draw*100).toFixed(2)}% → ρ=-0.15 X=${(pDC.draw*100).toFixed(2)}%)`);
check('DC verzió is normalizált', Math.abs(pDC.homeWin+pDC.draw+pDC.awayWin - 1) < 1e-9);

console.log('\n=== 3. EXPECTED GOALS ÉPELMÉJŰSÉG ===');
const eg = calculateExpectedGoals(
  { name: 'A', elo: 1800, attackStrength: 1.5, defenseStrength: 0.9, recentForm: [], tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.5 },
  { name: 'B', elo: 1600, attackStrength: 1.0, defenseStrength: 1.2, recentForm: [], tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.5 },
  false
);
check('Erősebb csapat több gólt vár', eg.homeGoals > eg.awayGoals, `(${eg.homeGoals.toFixed(2)} vs ${eg.awayGoals.toFixed(2)})`);
check('Gólvárakozás reális tartomány (0.2-4)', eg.homeGoals > 0.2 && eg.homeGoals < 4 && eg.awayGoals > 0.2, `(home=${eg.homeGoals.toFixed(2)})`);

console.log('\n=== 4. KALIBRÁCIÓ: TÖKÉLETES vs ROSSZ MODELL ===');
// Tökéletesen kalibrált, VÁLTOZATOS predikciók (csak így van értelme a BSS-nek:
// ha minden tipp ugyanaz mint az alapráta, a BSS definíció szerint 0).
const perfectSamples: CalibrationSample[] = [];
const probLevels = [0.2, 0.4, 0.6, 0.8];
for (const pl of probLevels) {
  const nWin = Math.round(pl * 50); // 50 minta szintenként, pl arányban nyer
  for (let i = 0; i < 50; i++) perfectSamples.push({ predictedProb: pl, outcome: i < nWin ? 1 : 0 });
}
const perfectRep = buildCalibrationReport(perfectSamples);
check('Tökéletes kalibráció: alacsony ECE', perfectRep.expectedCalibrationError < 0.05, `(ECE=${perfectRep.expectedCalibrationError.toFixed(4)})`);
check('Tökéletes kalibráció: pozitív BSS', perfectRep.brierSkillScore > 0, `(BSS=${perfectRep.brierSkillScore.toFixed(4)})`);

// Túl-magabiztos modell: p=0.9 de csak 50% jön be
const overconfident: CalibrationSample[] = [];
for (let i = 0; i < 100; i++) overconfident.push({ predictedProb: 0.9, outcome: i < 50 ? 1 : 0 });
const overRep = buildCalibrationReport(overconfident);
check('Túl-magabiztos modell: magas ECE (lebukik!)', overRep.expectedCalibrationError > 0.3, `(ECE=${overRep.expectedCalibrationError.toFixed(4)})`);
check('Túl-magabiztos modell: rossz Brier', overRep.brierScore > 0.25, `(Brier=${overRep.brierScore.toFixed(4)})`);

console.log('\n=== 5. CLV: EDGE BIZONYÍTÁS ===');
// Pozitív CLV: konzisztensen jobb oddson fogadva mint a záró
const posClv: ClvRecord[] = [];
for (let i = 0; i < 30; i++) posClv.push({ matchId: `m${i}`, selection: 'home', betOdds: 2.10, closingOdds: 2.00, stakeFt: 5000 });
const posSummary = summarizeClv(posClv);
check('Pozitív CLV detektálva', posSummary.weightedClvPct > 1.5, `(CLV=+${posSummary.weightedClvPct.toFixed(2)}%)`);
check('Beat-close rate 100%', posSummary.beatCloseRate === 100, `(${posSummary.beatCloseRate}%)`);

// Negatív CLV: rosszabb oddson fogadva
const negClv: ClvRecord[] = [];
for (let i = 0; i < 30; i++) negClv.push({ matchId: `m${i}`, selection: 'home', betOdds: 1.90, closingOdds: 2.00, stakeFt: 5000 });
const negSummary = summarizeClv(negClv);
check('Negatív CLV detektálva (nincs edge)', negSummary.weightedClvPct < 0, `(CLV=${negSummary.weightedClvPct.toFixed(2)}%)`);

console.log(`\n${'='.repeat(50)}`);
console.log(`EREDMÉNY: ${pass} PASS, ${fail} FAIL`);
console.log('='.repeat(50));
process.exit(fail > 0 ? 1 : 0);
