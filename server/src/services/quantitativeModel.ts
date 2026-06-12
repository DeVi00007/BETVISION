/**
 * Kvantitatív Sportanalitikai Motor
 * Poisson-eloszlás, Elo-kalkuláció, Kelly-kritérium, Piaci hatékonyság
 *
 * BETVISION — World Cup 2026 Edition
 * Author: Hermes AI Quantitative Sports Analyst
 */

// ================================================================
// 1. ALAPVETŐ KONSTANSONOK ÉS TÍPUSOK
// ================================================================

export interface TeamStats {
  name: string;
  elo: number;
  attackStrength: number;   // λ támadó (Expected Goals per game)
  defenseStrength: number;  // λ védő (Expected Goals conceded per game)
  homeAdvantage?: number;   // hazai pálya előny (multiplier)
  recentForm: string[];     // utolsó 5 meccs eredménye ['W','D','L',...]
  tier1Missing: number;     // Tier 1 hiányzók száma
  tier2Missing: number;     // Tier 2 hiányzók száma
  pressureIndex: number;    // 0-1: mennyire kell győznie (1 = muszáj nyerni)
}

export interface MarketOdds {
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  over25Odds?: number;
  under25Odds?: number;
}

export interface MatchInput {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  marketOdds: MarketOdds;
  isNeutralVenue?: boolean;
  groupStage?: string;
}

export interface ProbabilityResult {
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  homeExpectedGoals: number;
  awayExpectedGoals: number;
}

export interface ValueBet {
  type: '1X2' | 'OVER_UNDER' | 'AH';
  selection: string;
  marketOdds: number;
  modelProbability: number;
  marketProbability: number;
  value: number;           // Value = (P × Odds) - 1
  kellyFraction: number;   // f* = (P × Odds - 1) / (Odds - 1)
  halfKellyPct: number;    // Half-Kelly a bankroll %-ában
  quarterKellyPct: number; // Quarter-Kelly a bankroll %-ában
  confidence: number;       // 0-100
}

export interface MatchAnalysis {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  cleanOdds: { homeProb: number; drawProb: number; awayProb: number; overround: number };
  rawProbabilities: ProbabilityResult;
  correctedProbabilities: ProbabilityResult;
  newsCorrections: string[];
  valueBets: ValueBet[];
  bestBet: ValueBet | null;
  kellyStakeFt: number;    // Ajánlott tét Ft-ban (100.000 Ft bankrollra)
}

// ================================================================
// 2. POISSON-ELOSZLÁS
// ================================================================

/**
 * Poisson valószínűség: P(X=k) = (λ^k × e^-λ) / k!
 */
function poissonPMF(lambda: number, k: number): number {
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * Poisson kumulatív: P(X <= k)
 */
function poissonCDF(lambda: number, k: number): number {
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += poissonPMF(lambda, i);
  }
  return sum;
}

// ================================================================
// 3. VÁRHATÓ GÓLOK KALKULÁCIÓJA (Elo-alapú)
// ================================================================

/**
 * Elo alapján várható gólarány számítása
 * A VB-n a hazai pálya előny csökkent, mert semleges vagy "fél-hazai" a helyszín
 */
function expectedEloScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Várható gólok számítása Elo + erősség alapján
 * World Cup átlagos gólszáma: ~2.5 per meccs (történelmi átlag)
 */
export function calculateExpectedGoals(
  home: TeamStats,
  away: TeamStats,
  isNeutralVenue: boolean = false
): { homeGoals: number; awayGoals: number } {
  const BASE_AVG_GOALS_TOTAL = 2.5; // VB átlag gól/meccs
  const HOME_ADVANTAGE = isNeutralVenue ? 1.0 : 1.12; // 12% hazai előny

  // Elo-alapú erősségi arány
  const homeEloExpected = expectedEloScore(home.elo, away.elo);

  // Támadó/védő erősség arány: attackStrength / defenseStrength
  // A defenseStrength itt a KAPOTT gólokat jelzi (alacsonyabb = jobb védelem)
  // Normalizáljuk az átlagos erősséghez képest (1.0 = átlagos)
  const homeAttackRatio = home.attackStrength / 1.0;
  const awayDefenseRatio = 1.0 / away.defenseStrength; // Fordított: jobb védelem = kevesebb kapott gól
  const awayAttackRatio = away.attackStrength / 1.0;
  const homeDefenseRatio = 1.0 / home.defenseStrength;

  // Várható gólok a Poisson modellhez
  // Alap: gólok elosztása Elo arány szerint, korrigálva támadó/védő erősséggel
  const homeBase = BASE_AVG_GOALS_TOTAL * homeEloExpected * HOME_ADVANTAGE;
  const awayBase = BASE_AVG_GOALS_TOTAL * (1 - homeEloExpected);

  // Erősség korrekció (a támadó/védő arányt az átlaghoz képest)
  const homeStrengthFactor = (homeAttackRatio + 1/awayDefenseRatio) / 2;
  const awayStrengthFactor = (awayAttackRatio + 1/homeDefenseRatio) / 2;

  const homeGoals = Math.max(0.3, homeBase * homeStrengthFactor * 0.85);
  const awayGoals = Math.max(0.2, awayBase * awayStrengthFactor * 0.85);

  // Keretinformációk korrekció
  const homeMissingCorrection = 1 - (home.tier1Missing * 0.15 + home.tier2Missing * 0.05);
  const awayMissingCorrection = 1 - (away.tier1Missing * 0.15 + away.tier2Missing * 0.05);

  // Nyomás faktor
  const homePressure = 1 + (home.pressureIndex * 0.08);
  const awayPressure = 1 + (away.pressureIndex * 0.08);

  return {
    homeGoals: Math.max(0.2, homeGoals * homeMissingCorrection * homePressure),
    awayGoals: Math.max(0.2, awayGoals * awayMissingCorrection * awayPressure),
  };
}

// ================================================================
// 4. VALÓSZÍNŰSÉG SZÁMÍTÁS POISSONNAL
// ================================================================

/**
 * Teljes valószínűségi mátrix létrehozása Poisson alapján
 * Kiszámolja 1X2, Over/Under, és pontos gólarányok valószínűségét
 */
export function calculateProbabilities(
  homeExpectedGoals: number,
  awayExpectedGoals: number,
  maxGoals: number = 8
): ProbabilityResult {
  // Valószínűségi mátrix
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let under25 = 0;

  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const prob = poissonPMF(homeExpectedGoals, h) * poissonPMF(awayExpectedGoals, a);
      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h + a > 2.5) over25 += prob;
      else under25 += prob;
    }
  }

  // Normalizálás (lebegőpontos hibák miatt)
  const sum = homeWin + draw + awayWin;
  return {
    homeWin: homeWin / sum,
    draw: draw / sum,
    awayWin: awayWin / sum,
    over25: over25,
    under25: under25,
    homeExpectedGoals,
    awayExpectedGoals,
  };
}

// ================================================================
// 5. PIACI ODDSOK TISZTÍTÁSA (Overround eltávolítás)
// ================================================================

/**
 * Bukmékeri margó eltávolítása az oddsokból
 * Visszaadja a "valódi" piaci valószínűségeket
 */
export function cleanMarketOdds(odds: MarketOdds): {
  homeProb: number;
  drawProb: number;
  awayProb: number;
  overround: number;
} {
  const rawHome = 1 / odds.homeOdds;
  const rawDraw = 1 / odds.drawOdds;
  const rawAway = 1 / odds.awayOdds;
  const overround = rawHome + rawDraw + rawAway;

  return {
    homeProb: rawHome / overround,   // Tisztított valószínűség
    drawProb: rawDraw / overround,
    awayProb: rawAway / overround,
    overround: (overround - 1) * 100, // %-ban kifejezett margó
  };
}

// ================================================================
// 6. ÉRTÉK ÉS KELLY-KRITÉRIUM
// ================================================================

/**
 * Value kalkuláció: Value = (P × Odds) - 1
 */
function calculateValue(modelProb: number, marketOdds: number): number {
  return (modelProb * marketOdds) - 1;
}

/**
 * Kelly-kritérium: f* = (P × Odds - 1) / (Odds - 1)
 * Half-Kelly-t használunk a variancia csökkentésére
 */
function calculateKelly(modelProb: number, marketOdds: number): {
  fullKelly: number;
  halfKelly: number;
  quarterKelly: number;
} {
  const fullKelly = (modelProb * marketOdds - 1) / (marketOdds - 1);
  return {
    fullKelly: Math.max(0, fullKelly),
    halfKelly: Math.max(0, fullKelly * 0.5),
    quarterKelly: Math.max(0, fullKelly * 0.25),
  };
}

// ================================================================
// 7. PIACI HATÉKONYSÁGI INDEX
// ================================================================

/**
 * Minél magasabb az index, annál valószínűbb, hogy a piac hatékony
 * (kevés value lehetőség). 1X2 piacok hatékonyabbak, gólpiacok kevésbé.
 */
function marketEfficiencyIndex(marketType: '1X2' | 'OVER_UNDER' | 'AH', overround: number): number {
  const baseEfficiency: Record<string, number> = {
    '1X2': 0.85,
    'OVER_UNDER': 0.70,
    'AH': 0.65,
  };
  // Alacsonyabb overround = hatékonyabb piac
  const overroundPenalty = Math.min(0.3, overround / 20);
  return Math.max(0.4, baseEfficiency[marketType] - overroundPenalty);
}

// ================================================================
// 8. HÍRKORREKCIÓS MOTOR
// ================================================================

export interface NewsCorrection {
  description: string;
  homeGoalAdjustment: number;   // λ korrekció (multiplier)
  awayGoalAdjustment: number;
  homeWinAdjustment: number;    // %-pont korrekció
  awayWinAdjustment: number;
}

/**
 * Tier 1 és Tier 2 hiányzók hatásának számszerűsítése
 */
export function calculateNewsCorrections(
  home: TeamStats,
  away: TeamStats
): NewsCorrection {
  const corrections: string[] = [];
  let homeGoalAdj = 1.0;
  let awayGoalAdj = 1.0;
  let homeWinAdj = 0;
  let awayWinAdj = 0;

  // Tier 1 hiányzók: támadó vs védő hatás
  if (home.tier1Missing > 0) {
    // Támadó Tier 1 hiány: -15% λ, -6% győzelmi esély
    homeGoalAdj *= (1 - home.tier1Missing * 0.15);
    homeWinAdj -= home.tier1Missing * 6;
    corrections.push(`🇨🇦 ${home.tier1Missing}x Tier 1 hiányzó: λ támadás -${home.tier1Missing * 15}%, győzelmi esély -${home.tier1Missing * 6}%`);
  }
  if (away.tier1Missing > 0) {
    awayGoalAdj *= (1 - away.tier1Missing * 0.15);
    awayWinAdj -= away.tier1Missing * 6;
    corrections.push(`🇧🇦 ${away.tier1Missing}x Tier 1 hiányzó: λ támadás -${away.tier1Missing * 15}%, győzelmi esély -${away.tier1Missing * 6}%`);
  }

  // Tier 2 hiányzók: -5% λ, -2.5% győzelmi esély
  if (home.tier2Missing > 0) {
    homeGoalAdj *= (1 - home.tier2Missing * 0.05);
    homeWinAdj -= home.tier2Missing * 2.5;
    corrections.push(`🇨🇦 ${home.tier2Missing}x Tier 2 hiányzó: λ támadás -${home.tier2Missing * 5}%`);
  }
  if (away.tier2Missing > 0) {
    awayGoalAdj *= (1 - away.tier2Missing * 0.05);
    awayWinAdj -= away.tier2Missing * 2.5;
    corrections.push(`🇧🇦 ${away.tier2Missing}x Tier 2 hiányzó: λ támadás -${away.tier2Missing * 5}%`);
  }

  return {
    description: corrections.join('; '),
    homeGoalAdjustment: homeGoalAdj,
    awayGoalAdjustment: awayGoalAdj,
    homeWinAdjustment: homeWinAdj,
    awayWinAdjustment: awayWinAdj,
  };
}

// ================================================================
// 9. TELJES MECCSELEMZÉS
// ================================================================

const FIXED_BANKROLL = 100_000; // Ft

/**
 * Teljes mérkőzés elemzés futtatása
 * 1. Alap valószínűségek (Poisson + Elo)
 * 2. Hír korrekció
 * 3. Piaci összehasonlítás
 * 4. Value + Kelly számítás
 * 5. Legjobb tipp kiválasztása
 */
export function analyzeMatch(
  matchInput: MatchInput,
  matchIndex: number = 0
): MatchAnalysis {
  const { homeTeam, awayTeam, marketOdds, isNeutralVenue, groupStage } = matchInput;

  // --- 1. ALAP VALÓSZÍNŰSÉGEK ---
  const baseGoals = calculateExpectedGoals(homeTeam, awayTeam, isNeutralVenue ?? false);
  const baseProbs = calculateProbabilities(baseGoals.homeGoals, baseGoals.awayGoals);

  // --- 2. HÍR KORREKCIÓ ---
  const newsCorr = calculateNewsCorrections(homeTeam, awayTeam);
  const correctedHomeGoals = baseGoals.homeGoals * newsCorr.homeGoalAdjustment;
  const correctedAwayGoals = baseGoals.awayGoals * newsCorr.awayGoalAdjustment;
  const correctedProbs = calculateProbabilities(correctedHomeGoals, correctedAwayGoals);

  // Győzelmi esély korrekció alkalmazása
  correctedProbs.homeWin = Math.max(0.01, Math.min(0.99,
    correctedProbs.homeWin + newsCorr.homeWinAdjustment / 100
  ));
  correctedProbs.awayWin = Math.max(0.01, Math.min(0.99,
    correctedProbs.awayWin + newsCorr.awayWinAdjustment / 100
  ));
  // Döntetlen normalizálása
  const corrSum = correctedProbs.homeWin + correctedProbs.draw + correctedProbs.awayWin;
  correctedProbs.homeWin /= corrSum;
  correctedProbs.draw /= corrSum;
  correctedProbs.awayWin /= corrSum;

  // --- 3. PIACI ODDS TISZTÍTÁS ---
  const cleanedMarket = cleanMarketOdds(marketOdds);

  // --- 4. VALUE ÉS KELLY ---
  const valueBets: ValueBet[] = [];

  // 1X2 piac
  const homeValue = calculateValue(correctedProbs.homeWin, marketOdds.homeOdds);
  const drawValue = calculateValue(correctedProbs.draw, marketOdds.drawOdds);
  const awayValue = calculateValue(correctedProbs.awayWin, marketOdds.awayOdds);

  const marketEfficiency = marketEfficiencyIndex('1X2', cleanedMarket.overround);

  // Csak +EV esetén ajánljuk, és piaci hatékonyság filter
  if (homeValue > 0.05 && homeValue * marketEfficiency > 0.03) {
    const kelly = calculateKelly(correctedProbs.homeWin, marketOdds.homeOdds);
    const confidence = Math.min(95, Math.round(50 + homeValue * 200));
    valueBets.push({
      type: '1X2',
      selection: `${homeTeam.name} (Hazai győzelem)`,
      marketOdds: marketOdds.homeOdds,
      modelProbability: correctedProbs.homeWin,
      marketProbability: cleanedMarket.homeProb,
      value: homeValue,
      kellyFraction: kelly.fullKelly,
      halfKellyPct: kelly.halfKelly * 100,
      quarterKellyPct: kelly.quarterKelly * 100,
      confidence,
    });
  }

  if (drawValue > 0.05 && drawValue * marketEfficiency > 0.03) {
    const kelly = calculateKelly(correctedProbs.draw, marketOdds.drawOdds);
    const confidence = Math.min(90, Math.round(50 + drawValue * 150));
    valueBets.push({
      type: '1X2',
      selection: 'Döntetlen (X)',
      marketOdds: marketOdds.drawOdds,
      modelProbability: correctedProbs.draw,
      marketProbability: cleanedMarket.drawProb,
      value: drawValue,
      kellyFraction: kelly.fullKelly,
      halfKellyPct: kelly.halfKelly * 100,
      quarterKellyPct: kelly.quarterKelly * 100,
      confidence,
    });
  }

  if (awayValue > 0.05 && awayValue * marketEfficiency > 0.03) {
    const kelly = calculateKelly(correctedProbs.awayWin, marketOdds.awayOdds);
    const confidence = Math.min(95, Math.round(50 + awayValue * 200));
    valueBets.push({
      type: '1X2',
      selection: `${awayTeam.name} (Vendég győzelem)`,
      marketOdds: marketOdds.awayOdds,
      modelProbability: correctedProbs.awayWin,
      marketProbability: cleanedMarket.awayProb,
      value: awayValue,
      kellyFraction: kelly.fullKelly,
      halfKellyPct: kelly.halfKelly * 100,
      quarterKellyPct: kelly.quarterKelly * 100,
      confidence,
    });
  }

  // Over/Under piac (ha van)
  if (marketOdds.over25Odds && marketOdds.under25Odds) {
    const overValue = calculateValue(correctedProbs.over25, marketOdds.over25Odds);
    const underValue = calculateValue(correctedProbs.under25, marketOdds.under25Odds);
    const goalMarketEff = marketEfficiencyIndex('OVER_UNDER', 5); // ~5% overround on goal markets

    if (overValue > 0.05 && overValue * goalMarketEff > 0.03) {
      const kelly = calculateKelly(correctedProbs.over25, marketOdds.over25Odds);
      valueBets.push({
        type: 'OVER_UNDER',
        selection: 'Over 2.5 gól',
        marketOdds: marketOdds.over25Odds,
        modelProbability: correctedProbs.over25,
        marketProbability: 1 / marketOdds.over25Odds,
        value: overValue,
        kellyFraction: kelly.fullKelly,
        halfKellyPct: kelly.halfKelly * 100,
      quarterKellyPct: kelly.quarterKelly * 100,
        confidence: Math.min(85, Math.round(50 + overValue * 150)),
      });
    }

    if (underValue > 0.05 && underValue * goalMarketEff > 0.03) {
      const kelly = calculateKelly(correctedProbs.under25, marketOdds.under25Odds);
      valueBets.push({
        type: 'OVER_UNDER',
        selection: 'Under 2.5 gól',
        marketOdds: marketOdds.under25Odds,
        modelProbability: correctedProbs.under25,
        marketProbability: 1 / marketOdds.under25Odds,
        value: underValue,
        kellyFraction: kelly.fullKelly,
        halfKellyPct: kelly.halfKelly * 100,
      quarterKellyPct: kelly.quarterKelly * 100,
        confidence: Math.min(85, Math.round(50 + underValue * 150)),
      });
    }
  }

  // --- 5. LEGJOBB TIPP ---
  // Rendezés value szerint csökkenően, a legmagasabb value + confidence kombináció
  valueBets.sort((a, b) => (b.value * b.confidence) - (a.value * a.confidence));
  const bestBet = valueBets.length > 0 ? valueBets[0] : null;

  // Kelly tét Ft-ban — Quarter-Kelly + max 8% bankroll cap
  const MAX_STAKE_PCT = 8; // % of bankroll
  const kellyStakeFt = bestBet
    ? Math.min(
        Math.round(FIXED_BANKROLL * bestBet.quarterKellyPct / 100),
        Math.round(FIXED_BANKROLL * MAX_STAKE_PCT / 100)
      )
    : 0;

  // Korrekciós leírások
  const newsStrings: string[] = [];
  if (homeTeam.tier1Missing > 0) {
    newsStrings.push(`${homeTeam.name}: ${homeTeam.tier1Missing}x Tier 1 hiányzó`);
  }
  if (homeTeam.tier2Missing > 0) {
    newsStrings.push(`${homeTeam.name}: ${homeTeam.tier2Missing}x Tier 2 hiányzó`);
  }
  if (awayTeam.tier1Missing > 0) {
    newsStrings.push(`${awayTeam.name}: ${awayTeam.tier1Missing}x Tier 1 hiányzó`);
  }
  if (awayTeam.tier2Missing > 0) {
    newsStrings.push(`${awayTeam.name}: ${awayTeam.tier2Missing}x Tier 2 hiányzó`);
  }
  if (homeTeam.pressureIndex > 0.7) {
    newsStrings.push(`${homeTeam.name} nyomás alatt: győzelem kényszer (PI: ${(homeTeam.pressureIndex * 100).toFixed(0)}%)`);
  }
  if (awayTeam.pressureIndex > 0.7) {
    newsStrings.push(`${awayTeam.name} nyomás alatt: győzelem kényszer (PI: ${(awayTeam.pressureIndex * 100).toFixed(0)}%)`);
  }

  return {
    matchId: `wc-2026-${matchIndex + 1}`,
    homeTeam: homeTeam.name,
    awayTeam: awayTeam.name,
    league: groupStage ? `VB Csoportkör - ${groupStage}` : 'VB Csoportkör',
    cleanOdds: cleanedMarket,
    rawProbabilities: baseProbs,
    correctedProbabilities: correctedProbs,
    newsCorrections: newsStrings,
    valueBets,
    bestBet,
    kellyStakeFt,
  };
}
