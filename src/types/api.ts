// API-Football v3 válasz típusok
// Dokumentáció: https://www.api-football.com/documentation-v3

// --- Fixtures (mérkőzések) ---

export interface ApiFixtureStatus {
  long: string;
  short: string;
  elapsed: number | null;
}

export interface ApiFixturePeriods {
  first: number | null;
  second: number | null;
}

export interface ApiFixtureVenue {
  id: number | null;
  name: string | null;
  city: string | null;
}

export interface ApiFixtureItem {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: ApiFixturePeriods;
  venue: ApiFixtureVenue;
  status: ApiFixtureStatus;
}

export interface ApiLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string;
}

export interface ApiTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface ApiTeams {
  home: ApiTeam;
  away: ApiTeam;
}

export interface ApiGoals {
  home: number | null;
  away: number | null;
}

export interface ApiScoreDetail {
  home: number | null;
  away: number | null;
}

export interface ApiScore {
  halftime: ApiScoreDetail;
  fulltime: ApiScoreDetail;
  extratime: ApiScoreDetail | null;
  penalty: ApiScoreDetail | null;
}

export interface ApiFixtureResponse {
  fixture: ApiFixtureItem;
  league: ApiLeague;
  teams: ApiTeams;
  goals: ApiGoals;
  score: ApiScore;
}

// --- Odds ---

export interface ApiOddValue {
  value: string;
  odd: string;
}

export interface ApiOddBet {
  id: number;
  name: string;
  values: ApiOddValue[];
}

export interface ApiBookmaker {
  id: number;
  name: string;
  bets: ApiOddBet[];
}

export interface ApiOddsFixture {
  id: number;
  timezone: string;
  date: string;
  timestamp: number;
}

export interface ApiOddsLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
}

export interface ApiOddsResponse {
  fixture: ApiOddsFixture;
  league: ApiOddsLeague;
  teams: ApiTeams;
  update: string;
  bookmakers: ApiBookmaker[];
}

// --- Leagues ---

export interface ApiLeagueCoverageFixtures {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
}

export interface ApiLeagueCoverage {
  fixtures: ApiLeagueCoverageFixtures;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

export interface ApiSeason {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: ApiLeagueCoverage;
}

export interface ApiLeagueResponse {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: ApiSeason[];
}

// --- Statistics ---

export interface ApiStatisticItem {
  type: string;
  value: number | null;
}

export interface ApiTeamStatistics {
  team: ApiTeam;
  statistics: ApiStatisticItem[];
}

export interface ApiFixtureStatistics {
  fixture: ApiOddsFixture;
  league: ApiOddsLeague;
  teams: {
    home: ApiTeamStatistics;
    away: ApiTeamStatistics;
  };
}

// --- API válasz wrapper ---

export interface ApiResponse<T> {
  get: string;
  parameters: Record<string, unknown>;
  errors: string[] | Record<string, string>;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}

// --- Konvertált belső típusok ---

export interface ConvertedMatch {
  id: string;
  league: string;
  leagueFlag: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  time: string;
  isLive: boolean;
  homeScore?: number;
  awayScore?: number;
  aiConfidence: number;
  aiPick: string;
  markets: number;
  sport: string;
  fixtureId: number;
  leagueId: number;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface ConvertedOdds {
  fixtureId: number;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  bookmaker: string;
  updatedAt: string;
}

export interface MatchStatistics {
  fixtureId: number;
  shots: { home: number; away: number };
  shotsOnGoal: { home: number; away: number };
  possession: { home: number; away: number };
  xG: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  cards: { home: number; away: number };
  passes: { home: number; away: number };
}
