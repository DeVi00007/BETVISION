/**
 * Kvantitatív VB Tippek — Frontend adatmodell
 * Számítva a BETVISION Quantitative Motor által
 * Poisson + Elo + Kelly modellel
 * 
 * Frissítve: 2026. június 12.
 */

export interface QuantitativeTip {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  group: string;
  venue: string;
  kickoff: string;
  
  tipType: '1X2' | 'OVER_UNDER' | 'AH';
  selection: string;
  odds: number;
  modelProbability: number;
  marketProbability: number;
  valuePct: number;
  halfKellyPct: number;
  stakeFt: number;
  confidence: number;
  
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  over25Prob: number;
  under25Prob: number;
  
  overroundPct: number;
  expectedGoalsHome: number;
  expectedGoalsAway: number;
  
  reasoning: string;
  correctionFactors: string[];
  
  homeForm: string;
  awayForm: string;
  h2h: string;
  sport: string;
  time: string;
  aiPick: string;
  aiConfidence: number;
}

export interface QuantitativePortfolio {
  initialBankroll: number;
  totalStake: number;
  remainingBankroll: number;
  allocationPct: number;
  maxDailyRisk: number;
  stopLossLevel: number;
  takeProfitLevel: number;
  strategyName: string;
}

export interface QuantitativeTipSet {
  date: string;
  tournament: string;
  modelVersion: string;
  tips: QuantitativeTip[];
  portfolio: QuantitativePortfolio;
}

// ================================================================
// SZÁMÍTOTT TIPPEK — VB 2026. június 12.
// ================================================================

const BANKROLL = 100_000;

export const quantitativeVBData: QuantitativeTipSet = {
  date: '2026-06-12',
  tournament: 'FIFA World Cup 2026',
  modelVersion: 'BETVISION QM v1.0 (Poisson + Elo + Kelly)',

  tips: [
    // === 1. Kanada vs Bosznia — Bosznia győzelem (2) ===
    {
      id: 'qvb-001',
      matchId: 'wc-b-can-bos',
      homeTeam: 'Kanada',
      awayTeam: 'Bosznia-Hercegovina',
      league: 'VB 2026 - Csoportkör',
      group: 'B csoport',
      venue: 'BMO Field, Toronto',
      kickoff: '21:00 CET',
      
      tipType: '1X2',
      selection: 'Bosznia-Hercegovina (Vendég győzelem)',
      odds: 4.40,
      modelProbability: 0.282,
      marketProbability: 0.213,
      valuePct: 24.1,
      halfKellyPct: 3.5,
      stakeFt: Math.round(BANKROLL * 0.018),
      confidence: 70,
      
      homeOdds: 1.80,
      drawOdds: 3.50,
      awayOdds: 4.40,
      
      homeWinProb: 39.1,
      drawProb: 32.7,
      awayWinProb: 28.2,
      over25Prob: 36.2,
      under25Prob: 63.8,
      
      overroundPct: 6.85,
      expectedGoalsHome: 1.23,
      expectedGoalsAway: 0.92,
      
      reasoning: 'Davies nélkül Kanada támadóereje jelentősen csökken (Tier 1 hiányzó). A piac túlárazza a hazai pályát (52% implikált vs 39% modell). Bosznia agresszív letámadása és Džeko tapasztalata értéket képvisel +24.1% EV mellett.',
      correctionFactors: [
        'Alphonso Davies (Tier 1): λ támadás -15%, győzelmi esély -6%',
        'Moise Bombito (Tier 2): λ támadás -5%',
        'Kanada PI: 85% — hazai pályás debütálás torzíthat',
      ],
      
      homeForm: 'D-W-D-W-D',
      awayForm: 'D-D-W-D-L',
      h2h: 'Nincs előzmény',
      sport: 'foci',
      time: '21:00',
      aiPick: '2 (Vendég)',
      aiConfidence: 70,
    },
    
    // === 2. Kanada vs Bosznia — Döntetlen (X) ===
    {
      id: 'qvb-002',
      matchId: 'wc-b-can-bos-x',
      homeTeam: 'Kanada',
      awayTeam: 'Bosznia-Hercegovina',
      league: 'VB 2026 - Csoportkör',
      group: 'B csoport',
      venue: 'BMO Field, Toronto',
      kickoff: '21:00 CET',
      
      tipType: '1X2',
      selection: 'Döntetlen (X)',
      odds: 3.50,
      modelProbability: 0.327,
      marketProbability: 0.267,
      valuePct: 14.5,
      halfKellyPct: 2.9,
      stakeFt: 0, // Kihagyva: túl alacsony confidence (55%) + korrelál a Bosznia tippel
      confidence: 55,
      
      homeOdds: 1.80,
      drawOdds: 3.50,
      awayOdds: 4.40,
      
      homeWinProb: 39.1,
      drawProb: 32.7,
      awayWinProb: 28.2,
      over25Prob: 36.2,
      under25Prob: 63.8,
      
      overroundPct: 6.85,
      expectedGoalsHome: 1.23,
      expectedGoalsAway: 0.92,
      
      reasoning: 'A döntetlen valószínűsége magas (32.7% modell vs 26.7% piac). Davies nélkül Kanada óvatosabb, Bosznia elégedett lehet egy ponttal. Alacsonyabb confidence, de reális +EV.',
      correctionFactors: [
        'Döntetlen esély: 32.7% (model) vs 26.7% (market) = +6pp',
        'Nyitómeccs faktor: mindkét csapat konzervatív',
      ],
      
      homeForm: 'D-W-D-W-D',
      awayForm: 'D-D-W-D-L',
      h2h: 'Nincs előzmény',
      sport: 'foci',
      time: '21:00',
      aiPick: 'X (Döntetlen)',
      aiConfidence: 55,
    },
    
    // === 3. USA vs Paraguay — USA győzelem (1) ===
    {
      id: 'qvb-003',
      matchId: 'wc-d-usa-par',
      homeTeam: 'USA',
      awayTeam: 'Paraguay',
      league: 'VB 2026 - Csoportkör',
      group: 'D csoport',
      venue: 'SoFi Stadium, Inglewood (LA)',
      kickoff: '03:00 CET (jún. 13)',
      
      tipType: '1X2',
      selection: 'USA (Hazai győzelem)',
      odds: 1.96,
      modelProbability: 0.682,
      marketProbability: 0.495,
      valuePct: 33.7,
      halfKellyPct: 17.6,
      stakeFt: Math.min(Math.round(BANKROLL * 0.088), Math.round(BANKROLL * 0.08)),
      confidence: 82,
      
      homeOdds: 1.96,
      drawOdds: 3.45,
      awayOdds: 4.35,
      
      homeWinProb: 68.2,
      drawProb: 27.2,
      awayWinProb: 4.6,
      over25Prob: 31.7,
      under25Prob: 68.3,
      
      overroundPct: 2.99,
      expectedGoalsHome: 1.54,
      expectedGoalsAway: 0.44,
      
      reasoning: 'A piac alulárazza az USA-t (-104 = 49.5%). Richards felépülése kulcsfontosságú; a teljes kerettel az USA 68%+ esélyt élvez. Paraguay támadójátéka gyenge (14 gól/18 meccs). SoFi fedett stadion kedvez az amerikai játéknak.',
      correctionFactors: [
        'Chris Richards (Tier 1) felépült: védelem stabil',
        'Julio Enciso (Tier 1 - PAR) doubtful: támadás gyengül',
        'Paraguay védelem erős, de USA keret mélysége döntő',
      ],
      
      homeForm: 'W-L-W-W-W',
      awayForm: 'L-W-L-D-L',
      h2h: 'Vegyes (USA előnyben)',
      sport: 'foci',
      time: '03:00',
      aiPick: '1 (Hazai)',
      aiConfidence: 82,
    },
    
    // === 4. USA vs Paraguay — Under 2.5 ===
    {
      id: 'qvb-004',
      matchId: 'wc-d-usa-par-u25',
      homeTeam: 'USA',
      awayTeam: 'Paraguay',
      league: 'VB 2026 - Csoportkör',
      group: 'D csoport',
      venue: 'SoFi Stadium, Inglewood (LA)',
      kickoff: '03:00 CET (jún. 13)',
      
      tipType: 'OVER_UNDER',
      selection: 'Under 2.5 gól',
      odds: 1.65,
      modelProbability: 0.683,
      marketProbability: 0.606,
      valuePct: 12.7,
      halfKellyPct: 9.8,
      stakeFt: 0, // Kihagyva: korrelál az USA győzelemmel (ál-diverzifikáció)
      confidence: 65,
      
      homeOdds: 1.96,
      drawOdds: 3.45,
      awayOdds: 4.35,
      
      homeWinProb: 68.2,
      drawProb: 27.2,
      awayWinProb: 4.6,
      over25Prob: 31.7,
      under25Prob: 68.3,
      
      overroundPct: 3.50,
      expectedGoalsHome: 1.54,
      expectedGoalsAway: 0.44,
      
      reasoning: '68.3% Under 2.5 valószínűség (market: 60.6%). Paraguay anémiás támadójátéka (14 gól 18 meccsen) és USA szilárd védelme alacsony gólszámot ígér. Enciso hiánya tovább gyengíti Paraguayt.',
      correctionFactors: [
        'Paraguay λ támadás = 0.75 (25% átlag alatt)',
        'USA λ védelem = 0.95 (5% átlag felett)',
        'Enciso (Tier 1) hiánya: -15% Paraguay λ',
      ],
      
      homeForm: 'W-L-W-W-W',
      awayForm: 'L-W-L-D-L',
      h2h: 'Vegyes (USA előnyben)',
      sport: 'foci',
      time: '03:00',
      aiPick: 'Under 2.5',
      aiConfidence: 65,
    },
  ],

  portfolio: {
    initialBankroll: BANKROLL,
    totalStake: 0, // számoljuk alul
    remainingBankroll: 0,
    allocationPct: 0,
    maxDailyRisk: Math.round(BANKROLL * 0.25),
    stopLossLevel: Math.round(BANKROLL * 0.80),
    takeProfitLevel: Math.round(BANKROLL * 1.50),
    strategyName: 'Konzervatív Érték-Követő (Value + Half-Kelly)',
  },
};

// Portfolio összegzés
quantitativeVBData.portfolio.totalStake = quantitativeVBData.tips.reduce((s, t) => s + t.stakeFt, 0);
quantitativeVBData.portfolio.remainingBankroll = BANKROLL - quantitativeVBData.portfolio.totalStake;
quantitativeVBData.portfolio.allocationPct = Math.round((quantitativeVBData.portfolio.totalStake / BANKROLL) * 100);
