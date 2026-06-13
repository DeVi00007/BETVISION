/**
 * AI Tippek Router — ÉLES VERZIÓ
 * Valós odds-ok a The Odds API-ból + kvantitatív modell
 */

import { Router, Request, Response } from 'express';
import { analyzeMatch, type TeamStats, type MarketOdds, type MatchInput } from '../services/quantitativeModel.js';
import { fetchWorldCupOdds, getBestOdds, getUsageStats } from '../services/oddsApiService.js';

export const aiTipsRouter = Router();

const BANKROLL = 100_000;
const MAX_STAKE_PCT = 8;

// Csapatadatok — ÖSSZES VB 2026 csapat (FIFA/Elo alapú)
const TEAM_DB: Record<string, Partial<TeamStats>> = {
  'Canada':         { elo: 1520, attackStrength: 1.25, defenseStrength: 1.15, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.85 },
  'Bosnia & Herzegovina': { elo: 1460, attackStrength: 1.05, defenseStrength: 1.30, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.60 },
  'USA':             { elo: 1580, attackStrength: 1.20, defenseStrength: 0.95, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.70 },
  'Paraguay':        { elo: 1430, attackStrength: 0.75, defenseStrength: 0.85, tier1Missing: 1, tier2Missing: 0, pressureIndex: 0.50 },
  'Mexico':          { elo: 1550, attackStrength: 1.20, defenseStrength: 1.00, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.60 },
  'Brazil':          { elo: 1700, attackStrength: 1.55, defenseStrength: 0.85, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Morocco':         { elo: 1570, attackStrength: 1.15, defenseStrength: 0.90, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'France':          { elo: 1710, attackStrength: 1.55, defenseStrength: 0.80, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'England':         { elo: 1660, attackStrength: 1.42, defenseStrength: 0.88, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Spain':           { elo: 1670, attackStrength: 1.45, defenseStrength: 0.85, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Argentina':       { elo: 1650, attackStrength: 1.40, defenseStrength: 0.90, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Germany':         { elo: 1630, attackStrength: 1.38, defenseStrength: 0.93, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Netherlands':     { elo: 1610, attackStrength: 1.32, defenseStrength: 1.00, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Portugal':        { elo: 1590, attackStrength: 1.30, defenseStrength: 1.00, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Belgium':         { elo: 1620, attackStrength: 1.32, defenseStrength: 0.98, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Switzerland':     { elo: 1560, attackStrength: 1.15, defenseStrength: 1.05, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Qatar':           { elo: 1350, attackStrength: 0.70, defenseStrength: 1.60, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.50 },
  'Haiti':           { elo: 1280, attackStrength: 0.65, defenseStrength: 1.80, tier1Missing: 0, tier2Missing: 3, pressureIndex: 0.40 },
  'Scotland':        { elo: 1540, attackStrength: 1.10, defenseStrength: 1.10, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.60 },
  'Australia':       { elo: 1420, attackStrength: 0.80, defenseStrength: 1.30, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.45 },
  'Turkey':          { elo: 1530, attackStrength: 1.20, defenseStrength: 1.10, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Curaçao':         { elo: 1200, attackStrength: 0.55, defenseStrength: 2.20, tier1Missing: 1, tier2Missing: 2, pressureIndex: 0.30 },
  'Japan':           { elo: 1555, attackStrength: 1.10, defenseStrength: 0.95, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.50 },
  'Ivory Coast':     { elo: 1510, attackStrength: 1.10, defenseStrength: 1.15, tier1Missing: 1, tier2Missing: 0, pressureIndex: 0.55 },
  'Ecuador':         { elo: 1520, attackStrength: 1.05, defenseStrength: 1.05, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.60 },
  'Sweden':          { elo: 1535, attackStrength: 1.10, defenseStrength: 1.05, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Tunisia':         { elo: 1450, attackStrength: 0.85, defenseStrength: 1.20, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.50 },
  'Cape Verde':      { elo: 1350, attackStrength: 0.70, defenseStrength: 1.50, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.40 },
  'Egypt':           { elo: 1490, attackStrength: 1.00, defenseStrength: 1.20, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Saudi Arabia':    { elo: 1400, attackStrength: 0.75, defenseStrength: 1.40, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.45 },
  'Uruguay':         { elo: 1580, attackStrength: 1.25, defenseStrength: 0.95, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Iran':            { elo: 1480, attackStrength: 0.90, defenseStrength: 1.15, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'New Zealand':     { elo: 1380, attackStrength: 0.75, defenseStrength: 1.45, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.40 },
  'Senegal':         { elo: 1540, attackStrength: 1.15, defenseStrength: 1.05, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Croatia':         { elo: 1600, attackStrength: 1.25, defenseStrength: 0.95, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Colombia':        { elo: 1570, attackStrength: 1.22, defenseStrength: 1.00, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'South Korea':     { elo: 1500, attackStrength: 1.05, defenseStrength: 1.20, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.50 },
  'South Africa':    { elo: 1380, attackStrength: 0.75, defenseStrength: 1.50, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.40 },
  'Czech Republic':  { elo: 1490, attackStrength: 1.00, defenseStrength: 1.15, tier1Missing: 1, tier2Missing: 0, pressureIndex: 0.50 },
  'DR Congo':        { elo: 1360, attackStrength: 0.70, defenseStrength: 1.60, tier1Missing: 1, tier2Missing: 2, pressureIndex: 0.45 },
  'Uzbekistan':      { elo: 1390, attackStrength: 0.80, defenseStrength: 1.40, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.45 },
  'Panama':          { elo: 1410, attackStrength: 0.80, defenseStrength: 1.30, tier1Missing: 1, tier2Missing: 1, pressureIndex: 0.40 },
  'Ghana':           { elo: 1450, attackStrength: 1.00, defenseStrength: 1.30, tier1Missing: 0, tier2Missing: 1, pressureIndex: 0.50 },
  'Norway':          { elo: 1540, attackStrength: 1.20, defenseStrength: 1.10, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Algeria':         { elo: 1520, attackStrength: 1.10, defenseStrength: 1.15, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Austria':         { elo: 1510, attackStrength: 1.05, defenseStrength: 1.10, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.55 },
  'Iraq':            { elo: 1360, attackStrength: 0.70, defenseStrength: 1.60, tier1Missing: 1, tier2Missing: 2, pressureIndex: 0.40 },
  'Jordan':          { elo: 1330, attackStrength: 0.65, defenseStrength: 1.80, tier1Missing: 1, tier2Missing: 2, pressureIndex: 0.35 },
};

function getTeamStats(name: string): TeamStats {
  const base = TEAM_DB[name] || { elo: 1500, attackStrength: 1.0, defenseStrength: 1.0, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.5 };
  return {
    name,
    elo: base.elo || 1500,
    attackStrength: base.attackStrength || 1.0,
    defenseStrength: base.defenseStrength || 1.0,
    recentForm: ['W', 'W', 'W', 'W', 'W'],
    tier1Missing: base.tier1Missing || 0,
    tier2Missing: base.tier2Missing || 0,
    pressureIndex: base.pressureIndex || 0.5,
  };
}

// ================================================================
// GET /api/ai/tips — ÉLŐ VB TIPPEK
// ================================================================

aiTipsRouter.get('/tips', async (_req: Request, res: Response) => {
  try {
    const apiMatches = await fetchWorldCupOdds();
    const usage = getUsageStats();
    
    const analyses = apiMatches.slice(0, 12).map((apiMatch, idx) => {
      const best = getBestOdds(apiMatch);
      const homeStats = getTeamStats(best.homeTeam);
      const awayStats = getTeamStats(best.awayTeam);

      const input: MatchInput = {
        homeTeam: homeStats,
        awayTeam: awayStats,
        marketOdds: {
          homeOdds: best.homeOdds,
          drawOdds: best.drawOdds,
          awayOdds: best.awayOdds,
        },
        isNeutralVenue: true,
        groupStage: 'VB 2026',
      };

      const analysis = analyzeMatch(input, idx);
      const kellyCap = Math.min(Math.round(BANKROLL * MAX_STAKE_PCT / 100));
      
      return {
        ...analysis,
        kickoff: apiMatch.commence_time,
        bestBookmaker: best.bestBookmaker,
        kellyStakeFt: Math.min(analysis.kellyStakeFt, kellyCap),
      };
    });

    const totalStake = analyses.reduce((s, a) => s + a.kellyStakeFt, 0);

    res.json({
      date: new Date().toISOString().split('T')[0],
      apiUsage: usage,
      bankroll: {
        total: BANKROLL,
        allocated: totalStake,
        remaining: BANKROLL - totalStake,
        allocationPct: Math.round((totalStake / BANKROLL) * 100),
      },
      strategy: {
        maxBetsPerDay: 5,
        stopLossPct: 20,
        takeProfitPct: 50,
        kellyType: 'Quarter-Kelly',
        maxStakePct: MAX_STAKE_PCT,
        strategyType: 'Élő odds + Kvantitatív modell',
      },
      matches: analyses,
    });
  } catch (error: any) {
    console.error('[aiTips] Hiba:', error.message);
    res.status(500).json({ 
      error: 'Hiba az élő odds-ok lekérésekor',
      detail: error.message,
    });
  }
});

// GET /api/ai/portfolio
aiTipsRouter.get('/portfolio', (_req: Request, res: Response) => {
  res.json({
    bankroll: { initial: BANKROLL, current: BANKROLL, pnl: 0, pnlPct: 0 },
    activeBets: [],
    history: [],
    riskMetrics: { maxDrawdown: 0, sharpeRatio: 0, winRate: 0 },
    lastUpdated: new Date().toISOString(),
  });
});

// POST /api/ai/analyze
aiTipsRouter.post('/analyze', (req: Request, res: Response) => {
  try {
    const { homeTeam, awayTeam, homeOdds, drawOdds, awayOdds } = req.body;
    if (!homeTeam || !awayTeam || !homeOdds || !drawOdds || !awayOdds) {
      res.status(400).json({ error: 'Hiányzó paraméterek' });
      return;
    }
    const input: MatchInput = {
      homeTeam: getTeamStats(homeTeam),
      awayTeam: getTeamStats(awayTeam),
      marketOdds: { homeOdds: Number(homeOdds), drawOdds: Number(drawOdds), awayOdds: Number(awayOdds) },
      isNeutralVenue: true,
    };
    res.json(analyzeMatch(input, 0));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
