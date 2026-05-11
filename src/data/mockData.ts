export interface Match {
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
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface AITip {
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

export interface LeaderboardEntry {
  rank: number;
  username: string;
  profit: number;
  winRate: number;
  avgOdds: number;
  streak: number;
  isPremium: boolean;
  avatar: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  isPremium: boolean;
  rating: number;
}

export const liveMatches: Match[] = [
  {
    id: "m1",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeTeam: "West Ham",
    awayTeam: "Arsenal",
    homeOdds: 5.75,
    drawOdds: 4.40,
    awayOdds: 1.61,
    time: "23:30",
    isLive: false,
    aiConfidence: 78,
    aiPick: "2",
    markets: 832,
    sport: "foci",
  },
  {
    id: "m2",
    league: "La Liga",
    leagueFlag: "🇪🇸",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    homeOdds: 1.66,
    drawOdds: 5.00,
    awayOdds: 4.40,
    time: "03:00",
    isLive: true,
    homeScore: 2,
    awayScore: 1,
    aiConfidence: 82,
    aiPick: "1",
    markets: 938,
    sport: "foci",
  },
  {
    id: "m3",
    league: "Premier League",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeTeam: "Burnley",
    awayTeam: "Aston Villa",
    homeOdds: 5.50,
    drawOdds: 4.20,
    awayOdds: 1.60,
    time: "21:00",
    isLive: false,
    aiConfidence: 71,
    aiPick: "2",
    markets: 815,
    sport: "foci",
  },
  {
    id: "m4",
    league: "Bundesliga 1.",
    leagueFlag: "🇩🇪",
    homeTeam: "Bayern München",
    awayTeam: "Dortmund",
    homeOdds: 1.45,
    drawOdds: 5.20,
    awayOdds: 6.75,
    time: "20:30",
    isLive: false,
    aiConfidence: 88,
    aiPick: "1",
    markets: 920,
    sport: "foci",
  },
  {
    id: "m5",
    league: "Serie A",
    leagueFlag: "🇮🇹",
    homeTeam: "AC Milan",
    awayTeam: "Juventus",
    homeOdds: 2.30,
    drawOdds: 3.20,
    awayOdds: 3.40,
    time: "20:45",
    isLive: false,
    aiConfidence: 65,
    aiPick: "1",
    markets: 780,
    sport: "foci",
  },
  {
    id: "m6",
    league: "Ligue 1",
    leagueFlag: "🇫🇷",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    homeOdds: 1.35,
    drawOdds: 5.50,
    awayOdds: 8.25,
    time: "22:00",
    isLive: false,
    aiConfidence: 91,
    aiPick: "1",
    markets: 850,
    sport: "foci",
  },
];

export const aiTips: AITip[] = [
  {
    id: "t1",
    matchId: "m4",
    homeTeam: "Bayern München",
    awayTeam: "Dortmund",
    league: "Bundesliga 1.",
    aiPick: "1 (Hazai)",
    aiConfidence: 88,
    odds: 1.45,
    analysis: "A Bayern hazai pályán rendkívül erős, az utóbbi 10 hazai meccsükből 9-et megnyertek. A Dortmund védelme gyenge formában van, az utóbbi 5 meccsükön 9 gólt kaptak. A Bayern támadói (Kane, Musiala) kiváló formában játszanak.",
    sport: "foci",
    time: "20:30",
    homeForm: "WWWDW",
    awayForm: "WLDWL",
    h2h: "7-2-1",
  },
  {
    id: "t2",
    matchId: "m6",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    aiPick: "1 (Hazai)",
    aiConfidence: 91,
    odds: 1.35,
    analysis: "A Le Classique-ban a PSG hazai pályán szinte verhetetlen. Dembélé és Barcola formája kimagasló. A Marseille 3 kulcsjátékosát is nélkülözi sérülés miatt.",
    sport: "foci",
    time: "22:00",
    homeForm: "WWWWW",
    awayForm: "LLWDL",
    h2h: "6-3-1",
  },
  {
    id: "t3",
    matchId: "m1",
    homeTeam: "West Ham",
    awayTeam: "Arsenal",
    league: "Premier League",
    aiPick: "2 (Vendég)",
    aiConfidence: 78,
    odds: 1.61,
    analysis: "Az Arsenal bajnoki címért harcol és minden pont számít. Saka és Ødegaard remek formában vannak. A West Ham középszerű szezont fut és nincs tétje a meccsnek.",
    sport: "foci",
    time: "23:30",
    homeForm: "LLWDL",
    awayForm: "WWWDW",
    h2h: "1-2-7",
  },
  {
    id: "t4",
    matchId: "m2",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    league: "La Liga",
    aiPick: "1 (Hazai)",
    aiConfidence: 82,
    odds: 1.66,
    analysis: "El Clásico a Camp Nou-ban. A Barcelona hazai pályán erős, Lewandowski és Yamal kimagasló formában. A Real Madridnak Bellingham sérülése nagy veszteség.",
    sport: "foci",
    time: "03:00",
    homeForm: "WDWWW",
    awayForm: "WWDLW",
    h2h: "4-3-3",
  },
  {
    id: "t5",
    matchId: "m5",
    homeTeam: "AC Milan",
    awayTeam: "Juventus",
    league: "Serie A",
    aiPick: "1X (Hazai vagy Döntetlen)",
    aiConfidence: 72,
    odds: 1.42,
    analysis: "A Milan a San Siro-ban stabil, a Juventus támadójátéka hagy kívánni valót maga után. A döntetlen valószínű, de a Milan otthoni előnye döntő lehet.",
    sport: "foci",
    time: "20:45",
    homeForm: "WDWLW",
    awayForm: "DDWDL",
    h2h: "3-4-3",
  },
];

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "TippMester87", profit: 142.5, winRate: 72, avgOdds: 1.95, streak: 8, isPremium: true, avatar: "TM" },
  { rank: 2, username: "FociGuru", profit: 128.3, winRate: 68, avgOdds: 2.10, streak: 5, isPremium: true, avatar: "FG" },
  { rank: 3, username: "AnalitikusPro", profit: 115.7, winRate: 71, avgOdds: 1.88, streak: 4, isPremium: true, avatar: "AP" },
  { rank: 4, username: "Tippszaki", profit: 98.2, winRate: 65, avgOdds: 1.92, streak: 3, isPremium: false, avatar: "TZ" },
  { rank: 5, username: "BetHunter", profit: 87.4, winRate: 63, avgOdds: 2.05, streak: 6, isPremium: true, avatar: "BH" },
  { rank: 6, username: "OddsKing", profit: 76.8, winRate: 61, avgOdds: 1.98, streak: 2, isPremium: false, avatar: "OK" },
  { rank: 7, username: "StatSzaki", profit: 71.3, winRate: 66, avgOdds: 1.85, streak: 3, isPremium: false, avatar: "SS" },
  { rank: 8, username: "TippmixHero", profit: 65.9, winRate: 59, avgOdds: 2.15, streak: 1, isPremium: true, avatar: "TH" },
  { rank: 9, username: "ValueBetPro", profit: 58.1, winRate: 64, avgOdds: 1.90, streak: 4, isPremium: false, avatar: "VB" },
  { rank: 10, username: "FociFanatic", profit: 52.6, winRate: 57, avgOdds: 2.20, streak: 2, isPremium: false, avatar: "FF" },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Az AI tippjei egyszerűen hihetetlenek. 3 hónap alatt +45 egység profitot értem el. Ez a legjobb befektetésem a sportfogadásban.",
    author: "Kovács Péter",
    isPremium: true,
    rating: 5,
  },
  {
    quote: "Végre egy platform, ami tényleg adatvezérelt. A kalkulátor és az odds elemzés kombinációja verhetetlen.",
    author: "Szabó Anna",
    isPremium: true,
    rating: 5,
  },
  {
    quote: "Ingyenes tippek is vannak, de a prémium megéri minden forintját. A neurális hálózat tényleg működik!",
    author: "Nagy Gábor",
    isPremium: true,
    rating: 4,
  },
];

export const featuredMatch = liveMatches[1]; // Barcelona vs Real Madrid

export const aiPerformance = {
  monthlyProfit: 32.4,
  winRate: 68,
  avgOdds: 1.92,
  profitFactor: 1.34,
  dailyHistory: [
    0, 2.4, 1.8, -1.2, 3.1, 0.5, -0.8, 4.2, 1.5, 2.8,
    -2.1, 1.9, 3.4, 0.7, -1.5, 2.2, 1.1, 3.8, -0.9, 2.5,
    1.7, -1.8, 4.1, 2.3, 0.9, -1.1, 3.5, 2.1, 1.4, -0.6,
  ],
};
