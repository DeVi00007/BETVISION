import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import type { Tier } from '@/services/subscriptionStatus';

const tiers: Array<{
  name: Tier;
  price: string;
  period: string;
  icon: typeof Sparkles;
  accentClass: string;
  borderClass: string;
  topClass: string;
  features: Array<{ text: string; included: boolean }>;
}> = [
  {
    name: 'ALAP',
    price: '0',
    period: 'Ft / hónap',
    icon: Sparkles,
    accentClass: 'text-bv-text-secondary',
    borderClass: 'border-bv-border-subtle',
    topClass: 'bg-bv-text-muted',
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
  },
  {
    name: 'PRO',
    price: '4,990',
    period: 'Ft / hónap',
    icon: Zap,
    accentClass: 'text-bv-blue',
    borderClass: 'border-bv-blue/40',
    topClass: 'bg-bv-blue',
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
  },
  {
    name: 'PRO+',
    price: '9,990',
    period: 'Ft / hónap',
    icon: Crown,
    accentClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/40',
    topClass: 'bg-yellow-500',
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
  },
];

export default function SubscriptionPage() {
  // A-ben: minden PRO/PRO+ választás automatikusan indítja a 7 napos trialt (Stripe/PayPal nélkül)
  const { status, selectTier, expireTrial, resetSubscription } = useSubscriptionStatus(7);

  const selectedTier = status.selectedTier;

  const activeTier = useMemo(
    () => tiers.find((t) => t.name === selectedTier) ?? tiers[0],
    [selectedTier]
  );

  const activeFeatures = useMemo(() => {
    const included = activeTier.features.filter((f) => f.included).length;
    return { included };
  }, [activeTier.features]);

  return (
    <>
      <Helmet>
        <title>Előfizetés - BetVision</title>
        <meta
          name="description"
          content="Válaszd ki a BETVISION csomagod (fizetés később bekötve)."
        />
      </Helmet>

      <div className="pt-[72px] min-h-screen bg-bv-bg">
        <div className="content-max-width py-10">
          <SectionHeader
            title="VÁLASZD A CSOMAGOD"
            subtitle="A Stripe / PayPal integrációt később kötjük be — most a próba logika mockolva van."
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = tier.name === selectedTier;

              // trial csak PRO/PRO+ esetén lehet, de “kiválasztottnak” mindig azt jelöljük, amit a kártyán kattintottunk
              return (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => selectTier(tier.name)}
                  className={[
                    'relative rounded-xl border bg-bv-bg-tertiary overflow-hidden text-left transition-all',
                    tier.borderClass,
                    isSelected ? 'ring-2 ring-bv-blue/60 scale-[1.02]' : 'hover:shadow-glow-blue/20',
                  ].join(' ')}
                >
                  <div className={`h-1 ${tier.topClass}`} />
                  {tier.name === 'PRO' && (
                    <div className="absolute top-4 right-4 bg-bv-blue/20 text-bv-blue text-xs font-bold px-3 py-1 rounded-full">
                      LEGNÉPSZERŰBB
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon size={28} className={tier.accentClass} />
                      <span className={`text-xl font-bold ${tier.accentClass}`}>{tier.name}</span>
                    </div>

                    <div className="mb-5">
                      <span className={`font-mono text-4xl font-bold ${tier.accentClass}`}>{tier.price}</span>
                      <span className="text-bv-text-muted text-sm ml-2">{tier.period}</span>
                    </div>

                    <div className="space-y-2">
                      {tier.features.slice(0, 5).map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2">
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

                    <div className="mt-5 text-xs text-bv-text-muted">
                      {isSelected
                        ? `Kiválasztva • ${activeFeatures.included} funkció`
                        : 'Kattints a csomagra'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-6">
              <h2 className="text-white text-xl font-extrabold mb-4">
                {activeTier.name} csomag — mit kapsz?
              </h2>

              <div className="space-y-3">
                {activeTier.features.map((f, i) => (
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

              <div className="mt-6 text-bv-text-muted text-xs leading-relaxed">
                Próba státusz (mock):
                <div className="mt-2">
                  {status.isTrial ? (
                    <span className="text-bv-blue font-semibold">
                      Trial aktív • hátralévő: {status.daysLeft ?? 0} nap
                    </span>
                  ) : (
                    <span className="text-bv-text-muted">
                      Trial nem aktív • aktuális hozzáférés: {status.effectiveTier}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  Stripe / PayPal később — itt most a “subscription-status” logika működik.
                  Addig is: lásd az{' '}
                  <Link to="/#pricing" className="text-bv-blue hover:underline">
                    Árazás
                  </Link>{' '}
                  részt.
                </div>
              </div>
            </div>

            <div className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-2xl p-6 h-fit">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-bold text-lg">Összegzés</div>
                <div className={`font-mono text-xl font-bold ${activeTier.accentClass}`}>{activeTier.price}</div>
              </div>
              <div className="text-bv-text-muted text-sm mb-5">{activeTier.period}</div>

              <div className="bg-bv-bg rounded-xl border border-bv-border-subtle p-4">
                <div className="text-bv-text-secondary text-sm font-semibold mb-1">Aktív csomag</div>
                <div className="text-white text-xl font-extrabold">
                  {status.effectiveTier}
                  {status.isTrial ? <span className="ml-2 text-xs text-bv-blue">(trial)</span> : null}
                </div>
                <div className="text-bv-text-muted text-xs mt-2">
                  {status.isTrial
                    ? `Lejárat: ${status.trialEndAt?.toLocaleDateString('hu-HU')}`
                    : 'Stripe/PayPal: később bekötve'}
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={expireTrial}
                    className="w-full bg-bv-blue/20 text-bv-bg font-semibold py-2.5 rounded-lg hover:bg-bv-blue/30 transition-all"
                  >
                    Trial lejárat szimulálása
                  </button>
                  <button
                    type="button"
                    onClick={resetSubscription}
                    className="w-full border border-bv-border-subtle text-bv-text-secondary font-semibold py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                  >
                    Reset mock előfizetés
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-5 w-full bg-bv-blue/30 text-bv-bg font-semibold py-3 rounded-lg cursor-not-allowed opacity-70"
              >
                Fizetés bekötés alatt
              </button>

              <div className="mt-3 text-bv-text-muted text-xs leading-relaxed">
                Ha PRO/PRO+ csomagot választasz, automatikusan indul a 7 napos trial (mock).
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
