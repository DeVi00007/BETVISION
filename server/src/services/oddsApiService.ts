/**
 * The Odds API integrációs réteg
 * Valós odds-ok a VB 2026 meccseire
 * Free tier: 500 request/hó (~16/nap)
 */

const API_KEY='a8e5531b0522a4fdf01a696cbab69cff';
const BASE_URL = 'https://api.the-odds-api.com/v4';

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
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

interface OddsApiUsage {
  requestsRemaining: number;
  requestsUsed: number;
}

let usageInfo: OddsApiUsage = { requestsRemaining: 500, requestsUsed: 0 };

/**
 * VB meccsek lekérése valós odds-okkal
 * Használat: regions=eu&markets=h2h,spreads,totals
 */
export async function fetchWorldCupOdds(): Promise<OddsApiMatch[]> {
  const url = `${BASE_URL}/sports/soccer_fifa_world_cup/odds/?apiKey=${API_KEY}&regions=eu,us&markets=h2h`;
  
  const response = await fetch(url);
  
  // Track API usage from headers
  const remaining = response.headers.get('x-requests-remaining');
  const used = response.headers.get('x-requests-used');
  if (remaining) usageInfo.requestsRemaining = parseInt(remaining);
  if (used) usageInfo.requestsUsed = parseInt(used);
  
  if (!response.ok) {
    throw new Error(`Odds API hiba: ${response.status} - ${await response.text()}`);
  }
  
  const data = await response.json() as OddsApiMatch[];
  return data;
}

/**
 * Egy adott meccs odds-ainak lekérése
 */
export async function fetchMatchOdds(matchId: string): Promise<OddsApiMatch | null> {
  const matches = await fetchWorldCupOdds();
  return matches.find(m => m.id === matchId) || null;
}

/**
 * Megadja a legjobb odds-ot az összes bookmaker közül
 */
export function getBestOdds(match: OddsApiMatch): {
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  bestBookmaker: string;
} {
  let bestHome = 0, bestDraw = 0, bestAway = 0;
  let bestBookmaker = '';

  for (const bm of match.bookmakers) {
    const h2h = bm.markets.find(m => m.key === 'h2h');
    if (!h2h) continue;

    const outcomes: Record<string, number> = {};
    for (const o of h2h.outcomes) {
      outcomes[o.name] = o.price;
    }

    // Find home team name, draw, away team name
    const homeName = match.home_team;
    const awayName = match.away_team;
    
    // The outcomes might use different naming
    let home = outcomes[homeName] || 0;
    let away = outcomes[awayName] || 0;
    let draw = outcomes['Draw'] || 0;

    if (home > bestHome) {
      bestHome = home;
      bestDraw = draw;
      bestAway = away;
      bestBookmaker = bm.title;
    }
  }

  return {
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    homeOdds: bestHome,
    drawOdds: bestDraw,
    awayOdds: bestAway,
    bestBookmaker,
  };
}

/**
 * API használati statisztika
 */
export function getUsageStats(): OddsApiUsage {
  return { ...usageInfo };
}
