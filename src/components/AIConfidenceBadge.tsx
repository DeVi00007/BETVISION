import { memo } from 'react';

interface AIConfidenceBadgeProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

const AIConfidenceBadge = memo(function AIConfidenceBadge({
  confidence,
  size = 'sm',
}: AIConfidenceBadgeProps) {
  const getGradient = () => {
    if (confidence >= 80) return 'from-emerald-500 to-bv-green';
    if (confidence >= 60) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-bv-orange';
  };

  const sizeClasses = {
    sm: 'h-6 px-2.5 text-xs',
    md: 'h-7 px-3 text-sm',
    lg: 'h-8 px-4 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono font-semibold text-white
        bg-gradient-to-r ${getGradient()} ${sizeClasses[size]}
        ${confidence >= 85 ? 'animate-glow-pulse' : ''}`}>
      <span className="opacity-80">AI</span>
      <span>{confidence}%</span>
    </span>
  );
});

export default AIConfidenceBadge;
