import { useState } from 'react';
import { Shield, Scale, Flame } from 'lucide-react';

const profiles = [
  {
    id: 'cautious',
    label: 'ÓVatos',
    oddsRange: '1.20 — 1.60',
    desc: 'Alacsony kockázat, kisebb de stabilabb nyeremények',
    icon: Shield,
    color: 'text-bv-blue-light',
    borderColor: 'border-bv-blue-light/40',
    bgColor: 'bg-bv-blue-light/10',
  },
  {
    id: 'balanced',
    label: 'KIEGYENSÚLYOZOTT',
    oddsRange: '1.60 — 2.50',
    desc: 'Optimális kockázat/nyeremény arány',
    icon: Scale,
    color: 'text-bv-blue',
    borderColor: 'border-bv-blue/40',
    bgColor: 'bg-bv-blue/10',
  },
  {
    id: 'aggressive',
    label: 'MERÉSZ',
    oddsRange: '2.50 — 5.00+',
    desc: 'Magas kockázat, de nagyobb nyeremény potenciál',
    icon: Flame,
    color: 'text-bv-orange',
    borderColor: 'border-bv-orange/40',
    bgColor: 'bg-bv-orange/10',
  },
];

interface RiskProfileSelectorProps {
  onSelect?: (profile: string) => void;
}

export default function RiskProfileSelector({ onSelect }: RiskProfileSelectorProps) {
  const [active, setActive] = useState('balanced');

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {profiles.map((profile) => {
        const isActive = active === profile.id;
        const Icon = profile.icon;
        return (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile.id)}
            className={`text-left p-5 rounded-xl border transition-all duration-300 ${
              isActive
                ? `${profile.bgColor} ${profile.borderColor} shadow-glow-blue`
                : 'bg-bv-bg-tertiary border-bv-border-subtle hover:border-white/20'
            }`}>
            <div className="flex items-center gap-3 mb-3">
              <Icon size={24} className={profile.color} />
              <span className={`text-lg font-bold ${profile.color}`}>{profile.label}</span>
            </div>
            <div className={`font-mono text-xl font-bold ${profile.color} mb-2`}>
              {profile.oddsRange}
            </div>
            <p className="text-bv-text-secondary text-sm">{profile.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
