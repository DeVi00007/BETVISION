import { useState } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';
import { leaderboardData } from '@/data/mockData';

const periods = ['HETI', 'HAVI', 'ÉVES', 'ÖRÖK'];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy size={20} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={20} className="text-gray-300" />;
  if (rank === 3) return <Medal size={20} className="text-amber-600" />;
  return <span className="font-mono text-bv-text-muted text-sm w-5 text-center">{rank}</span>;
}

function getRankBg(rank: number) {
  if (rank === 1) return 'bg-yellow-400/5 border-yellow-400/20';
  if (rank === 2) return 'bg-gray-300/5 border-gray-300/10';
  if (rank === 3) return 'bg-amber-600/5 border-amber-600/10';
  return 'bg-bv-bg-tertiary border-bv-border-subtle';
}

export default function LeaderboardPage() {
  const [activePeriod, setActivePeriod] = useState('HAVI');

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      <div className="content-max-width py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
            RANGLISTA
          </h1>
          <p className="text-bv-text-secondary">A legjobb tippmix tippek mesterei</p>
        </div>

        {/* Period Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activePeriod === period
                  ? 'bg-bv-blue text-bv-bg'
                  : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
              }`}>
              {period}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {[2, 1, 3].map((rank) => {
            const entry = leaderboardData.find((e) => e.rank === rank);
            if (!entry) return null;
            const heights = ['h-32', 'h-44', 'h-28'];
            const colors = ['from-gray-300/20 to-transparent', 'from-yellow-400/20 to-transparent', 'from-amber-600/20 to-transparent'];
            return (
              <div key={rank} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-lg font-bold text-white mb-3 ${
                  rank === 1 ? 'from-yellow-400 to-yellow-600' : rank === 2 ? 'from-gray-400 to-gray-600' : 'from-amber-600 to-amber-800'
                }`}>
                  {entry.avatar}
                </div>
                <span className="text-white text-sm font-semibold text-center truncate w-full">{entry.username}</span>
                <span className="font-mono text-bv-blue text-sm font-bold">+{entry.profit} egység</span>
                <div className={`w-full ${heights[rank - 1]} bg-gradient-to-t ${colors[rank - 1]} rounded-t-lg mt-3`} />
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_120px_100px_100px_80px_60px] gap-4 px-6 py-3 border-b border-bv-border-subtle text-xs text-bv-text-muted uppercase tracking-wider">
            <span>Hely.</span>
            <span>Felhasználó</span>
            <span className="text-right">Profit</span>
            <span className="text-right">Nyerési %</span>
            <span className="text-right">Átlag odds</span>
            <span className="text-right">Streak</span>
            <span></span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-bv-border-subtle">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`grid grid-cols-1 md:grid-cols-[60px_1fr_120px_100px_100px_80px_60px] gap-4 px-6 py-4 items-center border ${getRankBg(entry.rank)} transition-all hover:bg-white/5`}>
                {/* Rank */}
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                </div>

                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-bv-bg-secondary flex items-center justify-center text-xs font-bold text-white">
                    {entry.avatar}
                  </div>
                  <div>
                    <span className="text-white text-sm font-semibold">{entry.username}</span>
                    {entry.isPremium && (
                      <span className="ml-2 text-[10px] bg-bv-blue/20 text-bv-blue px-1.5 py-0.5 rounded font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                </div>

                {/* Profit */}
                <div className="md:text-right">
                  <span className="font-mono text-bv-blue font-bold">+{entry.profit}</span>
                  <span className="text-bv-text-muted text-xs ml-1">egység</span>
                </div>

                {/* Win Rate */}
                <div className="md:text-right">
                  <span className="font-mono text-white">{entry.winRate}%</span>
                </div>

                {/* Avg Odds */}
                <div className="md:text-right">
                  <span className="font-mono text-bv-blue-light">{entry.avgOdds.toFixed(2)}</span>
                </div>

                {/* Streak */}
                <div className="md:text-right flex items-center md:justify-end gap-1">
                  <Flame size={14} className="text-orange-400" />
                  <span className="font-mono text-white text-sm">{entry.streak}</span>
                </div>

                {/* Empty */}
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
