import { useState } from 'react';
import { Check, X } from 'lucide-react';

const features = [
  'Szelvény szimuláció valós oddsokkal',
  'Bankroll menedzsment',
  'Többféle tétstratégia',
  'Automatikus nyereményszámítás',
];

const defaultBets = [
  { id: 'b1', match: 'Bayern München - Dortmund', odds: 1.45 },
  { id: 'b2', match: 'PSG - Marseille', odds: 1.35 },
  { id: 'b3', match: 'Barcelona - Real Madrid', odds: 1.66 },
];

export default function CalculatorPreviewSection() {
  const [stake, setStake] = useState(2000);
  const [bets, setBets] = useState(defaultBets);

  const totalOdds = bets.reduce((acc, b) => acc * b.odds, 1);
  const potentialWin = stake * totalOdds;
  const profit = potentialWin - stake;

  const removeBet = (id: string) => {
    setBets(bets.filter((b) => b.id !== id));
  };

  return (
    <section className="section-padding bg-bv-bg-secondary">
      <div className="content-max-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Description */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
              PROFI TIPPMIX KALKULÁTOR
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-bv-text-secondary mb-4">
              Tervezd meg a szelvényedet profi eszközökkel
            </h3>
            <p className="text-bv-text-secondary text-base leading-relaxed mb-8">
              A beépített kalkulátorunkkal számold ki a nyereményedet, kezeld a bankrolledat és 
              optimalizáld a téteket a Kelly-kritérium vagy Martingale stratégia alapján.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check size={18} className="text-bv-blue flex-shrink-0" />
                  <span className="text-bv-text-secondary text-sm">{f}</span>
                </div>
              ))}
            </div>

            <a
              href="/kalkulator"
              className="inline-block bg-bv-blue text-bv-bg font-semibold text-base px-8 py-4 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02]">
              KALKULÁTOR MEGNYITÁSA
            </a>
          </div>

          {/* Right - Calculator Widget */}
          <div className="lg:ml-auto max-w-[480px] w-full">
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-6 shadow-glow-blue-lg animate-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-white text-lg font-bold">SZELVÉNY KALKULÁTOR</h4>
                <button
                  onClick={() => setBets(defaultBets)}
                  className="text-bv-text-muted hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Bet list */}
              <div className="space-y-3 mb-5">
                {bets.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between bg-bv-bg rounded-lg p-3">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-white text-sm truncate">{bet.match}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-bv-blue font-semibold">
                        {bet.odds.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeBet(bet.id)}
                        className="text-bv-text-muted hover:text-bv-orange transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {bets.length === 0 && (
                  <p className="text-bv-text-muted text-sm text-center py-4">
                    Nincs tipp a szelvényen
                  </p>
                )}
              </div>

              {/* Stake input */}
              <div className="mb-4">
                <label className="text-bv-text-secondary text-xs uppercase tracking-wider mb-2 block">
                  Tét összege (Ft)
                </label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full bg-bv-bg border border-bv-border-subtle rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-bv-blue transition-colors"
                />
              </div>

              {/* Results */}
              <div className="bg-bv-bg rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-bv-text-secondary text-sm">Összesített odds</span>
                  <span className="font-mono text-bv-blue text-xl font-bold">
                    {totalOdds.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-bv-text-secondary text-sm">Várható nyeremény</span>
                  <span className="font-mono text-white text-2xl font-bold">
                    {Math.round(potentialWin).toLocaleString()} Ft
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-bv-border-subtle">
                  <span className="text-bv-text-secondary text-sm">Profit</span>
                  <span className="font-mono text-bv-blue text-lg font-semibold">
                    +{Math.round(profit).toLocaleString()} Ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
