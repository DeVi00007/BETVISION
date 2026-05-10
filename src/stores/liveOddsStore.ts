import { create } from 'zustand';
import { liveMatches, type Match } from '@/data/mockData';

interface LiveOddsStore {
  odds: Record<string, Match>;
  lastUpdated: number;
  init: () => void;
  updateOdds: () => void;
}

export const useLiveOddsStore = create<LiveOddsStore>((set, get) => ({
  odds: {},
  lastUpdated: Date.now(),
  init: () => {
    const map: Record<string, Match> = {};
    liveMatches.forEach((m) => (map[m.id] = { ...m }));
    set({ odds: map, lastUpdated: Date.now() });
  },
  updateOdds: () => {
    const current = { ...get().odds };
    const matchIds = Object.keys(current);
    if (matchIds.length === 0) return;
    // Random 1-2 meccs frissítése
    const numUpdates = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numUpdates; i++) {
      const randomId = matchIds[Math.floor(Math.random() * matchIds.length)];
      const match = current[randomId];
      if (match) {
        const change = (Math.random() - 0.5) * 0.1;
        current[randomId] = {
          ...match,
          homeOdds: Math.max(1.01, +(match.homeOdds + change).toFixed(2)),
          drawOdds: Math.max(1.01, +(match.drawOdds + change).toFixed(2)),
          awayOdds: Math.max(1.01, +(match.awayOdds + change).toFixed(2)),
        };
      }
    }
    set({ odds: current, lastUpdated: Date.now() });
  },
}));
