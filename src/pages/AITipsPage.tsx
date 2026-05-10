import { useState } from 'react';
import { Plus, ChevronDown, Lock } from 'lucide-react';
import { aiTips, aiPerformance } from '@/data/mockData';
import { useBetSlipStore } from '@/stores/betSlipStore';
import AIConfidenceBadge from '@/components/AIConfidenceBadge';
import RiskProfileSelector from '@/components/RiskProfileSelector';

const sportFilters = ['ÖSSZES', 'LABDARÚGÁS', 'TENISZ', 'KOSÁRLABDA', 'JÉGKORONG', 'E-SPORT'];

function getFormDots(form: string) {
  return form.split('').map((char, i) => {
    const color =
      char === 'W' ? 'bg-bv-blue' : char === 'D' ? 'bg-yellow-500' : 'bg-bv-orange';
    return <span key={i} className={`w-2 h-2 rounded-full ${color}`} />;
  });
}

export default function AITipsPage() {
  const [activeFilter, setActiveFilter] = useState('ÖSSZES');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const { addItem } = useBetSlipStore();

  const filteredTips =
    activeFilter === 'ÖSSZES'
      ? aiTips
      : aiTips.filter((t) => t.sport === 'foci'); // Simplified filter

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      {/* Hero */}
      <div className="py-16 md:py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          AI TIPPMIX TIPPEK
        </h1>
        <p className="text-bv-text-secondary text-base md:text-lg max-w-xl mx-auto mb-8">
          Naponta frissülő, mesterséges intelligencia által generált fogadási ajánlások
        </p>

        {/* AI Kockázati Profil */}
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-bv-text-muted text-sm uppercase tracking-wider mb-4">Válaszd ki a kockázati szintedet</p>
          <RiskProfileSelector />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sportFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-bv-blue text-bv-bg'
                  : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
              }`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tips List */}
      <div className="content-max-width pb-16">
        <div className="space-y-4">
          {filteredTips.map((tip, idx) => (
            <div
              key={tip.id}
              className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5 md:p-6 hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${idx * 80}ms` }}>
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚽</span>
                  <span className="text-xs text-bv-text-muted uppercase tracking-wider">
                    {tip.league}
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
                <AIConfidenceBadge confidence={tip.aiConfidence} size="lg" />
                <span className="text-white font-semibold">
                  AI Választás:{''}
                  <span className="text-bv-blue ml-1">{tip.aiPick}</span>
                </span>
                <span className="font-mono text-2xl md:text-3xl font-bold text-bv-blue">
                  {tip.odds.toFixed(2)}
                </span>
                {/* Blockchain Audit Badge */}
                <span className="flex items-center gap-1.5 bg-bv-blue-light/10 border border-bv-blue-light/30 rounded-full px-3 py-1">
                  <Lock size={12} className="text-bv-blue-light" />
                  <span className="text-bv-blue-light text-xs font-mono">AUDITÁLT</span>
                </span>
              </div>

              {/* Analysis */}
              <div className="mb-4">
                <p
                  className={`text-bv-text-secondary text-sm leading-relaxed ${
                    expandedTip === tip.id ? '' : 'line-clamp-2'
                  }`}>
                  {tip.analysis}
                </p>
                {tip.analysis.length > 120 && (
                  <button
                    onClick={() =>
                      setExpandedTip(expandedTip === tip.id ? null : tip.id)
                    }
                    className="text-bv-blue text-xs mt-1 hover:underline flex items-center gap-1">
                    {expandedTip === tip.id ? 'Kevesebb' : 'Mutass többet'}
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${expandedTip === tip.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* Stats mini-grid */}
              <div className="flex flex-wrap items-center gap-6 mb-4 text-xs">
                <div>
                  <span className="text-bv-text-muted block mb-1">Hazai forma</span>
                  <div className="flex gap-1">{getFormDots(tip.homeForm)}</div>
                </div>
                <div>
                  <span className="text-bv-text-muted block mb-1">Vendég forma</span>
                  <div className="flex gap-1">{getFormDots(tip.awayForm)}</div>
                </div>
                <div>
                  <span className="text-bv-text-muted block mb-1">H2H</span>
                  <span className="text-white font-mono">{tip.h2h}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  addItem({
                    id: `${tip.matchId}-ai`,
                    match: `${tip.homeTeam} - ${tip.awayTeam}`,
                    market: tip.aiPick.split(' ')[0],
                    odds: tip.odds,
                  })
                }
                className="inline-flex items-center gap-2 border border-bv-blue/40 text-bv-blue text-sm px-4 py-2 rounded-lg hover:bg-bv-blue/10 transition-all">
                <Plus size={14} />
                Tipp hozzáadása a kalkulátorhoz
              </button>
            </div>
          ))}
        </div>

        {/* AI Performance Dashboard */}
        <div className="mt-16 bg-bv-bg-secondary rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
            AI TELJESÍTMÉNY
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Ebben a hónapban', value: `+${aiPerformance.monthlyProfit} egység`, color: 'text-bv-blue' },
              { label: 'Nyertes tippek', value: `${aiPerformance.winRate}%`, color: 'text-bv-blue' },
              { label: 'Átlag odds', value: aiPerformance.avgOdds.toFixed(2), color: 'text-white' },
              { label: 'Profit faktor', value: aiPerformance.profitFactor.toFixed(2), color: 'text-bv-blue-light' },
            ].map((metric) => (
              <div key={metric.label} className="bg-bv-bg rounded-xl p-4 text-center">
                <div className={`text-2xl md:text-3xl font-mono font-bold ${metric.color} mb-1`}>
                  {metric.value}
                </div>
                <div className="text-bv-text-muted text-xs">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="bg-bv-bg rounded-xl p-4">
            <h4 className="text-white text-sm font-semibold mb-4">30 napos teljesítmény</h4>
            <svg viewBox="0 0 600 120" className="w-full h-28">
              {/* Grid lines */}
              {[0, 30, 60, 90].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}
              {/* Area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Build path from performance data */}
              {(() => {
                const data = aiPerformance.dailyHistory;
                const maxVal = Math.max(...data.map(Math.abs));
                const points = data.map((val, i) => {
                  const x = (i / (data.length - 1)) * 580 + 10;
                  const y = 60 - (val / maxVal) * 50;
                  return `${x},${y}`;
                });
                const areaPath = `M10,60 ${points.map((p) => `L${p}`).join(' ')} L590,60 Z`;
                const linePath = `M${points.join(' L')}`;
                return (
                  <>
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#00D4FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* End dot */}
                    <circle
                      cx={points[points.length - 1].split(',')[0]}
                      cy={points[points.length - 1].split(',')[1]}
                      r="4"
                      fill="#00D4FF"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
