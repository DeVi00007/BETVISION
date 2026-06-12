import { useEffect, useState } from 'react';
import { Plus, ChevronDown, Lock, RefreshCw, WifiOff, Brain, BarChart3, Trophy, TrendingUp } from 'lucide-react';
import { useAITips } from '@/hooks/useAITips';
import { useQuantitativeTips } from '@/hooks/useQuantitativeTips';
import { aiPerformance } from '@/data/mockData';
import { useBetSlipStore } from '@/stores/betSlipStore';
import AIConfidenceBadge from '@/components/AIConfidenceBadge';
import RiskProfileSelector from '@/components/RiskProfileSelector';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import PremiumUpgradeLink from '@/components/PremiumUpgradeLink';
import { quantitativeVBData } from '@/data/quantitativeTips';

type ViewMode = 'ai-tippmix' | 'vb-kvantitativ';

const sportFilters = ['ÖSSZES', 'LABDARÚGÁS', 'TENISZ', 'KOSÁRLABDA', 'JÉGKORONG', 'E-SPORT'];

function getFormDots(form: string) {
  return form.split('').map((char, i) => {
    const color = char === 'W' ? 'bg-bv-blue' : char === 'D' ? 'bg-yellow-500' : 'bg-bv-orange';
    return <span key={i} className={`w-2 h-2 rounded-full ${color}`} />;
  });
}

/**
 * AI Tippek oldal — AI Tippmix + VB Kvantitatív mód
 */
export default function AITipsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('ai-tippmix');
  const [activeFilter, setActiveFilter] = useState('ÖSSZES');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const { addItem } = useBetSlipStore();

  const { status } = useSubscriptionStatus(7);
  const canExpandAnalysis = status.effectiveTier !== 'ALAP';

  // AI Tippmix hook
  const {
    tips: aiTips,
    loading: aiLoading,
    lastUpdated: aiUpdated,
    refresh: aiRefresh,
    isUsingMockData,
  } = useAITips({ limit: 8 });

  // VB Kvantitatív hook
  const {
    tips: vbTips,
    portfolio: vbPortfolio,
    lastUpdated: vbUpdated,
  } = useQuantitativeTips();

  const tips = viewMode === 'vb-kvantitativ' ? vbTips : aiTips;
  const loading = viewMode === 'vb-kvantitativ' ? false : aiLoading;
  const lastUpdated = viewMode === 'vb-kvantitativ' ? vbUpdated : aiUpdated;

  // Szűrés sport szerint
  const filteredTips =
    viewMode === 'vb-kvantitativ'
      ? tips
      : activeFilter === 'ÖSSZES'
        ? tips
        : activeFilter === 'LABDARÚGÁS'
          ? tips.filter((t) => t.sport === 'foci')
          : tips;

  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds} mp ezelőtt`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} perce`;
  };

  // Ha lejár a trial / visszaesik ALAP-ra, zárjuk az expanded állapotot
  useEffect(() => {
    if (!canExpandAnalysis) setExpandedTip(null);
  }, [canExpandAnalysis]);

  // Kelly tet format — eltavolitva, elerheto a UI-bol

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      {/* Hero */}
      <div className="py-16 md:py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          {viewMode === 'vb-kvantitativ' ? '⚽ VB 2026 KVANTITATÍV TIPPEK' : 'AI TIPPMIX TIPPEK'}
        </h1>
        <p className="text-bv-text-secondary text-base md:text-lg max-w-xl mx-auto mb-6">
          {viewMode === 'vb-kvantitativ'
            ? 'Poisson-eloszlás + Elo + Kelly-kritérium — matematikailag optimalizált fogadási ajánlások'
            : 'Naponta frissülő, mesterséges intelligencia által generált fogadási ajánlások'}
        </p>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setViewMode('ai-tippmix')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              viewMode === 'ai-tippmix'
                ? 'bg-bv-blue text-bv-bg shadow-lg shadow-bv-blue/30'
                : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
            }`}
          >
            <Brain size={16} />
            AI Tippmix
          </button>
          <button
            onClick={() => setViewMode('vb-kvantitativ')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              viewMode === 'vb-kvantitativ'
                ? 'bg-emerald-500 text-bv-bg shadow-lg shadow-emerald-500/30'
                : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
            }`}
          >
            <Trophy size={16} />
            VB Kvantitatív
          </button>
        </div>

        {/* VB mód infó sáv */}
        {viewMode === 'vb-kvantitativ' && (
          <div className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-6 text-sm">
              <span className="text-emerald-400 font-mono">{vbPortfolio.initialBankroll.toLocaleString('hu-HU')} Ft</span>
              <span className="text-bv-text-muted">|</span>
              <span className="text-bv-text-secondary">Tét: <span className="text-emerald-400 font-mono">{vbPortfolio.totalStake.toLocaleString('hu-HU')} Ft</span></span>
              <span className="text-bv-text-muted">|</span>
              <span className="text-bv-text-secondary">Szabad: <span className="text-bv-blue font-mono">{vbPortfolio.remainingBankroll.toLocaleString('hu-HU')} Ft</span></span>
              <span className="text-bv-text-muted">|</span>
              <span className="text-bv-text-muted">{quantitativeVBData.modelVersion}</span>
            </div>
          </div>
        )}

        {/* Risk Profile (only in AI mode) */}
        {viewMode === 'ai-tippmix' && (
          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-bv-text-muted text-sm uppercase tracking-wider mb-4">
              Válaszd ki a kockázati szintedet
            </p>
            <RiskProfileSelector />
          </div>
        )}

        {/* Státusz és frissítés */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {lastUpdated && (
            <span className="text-xs text-bv-text-muted">
              Utoljára frissítve: {getLastUpdatedText()}
            </span>
          )}
          {viewMode === 'ai-tippmix' && (
            <button
              onClick={aiRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-bv-blue hover:text-bv-blue-light transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Frissítés
            </button>
          )}
          {viewMode === 'ai-tippmix' && isUsingMockData && (
            <span className="flex items-center gap-1 text-xs text-bv-orange bg-bv-orange/10 border border-bv-orange/20 rounded-full px-2 py-0.5">
              <WifiOff size={10} />
              Demo mód
            </span>
          )}
        </div>

        {/* Filter tabs (csak AI módban) */}
        {viewMode === 'ai-tippmix' && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sportFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-bv-blue text-bv-bg'
                    : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tips List */}
      <div className="content-max-width pb-16">
        {/* Loading állapot */}
        {loading && filteredTips.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-3 w-24 bg-bv-bg-secondary rounded" />
                  <div className="h-3 w-12 bg-bv-bg-secondary rounded" />
                </div>
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-32 bg-bv-bg-secondary rounded" />
                  <div className="h-6 w-32 bg-bv-bg-secondary rounded" />
                </div>
                <div className="h-8 w-48 bg-bv-bg-secondary rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Tippek lista */}
        {!loading || filteredTips.length > 0 ? (
          <div className="space-y-4">
            {filteredTips.map((tip, idx) => {
              const vt = viewMode === 'vb-kvantitativ' ? (tip as any) : null;
              return (
              <div
                key={tip.id}
                className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5 md:p-6 hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* VB mód badge */}
                {viewMode === 'vb-kvantitativ' && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-0.5 text-xs">
                      <Trophy size={10} className="text-emerald-400" />
                      <span className="text-emerald-400 font-mono">{vt.group}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-0.5 text-xs">
                      <BarChart3 size={10} className="text-purple-400" />
                      <span className="text-purple-400">{vt.tipType}</span>
                    </span>
                    {vt.valuePct > 20 && (
                      <span className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-0.5 text-xs">
                        <TrendingUp size={10} className="text-green-400" />
                        <span className="text-green-400">+{vt.valuePct.toFixed(0)}% EV</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚽</span>
                    <span className="text-xs text-bv-text-muted uppercase tracking-wider">
                      {tip.league}
                      {viewMode === 'vb-kvantitativ' && ` • ${vt.venue}`}
                    </span>
                  </div>
                  <span className="text-xs text-bv-text-muted">{tip.time}</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold text-lg md:text-xl">{tip.homeTeam}</span>
                  <span className="text-bv-text-muted text-sm mx-3">VS</span>
                  <span className="text-white font-semibold text-lg md:text-xl">{tip.awayTeam}</span>
                </div>

                {/* AI Prediction */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {viewMode === 'vb-kvantitativ' ? (
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      vt.confidence >= 75 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      vt.confidence >= 60 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {vt.confidence}% Kvant
                    </div>
                  ) : (
                    <AIConfidenceBadge confidence={tip.aiConfidence} size="lg" />
                  )}
                  <span className="text-white font-semibold">
                    Tipp:{' '}
                    <span className={viewMode === 'vb-kvantitativ' ? 'text-emerald-400 ml-1' : 'text-bv-blue ml-1'}>
                      {tip.aiPick}
                    </span>
                  </span>
                  <span className={`font-mono text-2xl md:text-3xl font-bold ${viewMode === 'vb-kvantitativ' ? 'text-emerald-400' : 'text-bv-blue'}`}>
                    {tip.odds.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-bv-blue-light/10 border border-bv-blue-light/30 rounded-full px-3 py-1">
                    <Lock size={12} className="text-bv-blue-light" />
                    <span className="text-bv-blue-light text-xs font-mono">AUDITÁLT</span>
                  </span>
                </div>

                {/* VB mód: Value / Kelly infó */}
                {viewMode === 'vb-kvantitativ' && 'valuePct' in tip && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-bv-bg rounded-lg p-2.5 text-center">
                      <div className="text-xs text-bv-text-muted mb-1">+EV</div>
                      <div className="text-emerald-400 font-mono font-bold text-lg">
                        +{(tip as any).valuePct.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-bv-bg rounded-lg p-2.5 text-center">
                      <div className="text-xs text-bv-text-muted mb-1">Kelly tét</div>
                      <div className="text-bv-blue font-mono font-bold text-lg">
                        {(tip as any).stakeFt.toLocaleString('hu-HU')} Ft
                      </div>
                    </div>
                    <div className="bg-bv-bg rounded-lg p-2.5 text-center">
                      <div className="text-xs text-bv-text-muted mb-1">Kelly %</div>
                      <div className="text-purple-400 font-mono font-bold text-lg">
                        {(tip as any).halfKellyPct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Valószínűségi sáv (VB mód) */}
                {viewMode === 'vb-kvantitativ' && 'homeWinProb' in tip && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-bv-text-muted mb-1">
                      <span>{tip.homeTeam}</span>
                      <span>Döntetlen</span>
                      <span>{tip.awayTeam}</span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-bv-bg">
                      <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${(tip as any).homeWinProb}%` }}
                      />
                      <div
                        className="bg-yellow-500 transition-all"
                        style={{ width: `${(tip as any).drawProb}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${(tip as any).awayWinProb}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-bv-text-muted mt-1">
                      <span className="text-blue-400">{(tip as any).homeWinProb.toFixed(0)}%</span>
                      <span className="text-yellow-400">{(tip as any).drawProb.toFixed(0)}%</span>
                      <span className="text-red-400">{(tip as any).awayWinProb.toFixed(0)}%</span>
                    </div>
                  </div>
                )}

                {/* Analysis */}
                <div className="mb-4">
                  <p
                    className={`text-bv-text-secondary text-sm leading-relaxed ${
                      expandedTip === tip.id ? '' : 'line-clamp-2'
                    }`}
                  >
                    {vt.reasoning || (tip as any).analysis || ''}
                  </p>

                  {/* Korrekciós faktorok (VB mód) */}
                  {viewMode === 'vb-kvantitativ' && (tip as any).correctionFactors?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {(tip as any).correctionFactors.map((cf: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-bv-text-muted">
                          <span className="text-orange-400 mt-0.5">📰</span>
                          <span>{cf}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(vt.reasoning?.length > 120 || (tip as any).analysis?.length > 120) && (
                    canExpandAnalysis ? (
                      <button
                        onClick={() =>
                          setExpandedTip(expandedTip === tip.id ? null : tip.id)
                        }
                        className="text-bv-blue text-xs mt-1 hover:underline flex items-center gap-1"
                      >
                        {expandedTip === tip.id ? 'Kevesebb' : 'Mutass többet'}
                        <ChevronDown
                          size={12}
                          className={`transition-transform ${expandedTip === tip.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : (
                      <PremiumUpgradeLink text="PRO kell a teljes elemzéshez" />
                    )
                  )}
                </div>

                {/* Stats mini-grid */}
                <div className="flex flex-wrap items-center gap-6 mb-4 text-xs">
                  <div>
                    <span className="text-bv-text-muted block mb-1">{tip.homeTeam} forma</span>
                    <div className="flex gap-1">{getFormDots(tip.homeForm)}</div>
                  </div>
                  <div>
                    <span className="text-bv-text-muted block mb-1">{tip.awayTeam} forma</span>
                    <div className="flex gap-1">{getFormDots(tip.awayForm)}</div>
                  </div>
                  {tip.h2h && (
                    <div>
                      <span className="text-bv-text-muted block mb-1">H2H</span>
                      <span className="text-white font-mono">{tip.h2h}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    addItem({
                      id: `${tip.matchId}-${tip.id}`,
                      match: `${tip.homeTeam} - ${tip.awayTeam}`,
                      market: tip.aiPick.split(' ')[0],
                      odds: tip.odds,
                    })
                  }
                  className="inline-flex items-center gap-2 border border-bv-blue/40 text-bv-blue text-sm px-4 py-2 rounded-lg hover:bg-bv-blue/10 transition-all"
                >
                  <Plus size={14} />
                  Tipp hozzáadása a kalkulátorhoz
                </button>
              </div>
            );
          })}
        </div>
        ) : null}

        {/* VB Portfolio Dashboard */}
        {viewMode === 'vb-kvantitativ' && (
          <div className="mt-16 bg-gradient-to-br from-bv-bg-secondary to-bv-bg-tertiary rounded-2xl p-6 md:p-8 border border-emerald-500/10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              🏦 PORTFÓLIÓ — 100.000 Ft
            </h2>
            <p className="text-bv-text-muted text-sm mb-6">{vbPortfolio.strategyName}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Induló bankroll', value: `${vbPortfolio.initialBankroll.toLocaleString('hu-HU')} Ft`, color: 'text-white' },
                { label: 'Lefedett tétek', value: `${vbPortfolio.totalStake.toLocaleString('hu-HU')} Ft`, color: 'text-emerald-400' },
                { label: 'Szabad egyenleg', value: `${vbPortfolio.remainingBankroll.toLocaleString('hu-HU')} Ft`, color: 'text-bv-blue' },
                { label: 'Felhasználás', value: `${vbPortfolio.allocationPct}%`, color: 'text-purple-400' },
              ].map((metric) => (
                <div key={metric.label} className="bg-bv-bg rounded-xl p-4 text-center">
                  <div className={`text-2xl md:text-3xl font-mono font-bold ${metric.color} mb-1`}>{metric.value}</div>
                  <div className="text-bv-text-muted text-xs">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Strategy details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bv-bg/50 rounded-xl p-4 border border-green-500/10">
                <h4 className="text-emerald-400 text-sm font-semibold mb-2">⚙️ Kockázatkezelés</h4>
                <ul className="text-xs text-bv-text-secondary space-y-1.5">
                  <li>• Kelly módszer: Half-Kelly</li>
                  <li>• Max napi kockázat: {vbPortfolio.maxDailyRisk.toLocaleString('hu-HU')} Ft (25%)</li>
                  <li>• Max tét/tipp: 15.000 Ft</li>
                </ul>
              </div>
              <div className="bg-bv-bg/50 rounded-xl p-4 border border-red-500/10">
                <h4 className="text-red-400 text-sm font-semibold mb-2">⛔ Stop-loss</h4>
                <ul className="text-xs text-bv-text-secondary space-y-1.5">
                  <li>• Küszöb: {vbPortfolio.stopLossLevel.toLocaleString('hu-HU')} Ft</li>
                  <li>• Ha a bankroll ide esik → szünet</li>
                  <li>• Következő nap: csak 50% Kelly</li>
                </ul>
              </div>
              <div className="bg-bv-bg/50 rounded-xl p-4 border border-blue-500/10">
                <h4 className="text-blue-400 text-sm font-semibold mb-2">📈 Take-profit</h4>
                <ul className="text-xs text-bv-text-secondary space-y-1.5">
                  <li>• Cél: {vbPortfolio.takeProfitLevel.toLocaleString('hu-HU')} Ft</li>
                  <li>• Profit kivétel +50% felett</li>
                  <li>• Újraindítás 100.000 Ft-tal</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI Performance Dashboard (csak AI módban) */}
        {viewMode === 'ai-tippmix' && (
          <div className="mt-16 bg-bv-bg-secondary rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">AI TELJESÍTMÉNY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Ebben a hónapban', value: `+${aiPerformance.monthlyProfit} egység`, color: 'text-bv-blue' },
                { label: 'Nyertes tippek', value: `${aiPerformance.winRate}%`, color: 'text-bv-blue' },
                { label: 'Átlag odds', value: aiPerformance.avgOdds.toFixed(2), color: 'text-white' },
                { label: 'Profit faktor', value: aiPerformance.profitFactor.toFixed(2), color: 'text-bv-blue-light' },
              ].map((metric) => (
                <div key={metric.label} className="bg-bv-bg rounded-xl p-4 text-center">
                  <div className={`text-2xl md:text-3xl font-mono font-bold ${metric.color} mb-1`}>{metric.value}</div>
                  <div className="text-bv-text-muted text-xs">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
