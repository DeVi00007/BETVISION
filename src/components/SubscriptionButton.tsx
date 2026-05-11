import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionButtonProps {
  variant?: 'default' | 'outline' | 'small';
  className?: string;
}

export default function SubscriptionButton({ variant = 'default', className }: SubscriptionButtonProps) {
  const variants = {
    default: cn('inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-bv-bg font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:translate-y-0 text-sm'),
    outline: cn('inline-flex items-center gap-2 border border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/10 font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:border-yellow-400 text-sm'),
    small: cn('inline-flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 font-medium text-xs transition-colors duration-200 hover:underline underline-offset-4'),
  };

  return (
    <Link to="/elofizetes" className={cn(variants[variant], className)}>
      <CreditCard size={variant === 'small' ? 12 : 16} />
      <span>Előfizetés</span>
    </Link>
  );
}
