import { create } from 'zustand';

export interface BetItem {
  id: string;
  match: string;
  market: string;
  odds: number;
}

interface BetSlipStore {
  items: BetItem[];
  stake: number;
  addItem: (item: BetItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  setStake: (amount: number) => void;
  totalOdds: () => number;
  potentialWinnings: () => number;
}

export const useBetSlipStore = create<BetSlipStore>((set, get) => ({
  items: [],
  stake: 1000,
  addItem: (item) => {
    const exists = get().items.find((i) => i.id === item.id);
    if (!exists) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  setStake: (amount) => set({ stake: amount }),
  totalOdds: () => {
    const items = get().items;
    if (items.length === 0) return 1;
    return items.reduce((acc, item) => acc * item.odds, 1);
  },
  potentialWinnings: () => {
    const store = get();
    return store.stake * store.totalOdds();
  },
}));
