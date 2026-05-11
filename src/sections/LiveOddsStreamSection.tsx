import { useEffect } from 'react';
import { Bookmark, Plus, TrendingUp, RefreshCw, WifiOff } from 'lucide-react';
import { useLiveOddsStore } from '@/stores/liveOddsStore';
import { useBetSlipStore } from '@/stores/betSlipStore';
import { useLiveOdds } from '@/hooks/useLiveOdds';
import { featuredMatch as fallbackFeatured } from '@/data/mockData';
import OddsDisplayCell from '@/components/OddsDisplayCell';
import AIConfidenceBadge from '@/components/AIConfidenceBadge';
import SectionHeader from '@/components/SectionHeader';

export default function LiveOddsStreamSection() {
  const { matches, loading, error, lastUpdated, refresh, isUsingMockData } = useLiveOdds();
  const { odds, init, updateOdds } = useLiveOddsStore();
  const { addItem } = useBetSlipStore();

  // Store inicializálás az API adatokkal
  useEffect(() => {
    if (matches.length > 0) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches.length]);

  // Helyi odds frissítés az animációkhoz (5-15 mp véletlenszerű)
  useEffect(() => {
    const interval = setInterval(() => {
      updateOdds();
    }, 5000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [updateOdds]);

  // Featured match kiválasztása - első élő meccs, vagy első meccs
  const liveMatch = matches.find((m) => m.isLive);
  const featuredMatch = liveMatch || matches[0] || fallbackFeatured;

  // Konvertálás a store odds formátumba
  const storeMatches = Object.values(odds).length > 0 ? Object.values(odds) : matches;

  const handleAddToSlip = (matchId: string, team: string, odds: number, market: string) => {
    addItem({
      id: `${matchId}-${market}`,
      match: team,
      market,
      odds,
    });
  };

  // Frissítési idő formázása
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds} mp ezelőtt`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} perce`;
  };

  return (
    <section id="live-odds" className="section-padding bg-bv-bg-secondary">
      <div className="content-max-width">
        <div className="mb-12">
          <SectionHeader
            title="ÉLŐ FOGLADÁSI AJÁNLATOK"
            subtitle="Valós idejű odds-ok a legnagyobb bajnokságokból"
            live
          />
          {/* Státusz sor */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              {isUsingMockData && (
                <span className="flex items-center gap-1.5 text-xs text-bv-orange bg-bv-orange/10 border border-bv-orange/20 rounded-full px-3 py-1">
                  <WifiOff size={12} />
                  Demo mód - mock adatok
                </span>
              )}
              {error && (
                <span className="text-xs text-bv-orange">
                  {error}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-bv-text-muted">
                  Frissítve: {getLastUpdatedText()}
                </span>
              )}
              <button
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-bv-blue hover:text-bv-blue-light transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Frissítés
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Odds Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeMatches.length === 0 && loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5 animate-pulse"
                >
                  <div className="h-3 w-20 bg-bv-bg-secondary rounded mb-3" />
                  <div className="flex justify-between mb-4">
                    <div className="h-6 w-24 bg-bv-bg-secondary rounded" />
                    <div className="h-6 w-24 bg-bv-bg-secondary rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-12 w-20 bg-bv-bg-secondary rounded" />
                    <div className="h-12 w-20 bg-bv-bg-secondary rounded" />
                    <div className="h-12 w-20 bg-bv-bg-secondary rounded" />
                  </div>
                </div>
              ))
            ) : (
              storeMatches.map((match, idx) => (
                <div
                  key={match.id}
                  className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5 hover:-translate-y-1 hover:shadow-glow-blue transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-bv-text-muted flex items-center gap-1">
                      <span>{match.leagueFlag}</span>
                      {match.league}
                    </span>
                    {match.isLive && (
                      <span className="flex items-center gap-1 text-[11px] text-bv-orange font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-bv-orange animate-pulse" />
                        ÉLŐ
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {match.homeTeamLogo ? (
                        <img
                          src={match.homeTeamLogo}
                          alt={match.homeTeam}
                          className="w-8 h-8 rounded-full object-contain bg-bv-bg-secondary"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-bv-bg-secondary flex items-center justify-center text-xs font-bold text-white">
                          {match.homeTeam[0]}
                        </div>
                      )}
                      <span className="text-white font-semibold text-base">{match.homeTeam}</span>
                    </div>
                    {match.isLive && (
                      <span className="font-mono text-lg font-bold text-bv-blue">
                        {match.homeScore}-{match.awayScore}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-base">{match.awayTeam}</span>
                      {match.awayTeamLogo ? (
                        <img
                          src={match.awayTeamLogo}
                          alt={match.awayTeam}
                          className="w-8 h-8 rounded-full object-contain bg-bv-bg-secondary"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-bv-bg-secondary flex items-center justify-center text-xs font-bold text-white">
                          {match.awayTeam[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Odds row */}
                  <div className="flex items-center gap-2 mb-3">
                    <OddsDisplayCell
                      odds={match.homeOdds}
                      label="1"
                      isValueBet={match.aiPick === '1'}
                      onClick={() => handleAddToSlip(match.id, `${match.homeTeam} - ${match.awayTeam}`, match.homeOdds, '1')}
                    />
                    <OddsDisplayCell
                      odds={match.drawOdds}
                      label="X"
                      onClick={() => handleAddToSlip(match.id, `${match.homeTeam} - ${match.awayTeam}`, match.drawOdds, 'X')}
                    />
                    <OddsDisplayCell
                      odds={match.awayOdds}
                      label="2"
                      isValueBet={match.aiPick === '2'}
                      onClick={() => handleAddToSlip(match.id, `${match.homeTeam} - ${match.awayTeam}`, match.awayOdds, '2')}
                    />
                    <span className="text-xs text-bv-text-muted ml-auto flex items-center gap-1">
                      <Plus size={12} />
                      {match.markets}
                    </span>
                  </div>

                  {/* AI row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AIConfidenceBadge confidence={match.aiConfidence} />
                      <span className="text-xs text-bv-text-secondary">
                        AI tipp: <span className="text-bv-blue font-semibold">{match.aiPick === '1' ? '1' : match.aiPick === '2' ? '2' : 'X'}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-bv-text-muted">{match.time}</span>
                      <Bookmark size={14} className="text-bv-text-muted hover:text-bv-blue cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right - Featured Match */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-bv-bg-tertiary to-bv-bg-secondary border border-bv-border-subtle rounded-2xl p-6 h-full">
              <span className="text-bv-blue text-xs font-semibold tracking-[0.1em] uppercase mb-4 block">
                A NAP MÉRKŐZÉSE
              </span>

              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  {featuredMatch.homeTeamLogo ? (
                    <img
                      src={featuredMatch.homeTeamLogo}
                      alt={featuredMatch.homeTeam}
                      className="w-16 h-16 rounded-full object-contain bg-gradient-to-br from-blue-600/30 to-blue-800/30 mx-auto mb-2 p-2"
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
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-xl font-bold text-white mb-2 mx-auto"
                    style={{ display: featuredMatch.homeTeamLogo ? 'none' : 'flex' }}
                  >
                    {featuredMatch.homeTeam[0]}
                  </div>
                  <span className="text-white font-bold text-lg">{featuredMatch.homeTeam}</span>
                </div>

                <div className="text-center px-4">
                  <div className="font-mono text-4xl font-bold text-white mb-1">
                    {featuredMatch.homeScore ?? 0}-{featuredMatch.awayScore ?? 0}
                  </div>
                  <span className="text-bv-blue text-xs font-semibold animate-pulse">
                    {featuredMatch.isLive ? 'ÉLŐ' : featuredMatch.time}
                  </span>
                </div>

                <div className="text-center flex-1">
                  {featuredMatch.awayTeamLogo ? (
                    <img
                      src={featuredMatch.awayTeamLogo}
                      alt={featuredMatch.awayTeam}
                      className="w-16 h-16 rounded-full object-contain bg-gradient-to-br from-purple-600/30 to-purple-800/30 mx-auto mb-2 p-2"
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
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xl font-bold text-white mb-2 mx-auto"
                    style={{ display: featuredMatch.awayTeamLogo ? 'none' : 'flex' }}
                  >
                    {featuredMatch.awayTeam[0]}
                  </div>
                  <span className="text-white font-bold text-lg">{featuredMatch.awayTeam}</span>
                </div>
              </div>

              {/* Large odds */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {[
                  { odds: featuredMatch.homeOdds, label: '1', isValue: featuredMatch.aiPick === '1' },
                  { odds: featuredMatch.drawOdds, label: 'X', isValue: false },
                  { odds: featuredMatch.awayOdds, label: '2', isValue: featuredMatch.aiPick === '2' },
                ].map((o) => (
                  <button
                    key={o.label}
                    onClick={() => handleAddToSlip(featuredMatch.id, `${featuredMatch.homeTeam} - ${featuredMatch.awayTeam}`, o.odds, o.label)}
                    className={`w-24 h-14 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 ${
                      o.isValue
                        ? 'bg-bv-blue/20 border border-bv-blue/40'
                        : 'bg-bv-bg border border-bv-border-subtle'
                    }`}>
                    <span className={`font-mono text-xl font-bold ${o.isValue ? 'text-bv-blue' : 'text-white'}`}>
                      {o.odds.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>

              {/* AI Mini Analysis */}
              <div className="bg-bv-bg rounded-xl p-4 mb-4">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-bv-blue" />
                  AI Elemzés
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Lövések (kapura)', value: 12, max: 20, team: `${featuredMatch.homeTeam[0]}: 8 - ${featuredMatch.awayTeam[0]}: 4` },
                    { label: 'Labdabirtoklás', value: 58, max: 100, team: `${featuredMatch.homeTeam[0]}: 58% - ${featuredMatch.awayTeam[0]}: 42%` },
                    { label: 'xG (Várható gól)', value: 2.4, max: 4, team: `${featuredMatch.homeTeam[0]}: 1.8 - ${featuredMatch.awayTeam[0]}: 0.6` },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-bv-text-secondary">{stat.label}</span>
                        <span className="text-bv-text-muted">{stat.team}</span>
                      </div>
                      <div className="h-1.5 bg-bv-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-bv-green to-emerald-400 rounded-full"
                          style={{ width: `${(stat.value / stat.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAddToSlip(featuredMatch.id, `${featuredMatch.homeTeam} - ${featuredMatch.awayTeam}`, featuredMatch.homeOdds, '1')}
                className="w-full bg-bv-blue text-bv-bg font-semibold py-3 rounded-lg hover:brightness-110 transition-all">
                Tipp hozzáadása
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
