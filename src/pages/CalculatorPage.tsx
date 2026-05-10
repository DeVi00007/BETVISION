import { useState } from 'react';
import { X, TrendingUp, Trash2 } from 'lucide-react';
import { useBetSlipStore } from '@/stores/betSlipStore';

type CalcMode = 'SZELVÉNY' | 'BANKROLL' | 'STRATÉGIA';

export default function CalculatorPage() {
  const [mode, setMode] = useState<CalcMode>('SZELVÉNY');
  const [odds, setOdds] = useState<string[]>(['1.45', '1.35', '1.66', '', '', '', '', '']);
  const [stake, setStake] = useState(2000);
  const { items, removeItem, clear, stake: slipStake, setStake: setSlipStake, totalOdds, potentialWinnings } = useBetSlipStore();

  const calcTotalOdds = () => {
    const validOdds = odds
      .filter((o) => o && parseFloat(o) > 1)
      .map((o) => parseFloat(o));
    if (validOdds.length === 0) return 1;
    return validOdds.reduce((a, b) => a * b, 1);
  };

  const calcWinnings = () => stake * calcTotalOdds();
  const calcProfit = () => calcWinnings() - stake;

  const updateOdds = (index: number, value: string) => {
    const newOdds = [...odds];
    newOdds[index] = value;
    setOdds(newOdds);
  };

  return (
    <div className="pt-[72px] min-h-screen bg-bv-bg">
      <div className="content-max-width py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          TIPPMIX KALKULÁTOR
        </h1>
        <p className="text-bv-text-secondary mb-6">Prof odds számítás és szelvény kezelés</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - 65% */}
          <div className="lg:col-span-3">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              {(['SZELVÉNY', 'BANKROLL', 'STRATÉGIA'] as CalcMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? 'bg-bv-blue text-bv-bg'
                      : 'bg-bv-bg-tertiary text-bv-text-secondary hover:text-white border border-bv-border-subtle'
                  }`}>
                  {m}
                </button>
              ))}
            </div>

            {mode === 'SZELVÉNY' && (
              <div className="space-y-4">
                {/* Odds Input Grid */}
                <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-bv-blue" />
                    Odds bevitel (max 8 tipp)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {odds.map((o, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-bv-text-muted font-mono text-sm w-6">#{i + 1}</span>
                        <input
                          type="number"
                          step="0.01"
                          min="1.01"
                          placeholder="Odds"
                          value={o}
                          onChange={(e) => updateOdds(i, e.target.value)}
                          className="flex-1 bg-bv-bg border border-bv-border-subtle rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-bv-blue transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stake + Results */}
                <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <label className="text-bv-text-secondary text-sm uppercase tracking-wider">
                      Tét (Ft):
                    </label>
                    <input
                      type="number"
                      value={stake}
                      onChange={(e) => setStake(Number(e.target.value))}
                      className="bg-bv-bg border border-bv-border-subtle rounded-lg px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-bv-blue transition-colors w-full sm:w-48"
                    />
                  </div>

                  <div className="bg-bv-bg rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-bv-text-secondary">Összesített odds</span>
                      <span className="font-mono text-2xl font-bold text-bv-blue">
                        {calcTotalOdds().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-bv-text-secondary">Várható nyeremény</span>
                      <span className="font-mono text-3xl font-bold text-white">
                        {Math.round(calcWinnings()).toLocaleString()} Ft
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-bv-border-subtle">
                      <span className="text-bv-text-secondary">Profit</span>
                      <span
                        className={`font-mono text-xl font-bold ${
                          calcProfit() > 0 ? 'text-bv-blue' : 'text-bv-orange'
                        }`}>
                        {calcProfit() > 0 ? '+' : ''}
                        {Math.round(calcProfit()).toLocaleString()} Ft
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-bv-text-secondary">ROI</span>
                      <span className="font-mono text-lg text-bv-blue-light">
                        {stake > 0 ? (((calcWinnings() - stake) / stake) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'BANKROLL' && (
              <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 space-y-6">
                <h3 className="text-white font-semibold text-lg">Bankroll Menedzsment</h3>
                <div>
                  <label className="text-bv-text-secondary text-sm mb-2 block">Kezdő bankroll (Ft)</label>
                  <input
                    type="number"
                    defaultValue={50000}
                    className="w-full bg-bv-bg border border-bv-border-subtle rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-bv-blue"
                  />
                </div>
                <div>
                  <label className="text-bv-text-secondary text-sm mb-2 block">Tét százalék: 2%</label>
                  <input type="range" min="1" max="10" defaultValue="2" className="w-full accent-bv-green" />
                </div>
                <div className="flex gap-3">
                  {['Alacsony', 'Közepes', 'Magas'].map((r) => (
                    <button key={r} className="flex-1 py-2.5 rounded-lg bg-bv-bg text-bv-text-secondary text-sm hover:text-white hover:bg-bv-bg-secondary transition-all border border-bv-border-subtle">
                      {r} kockázat
                    </button>
                  ))}
                </div>
                <div className="bg-bv-bg rounded-xl p-4">
                  <h4 className="text-bv-blue text-sm font-semibold mb-2">Kelly Kritérium</h4>
                  <p className="text-bv-text-secondary text-xs leading-relaxed">
                    f* = (bp - q) / b, ahol b = odds, p = nyerési valószínűség, q = veszteség valószínűség (1-p).
                    Optimális tét: 1.8% a bankrollból.
                  </p>
                </div>
              </div>
            )}

            {mode === 'STRATÉGIA' && (
              <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Tétstratégia Szimulátor</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {['Martingale', 'Fibonacci', 'Flat', 'Kelly'].map((s) => (
                    <button key={s} className="py-3 rounded-lg bg-bv-bg text-bv-text-secondary text-sm hover:text-white hover:bg-bv-bg-secondary transition-all border border-bv-border-subtle">
                      {s}
                    </button>
                  ))}
                </div>
                <div className="bg-bv-bg rounded-xl p-6 text-center">
                  <p className="text-bv-text-muted text-sm">Válassz egy stratégiát a szimuláció megtekintéséhez</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Bet Slip (35%) */}
          <div className="lg:col-span-2">
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">
                  SZELVÉNY
                  {items.length > 0 && (
                    <span className="ml-2 bg-bv-blue text-bv-bg text-xs font-bold px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  )}
                </h3>
                {items.length > 0 && (
                  <button onClick={clear} className="text-bv-text-muted hover:text-bv-orange transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-bv-text-muted text-sm text-center py-8">
                    A szelvény üres. Adj hozzá tippeket az odds-okra kattintva.
                  </p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-bv-bg rounded-lg p-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-white text-sm truncate">{item.match}</p>
                        <p className="text-bv-text-muted text-xs">{item.market} @ {item.odds.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-bv-text-muted hover:text-bv-orange transition-colors flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <>
                  <div className="mb-4">
                    <label className="text-bv-text-secondary text-xs uppercase tracking-wider mb-2 block">
                      Tét (Ft)
                    </label>
                    <input
                      type="number"
                      value={slipStake}
                      onChange={(e) => setSlipStake(Number(e.target.value))}
                      className="w-full bg-bv-bg border border-bv-border-subtle rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-bv-blue"
                    />
                  </div>

                  <button className="w-full bg-bv-blue text-bv-bg font-semibold py-3 rounded-lg hover:brightness-110 transition-all mb-4">
                    NYEREMÉNY KISZÁMÍTÁSA
                  </button>

                  <div className="bg-bv-bg rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-bv-text-secondary">Összesített odds</span>
                      <span className="font-mono text-bv-blue font-semibold">{totalOdds().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bv-text-secondary text-sm">Várható nyeremény</span>
                      <span className="font-mono text-white text-xl font-bold">
                        {Math.round(potentialWinnings()).toLocaleString()} Ft
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
