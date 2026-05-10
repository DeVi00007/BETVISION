import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Shield, Swords, BarChart3 } from 'lucide-react';
import { liveMatches } from '@/data/mockData';
import AIConfidenceBadge from '@/components/AIConfidenceBadge';

const tabs = ['ÁTTEKINTÉS', 'STATISZTIKA', 'AI ELEMZÉS', 'H2H', 'KERESZT'];

const matchData = {
  shots: { home: 12, away: 5 },
  possession: { home: 58, away: 42 },
  xG: { home: 2.4, away: 0.8 },
  corners: { home: 6, away: 2 },
  fouls: { home: 8, away: 12 },
  cards: { home: 1, away: 3 },
};

const h2hHistory = [
  { date: '2024.10.27', home: 'Barcelona', away: 'Real Madrid', score: '4-0', winner: 'home' },
  { date: '2024.04.22', home: 'Real Madrid', away: 'Barcelona', score: '3-2', winner: 'home' },
  { date: '2024.01.15', home: 'Barcelona', away: 'Real Madrid', score: '2-1', winner: 'home' },
  { date: '2023.10.29', home: 'Real Madrid', away: 'Barcelona', score: '1-2', winner: 'away' },
  { date: '2023.03.20', home: 'Barcelona', away: 'Real Madrid', score: '2-1', winner: 'home' },
];

export default function AnalyticsPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('AI ELEMZÉS');

  const match = liveMatches.find((m) => m.id === matchId) || liveMatches[1];

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      <div className="content-max-width py-8">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-bv-text-secondary hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          Vissza az élő odds-okhoz
        </Link>

        {/* Match Header */}
        <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-xs text-bv-text-muted uppercase tracking-wider">{match.league}</span>
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-2xl font-bold text-white mb-2 mx-auto">
                {match.homeTeam[0]}
              </div>
              <span className="text-white font-bold text-xl">{match.homeTeam}</span>
            </div>

            <div className="text-center">
              <div className="font-mono text-5xl font-bold text-white mb-1">
                {match.homeScore}-{match.awayScore}
              </div>
              <span className="text-bv-blue text-sm font-semibold animate-pulse">ÉLŐ 67'</span>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl font-bold text-white mb-2 mx-auto">
                {match.awayTeam[0]}
              </div>
              <span className="text-white font-bold text-xl">{match.awayTeam}</span>
            </div>
          </div>

          {/* Odds */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {[
              { label: '1', odds: match.homeOdds, color: match.aiPick === '1' ? 'text-bv-blue' : 'text-white' },
              { label: 'X', odds: match.drawOdds, color: 'text-white' },
              { label: '2', odds: match.awayOdds, color: match.aiPick === '2' ? 'text-bv-blue' : 'text-white' },
            ].map((o) => (
              <div key={o.label} className="text-center bg-bv-bg rounded-lg px-6 py-3">
                <div className={`font-mono text-2xl font-bold ${o.color}`}>{o.odds.toFixed(2)}</div>
                <div className="text-bv-text-muted text-xs">{o.label}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <AIConfidenceBadge confidence={match.aiConfidence} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-bv-blue text-bv-bg'
                  : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'AI ELEMZÉS' && (
          <div className="space-y-6">
            {/* AI Preview */}
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-bv-blue" />
                AI Mérkőzés Elemzés
              </h3>
              <div className="space-y-3 text-bv-text-secondary text-sm leading-relaxed">
                <p>
                  A Barcelona hazai pályán a Camp Nou-ban rendkívül erős teljesítményt nyújt. A csapat 
                  az utóbbi 10 hazai mérkőzéséből 8-at megnyert, és csupán 2 döntetlent játszott. 
                  Lewandowski kiváló formában van, az utóbbi 5 meccsen 7 gólt szerzett.
                </p>
                <p>
                  A Real Madridnak Bellingham sérülése komoly veszteség a középpályán. Vincius Jr. és 
                  Rodrygo sem tudták eddig pótolni a hiányzó kreativitást. A védelem pedig gyenge 
                  teljesítményt nyújt idegenben.
                </p>
              </div>

              {/* Key Factors */}
              <div className="mt-5 space-y-2">
                <h4 className="text-white text-sm font-semibold mb-2">Kulcsfaktorok</h4>
                {[
                  { icon: TrendingUp, label: 'Forma', text: 'Barcelona: 5 meccses veretlenség hazai pályán' },
                  { icon: Shield, label: 'Sérülések', text: 'Real Madrid: Bellingham (középpálya) kiesett' },
                  { icon: Swords, label: 'Motiváció', text: 'Bajnoki címért harcol mindkét csapat' },
                ].map((factor) => (
                  <div key={factor.label} className="flex items-start gap-3 bg-bv-bg rounded-lg p-3">
                    <factor.icon size={16} className="text-bv-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white text-sm font-medium">{factor.label}:</span>{' '}
                      <span className="text-bv-text-secondary text-sm">{factor.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Probability Bars */}
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Valószínűségi Eloszlás (AI)</h3>
              <div className="space-y-4">
                {[
                  { label: `${match.homeTeam} győzelem`, value: 62, color: 'from-bv-green to-emerald-400' },
                  { label: 'Döntetlen', value: 22, color: 'from-yellow-500 to-amber-400' },
                  { label: `${match.awayTeam} győzelem`, value: 16, color: 'from-bv-orange to-red-400' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-bv-text-secondary">{bar.label}</span>
                      <span className="text-white font-mono font-semibold">{bar.value}%</span>
                    </div>
                    <div className="h-3 bg-bv-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${bar.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* xG Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 text-center">
                <h4 className="text-white text-sm font-semibold mb-4">xG — {match.homeTeam}</h4>
                <div className="relative w-28 h-28 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="#00D4FF" strokeWidth="8"
                      strokeDasharray={`${2.4 * 66} ${264 - 2.4 * 66}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-bv-blue">2.4</span>
                  </div>
                </div>
              </div>
              <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 text-center">
                <h4 className="text-white text-sm font-semibold mb-4">xG — {match.awayTeam}</h4>
                <div className="relative w-28 h-28 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="#F59E0B" strokeWidth="8"
                      strokeDasharray={`${0.8 * 66} ${264 - 0.8 * 66}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-bv-orange">0.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Csapat Erősség Radar</h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 300 260" className="w-full max-w-sm">
                  {/* Pentagon grid */}
                  {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
                    <polygon
                      key={scale}
                      points={getPentagonPoints(100 * scale, 150, 120)}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Axis labels */}
                  {['Támadás', 'Védelem', 'Forma', 'Otthon/Idegen', 'Motiváció'].map((label, i) => {
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    const x = 150 + 135 * Math.cos(angle);
                    const y = 120 + 135 * Math.sin(angle);
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#888"
                        fontSize="10"
                      >
                        {label}
                      </text>
                    );
                  })}
                  {/* Home team (green) */}
                  <polygon
                    points={getPentagonPointsForValues([85, 72, 90, 88, 92], 150, 120)}
                    fill="rgba(0,255,148,0.15)"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  />
                  {/* Away team (red) */}
                  <polygon
                    points={getPentagonPointsForValues([70, 65, 75, 55, 85], 150, 120)}
                    fill="rgba(255,51,102,0.1)"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                  {/* Legend */}
                  <rect x="80" y="240" width="8" height="8" fill="#00D4FF" rx="2" />
                  <text x="94" y="248" fill="#fff" fontSize="10">{match.homeTeam}</text>
                  <rect x="170" y="240" width="8" height="8" fill="#F59E0B" rx="2" />
                  <text x="184" y="248" fill="#fff" fontSize="10">{match.awayTeam}</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'STATISZTIKA' && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-bv-blue-light" />
              Mérkőzés Statisztikák
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(matchData).map(([key, val]) => (
                <div key={key} className="bg-bv-bg rounded-lg p-4">
                  <span className="text-bv-text-muted text-xs uppercase block mb-2">{key}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-bv-blue font-bold text-lg">{val.home}</span>
                    <span className="text-bv-text-muted text-xs">vs</span>
                    <span className="font-mono text-bv-orange font-bold text-lg">{val.away}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'H2H' && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-6">Korábbi Találkozások</h3>
            <div className="space-y-3">
              {h2hHistory.map((game, i) => (
                <div key={i} className="flex items-center justify-between bg-bv-bg rounded-lg p-4">
                  <span className="text-bv-text-muted text-xs w-24">{game.date}</span>
                  <div className="flex items-center gap-3 flex-1 justify-center">
                    <span className={`text-sm font-medium ${game.winner === 'home' && game.home === match.homeTeam ? 'text-bv-blue' : 'text-white'}`}>
                      {game.home}
                    </span>
                    <span className="font-mono text-white font-bold px-3 py-1 bg-bv-bg-secondary rounded">
                      {game.score}
                    </span>
                    <span className={`text-sm font-medium ${game.winner === 'away' && game.away === match.awayTeam ? 'text-bv-orange' : 'text-white'}`}>
                      {game.away}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-bv-blue">3</div>
                <div className="text-bv-text-muted text-xs">{match.homeTeam} győzelem</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-yellow-500">1</div>
                <div className="text-bv-text-muted text-xs">Döntetlen</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-bv-orange">1</div>
                <div className="text-bv-text-muted text-xs">{match.awayTeam} győzelem</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ÁTTEKINTÉS' && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-8 text-center">
            <p className="text-bv-text-muted">Válaszd az AI ELEMZÉS vagy STATISZTIKA fület a részletes adatokért.</p>
          </div>
        )}

        {activeTab === 'KERESZT' && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-8 text-center">
            <p className="text-bv-text-muted">Keresztstatisztika hamarosan elérhető.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getPentagonPoints(radius: number, cx: number, cy: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function getPentagonPointsForValues(values: number[], cx: number, cy: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const radius = (values[i] / 100) * 100;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(' ');
}
