/**
 * Kvantitatív tippek service — a BACKEND MOTOR (/api/ai/tips) hívása.
 *
 * Korábban a frontend a statikus quantitativeTips.ts kézi adatából dolgozott,
 * ami szétcsúszhatott a tényleges modell-kimenettől. Ez a modul a valós,
 * Poisson + Elo + Dixon-Coles + shrinkage motort hívja a szerveren.
 *
 * Ha a backend nem elérhető (pl. statikus Vercel deploy backend nélkül),
 * a hívó hook a statikus adatra fallbackel — így az oldal sosem törik.
 */

import type { QuantitativeTip, QuantitativeTipSet } from '@/data/quantitativeTips';
import { quantitativeVBData } from '@/data/quantitativeTips';

// A backend base URL-je. Vite env-ből, fallback a Vercel proxy útra.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const TIPS_ENDPOINT = `${API_BASE}/api/ai/tips`;

// ─── A motor /api/ai/tips válaszának (részleges) alakja ───
interface EngineValueBet {
  type: string;
  selection: string;
  marketOdds: number;
  modelProbability: number;
  marketProbability: number;
  value: number;
  halfKellyPct: number;
  quarterKellyPct: number;
  confidence: number;
}

interface EngineMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoff?: string;
  bestBookmaker?: string;
  cleanOdds: { homeProb: number; drawProb: number; awayProb: number; overround: number };
  correctedProbabilities: {
    homeWin: number; draw: number; awayWin: number;
    over25: number; under25: number;
    homeExpectedGoals: number; awayExpectedGoals: number;
  };
  newsCorrections: string[];
  bestBet: EngineValueBet | null;
  kellyStakeFt: number;
}

interface EngineResponse {
  date: string;
  bankroll: { total: number; allocated: number; remaining: number; allocationPct: number };
  strategy: { kellyType: string; maxStakePct: number; strategyType: string; stopLossPct: number; takeProfitPct: number };
  matches: EngineMatch[];
}

/** Egy motor-meccset a frontend QuantitativeTip alakjára mappel */
function mapEngineMatchToTip(m: EngineMatch): QuantitativeTip | null {
  if (!m.bestBet) return null;
  const cp = m.correctedProbabilities;
  const bb = m.bestBet;
  return {
    id: m.matchId,
    matchId: m.matchId,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    league: m.league,
    group: m.league,
    venue: m.bestBookmaker ?? '',
    kickoff: m.kickoff ?? '',
    tipType: (bb.type as QuantitativeTip['tipType']) ?? '1X2',
    selection: bb.selection,
    odds: bb.marketOdds,
    modelProbability: bb.modelProbability,
    marketProbability: bb.marketProbability,
    valuePct: Math.round(bb.value * 1000) / 10,
    halfKellyPct: Math.round(bb.halfKellyPct * 10) / 10,
    stakeFt: m.kellyStakeFt,
    confidence: bb.confidence,
    homeOdds: cp.homeWin > 0 ? Math.round((1 / m.cleanOdds.homeProb) * 100) / 100 : 0,
    drawOdds: m.cleanOdds.drawProb > 0 ? Math.round((1 / m.cleanOdds.drawProb) * 100) / 100 : 0,
    awayOdds: m.cleanOdds.awayProb > 0 ? Math.round((1 / m.cleanOdds.awayProb) * 100) / 100 : 0,
    homeWinProb: Math.round(cp.homeWin * 1000) / 10,
    drawProb: Math.round(cp.draw * 1000) / 10,
    awayWinProb: Math.round(cp.awayWin * 1000) / 10,
    over25Prob: Math.round(cp.over25 * 1000) / 10,
    under25Prob: Math.round(cp.under25 * 1000) / 10,
    overroundPct: Math.round(m.cleanOdds.overround * 100) / 100,
    expectedGoalsHome: Math.round(cp.homeExpectedGoals * 100) / 100,
    expectedGoalsAway: Math.round(cp.awayExpectedGoals * 100) / 100,
    reasoning: m.newsCorrections.join('; ') || 'Modell-alapú értékfogadás (shrinkage-korrigált).',
    correctionFactors: m.newsCorrections,
    homeForm: '',
    awayForm: '',
    h2h: '',
    sport: 'foci',
    time: m.kickoff ?? '',
    aiPick: bb.selection,
    aiConfidence: bb.confidence,
  };
}

export interface QuantitativeTipsResult {
  data: QuantitativeTipSet;
  source: 'engine' | 'static';
}

/**
 * Lekéri a tippeket a motorból. Hiba/üres válasz esetén a statikus adatra esik
 * vissza, és source='static'-ot jelez (a UI így jelezheti a felhasználónak).
 */
export async function fetchQuantitativeTips(): Promise<QuantitativeTipsResult> {
  try {
    const res = await fetch(TIPS_ENDPOINT, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as EngineResponse;

    const tips = (json.matches ?? [])
      .map(mapEngineMatchToTip)
      .filter((t): t is QuantitativeTip => t !== null);

    if (tips.length === 0) {
      // A motor él, de nincs +EV tipp ma → statikus helyett üres motor-set
      return {
        source: 'engine',
        data: {
          date: json.date,
          tournament: 'FIFA World Cup 2026',
          modelVersion: 'BETVISION QM v2.0 (Poisson+Elo+DC+Shrinkage)',
          tips: [],
          portfolio: {
            initialBankroll: json.bankroll.total,
            totalStake: json.bankroll.allocated,
            remainingBankroll: json.bankroll.remaining,
            allocationPct: json.bankroll.allocationPct,
            maxDailyRisk: Math.round(json.bankroll.total * 0.25),
            stopLossLevel: Math.round(json.bankroll.total * (1 - json.strategy.stopLossPct / 100)),
            takeProfitLevel: Math.round(json.bankroll.total * (1 + json.strategy.takeProfitPct / 100)),
            strategyName: json.strategy.strategyType,
          },
        },
      };
    }

    const totalStake = tips.reduce((s, t) => s + t.stakeFt, 0);
    return {
      source: 'engine',
      data: {
        date: json.date,
        tournament: 'FIFA World Cup 2026',
        modelVersion: 'BETVISION QM v2.0 (Poisson+Elo+DC+Shrinkage)',
        tips,
        portfolio: {
          initialBankroll: json.bankroll.total,
          totalStake,
          remainingBankroll: json.bankroll.total - totalStake,
          allocationPct: Math.round((totalStake / json.bankroll.total) * 100),
          maxDailyRisk: Math.round(json.bankroll.total * 0.25),
          stopLossLevel: Math.round(json.bankroll.total * (1 - json.strategy.stopLossPct / 100)),
          takeProfitLevel: Math.round(json.bankroll.total * (1 + json.strategy.takeProfitPct / 100)),
          strategyName: json.strategy.strategyType,
        },
      },
    };
  } catch (err) {
    console.warn('[quantitativeTips] Motor nem elérhető, statikus fallback:', err);
    return { data: quantitativeVBData, source: 'static' };
  }
}
