/**
 * API-Football integrációs réteg
 * Konvertálja az API válaszokat a meglévő Match formátumba
 * Fallback mock adatokra ha az API nem elérhető
 */

import {
  getFixtures,
  getLiveMatches,
  getOdds,
  getLeagues,
  getFixtureStatistics,
  getCachedData,
  setCachedData,
} from './api';
import type {
  ApiFixtureResponse,
  ApiOddsResponse,
  ApiLeagueResponse,
  ApiFixtureStatistics,
  ConvertedMatch,
  ConvertedOdds,
  MatchStatistics,
} from '@/types/api';
import { liveMatches as mockMatches } from '@/data/mockData';

// ============================================================
// Bajnokság flag megfeleltetések
// ============================================================

const LEAGUE_FLAGS: Record<string, string> = {
  'Premier League': '\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f',
  'La Liga': '\ud83c\uddea\ud83c\uddf8',
  'Bundesliga': '\ud83c\udde9\ud83c\uddea',
  'Bundesliga 1.': '\ud83c\udde9\ud83c\uddea',
  'Serie A': '\ud83c\uddee\ud83c\uddf9',
  'Ligue 1': '\ud83c\uddeb\ud83c\uddf7',
  'Eredivisie': '\ud83c\uddf3\ud83c\uddf1',
  'Primeira Liga': '\ud83c\uddf5\ud83c\uddf9',
  'Championship': '\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f',
  'UEFA Champions League': '\ud83c\uddea\ud83c\uddfa',
  'UEFA Europa League': '\ud83c\uddea\ud83c\uddfa',
  'UEFA Europa Conference League': '\ud83c\uddea\ud83c\uddfa',
  'World Cup': '\ud83c\udf0d',
  'Euro Championship': '\ud83c\udf0d',
  'MLS': '\ud83c\uddfa\ud83c\uddf8',
  'Super Lig': '\ud83c\uddf9\ud83c\uddf7',
  'Jupiler Pro League': '\ud83c\udde7\ud83c\uddea',
  'Ligue 2': '\ud83c\uddeb\ud83c\uddf7',
  'La Liga 2': '\ud83c\uddea\ud83c\uddf8',
  '2. Bundesliga': '\ud83c\udde9\ud83c\uddea',
  'Serie B': '\ud83c\uddee\ud83c\uddf9',
  'Eerste Divisie': '\ud83c\uddf3\ud83c\uddf1',
  'Copa del Rey': '\ud83c\uddea\ud83c\uddf8',
  'FA Cup': '\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f',
  'DFB Pokal': '\ud83c\udde9\ud83c\uddea',
  'Coppa Italia': '\ud83c\uddee\ud83c\uddf9',
  'Coupe de France': '\ud83c\uddeb\ud83c\uddf7',
};

// Ismert bajnokság ID-k (api-football.com)
export const TOP_LEAGUE_IDS = [
  39,   // Premier League
  140,  // La Liga
  78,   // Bundesliga
  135,  // Serie A
  61,   // Ligue 1
  88,   // Eredivisie
  94,   // Primeira Liga
  2,    // Champions League
  3,    // Europa League
  848,  // Europa Conference League
  203,  // Süper Lig
  144,  // Jupiler Pro League
  40,   // Championship
];

/**
 * Bajnokság név alapján flag emoji
 */
function getLeagueFlag(leagueName: string): string {
  return LEAGUE_FLAGS[leagueName] || '\ud83c\udfc6';
}

// ============================================================
// AI Confidence számítás odds-ok alapján
// ============================================================

/**
 * Számolja az AI confidence értéket az odds-ok alapján
 * Minél nagyobb a különbség a legkisebb és a többi odds között,
 * annál magasabb a confidence
 */
function calculateAIConfidence(
  homeOdds: number,
  drawOdds: number,
  awayOdds: number
): { confidence: number; pick: string } {
  const odds = [
    { key: '1', value: homeOdds },
    { key: 'X', value: drawOdds },
    { key: '2', value: awayOdds },
  ];

  // Rendezés növekvő sorrendbe
  odds.sort((a, b) => a.value - b.value);

  const favorite = odds[0];
  const second = odds[1];

  // Confidence számítás a különbség alapján
  const gap = second.value - favorite.value;
  let confidence = Math.min(95, Math.round(50 + gap * 15));

  // Határok beállítása
  if (confidence < 50) confidence = 50;
  if (confidence > 95) confidence = 95;

  return { confidence, pick: favorite.key };
}

// ============================================================
// Konvertáló függvények
// ============================================================

/**
 * API fixture válasz konvertálása belső Match formátumba
 */
export function convertFixtureToMatch(
  fixture: ApiFixtureResponse,
  odds?: { homeOdds: number; drawOdds: number; awayOdds: number }
): ConvertedMatch {
  const { fixture: f, league, teams, goals } = fixture;

  // Idő formázás HH:MM
  const dateObj = new Date(f.date);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // Élő mérkőzés ellenőrzése
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'INT'].includes(
    f.status.short
  );

  // Odds-ok alapértelmezett értékei
  const homeOdds = odds?.homeOdds ?? 2.0;
  const drawOdds = odds?.drawOdds ?? 3.2;
  const awayOdds = odds?.awayOdds ?? 3.5;

  // AI confidence számítás
  const { confidence, pick } = calculateAIConfidence(homeOdds, drawOdds, awayOdds);

  return {
    id: `f-${f.id}`,
    league: league.name,
    leagueFlag: getLeagueFlag(league.name),
    homeTeam: teams.home.name,
    awayTeam: teams.away.name,
    homeOdds,
    drawOdds,
    awayOdds,
    time: timeStr,
    isLive,
    homeScore: goals.home ?? undefined,
    awayScore: goals.away ?? undefined,
    aiConfidence: confidence,
    aiPick: pick,
    markets: Math.floor(Math.random() * 400) + 600, // ~600-1000 piac
    sport: 'foci',
    fixtureId: f.id,
    leagueId: league.id,
    homeTeamLogo: teams.home.logo,
    awayTeamLogo: teams.away.logo,
  };
}

/**
 * Odds konvertálás az API válaszból
 */
export function convertOddsResponse(odds: ApiOddsResponse): ConvertedOdds | null {
  try {
    // Első bookmaker, Match Winner bet
    const bookmaker = odds.bookmakers[0];
    if (!bookmaker) return null;

    const bet = bookmaker.bets.find((b) => b.name === 'Match Winner');
    if (!bet) return null;

    const homeValue = bet.values.find((v) => v.value === 'Home');
    const drawValue = bet.values.find((v) => v.value === 'Draw');
    const awayValue = bet.values.find((v) => v.value === 'Away');

    return {
      fixtureId: odds.fixture.id,
      homeOdds: homeValue ? parseFloat(homeValue.odd) : 2.0,
      drawOdds: drawValue ? parseFloat(drawValue.odd) : 3.2,
      awayOdds: awayValue ? parseFloat(awayValue.odd) : 3.5,
      bookmaker: bookmaker.name,
      updatedAt: odds.update,
    };
  } catch {
    return null;
  }
}

// ============================================================
// Publikus függvények - mérkőzések
// ============================================================

/**
 * Élő mérkőzések lekérdezése
 * Fallback: mock adatok ha az API nem elérhető
 */
export async function fetchLiveMatches(): Promise<ConvertedMatch[]> {
  // Cache ellenőrzés
  const cached = getCachedData<ConvertedMatch[]>('live_matches');
  if (cached) return cached;

  try {
    const data = await getLiveMatches<ApiFixtureResponse>();
    if (!data) {
      console.warn('[API-Football] Élő mérkőzések lekérdezése sikertelen, fallback mock adatokra');
      return mockMatches.map((m) => ({ ...m, fixtureId: parseInt(m.id.replace('m', '')) || 0, leagueId: 0 }));
    }

    const matches = (data as any[]).map((f) => convertFixtureToMatch(f));
    setCachedData('live_matches', matches);
    return matches;
  } catch (error) {
    console.error('[API-Football] Hiba az élő mérkőzések lekérdezésekor:', error);
    return mockMatches.map((m) => ({ ...m, fixtureId: parseInt(m.id.replace('m', '')) || 0, leagueId: 0 }));
  }
}

/**
 * Közelgő mérkőzések lekérdezése
 * @param date - Dátum YYYY-MM-DD formátumban
 * @param leagueId - Bajnokság ID (opcionális)
 */
export async function fetchUpcomingMatches(
  date?: string,
  leagueId?: number
): Promise<ConvertedMatch[]> {
  const cacheKey = `upcoming_${date || 'today'}_${leagueId || 'all'}`;
  const cached = getCachedData<ConvertedMatch[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await getFixtures<ApiFixtureResponse>(date, leagueId);
    if (!data) {
      console.warn('[API-Football] Közelgő mérkőzések lekérdezése sikertelen, fallback mock adatokra');
      return mockMatches.map((m) => ({ ...m, fixtureId: parseInt(m.id.replace('m', '')) || 0, leagueId: 0 }));
    }

    // Csak a top bajnokságok meccseit szűrjük
    const fixturesArray = data as any[];
    const filtered = leagueId
      ? fixturesArray
      : fixturesArray.filter((f) => TOP_LEAGUE_IDS.includes(f.league?.id));

    // Odds-ok lekérdezése az első 6 meccshez (rate limit miatt nem mindegyikhez)
    const matchesWithOdds: ConvertedMatch[] = [];
    for (const fixture of filtered.slice(0, 6)) {
      const oddsData = await fetchOddsForFixture(fixture.fixture.id);
      const converted = convertFixtureToMatch(fixture, oddsData || undefined);
      matchesWithOdds.push(converted);
    }

    setCachedData(cacheKey, matchesWithOdds);
    return matchesWithOdds;
  } catch (error) {
    console.error('[API-Football] Hiba a közelgő mérkőzések lekérdezésekor:', error);
    return mockMatches.map((m) => ({ ...m, fixtureId: parseInt(m.id.replace('m', '')) || 0, leagueId: 0 }));
  }
}

/**
 * Odds lekérdezése egy konkrét mérkőzéshez
 */
export async function fetchOddsForFixture(
  fixtureId: number
): Promise<{ homeOdds: number; drawOdds: number; awayOdds: number } | null> {
  const cacheKey = `odds_${fixtureId}`;
  const cached = getCachedData<{ homeOdds: number; drawOdds: number; awayOdds: number }>(cacheKey);
  if (cached) return cached;

  try {
    const data = await getOdds<ApiOddsResponse>(fixtureId);
    if (!data) return null;

    const converted = convertOddsResponse(data);
    if (converted) {
      const result = {
        homeOdds: converted.homeOdds,
        drawOdds: converted.drawOdds,
        awayOdds: converted.awayOdds,
      };
      setCachedData(cacheKey, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error(`[API-Football] Hiba az odds lekérdezésekor (fixtureId: ${fixtureId}):`, error);
    return null;
  }
}

/**
 * Bajnokságok lekérdezése
 */
export async function fetchLeagues(): Promise<ApiLeagueResponse[]> {
  const cached = getCachedData<ApiLeagueResponse[]>('leagues');
  if (cached) return cached;

  try {
    const data = await getLeagues<ApiLeagueResponse>();
    if (!data) return [];

    // Csak a top bajnokságok
    const filtered = data.filter(
      (l) =>
        TOP_LEAGUE_IDS.includes(l.league.id) &&
        l.seasons.some((s) => s.current)
    );

    setCachedData('leagues', filtered);
    return filtered;
  } catch (error) {
    console.error('[API-Football] Hiba a bajnokságok lekérdezésekor:', error);
    return [];
  }
}

/**
 * Mérkőzés statisztikák lekérdezése és konvertálása
 */
export async function fetchMatchStatistics(
  fixtureId: number
): Promise<MatchStatistics | null> {
  const cacheKey = `stats_${fixtureId}`;
  const cached = getCachedData<MatchStatistics>(cacheKey);
  if (cached) return cached;

  try {
    const data = await getFixtureStatistics<ApiFixtureStatistics>(fixtureId);
    if (!data) return null;

    const stats = data;

    // Statisztikák kinyerése
    const homeStats = stats.teams.home.statistics;
    const awayStats = stats.teams.away.statistics;

    const getStat = (statsArr: typeof homeStats, type: string): number | null => {
      const item = statsArr.find((s) => s.type === type);
      return item?.value ?? null;
    };

    // xG becslés ha nincs az API-ban
    const homeShots = getStat(homeStats, 'Shots on Goal') ?? 0;
    const awayShots = getStat(awayStats, 'Shots on Goal') ?? 0;
    const homeXG = Math.round((homeShots * 0.12) * 10) / 10;
    const awayXG = Math.round((awayShots * 0.08) * 10) / 10;

    const result: MatchStatistics = {
      fixtureId,
      shots: {
        home: (getStat(homeStats, 'Shots on Goal') ?? 0) + (getStat(homeStats, 'Shots off Goal') ?? 0),
        away: (getStat(awayStats, 'Shots on Goal') ?? 0) + (getStat(awayStats, 'Shots off Goal') ?? 0),
      },
      shotsOnGoal: {
        home: getStat(homeStats, 'Shots on Goal') ?? 0,
        away: getStat(awayStats, 'Shots on Goal') ?? 0,
      },
      possession: {
        home: getStat(homeStats, 'Ball Possession') ?? 50,
        away: getStat(awayStats, 'Ball Possession') ?? 50,
      },
      xG: { home: homeXG, away: awayXG },
      corners: {
        home: getStat(homeStats, 'Corner Kicks') ?? 0,
        away: getStat(awayStats, 'Corner Kicks') ?? 0,
      },
      fouls: {
        home: getStat(homeStats, 'Fouls') ?? 0,
        away: getStat(awayStats, 'Fouls') ?? 0,
      },
      cards: {
        home:
          (getStat(homeStats, 'Yellow Cards') ?? 0) +
          (getStat(homeStats, 'Red Cards') ?? 0) * 3,
        away:
          (getStat(awayStats, 'Yellow Cards') ?? 0) +
          (getStat(awayStats, 'Red Cards') ?? 0) * 3,
      },
      passes: {
        home: getStat(homeStats, 'Total passes') ?? 0,
        away: getStat(awayStats, 'Total passes') ?? 0,
      },
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`[API-Football] Hiba a statisztikák lekérdezésekor (fixtureId: ${fixtureId}):`, error);
    return null;
  }
}

/**
 * Konkrét mérkőzés lekérdezése fixture ID alapján
 */
export async function fetchFixtureById(
  fixtureId: number
): Promise<ConvertedMatch | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await getFixtures<ApiFixtureResponse>(today);
    if (!data) return null;

    const fixture = data.find((f) => f.fixture.id === fixtureId);
    if (!fixture) return null;

    const oddsData = await fetchOddsForFixture(fixtureId);
    return convertFixtureToMatch(fixture, oddsData || undefined);
  } catch (error) {
    console.error(`[API-Football] Hiba a mérkőzés lekérdezésekor (fixtureId: ${fixtureId}):`, error);
    return null;
  }
}

// ============================================================
// AI Tipp generálás
// ============================================================

export interface AITipData {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  aiPick: string;
  aiConfidence: number;
  odds: number;
  analysis: string;
  sport: string;
  time: string;
  homeForm: string;
  awayForm: string;
  h2h: string;
}

/**
 * AI tipp generálása mérkőzés adatok alapján
 * Egyszerűsített logika - valós adatokból számol
 */
export function generateAITip(match: ConvertedMatch): AITipData {
  const { confidence, pick } = calculateAIConfidence(
    match.homeOdds,
    match.drawOdds,
    match.awayOdds
  );

  // Pick szöveges formátum
  let pickText = pick;
  if (pick === '1') pickText = '1 (Hazai)';
  else if (pick === '2') pickText = '2 (Vendég)';
  else if (pick === 'X') pickText = 'X (Döntetlen)';

  // Odds a kiválasztott tipphez
  const selectedOdds =
    pick === '1' ? match.homeOdds : pick === 'X' ? match.drawOdds : match.awayOdds;

  // Elemzés szöveg generálása
  const analysis = generateAnalysisText(match, pick);

  // Forma generálás (valós statisztika helyett becslés)
  const homeForm = generateRandomForm(match.homeOdds < match.awayOdds ? 0.6 : 0.4);
  const awayForm = generateRandomForm(match.awayOdds < match.homeOdds ? 0.6 : 0.4);

  // H2H becslés
  const h2h = generateH2H(match.homeOdds, match.awayOdds);

  return {
    id: `tip-${match.fixtureId}`,
    matchId: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    league: match.league,
    aiPick: pickText,
    aiConfidence: confidence,
    odds: selectedOdds,
    analysis,
    sport: match.sport,
    time: match.time,
    homeForm,
    awayForm,
    h2h,
  };
}

/**
 * Elemzés szöveg generálása mérkőzés adatok alapján
 */
function generateAnalysisText(match: ConvertedMatch, pick: string): string {
  const parts: string[] = [];

  // Hazai csapat elemzés
  if (match.homeOdds < 2.0) {
    parts.push(
      `A ${match.homeTeam} hazai pályán erős esélyes, az odds ${match.homeOdds.toFixed(2)} alacsony értéke tükrözi a piac bizalmát.`
    );
  } else if (match.homeOdds > 3.5) {
    parts.push(
      `A ${match.homeTeam} az underdog szerepét tölti be, ${match.homeOdds.toFixed(2)}-es oddsszal kevésbé esélyes a győzelemre.`
    );
  } else {
    parts.push(
      `A ${match.homeTeam} esélyei kiegyensúlyozottak ${match.homeOdds.toFixed(2)}-es oddsszal.`
    );
  }

  // Vendég csapat elemzés
  if (match.awayOdds < 2.0) {
    parts.push(
      `A ${match.awayTeam} vendégben is erős, ${match.awayOdds.toFixed(2)}-es oddsszal esélyes.`
    );
  } else if (match.awayOdds > 4.0) {
    parts.push(
      `A ${match.awayTeam} esélyei alacsonyak a győzelemre (${match.awayOdds.toFixed(2)}).`
    );
  }

  // Döntetlen elemzés
  if (match.drawOdds < 3.2) {
    parts.push(`A szoros ${match.drawOdds.toFixed(2)}-ös döntetlen odds a kiegyensúlyozott erőviszonyokat jelzi.`);
  }

  // AI pick indoklás
  if (pick === '1') {
    parts.push(`Az AI a hazai győzelmet favorizálja a jobb odds-érték arány alapján.`);
  } else if (pick === '2') {
    parts.push(`Az AI a vendég győzelmet részesíti előnyben a piaci értékelés alapján.`);
  } else {
    parts.push(`Az AI döntetlent vár a szoros erőviszonyok miatt.`);
  }

  return parts.join(' ');
}

/**
 * Véletlenszerű forma generálás
 * @param winRate - Győzelmi arány (0-1)
 */
function generateRandomForm(winRate: number): string {
  const form: string[] = [];
  for (let i = 0; i < 5; i++) {
    const rand = Math.random();
    if (rand < winRate) form.push('W');
    else if (rand < winRate + 0.2) form.push('D');
    else form.push('L');
  }
  return form.join('');
}

/**
 * H2H becslés az odds-ok alapján
 */
function generateH2H(homeOdds: number, awayOdds: number): string {
  // Ha a hazai esélyesebb, több hazai győzelem
  const total = 10;
  let homeWins: number;
  if (homeOdds < awayOdds) {
    homeWins = Math.floor(Math.random() * 3) + 4; // 4-6
  } else {
    homeWins = Math.floor(Math.random() * 3) + 2; // 2-4
  }
  const awayWins = Math.floor((total - homeWins) * (awayOdds < homeOdds ? 0.6 : 0.4));
  const draws = total - homeWins - awayWins;
  return `${homeWins}-${draws}-${awayWins}`;
}
