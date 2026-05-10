import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const plans = [
  {
    name: 'INGYENES',
    price: '0',
    period: 'Ft / hónap',
    icon: Sparkles,
    color: 'text-bv-text-secondary',
    borderColor: 'border-bv-border-subtle',
    topColor: 'bg-bv-text-muted',
    features: [
      { text: '3 AI tipp naponta', included: true },
      { text: 'Alap élő odds', included: true },
      { text: 'Szelvény kalkulátor', included: true },
      { text: 'Közösségi hozzáférés', included: true },
      { text: 'Ranglista', included: true },
      { text: 'Teljes AI elemzés', included: false },
      { text: 'Személyre szabott profil', included: false },
      { text: 'Értékkereső rendszer', included: false },
      { text: 'Push értesítések', included: false },
    ],
    cta: 'REGISZTRÁCIÓ',
    ctaStyle: 'border border-white/30 text-white hover:bg-white/5',
  },
  {
    name: 'PRO',
    price: '4,990',
    period: 'Ft / hónap',
    icon: Zap,
    color: 'text-bv-blue',
    borderColor: 'border-bv-blue/40',
    topColor: 'bg-bv-blue',
    popular: true,
    features: [
      { text: '5+ AI tipp naponta', included: true },
      { text: 'Teljes élő odds stream', included: true },
      { text: 'Profi kalkulátor + stratégiák', included: true },
      { text: 'Közösségi hozzáférés', included: true },
      { text: 'Ranglista + streak', included: true },
      { text: 'Teljes AI elemzés minden meccshez', included: true },
      { text: 'Személyre szabott kockázati profil', included: true },
      { text: 'Értékkereső rendszer', included: true },
      { text: 'Push értesítések', included: true },
    ],
    cta: 'PRO CSOMAG',
    ctaStyle: 'bg-bv-blue text-bv-bg hover:brightness-110',
  },
  {
    name: 'PRO+',
    price: '9,990',
    period: 'Ft / hónap',
    icon: Crown,
    color: 'text-bv-gold',
    borderColor: 'border-yellow-500/40',
    topColor: 'bg-yellow-500',
    features: [
      { text: 'Korlátlan AI tipp', included: true },
      { text: 'Teljes élő odds stream', included: true },
      { text: 'Profi kalkulátor + stratégiák', included: true },
      { text: 'VIP közösségi csatorna', included: true },
      { text: 'Ranglista + streak + statisztika', included: true },
      { text: 'Teljes AI elemzés minden meccshez', included: true },
      { text: 'Személyre szabott kockázati profil', included: true },
      { text: 'Értékkereső + arbitrázs detektor', included: true },
      { text: 'Push értesítések + email riportok', included: true },
    ],
    cta: 'PRO+ CSOMAG',
    ctaStyle: 'bg-yellow-500 text-bv-bg hover:brightness-110',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-bv-bg">
      <div className="content-max-width">
        <SectionHeader
          title="ÁRAZÁS"
          subtitle="Válaszd a számodra megfelelő csomagot. Ingyenes tippmix tippek minden nap."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-[1100px] mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border ${plan.borderColor} bg-bv-bg-tertiary overflow-hidden ${
                  plan.popular ? 'shadow-glow-blue scale-[1.02]' : ''
                }`}>
                {/* Top accent */}
                <div className={`h-1 ${plan.topColor}`} />

                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-bv-blue/20 text-bv-blue text-xs font-bold px-3 py-1 rounded-full">
                    LEGNÉPSZERŰBB
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={28} className={plan.color} />
                    <span className={`text-xl font-bold ${plan.color}`}>{plan.name}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className={`font-mono text-4xl font-bold ${plan.color}`}>{plan.price}</span>
                    <span className="text-bv-text-muted text-sm ml-2">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <Check size={16} className="text-bv-blue flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={16} className="text-bv-text-muted flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${f.included ? 'text-bv-text-secondary' : 'text-bv-text-muted'}`}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
