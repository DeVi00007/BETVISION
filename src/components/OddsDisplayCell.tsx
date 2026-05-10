import { memo, useEffect, useState } from 'react';

interface OddsDisplayCellProps {
  odds: number;
  label: string;
  isValueBet?: boolean;
  isDropped?: boolean;
  onClick?: () => void;
}

const OddsDisplayCell = memo(function OddsDisplayCell({
  odds,
  label,
  isValueBet = false,
  isDropped = false,
  onClick,
}: OddsDisplayCellProps) {
  const [flash, setFlash] = useState(false);
  const [prevOdds, setPrevOdds] = useState(odds);

  useEffect(() => {
    if (odds !== prevOdds) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 400);
      setPrevOdds(odds);
      return () => clearTimeout(timer);
    }
  }, [odds, prevOdds]);

  const oddsColor = isValueBet
    ? 'text-bv-blue'
    : isDropped
    ? 'text-bv-orange'
    : 'text-white';

  return (
    <button
      onClick={onClick}
      className={`w-[80px] h-[48px] rounded-lg bg-bv-bg-tertiary flex flex-col items-center justify-center
        transition-all duration-200 hover:bg-[#222] hover:scale-105 active:scale-95
        ${flash ? 'animate-flash-odds' : ''}`}>
      <span className={`font-mono text-lg font-bold ${oddsColor}`}>
        {odds.toFixed(2)}
      </span>
      {odds !== prevOdds && (
        <span className={`text-[10px] ${odds > prevOdds ? 'text-bv-blue' : 'text-bv-orange'}`}>
          {odds > prevOdds ? '↑' : '↓'}
        </span>
      )}
      <span className="text-[11px] text-bv-text-muted">{label}</span>
    </button>
  );
});

export default OddsDisplayCell;
