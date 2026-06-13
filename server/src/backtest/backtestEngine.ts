/**
 * Backtest Engine — Valós VB-meccseken kalibrált modell
 *
 * Adatforrás: martj42/international_results (49k+ valós nemzetközi meccs).
 * Cél: a Dixon-Coles ρ és a gólmodell-skála paramétereinek kalibrálása
 * VALÓS, lezárt VB-meccseken (2014, 2018, 2022) — NEM fabrikált adat.
 *
 * Tudományos garanciák:
 *  - NO LOOKAHEAD: a csapaterősséget (Elo) csak az adott meccs ELŐTTI
 *    nemzetközi meccsekből számoljuk (rolling update időrendben).
 *  - OUT-OF-SAMPLE értékelés: a kalibrált paramétereket a torna-meccseken
 *    mérjük, ahol a predikció pre-match információból készül.
 *  - A piaci oddsra NINCS szükség a ρ/skála kalibrációhoz (csak gólszám kell).
 */

import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────
// 1. CSV BETÖLTÉS
// ─────────────────────────────────────────────────────────────────────────

export interface RawMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  tournament: string;
  neutral: boolean;
}

export function loadMatches(csvPath?: string): RawMatch[] {
  // process.cwd() = a server/ mappa (innen futtatjuk a scriptet/szervert).
  // Modulrendszer-független (nincs import.meta), így CommonJS és ESM alatt is működik.
  const file = csvPath ?? path.join(process.cwd(), 'data', 'historical', 'international_results.csv');
  const text = fs.readFileSync(file, 'utf-8');
  const lines = text.split('\n');
  const matches: RawMatch[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 9) continue;
    const homeScore = parseInt(parts[3], 10);
    const awayScore = parseInt(parts[4], 10);
    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) continue;
    matches.push({
      date: parts[0],
      homeTeam: parts[1],
      awayTeam: parts[2],
      homeScore,
      awayScore,
      tournament: parts[5],
      neutral: parts[8].toUpperCase() === 'TRUE',
    });
  }
  // Időrendi sorrend garantálása (a rolling Elo-hoz kritikus)
  matches.sort((a, b) => a.date.localeCompare(b.date));
  return matches;
}

// ─────────────────────────────────────────────────────────────────────────
// 2. ROLLING ELO (World Football Elo stílus, gólkülönbség-súlyozással)
// ─────────────────────────────────────────────────────────────────────────

const INITIAL_ELO = 1500;
const K_FACTOR = 30;          // World Cup-szintű K
const HOME_FIELD_ELO = 65;    // hazai pálya Elo-előny (nem semleges helyszínen)

function eloExpectancy(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/** Gólkülönbség-szorzó (World Football Elo módszertan) */
function goalDiffMultiplier(goalDiff: number): number {
  const g = Math.abs(goalDiff);
  if (g <= 1) return 1;
  if (g === 2) return 1.5;
  return (11 + g) / 8;
}

export interface EloEngine {
  ratings: Map<string, number>;
  get(team: string): number;
  update(m: RawMatch): void;
}

export function createEloEngine(): EloEngine {
  const ratings = new Map<string, number>();
  const get = (team: string) => ratings.get(team) ?? INITIAL_ELO;

  return {
    ratings,
    get,
    update(m: RawMatch) {
      const homeElo = get(m.homeTeam);
      const awayElo = get(m.awayTeam);
      const homeAdv = m.neutral ? 0 : HOME_FIELD_ELO;
      const expHome = eloExpectancy(homeElo + homeAdv, awayElo);

      let sHome: number;
      if (m.homeScore > m.awayScore) sHome = 1;
      else if (m.homeScore === m.awayScore) sHome = 0.5;
      else sHome = 0;

      const mult = goalDiffMultiplier(m.homeScore - m.awayScore);
      const delta = K_FACTOR * mult * (sHome - expHome);

      ratings.set(m.homeTeam, homeElo + delta);
      ratings.set(m.awayTeam, awayElo - delta);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// 3. KALIBRÁLHATÓ λ-MODELL (Elo → várható gólok)
// ─────────────────────────────────────────────────────────────────────────

export interface LambdaParams {
  baseTotalGoals: number;  // VB átlag gól/meccs (~2.5)
  homeFieldElo: number;    // hazai Elo-előny gólra váltva (semleges helyszínen 0)
  eloToGoalScale: number;  // mennyire fordítja az Elo-különbséget gól-fölénybe
}

export const DEFAULT_LAMBDA_PARAMS: LambdaParams = {
  baseTotalGoals: 2.5,
  homeFieldElo: 65,
  eloToGoalScale: 0.0025,
};

/**
 * Elo-különbségből várható gólok. A gól-fölény (supremacy) az Elo-különbség
 * monoton függvénye; a total a baseTotalGoals köré szerveződik.
 */
export function eloToExpectedGoals(
  eloHome: number,
  eloAway: number,
  isNeutral: boolean,
  params: LambdaParams = DEFAULT_LAMBDA_PARAMS
): { lambdaHome: number; lambdaAway: number } {
  const homeAdv = isNeutral ? 0 : params.homeFieldElo;
  const eloDiff = (eloHome + homeAdv) - eloAway;

  // Gól-fölény: az Elo-különbség skálázva. tanh tartja értelmes tartományban.
  const supremacy = params.baseTotalGoals * Math.tanh(eloDiff * params.eloToGoalScale);

  const lambdaHome = Math.max(0.15, (params.baseTotalGoals + supremacy) / 2);
  const lambdaAway = Math.max(0.15, (params.baseTotalGoals - supremacy) / 2);
  return { lambdaHome, lambdaAway };
}
