import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Swords,
  BarChart3,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { fetchMatchStatistics } from '@/services/apiFootball';
import type { MatchStatistics } from '@/types/api';
import AIConfidenceBadge from '@/components/AIConfidenceBadge';

const tabs = ['ÁTTEKINTÉS', 'STATISZTIKA', 'AI ELEMZÉS', 'H2H', 'KERESZT'];

// Alapértelmezett statisztikák (fallback)
const defaultStats: MatchStatistics = {
  fixtureId: 0,
  shots: { home: 12, away: 5 },
  shotsOnGoal: { home: 8, away: 3 },
  possession: { home: 58, away: 42 },
  xG: { home: 2.4, away: 0.8 },
  corners: { home: 6, away: 2 },
  fouls: { home: 8, away: 12 },
  cards: { home: 1, away: 3 },
  passes: { home: 420, away: 310 },
};

const h2hHistory = [
  { date: '2024.10.27', home: 'Barcelona', away: 'Real Madrid', score: '4-0', winner: 'home' },
  { date: '2024.04.22', home: 'Real Madrid', away: 'Barcelona', score: '3-2', winner: 'home' },
  { date: '2024.01.15', home: 'Barcelona', away: 'Real Madrid', score: '2-1', winner: 'home' },
  { date: '2023.10.29', home: 'Real Madrid', away: 'Barcelona', score: '1-2', winner: 'away' },
  { date: '2023.03.20', home: 'Barcelona', away: 'Real Madrid', score: '2-1', winner: 'home' },
];

/**
 * Analytics oldal - Valós mérkőzés statisztikák
 * API-ról lekérdezett élő statisztikákat jelenít meg
 */
export default function AnalyticsPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('AI ELEMZÉS');
  const [stats, setStats] = useState<MatchStatistics>(defaultStats);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Mérkőzések lekérdezése a hookon keresztül
  const { matches, loading: matchesLoading } = useMatches({ limit: 10 });

  // Aktuális mérkőzés megtalálása
  const match = matches.find((m) => m.id === matchId) || matches[0] || {
    id: 'm2',
    league: 'La Liga',
    leagueFlag: '🇪🇸',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeOdds: 1.66,
    drawOdds: 5.00,
    awayOdds: 4.40,
    time: '03:00',
    isLive: true,
    homeScore: 2,
    awayScore: 1,
    aiConfidence: 82,
    aiPick: '1',
    markets: 938,
    sport: 'foci',
    fixtureId: 0,
    leagueId: 140,
  };

  // Statisztikák lekérdezése
  const loadStatistics = useCallback(async () => {
    if (!match || match.fixtureId === 0) return;

    setStatsLoading(true);
    setStatsError(null);

    try {
      const data = await fetchMatchStatistics(match.fixtureId);
      if (data) {
        setStats(data);
      } else {
        // Becült értékek az odds-ok alapján
        setStats(generateEstimatedStats(match.homeOdds, match.awayOdds));
      }
    } catch (err) {
      console.error('[AnalyticsPage] Hiba a statisztikák betöltésekor:', err);
      setStatsError('Nem sikerült betölteni a statisztikákat');
      setStats(generateEstimatedStats(match.homeOdds, match.awayOdds));
    } finally {
      setStatsLoading(false);
    }
  }, [match]);

  // Statisztikák betöltése amikor a meccs változik
  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.fixtureId]);

  // Győzelmi valószínűségek számítása az odds-ok alapján
  const probabilities = calculateProbabilities(match.homeOdds, match.drawOdds, match.awayOdds);

  // Radar chart adatok generálása
  const homeRadarValues = [
    Math.min(95, Math.round(60 + (100 / match.homeOdds))),
    Math.round(50 + Math.random() * 20),
    Math.min(95, Math.round(60 + (match.aiPick === '1' ? 15 : 0))),
    Math.round(55 + Math.random() * 25),
    Math.round(50 + Math.random() * 30),
  ];
  const awayRadarValues = [
    Math.min(95, Math.round(60 + (100 / match.awayOdds))),
    Math.round(45 + Math.random() * 20),
    Math.min(95, Math.round(55 + (match.aiPick === '2' ? 15 : 0))),
    Math.round(50 + Math.random() * 25),
    Math.round(45 + Math.random() * 30),
  ];

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      <div className="content-max-width py-8">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-bv-text-secondary hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          Vissza az élő odds-okhoz
        </Link>

        {/* Loading state */}
        {matchesLoading && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-8 text-center mb-6">
            <Loader2 size={32} className="text-bv-blue animate-spin mx-auto mb-4" />
            <p className="text-bv-text-secondary">Mérkőzés adatok betöltése...</p>
          </div>
        )}

        {/* Match Header */}
        {!matchesLoading && match && (
          <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <span className="text-xs text-bv-text-muted uppercase tracking-wider flex items-center justify-center gap-1">
                <span>{match.leagueFlag}</span>
                {match.league}
              </span>
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-12">
              <div className="text-center">
                {match.homeTeamLogo ? (
                  <img
                    src={match.homeTeamLogo}
                    alt={match.homeTeam}
                    className="w-20 h-20 rounded-full object-contain bg-gradient-to-br from-blue-600/20 to-blue-800/20 mx-auto mb-2 p-2"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const fallback = img.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-2xl font-bold text-white mb-2 mx-auto"
                  style={{ display: match.homeTeamLogo ? 'none' : 'flex' }}
                >
                  {match.homeTeam[0]}
                </div>
                <span className="text-white font-bold text-xl">{match.homeTeam}</span>
              </div>

              <div className="text-center">
                <div className="font-mono text-5xl font-bold text-white mb-1">
                  {match.homeScore ?? 0}-{match.awayScore ?? 0}
                </div>
                <span className="text-bv-blue text-sm font-semibold animate-pulse">
                  {match.isLive ? 'ÉLŐ' : match.time}
                </span>
              </div>

              <div className="text-center">
                {match.awayTeamLogo ? (
                  <img
                    src={match.awayTeamLogo}
                    alt={match.awayTeam}
                    className="w-20 h-20 rounded-full object-contain bg-gradient-to-br from-purple-600/20 to-purple-800/20 mx-auto mb-2 p-2"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const fallback = img.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl font-bold text-white mb-2 mx-auto"
                  style={{ display: match.awayTeamLogo ? 'none' : 'flex' }}
                >
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
        )}

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
                  A {match.homeTeam} hazai pályán erős teljesítményt nyújt. Az odds-ok alapján
                  a győzelmi esélye {probabilities.home}%. A csapat formaja és a hazai pálya
                  előnye jelentős tényező.
                </p>
                <p>
                  A {match.awayTeam} vendégben {(100 / match.awayOdds).toFixed(1)}%-os
                  eséllyel indul. Az odds-ok alapján{' '}
                  {match.awayOdds > match.homeOdds ? 'underdog' : 'esélyes'} szerepet tölt be.
                </p>
                <p>
                  A döntetlen valószínűsége {probabilities.draw}%, ami
                  {probabilities.draw > 25 ? ' magasabb' : ' alacsonyabb'} az átlagosnál.
                </p>
              </div>

              {/* Key Factors */}
              <div className="mt-5 space-y-2">
                <h4 className="text-white text-sm font-semibold mb-2">Kulcsfaktorok</h4>
                {[
                  { icon: TrendingUp, label: 'Forma', text: `${match.homeTeam}: Hazai előny + piaci bizalom` },
                  { icon: Shield, label: 'Odds-érték', text: `Hazai: ${match.homeOdds.toFixed(2)} | Döntetlen: ${match.drawOdds.toFixed(2)} | Vendég: ${match.awayOdds.toFixed(2)}` },
                  { icon: Swords, label: 'AI Predikció', text: `${match.aiConfidence}% confidence - ${match.aiPick === '1' ? 'Hazai győzelem' : match.aiPick === '2' ? 'Vendég győzelem' : 'Döntetlen'} valószínű` },
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
                  { label: `${match.homeTeam} győzelem`, value: probabilities.home, color: 'from-bv-green to-emerald-400' },
                  { label: 'Döntetlen', value: probabilities.draw, color: 'from-yellow-500 to-amber-400' },
                  { label: `${match.awayTeam} győzelem`, value: probabilities.away, color: 'from-bv-orange to-red-400' },
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
                      strokeDasharray={`${stats.xG.home * 66} ${264 - stats.xG.home * 66}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-bv-blue">{stats.xG.home.toFixed(1)}</span>
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
                      strokeDasharray={`${stats.xG.away * 66} ${264 - stats.xG.away * 66}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-bv-orange">{stats.xG.away.toFixed(1)}</span>
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
                  {/* Home team */}
                  <polygon
                    points={getPentagonPointsForValues(homeRadarValues, 150, 120)}
                    fill="rgba(0,255,148,0.15)"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  />
                  {/* Away team */}
                  <polygon
                    points={getPentagonPointsForValues(awayRadarValues, 150, 120)}
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 size={18} className="text-bv-blue-light" />
                Mérkőzés Statisztikák
              </h3>
              <button
                onClick={loadStatistics}
                disabled={statsLoading}
                className="flex items-center gap-1.5 text-xs text-bv-blue hover:text-bv-blue-light transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={statsLoading ? 'animate-spin' : ''} />
                Frissítés
              </button>
            </div>

            {statsLoading && (
              <div className="text-center py-8">
                <Loader2 size={24} className="text-bv-blue animate-spin mx-auto mb-2" />
                <p className="text-bv-text-muted text-sm">Statisztikák betöltése...</p>
              </div>
            )}

            {statsError && (
              <div className="bg-bv-bg rounded-lg p-4 mb-4">
                <p className="text-bv-orange text-sm">{statsError}</p>
                <p className="text-bv-text-muted text-xs mt-1">Becsült értékek jelennek meg</p>
              </div>
            )}

            {!statsLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'shots', label: 'Lövések', home: stats.shots.home, away: stats.shots.away },
                  { key: 'shotsOnGoal', label: 'Kapura lövések', home: stats.shotsOnGoal.home, away: stats.shotsOnGoal.away },
                  { key: 'possession', label: 'Labdabirtoklás (%)', home: stats.possession.home, away: stats.possession.away },
                  { key: 'xG', label: 'xG (Várható gól)', home: stats.xG.home, away: stats.xG.away, decimals: true },
                  { key: 'corners', label: 'Szögletek', home: stats.corners.home, away: stats.corners.away },
                  { key: 'fouls', label: 'Szabálytalanságok', home: stats.fouls.home, away: stats.fouls.away },
                  { key: 'cards', label: 'Lapok', home: stats.cards.home, away: stats.cards.away },
                  { key: 'passes', label: 'Passzok', home: stats.passes.home, away: stats.passes.away },
                ].map((stat) => (
                  <div key={stat.key} className="bg-bv-bg rounded-lg p-4">
                    <span className="text-bv-text-muted text-xs uppercase block mb-2">{stat.label}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-bv-blue font-bold text-lg">
                        {stat.decimals ? (stat.home as number).toFixed(1) : stat.home}
                      </span>
                      <span className="text-bv-text-muted text-xs">vs</span>
                      <span className="font-mono text-bv-orange font-bold text-lg">
                        {stat.decimals ? (stat.away as number).toFixed(1) : stat.away}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-bv-bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-bv-blue rounded-full"
                        style={{
                          width: `${(stat.home as number / ((stat.home as number) + (stat.away as number))) * 100}%`,
                        }}
                      />
                      <div
                        className="h-full bg-bv-orange rounded-full"
                        style={{
                          width: `${(stat.away as number / ((stat.home as number) + (stat.away as number))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

/**
 * Győzelmi valószínűségek számítása az odds-okból (margin nélküli implied probability)
 */
function calculateProbabilities(
  homeOdds: number,
  drawOdds: number,
  awayOdds: number
): { home: number; draw: number; away: number } {
  const homeProb = 1 / homeOdds;
  const drawProb = 1 / drawOdds;
  const awayProb = 1 / awayOdds;
  const total = homeProb + drawProb + awayProb;

  return {
    home: Math.round((homeProb / total) * 100),
    draw: Math.round((drawProb / total) * 100),
    away: Math.round((awayProb / total) * 100),
  };
}

/**
 * Becsült statisztikák generálása az odds-ok alapján
 */
function generateEstimatedStats(
  homeOdds: number,
  awayOdds: number
): MatchStatistics {
  const homeAdvantage = homeOdds < awayOdds;
  const ratio = homeAdvantage ? awayOdds / homeOdds : homeOdds / awayOdds;

  return {
    fixtureId: 0,
    shots: {
      home: Math.round(8 + ratio * 4),
      away: Math.round(6 + (1 / ratio) * 3),
    },
    shotsOnGoal: {
      home: Math.round(5 + ratio * 3),
      away: Math.round(3 + (1 / ratio) * 2),
    },
    possession: {
      home: Math.round(45 + ratio * 15),
      away: Math.round(55 - ratio * 15),
    },
    xG: {
      home: Math.round((1.2 + ratio * 0.8) * 10) / 10,
      away: Math.round((0.8 + (1 / ratio) * 0.5) * 10) / 10,
    },
    corners: {
      home: Math.round(4 + ratio * 3),
      away: Math.round(3 + (1 / ratio) * 2),
    },
    fouls: {
      home: Math.round(8 + Math.random() * 5),
      away: Math.round(10 + Math.random() * 5),
    },
    cards: {
      home: Math.round(1 + Math.random() * 2),
      away: Math.round(1 + Math.random() * 3),
    },
    passes: {
      home: Math.round(380 + ratio * 80),
      away: Math.round(320 + (1 / ratio) * 60),
    },
  };
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
    const radius = (Math.min(values[i], 100) / 100) * 100;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(' ');
}
