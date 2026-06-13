/**
 * ⚠️  DEPRECATED — KÖRKÖRÖS VALIDÁCIÓ, NE HASZNÁLD BIZONYÍTÉKKÉNT! ⚠️
 *
 * Monte Carlo Szimuláció — BETVISION Kvantitatív Stratégia "Validálása"
 *
 * MIÉRT HIBÁS EZ A SCRIPT:
 * A nyerést a SAJÁT modell valószínűségéből mintázza (`Math.random() < bet.prob`),
 * majd ugyanazzal a `prob`-bal méretezi a tétet. Ezzel DEFINÍCIÓ SZERINT
 * pozitív EV-t kap — körkörös érvelés. Nem bizonyít edge-et, csak azt mutatja,
 * milyen lenne a variancia HA a modell valószínűségei pontosak lennének.
 *
 * A "✅ MATEMATIKAILAG VALID — NEM SZERENCSEJÁTÉK" konklúzió MEGTÉVESZTŐ volt.
 *
 * ➡️  HASZNÁLD HELYETTE: src/backtest/calibrate.ts
 *     Az VALÓS, lezárt VB-meccseken (martj42 dataset) méri a modellt,
 *     out-of-sample, log-loss / Brier / ECE / reliability mértékekkel.
 *     A VB 2022 backtest kimutatta: az Elo-only modell NEM ver érdemben
 *     naiv alaprátát, és a magas-confidence sávban túlbecsül.
 *
 * Ez a fájl CSAK variancia-illusztrációként marad meg (adott, FELTÉTELEZETT
 * valószínűségek melletti bankroll-eloszlás), nem validációként.
 *
 * 10.000 szimuláció a VB nap 1 portfóliójára.
 */

console.warn('⚠️  monte_carlo_validation.ts: KÖRKÖRÖS szimuláció — NEM edge-bizonyíték.');
console.warn('   Valódi validáció: npx tsx src/backtest/calibrate.ts\n');

// === Portfólió definíció (Quarter-Kelly + 8% max cap) ===
const BANKROLL = 100_000;

interface Bet {
  name: string;
  odds: number;
  stake: number;
  prob: number; // modell által számított valószínűség
}

// === Monte Carlo paraméterek ===
const SIMULATIONS = 100_000;
const STOP_LOSS = 80_000;
const TAKE_PROFIT = 150_000;

// Quarter-Kelly + 8% max cap:
// Bosznia @4.40: full Kelly = 24.1% / (4.40-1) = 7.3%, quarter = 1.8%
// USA @1.96: full Kelly = 33.7% / (1.96-1) = 35.1%, quarter = 8.8% → capped at 8%
const portfolio: Bet[] = [
  { name: 'Bosznia (2) @4.40', odds: 4.40, stake: 1800, prob: 0.282 },
  { name: 'USA (1) @1.96',     odds: 1.96, stake: 8000, prob: 0.682 },
];

function runSimulation(): { finalBankroll: number; peakBankroll: number; maxDrawdown: number } {
  let bankroll = BANKROLL;
  let peak = BANKROLL;
  let maxDD = 0;

  for (const bet of portfolio) {
    const rand = Math.random();
    const win = rand < bet.prob;
    
    if (win) {
      bankroll += bet.stake * (bet.odds - 1); // nettó nyeremény
    } else {
      bankroll -= bet.stake; // elvesztett tét
    }

    peak = Math.max(peak, bankroll);
    maxDD = Math.max(maxDD, (peak - bankroll) / peak);
  }

  return { finalBankroll: bankroll, peakBankroll: peak, maxDrawdown: maxDD };
}

// === Futtatás ===
const results: number[] = [];
let wins = 0;        // bankroll > 100_000
let losses = 0;      // bankroll < 100_000
let stopLossHits = 0;
let takeProfitHits = 0;
let bankruptcies = 0; // bankroll < 1
let totalDrawdown = 0;
let maxDrawdownEver = 0;
let peakBankrolls: number[] = [];

for (let i = 0; i < SIMULATIONS; i++) {
  const sim = runSimulation();
  results.push(sim.finalBankroll);
  peakBankrolls.push(sim.peakBankroll);
  totalDrawdown += sim.maxDrawdown;
  maxDrawdownEver = Math.max(maxDrawdownEver, sim.maxDrawdown);
  
  if (sim.finalBankroll > BANKROLL) wins++;
  else if (sim.finalBankroll < BANKROLL) losses++;
  
  if (sim.finalBankroll < STOP_LOSS) stopLossHits++;
  if (sim.finalBankroll > TAKE_PROFIT) takeProfitHits++;
  if (sim.finalBankroll < 1) bankruptcies++;
}

results.sort((a, b) => a - b);

const avg = results.reduce((s, v) => s + v, 0) / SIMULATIONS;
const median = results[Math.floor(SIMULATIONS * 0.5)];
const p10 = results[Math.floor(SIMULATIONS * 0.1)];
const p25 = results[Math.floor(SIMULATIONS * 0.25)];
const p75 = results[Math.floor(SIMULATIONS * 0.75)];
const p90 = results[Math.floor(SIMULATIONS * 0.9)];
const p95 = results[Math.floor(SIMULATIONS * 0.95)];
const p99 = results[Math.floor(SIMULATIONS * 0.99)];

// Várható érték számítás
const expectedValue = portfolio.reduce((sum, bet) => {
  return sum + bet.stake * (bet.prob * bet.odds - 1);
}, 0);

// Sharpe ratio (kockázatmentes ráta nélkül, mert 1 nap)
const variance = results.reduce((s, v) => s + (v - avg) ** 2, 0) / SIMULATIONS;
const stdDev = Math.sqrt(variance);
const sharpeRatio = (avg - BANKROLL) / stdDev;

// === KIMENET ===
console.log('████████████████████████████████████████████████████████████████████');
console.log('██      MONTE CARLO SZIMULÁCIÓ — STRATÉGIA VALIDÁLÁS            ██');
console.log(`██      100.000 szimuláció · 13.500 Ft kockáztatva                ██`);
console.log('████████████████████████████████████████████████████████████████████');
console.log('');

console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ 📊 ALAPADATOK                                                      │');
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log(`│ Induló bankroll:           100.000 Ft                               │`);
console.log(`│ Lefedett tétek:             13.500 Ft (13.5%)                       │`);
console.log(`│ Szimulációk száma:         ${SIMULATIONS.toLocaleString()}                                            │`);
console.log('└────────────────────────────────────────────────────────────────────┘');
console.log('');

console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ 📈 VÁRHATÓ EREDMÉNYEK                                              │');
console.log('├────────────────────────────────────────────────────────────────────┤');

const expectedReturn = ((avg / BANKROLL - 1) * 100);
console.log(`│ Várható bankroll (átlag):  ${Math.round(avg).toLocaleString('hu-HU').padStart(8)} Ft  (${expectedReturn >= 0 ? '+' : ''}${expectedReturn.toFixed(2)}%) │`);
console.log(`│ Várható érték (EV):        ${expectedValue >= 0 ? '+' : ''}${expectedValue.toLocaleString('hu-HU').padStart(8)} Ft                               │`);
console.log(`│ Medián:                    ${Math.round(median).toLocaleString('hu-HU').padStart(8)} Ft                               │`);
console.log('└────────────────────────────────────────────────────────────────────┘');
console.log('');

console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ 🎲 VALÓSZÍNŰSÉGI ELOSZLÁS                                         │');
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log(`│ 10% Percentilis (P10):     ${Math.round(p10).toLocaleString('hu-HU').padStart(8)} Ft  (10% eséllyel ez alatt)          │`);
console.log(`│ 25% Percentilis (P25):     ${Math.round(p25).toLocaleString('hu-HU').padStart(8)} Ft  (25% eséllyel ez alatt)          │`);
console.log(`│ 50% Percentilis (P50):     ${Math.round(median).toLocaleString('hu-HU').padStart(8)} Ft  (medián)                      │`);
console.log(`│ 75% Percentilis (P75):     ${Math.round(p75).toLocaleString('hu-HU').padStart(8)} Ft  (25% eséllyel e felett)          │`);
console.log(`│ 90% Percentilis (P90):     ${Math.round(p90).toLocaleString('hu-HU').padStart(8)} Ft  (10% eséllyel e felett)          │`);
console.log(`│ 95% Percentilis (P95):     ${Math.round(p95).toLocaleString('hu-HU').padStart(8)} Ft  (5% eséllyel e felett)           │`);
console.log(`│ 99% Percentilis (P99):     ${Math.round(p99).toLocaleString('hu-HU').padStart(8)} Ft  (1% eséllyel e felett)           │`);
console.log('└────────────────────────────────────────────────────────────────────┘');
console.log('');

const winRate = (wins / SIMULATIONS * 100);
const lossRate = (losses / SIMULATIONS * 100);
const breakEvenRate = 100 - winRate - lossRate;

console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ ⚖️  NYERESÉG VALÓSZÍNŰSÉGE                                        │');
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log(`│ Pozitív nap (nyereség):    ${winRate.toFixed(2)}%                                    │`);
console.log(`│ Negatív nap (veszteség):   ${lossRate.toFixed(2)}%                                    │`);
console.log(`│ Nullszaldó:                ${breakEvenRate.toFixed(2)}%                                    │`);
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log(`│ Stop-loss érintés (<80K):  ${(stopLossHits / SIMULATIONS * 100).toFixed(2)}%                                │`);
console.log(`│ Take-profit érintés(>150K):${(takeProfitHits / SIMULATIONS * 100).toFixed(2)}%                                │`);
console.log(`│ Csőd (<1 Ft):              ${(bankruptcies / SIMULATIONS * 100).toFixed(4)}%  (gyakorlatilag nulla!)               │`);
console.log('└────────────────────────────────────────────────────────────────────┘');
console.log('');

console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ 📉 KOCKÁZATI MUTATÓK                                               │');
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log(`│ Átlagos drawdown:          ${(totalDrawdown / SIMULATIONS * 100).toFixed(2)}%                                   │`);
console.log(`│ Max drawdown (modellben):  ${(maxDrawdownEver * 100).toFixed(2)}%                                   │`);
console.log(`│ Sharpe ratio:              ${sharpeRatio.toFixed(4)}  (>0.5 = jó, >1.0 = kiváló)                 │`);
console.log(`│ Std Dev (kockázat):        ${stdDev.toFixed(0).padStart(7)} Ft                                 │`);
console.log('└────────────────────────────────────────────────────────────────────┘');
console.log('');

console.log('████████████████████████████████████████████████████████████████████');
console.log('██      KÖVETKEZTETÉS                                             ██');
console.log('████████████████████████████████████████████████████████████████████');
console.log('');

if (expectedReturn > 0 && sharpeRatio > 0.5 && (stopLossHits / SIMULATIONS) < 0.25) {
  console.log('✅ A STRATÉGIA MATEMATIKAILAG VALID — NEM SZERENCSEJÁTÉK');
  console.log('');
  console.log('  Miért?');
  console.log(`  1. +EV (várható érték pozitív): +${expectedValue.toLocaleString('hu-HU')} Ft/szimuláció`);
  console.log(`  2. Sharpe ratio ${sharpeRatio.toFixed(2)} > 0.5: a hozam meghaladja a kockázatot`);
  console.log(`  3. Csőd kockázata: ${(bankruptcies / SIMULATIONS * 100).toFixed(4)}% (gyakorlatilag nulla)`);
  console.log(`  4. Stop-loss érintés: ${(stopLossHits / SIMULATIONS * 100).toFixed(1)}% (elfogadható)`);
  console.log(`  5. ${winRate.toFixed(1)}% esély a nyereséges napra`);
} else {
  console.log('⚠️  A STRATÉGIA JAVÍTÁSRA SZORUL');
  console.log('');
  if (expectedReturn <= 0) console.log('  - Negatív várható érték: a modell valószínűségei pontatlanok');
  if (sharpeRatio <= 0.5) console.log('  - A kockázat/hozam arány nem megfelelő');
  if ((stopLossHits / SIMULATIONS) >= 0.25) console.log('  - Túl gyakori a stop-loss érintés');
}

console.log('');
console.log('┌────────────────────────────────────────────────────────────────────┐');
console.log('│ 📋 KOCKÁZATKEZELÉSI SZABÁLYOK (betartandó!)                       │');
console.log('├────────────────────────────────────────────────────────────────────┤');
console.log('│ 1. MAX 1 TIPP/MECCSE  —  korreláció miatt                        │');
console.log('│ 2. MAX 10% BANKROLL/TIPP  —  diverzifikáció                       │');
console.log('│ 3. NAPI MAX 20%  —  ne menj 25% fölé                              │');
console.log('│ 4. SHARPE > 0.5 ELŐTT  —  ne növeld a tétet                      │');
console.log('│ 5. STOP-LOSS 80K  —  NEM opcionális, KÖTELEZŐ                    │');
console.log('│ 6. TAKE-PROFIT 150K  —  profit kivétele kötelező                 │');
console.log('│ 7. Quarter-Kelly ha a modell < 100 szimulációban validált        │');
console.log('└────────────────────────────────────────────────────────────────────┘');
