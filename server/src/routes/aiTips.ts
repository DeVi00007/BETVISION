/**
 * AI Tippek Router — ÉLES VERZIÓ
 * Valós odds-ok a The Odds API-ból + kvantitatív modell
 */

import { Router, Request, Response } from 'express';
import { analyzeMatch, type TeamStats, type MarketOdds, type MatchInput } from '../services/quantitativeModel.js';
import { TEAM_DB } from '../data/teamDatabase.js';
import {
  fetchWorldCupOdds,
  fetchWorldCupScores,
  getBestOdds,
  getUsageStats,
  recordPrediction,
  resolvePredictions,
  getPerformanceStats,
  recordOddsFromAnalysis,
  getOddsMovement,
  getPredictions,
  parseScoreResult,
} from '../services/oddsApiService.js';

export const aiTipsRouter = Router();

const BANKROLL = 100_000;
const MAX_STAKE_PCT = 8;
const MIN_VALUE_PCT = 8; // Minimum +EV% küszöb (5% → 8%)

function getTeamStats(name: string): TeamStats {
  const base = TEAM_DB[name] || { elo: 1420, attackStrength: 0.85, defenseStrength: 1.15, tier1Missing: 0, tier2Missing: 0, pressureIndex: 0.5 };
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

    // +EV küszöb: csak 8%+ értékű tippek, max 1 tipp/meccs
    const filteredAnalyses = analyses
      .filter(a => a.bestBet && a.bestBet.value >= MIN_VALUE_PCT / 100)
      .filter((a, i, arr) => arr.findIndex(x => x.matchId === a.matchId) === i); // max 1 tipp/meccs

    const totalStake = filteredAnalyses.reduce((s, a) => s + a.kellyStakeFt, 0);

    // Predikciók rögzítése a visszacsatoláshoz
    for (const a of analyses) {
      if (a.bestBet && a.kellyStakeFt > 0) {
        recordPrediction({
          matchId: a.matchId,
          homeTeam: a.homeTeam,
          awayTeam: a.awayTeam,
          predicted: a.bestBet.selection.includes('Hazai') ? 'home' : a.bestBet.selection.includes('Döntetlen') ? 'draw' : 'away',
          marketOdds: a.bestBet.marketOdds,
          modelProbability: a.bestBet.modelProbability,
          stakeFt: a.kellyStakeFt,
          confidence: a.bestBet.confidence,
          tradeDate: new Date().toISOString(),
        });
      }
    }

    // Odds előzmények rögzítése
    recordOddsFromAnalysis(apiMatches);

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
      matches: filteredAnalyses,
    });
  } catch (error: any) {
    console.error('[aiTips] Hiba:', error.message);
    res.status(500).json({ 
      error: 'Hiba az élő odds-ok lekérésekor',
      detail: error.message,
    });
  }
});

// GET /api/ai/portfolio — ÉLŐ portfólió P&L-lel
aiTipsRouter.get('/portfolio', async (_req: Request, res: Response) => {
  try {
    const { resolved, pnl } = await resolvePredictions();
    const stats = getPerformanceStats();
    res.json({
      bankroll: { initial: 100000, current: stats.bankroll, pnl: stats.totalPnl, pnlPct: Math.round((stats.totalPnl / 100000) * 100) / 100 },
      activeBets: 0,
      history: stats,
      riskMetrics: { maxDrawdown: 0, sharpeRatio: 0, winRate: stats.winRate },
      lastUpdated: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ai/results — Lejátszott meccsek eredményei + P&L
aiTipsRouter.get('/results', async (_req: Request, res: Response) => {
  try {
    const scores = await fetchWorldCupScores(3);
    const completed = scores.filter((s: any) => s.completed);
    const { resolved, pnl } = await resolvePredictions();
    const stats = getPerformanceStats();

    // Keressük a predikcióink között az ismert meccseket
    const predictions = getPredictions();

    const results = completed.map((m: any) => {
      const homeScore = m.scores?.[0]?.score ?? '?';
      const awayScore = m.scores?.[1]?.score ?? '?';
      const result = parseScoreResult(m);
      const pred = predictions.find((p: any) => p.homeTeam === m.home_team && p.awayTeam === m.away_team);
      return {
        match: `${m.home_team} vs ${m.away_team}`,
        score: `${homeScore}-${awayScore}`,
        result,
        predicted: pred ? `${pred.predicted} @${pred.marketOdds}` : null,
        pnl: pred?.pnl ?? null,
      };
    });

    res.json({
      date: new Date().toISOString().split('T')[0],
      totalCompleted: completed.length,
      performance: stats,
      results,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ai/odds-movement — Valós odds változások
aiTipsRouter.get('/odds-movement', async (_req: Request, res: Response) => {
  try {
    const matches = await fetchWorldCupOdds();
    recordOddsFromAnalysis(matches);
    const mov = matches.map((m: any) => {
      const best = getBestOdds(m);
      const hist = getOddsMovement(m.id);
      return {
        match: `${m.home_team} vs ${m.away_team}`,
        current: `${best.homeOdds.toFixed(2)} - ${best.drawOdds.toFixed(2)} - ${best.awayOdds.toFixed(2)}`,
        movement: hist,
      };
    }).filter((x: any) => x.movement !== null);
    res.json({ snapshots: mov.length, movements: mov.slice(0, 20) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/ai/analyze

// Történelmi predikciók rögzítése (nap 1)
recordPrediction({
  matchId: 'wc-b-can-bos',
  homeTeam: 'Canada', awayTeam: 'Bosnia & Herzegovina',
  predicted: 'home', marketOdds: 4.0, modelProbability: 0.282,
  stakeFt: 3223, confidence: 70, tradeDate: '2026-06-12T12:00:00Z',
});
recordPrediction({
  matchId: 'wc-d-usa-par',
  homeTeam: 'USA', awayTeam: 'Paraguay',
  predicted: 'home', marketOdds: 2.16, modelProbability: 0.682,
  stakeFt: 8000, confidence: 82, tradeDate: '2026-06-12T12:00:00Z',
});

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
