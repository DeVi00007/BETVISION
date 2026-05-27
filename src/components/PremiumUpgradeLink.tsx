import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PremiumUpgradeLink({ text }: { text: string }) {
  return (
    <Link
      to="/elofizetes"
      className="text-bv-blue text-xs mt-1 hover:underline inline-flex items-center gap-1"
    >
      <Lock size={12} />
      {text}
    </Link>
  );
}
