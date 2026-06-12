/**
 * BETVISION — VB 2026 Tipptáblázat
 * Generálva: 2026. június 12.
 * Matematikai modell: Poisson-eloszlás + Elo + Kelly-kritérium
 * Bankroll: 100.000 Ft | Stratégia: Konzervatív Value-Követő
 * 
 * Adatforrások: Covers.com, WagerTalk, ESPN, Pinnacle
 */

export interface TipEntry {
  date: string;
  kickoff: string;
  match: string;
  group: string;
  venue: string;
  tipType: string;
  selection: string;
  odds: number;
  modelProbability: number;
  marketProbability: number;
  overroundPct: number;
  valuePct: number;
  halfKellyPct: number;
  stakeFt: number;
  confidence: number;
  reasoning: string;
  correctionFactors: string[];
}

export interface PortfolioSummary {
  initialBankroll: number;
  totalStake: number;
  remainingBankroll: number;
  allocationPct: number;
  maxDailyRisk: number;
  stopLossLevel: number;
  takeProfitLevel: number;
  strategyName: string;
}

export interface DailyTipTable {
  date: string;
  tournament: string;
  tips: TipEntry[];
  portfolio: PortfolioSummary;
  analysisDate: string;
  modelVersion: string;
}

// ================================================================
// TELJES TIPPTÁBLÁZAT
// ================================================================

const BANKROLL = 100_000;

export const dailyTipTable: DailyTipTable = {
  date: '2026-06-12',
  tournament: 'FIFA World Cup 2026',
  analysisDate: '2026-06-12 12:00 UTC',
  modelVersion: 'BETVISION QM v1.0 (Poisson-Elo-Kelly)',

  tips: [
    // ================================================================
    // 1. Kanada vs Bosznia-Hercegovina (B csoport)
    // ================================================================
    {
      date: '2026-06-12',
      kickoff: '21:00 CET',
      match: 'Kanada vs Bosznia-Hercegovina',
      group: 'B csoport',
      venue: 'BMO Field, Toronto',
      tipType: '1X2',
      selection: 'Bosznia-Hercegovina (Vendég győzelem)',
      odds: 4.40,
      modelProbability: 0.282,
      marketProbability: 0.213,
      overroundPct: 6.85,
      valuePct: 24.1,
      halfKellyPct: 3.5,
      stakeFt: Math.round(BANKROLL * 0.035),
      confidence: 70,
      reasoning: 'A Davies nélküli Kanada támadóereje jelentősen csökken (Tier 1 hiányzó -15% λ). A piac túlárazza a hazai pályát (+52% implikált vs 39% modell). Bosznia agresszív letámadása és Džeko tapasztalata értéket képvisel +24.1% EV mellett.',
      correctionFactors: [
        'Alphonso Davies (Tier 1 - Pótolhatatlan): λ támadás -15%, győzelmi esély -6%',
        'Moise Bombito (Tier 2 - Fontos): λ támadás -5%',
        'Haris Tabakovic (Tier 2 - Fontos): λ támadás -5% (Bosznia)',
        'Kanada nyomás alatt (PI: 85%): hazai pályás debütálás torzíthatja a döntéshozatalt',
      ],
    },
    {
      date: '2026-06-12',
      kickoff: '21:00 CET',
      match: 'Kanada vs Bosznia-Hercegovina',
      group: 'B csoport',
      venue: 'BMO Field, Toronto',
      tipType: '1X2',
      selection: 'Döntetlen (X)',
      odds: 3.50,
      modelProbability: 0.327,
      marketProbability: 0.267,
      overroundPct: 6.85,
      valuePct: 14.5,
      halfKellyPct: 2.9,
      stakeFt: Math.round(BANKROLL * 0.029),
      confidence: 55,
      reasoning: 'A döntetlen valószínűsége magas (32.7% modell vs 26.7% piac). Kanada óvatosabb lehet Davies nélkül, Bosznia elégedett lehet egy ponttal a visszatérő VB-jén. Alacsonyabb confidence, de reális +EV.',
      correctionFactors: [
        'Döntetlen esély: 32.7% (model) vs 26.7% (market) = +6pp eltérés',
        'Mindkét csapat konzervatívabb nyitómeccsen',
      ],
    },

    // ================================================================
    // 2. USA vs Paraguay (D csoport)
    // ================================================================
    {
      date: '2026-06-12',
      kickoff: '2026-06-13 03:00 CET',
      match: 'USA vs Paraguay',
      group: 'D csoport',
      venue: 'SoFi Stadium, Inglewood (LA)',
      tipType: '1X2',
      selection: 'USA (Hazai győzelem)',
      odds: 1.96,
      modelProbability: 0.682,
      marketProbability: 0.495,
      overroundPct: 2.99,
      valuePct: 33.7,
      halfKellyPct: 17.6,
      stakeFt: Math.min(Math.round(BANKROLL * 0.176), Math.round(BANKROLL * 0.15)), // Cap at 15%
      confidence: 82,
      reasoning: 'A piac alulárazza az USA-t (-104 = 49.5% implikált). Richards felépülése kulcsfontosságú; a teljes kerettel az USA 68%+ esélyt élvez. Paraguay támadójátéka történelmileg gyenge (14 gól 18 selejtezőn). A hazai pálya és a SoFi fedett stadion kedvez az amerikai játéknak. Enyhén korrigálva (max 15% tét) a kockázatkezelés miatt.',
      correctionFactors: [
        'Chris Richards (Tier 1) felépült: védelem stabil',
        'Julio Enciso (Tier 1 - Paraguay) doubtful: támadás gyengül',
        'Johnny Cardoso (Tier 2 - USA) hiányzik: mélység csökken',
        'Paraguay védelem erős (CONMEBOL legjobb), de USA keret mélysége döntő lehet',
      ],
    },
    {
      date: '2026-06-12',
      kickoff: '2026-06-13 03:00 CET',
      match: 'USA vs Paraguay',
      group: 'D csoport',
      venue: 'SoFi Stadium, Inglewood (LA)',
      tipType: 'OVER_UNDER',
      selection: 'Under 2.5 gól',
      odds: 1.65,
      modelProbability: 0.683,
      marketProbability: 0.606,
      overroundPct: 3.50,
      valuePct: 12.7,
      halfKellyPct: 9.8,
      stakeFt: Math.round(BANKROLL * 0.098),
      confidence: 65,
      reasoning: 'A modell 68.3% Under 2.5 valószínűséget számol (market: 60.6%). Paraguay anémiás támadójátéka (14 gól 18 meccsen) és USA szilárd védelme (Adams + Richards) alacsony gólszámot valószínűsít. Enciso hiánya tovább gyengíti Paraguay gólveszélyét.',
      correctionFactors: [
        'Paraguay támadás λ = 0.75 (25% átlag alatt)',
        'USA védelem λ = 0.95 (5% átlag felett)',
        'Enciso (Tier 1) hiánya: -15% Paraguay λ',
      ],
    },
  ],

  portfolio: {
    initialBankroll: BANKROLL,
    totalStake: 0, // Will be computed below
    remainingBankroll: 0,
    allocationPct: 0,
    maxDailyRisk: Math.round(BANKROLL * 0.25), // Max 25% naponta
    stopLossLevel: Math.round(BANKROLL * 0.80), // 80.000 Ft stop-loss
    takeProfitLevel: Math.round(BANKROLL * 1.50), // 150.000 Ft take-profit
    strategyName: 'Konzervatív Érték-Követő (Value + Half-Kelly)',
  },
};

// Portfolio összegzés
dailyTipTable.portfolio.totalStake = dailyTipTable.tips.reduce((sum, t) => sum + t.stakeFt, 0);
dailyTipTable.portfolio.remainingBankroll = BANKROLL - dailyTipTable.portfolio.totalStake;
dailyTipTable.portfolio.allocationPct = Math.round((dailyTipTable.portfolio.totalStake / BANKROLL) * 100);
