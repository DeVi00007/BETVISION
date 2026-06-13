/**
 * The Odds API integrációs réteg
 * VB 2026: élő odds, scores, odds előzmények, modell visszacsatolás
 */

const API_KEY = process.env.ODDS_API_KEY ?? '';
const BASE_URL = 'https://api.the-odds-api.com/v4';

/** Betöltéskor ellenőrizzük, hogy a kulcs rendelkezésre áll-e */
if (!API_KEY) {
  console.warn(
    '[oddsApiService] HIÁNYZIK az ODDS_API_KEY környezeti változó!\n' +
    '  1. Szerezz be egy API kulcsot: https://the-odds-api.com\n' +
    '  2. Állítsd be a server/.env-ben: ODDS_API_KEY=your_key_here\n' +
    '  3. Vagy állítsd be a környezetben export ODDS_API_KEY=...\n' +
    '  4. A szolgáltatás e nélkül nem fog éles adatokat visszaadni.'
  );
}

interface OddsApiMatch {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      outcomes: Array<{ name: string; price: number }>;
    }>;
  }>;
}

interface ScoresApiMatch {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  completed: boolean;
  scores: Array<{ name: string; score: number }> | null;
  last_update: string;
}

export interface PredictionRecord {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predicted: 'home' | 'draw' | 'away';
  marketOdds: number;
  modelProbability: number;
  stakeFt: number;
  confidence: number;
  actualResult: 'home' | 'draw' | 'away' | null;
  actualHomeScore: number | null;
  actualAwayScore: number | null;
  pnl: number | null;
  tradeDate: string;
  resolvedDate: string | null;
}

export interface OddsSnapshot {
  timestamp: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

let usageInfo = { requestsRemaining: 500, requestsUsed: 0 };
let predictionsDb: PredictionRecord[] = [];
let oddsHistory: Map<string, OddsSnapshot[]> = new Map();

function trackUsage(response: Response) {
  const remaining = response.headers.get('x-requests-remaining');
  const used = response.headers.get('x-requests-used');
  if (remaining) usageInfo.requestsRemaining = parseInt(remaining);
  if (used) usageInfo.requestsUsed = parseInt(used);
}

// ─── ÉLŐ ODDS ────────────────────────────────────────────────────────────

export async function fetchWorldCupOdds(): Promise<OddsApiMatch[]> {
  const url = `${BASE_URL}/sports/soccer_fifa_world_cup/odds/?apiKey=${API_KEY}&regions=eu,us&markets=h2h`;
  const response = await fetch(url);
  trackUsage(response);
  if (!response.ok) throw new Error(`Odds API hiba: ${response.status}`);
  return (await response.json()) as OddsApiMatch[];
}

export function getBestOdds(match: OddsApiMatch) {
  let bestHome = 0, bestDraw = 0, bestAway = 0, bestBookmaker = '';
  // Előnyben: Pinnacle, Betfair (pontosabb csapatnevek)
  const preferred = ['pinnacle', 'betfair', 'betmgm', 'fanduel', 'draftkings'];
  const sorted = [...match.bookmakers].sort((a, b) => {
    const ai = preferred.indexOf(a.key);
    const bi = preferred.indexOf(b.key);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  for (const bm of sorted) {
    const h2h = bm.markets.find((m: any) => m.key === 'h2h');
    if (!h2h || h2h.outcomes.length < 3) continue;
    const prices = h2h.outcomes.map((o: any) => ({ name: o.name, price: o.price }));
    // A három legmagasabb odds = underdog, középső = draw, legalacsonyabb = favorit
    prices.sort((a: any, b: any) => b.price - a.price);
    const high = prices[0]; // underdog
    const mid = prices[1];  // draw
    const low = prices[2];  // favorite
    // Párosítás: alacsony odds = erős csapat (home vagy away)
    // Próbáljuk match-elni a home_team és away_team névre
    const homeIsFavorite = match.home_team === low.name;
    if (homeIsFavorite) {
      bestHome = low.price; bestDraw = mid.price; bestAway = high.price;
    } else {
      bestHome = high.price; bestDraw = mid.price; bestAway = low.price;
    }
    bestBookmaker = bm.title;
    break; // Csak a legjobb bookmakert használjuk
  }
  return { homeTeam: match.home_team, awayTeam: match.away_team, homeOdds: bestHome, drawOdds: bestDraw, awayOdds: bestAway, bestBookmaker };
}

// ─── SCORES ───────────────────────────────────────────────────────────────

export async function fetchWorldCupScores(daysFrom: number = 2): Promise<ScoresApiMatch[]> {
  const url = `${BASE_URL}/sports/soccer_fifa_world_cup/scores/?apiKey=${API_KEY}&daysFrom=${daysFrom}`;
  const response = await fetch(url);
  trackUsage(response);
  if (!response.ok) throw new Error(`Scores API hiba: ${response.status}`);
  return (await response.json()) as ScoresApiMatch[];
}

export function parseScoreResult(match: ScoresApiMatch): 'home' | 'draw' | 'away' | null {
  if (!match.completed || !match.scores || match.scores.length < 2) return null;
  const home = match.scores[0]?.score || 0;
  const away = match.scores[1]?.score || 0;
  if (home > away) return 'home';
  if (away > home) return 'away';
  return 'draw';
}

// ─── PREDIKCIÓK KÖVETÉSE ─────────────────────────────────────────────────

export function recordPrediction(pred: Omit<PredictionRecord, 'actualResult' | 'actualHomeScore' | 'actualAwayScore' | 'pnl' | 'resolvedDate'>): void {
  predictionsDb.push({ ...pred, actualResult: null, actualHomeScore: null, actualAwayScore: null, pnl: null, resolvedDate: null });
}

export async function resolvePredictions(): Promise<{
  resolved: number;
  pnl: number;
  updatedPredictions: PredictionRecord[];
}> {
  const scores = await fetchWorldCupScores(2);
  let pnl = 0;
  let resolved = 0;

  for (const pred of predictionsDb) {
    if (pred.pnl !== null) continue;
    const match = scores.find((m: any) => m.home_team === pred.homeTeam && m.away_team === pred.awayTeam);
    if (!match || !match.completed || !match.scores) continue;

    const homeScore = match.scores[0]?.score || 0;
    const awayScore = match.scores[1]?.score || 0;
    const actual = parseScoreResult(match);

    pred.actualResult = actual;
    pred.actualHomeScore = homeScore;
    pred.actualAwayScore = awayScore;
    pred.resolvedDate = new Date().toISOString();
    pred.pnl = actual === pred.predicted
      ? Math.round(pred.stakeFt * (pred.marketOdds - 1))
      : -pred.stakeFt;
    pnl += pred.pnl;
    resolved++;
  }

  return { resolved, pnl, updatedPredictions: [...predictionsDb] };
}

export function getPredictions(): PredictionRecord[] {
  return [...predictionsDb];
}

// ─── ODDS ELŐZMÉNYEK ─────────────────────────────────────────────────────

export function trackOdds(matchId: string, homeOdds: number, drawOdds: number, awayOdds: number): void {
  const snap: OddsSnapshot = { timestamp: new Date().toISOString(), homeOdds, drawOdds, awayOdds };
  if (!oddsHistory.has(matchId)) oddsHistory.set(matchId, []);
  oddsHistory.get(matchId)!.push(snap);
  const hist = oddsHistory.get(matchId)!;
  if (hist.length > 20) hist.splice(0, hist.length - 20);
}

export function getOddsHistory(matchId: string): OddsSnapshot[] {
  return oddsHistory.get(matchId) || [];
}

export function getOddsMovement(matchId: string): { market: string; changePct: number } | null {
  const hist = oddsHistory.get(matchId);
  if (!hist || hist.length < 2) return null;
  const first = hist[0];
  const last = hist[hist.length - 1];
  const changes = [
    { market: 'home', change: last.homeOdds - first.homeOdds },
    { market: 'draw', change: last.drawOdds - first.drawOdds },
    { market: 'away', change: last.awayOdds - first.awayOdds },
  ];
  const max = changes.reduce((a, b) => Math.abs(a.change) > Math.abs(b.change) ? a : b);
  return { market: max.market, changePct: Math.round((Math.abs(max.change) / (['home','draw','away'].indexOf(max.market) === 0 ? first.homeOdds : max.market === 'draw' ? first.drawOdds : first.awayOdds)) * 100) };
}

export function recordOddsFromAnalysis(matches: OddsApiMatch[]): void {
  for (const m of matches) {
    const best = getBestOdds(m);
    trackOdds(m.id, best.homeOdds, best.drawOdds, best.awayOdds);
  }
}

// ─── TELJESÍTMÉNY ─────────────────────────────────────────────────────────

export function getPerformanceStats() {
  const resolved = predictionsDb.filter(p => p.pnl !== null);
  const wins = resolved.filter(p => (p.pnl || 0) > 0);
  const totalPnl = resolved.reduce((s, p) => s + (p.pnl || 0), 0);
  return {
    totalPredictions: predictionsDb.length,
    resolved: resolved.length,
    wins: wins.length,
    losses: resolved.length - wins.length,
    winRate: resolved.length > 0 ? Math.round((wins.length / resolved.length) * 100) : 0,
    totalPnl,
    avgPnlPerBet: resolved.length > 0 ? Math.round(totalPnl / resolved.length) : 0,
    bankroll: 100000 + totalPnl,
  };
}

export function getUsageStats() { return { ...usageInfo }; }
