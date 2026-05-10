import { useState } from 'react';
import {
  Heart,
  CreditCard,
  Wallet,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Gift,
  CheckCircle,
  ArrowRight,
  Lock,
  Sparkles,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/* ============================================================
   FIGYELEM: A fizetési linkek PLACEHOLDER-ek!
   Cseréld ki a saját fizetési adataidra mielőtt élesíted.
   ============================================================ */

const PLACEHOLDER_STRIPE_LINK = 'https://donate.stripe.com/test_YOUR_STRIPE_LINK';
const PLACEHOLDER_BARION_LINK = 'https://www.barion.com/pay/YOUR_BARION_LINK';
const PLACEHOLDER_PAYPAL_EMAIL = 'YOUR_PAYPAL_EMAIL@example.com';

const PRESET_AMOUNTS = [1000, 3000, 5000];

// ── Stripe SVG Logo ──────────────────────────────────────────
function StripeLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 25" fill="currentColor" className={className}>
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.09 10.09 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.26-.06 1.58zm-6.2-5.63c-.94 0-1.93.74-2.04 2.37h4.18c-.04-1.36-.74-2.37-2.14-2.37zM42.57 5.86l-.1 1.82h-.13c-.74-.95-2.08-1.66-3.72-1.66-3.56 0-5.96 3.14-5.96 7.44 0 4.47 2.35 7.56 5.92 7.56 1.46 0 2.98-.57 3.76-1.57h.1v1.44c0 3.63-1.97 5.4-4.88 5.4-1.56 0-2.9-.52-3.93-1.26l-1.48 3.14c1.56.99 3.43 1.54 5.45 1.54 4.88 0 8.45-2.95 8.45-9.27V6.4h-4.52v-.54zm-2.86 12.3c-2.04 0-3.32-1.78-3.32-4.22 0-2.45 1.28-4.14 3.32-4.14 2.08 0 3.32 1.7 3.32 4.14 0 2.44-1.24 4.22-3.32 4.22zM29.8 5.32c-1.7 0-2.88.67-3.63 1.65h-.11l-.13-1.37h-4.4v19.24l4.99-.02v-5.02c.72.66 1.89 1.28 3.36 1.28 3.38 0 6.52-2.78 6.52-7.54 0-4.96-3.14-7.22-6.61-7.22zm-1.14 10.85c-1.1 0-2.02-.48-2.49-1.15V9.66c.51-.67 1.43-1.23 2.49-1.23 1.93 0 3.22 2.08 3.22 4.37 0 2.36-1.3 4.37-3.22 4.37zM13.07.28C8.75.28 5.49 2.83 5.28 6.57h4.88c.17-1.18 1.15-2.1 2.82-2.1 1.64 0 2.6.7 2.6 1.84 0 1.28-1.38 1.74-3.36 2.25C9.82 9.26 5.4 10.28 5.4 15.11c0 3.8 2.68 5.76 6.04 5.76 1.93 0 3.63-.54 4.78-1.69.02.74.06 1.36.1 1.55h4.82c-.1-.5-.21-1.48-.21-3.08V6.85c0-4.42-3.51-6.57-7.86-6.57zm2.06 13.59c-.42.66-1.36 1.3-2.49 1.3-1.38 0-2.28-.78-2.28-1.97 0-1.48.93-2.17 2.49-2.61.78-.23 2.06-.54 2.28-1.1v4.38z" />
    </svg>
  );
}

// ── PayPal SVG Logo ──────────────────────────────────────────
function PayPalLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 26" fill="currentColor" className={className}>
      <path d="M12.5 2.1h-7C4.5 2.1 3 3.4 2.6 5.2L.1 18.2c-.2.8.4 1.5 1.2 1.5h2.8l.7-4.3v.2c.4-1.8 1.8-3.1 3.5-3.1h1.5c4.7 0 8.4-1.9 9.5-7 .4-2.2.2-4-1-5.2-1-1.1-2.8-2.2-5.8-2.2z" opacity="0.7" />
      <path d="M26.7 7.4h-3.9c-.5 0-1 .3-1.1.8l-.2 1-.3 1.7v.2c.4-1.8 1.8-3.1 3.5-3.1h1.5c4.7 0 8.4-1.9 9.5-7 .4-2.2.2-4-1-5.2-.3-.3-.7-.5-1.2-.7.2.3.3.6.3 1 0 .4-.1.8-.2 1.2-.8 3.2-3.2 4.8-6.6 5.6-1.2.3-2.5.4-3.9.5h-1c-.4 0-.8.3-1 .7l-.1.3-.7 4.7zM23.7 7.6h3.9c4.9 0 8.8-1.6 10-7.1.1-.5.2-1 .2-1.5.5 1 .6 2.5.2 4.3-1.1 5.2-4.8 7-9.5 7h-1.5c-1.7 0-3.1 1.3-3.5 3.1l-2 12.8c-.2.8.4 1.5 1.2 1.5h2.8l.6-3.8 1.8-11.5v-.2c-.4 1.8-1.8 3.1-3.5 3.1h-.7z" />
    </svg>
  );
}

// ── Barion SVG Logo (generic card icon) ──────────────────────
function BarionLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 14h4" />
    </svg>
  );
}

// ── FAQ Item ─────────────────────────────────────────────────
interface FAQItemProps {
  question: string;
  answer: string;
}
function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-bv-border-subtle rounded-lg bg-bv-bg-secondary overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium text-sm">{question}</span>
        {open ? (
          <ChevronUp size={18} className="text-bv-text-muted shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-bv-text-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-bv-text-secondary text-sm leading-relaxed border-t border-bv-border-subtle pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

// ── Main Donation Page ───────────────────────────────────────
export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(3000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);

  // Stripe modal state
  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeForm, setStripeForm] = useState({ name: '', email: '', message: '' });

  // Final amount
  const finalAmount = showCustom && customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  // ── Stripe redirect ──
  const handleStripeRedirect = () => {
    // TODO: Cseréld ki a PLACEHOLDER_STRIPE_LINK-et a saját Stripe Payment Link-edre
    const url = `${PLACEHOLDER_STRIPE_LINK}?prefilled_amount=${finalAmount * 100}`;
    window.open(url, '_blank');
    setStripeOpen(false);
  };

  // ── Barion redirect ──
  const handleBarionRedirect = () => {
    // TODO: Cseréld ki a PLACEHOLDER_BARION_LINK-et a saját Barion link-edre
    const url = `${PLACEHOLDER_BARION_LINK}?amount=${finalAmount}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-bv-bg pt-[72px]">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-bv-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-bv-gold/5 rounded-full blur-[100px]" />
        </div>

        <div className="content-max-width relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-bv-border-subtle rounded-full px-4 py-1.5 mb-6">
              <Heart size={14} className="text-red-400" />
              <span className="text-bv-text-secondary text-sm">Támogasd a fejlesztést</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Támogasd a{' '}
              <span className="bg-gradient-to-r from-bv-blue to-bv-blue-light bg-clip-text text-transparent">
                BETVISION
              </span>
              -t
            </h1>
            <p className="text-bv-text-secondary text-lg md:text-xl leading-relaxed mb-10">
              A BETVISION ingyenes AI tippmix tippeket és sportfogadási elemzéseket nyújt. A
              fejlesztés és a szerver költségek támogatásával hosszú távon biztosíthatod a platform
              működését.
            </p>
          </div>

          {/* ── Amount Selector ── */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setShowCustom(false);
                }}
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  !showCustom && selectedAmount === amount
                    ? 'bg-bv-blue text-bv-bg shadow-glow-blue'
                    : 'bg-bv-bg-secondary text-white border border-bv-border-subtle hover:border-bv-blue/30'
                }`}
              >
                {amount.toLocaleString('hu-HU')} Ft
              </button>
            ))}
            <button
              onClick={() => setShowCustom(true)}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                showCustom
                  ? 'bg-bv-blue text-bv-bg shadow-glow-blue'
                  : 'bg-bv-bg-secondary text-white border border-bv-border-subtle hover:border-bv-blue/30'
              }`}
            >
              Egyéni összeg
            </button>
          </div>

          {/* Custom amount input */}
          {showCustom && (
            <div className="flex justify-center mt-4">
              <div className="relative w-64">
                <Input
                  type="number"
                  placeholder="Add meg az összeget"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-12 text-center text-lg bg-bv-bg-secondary border-bv-border-subtle text-white"
                  min={100}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bv-text-muted text-sm">
                  Ft
                </span>
              </div>
            </div>
          )}

          {/* Selected amount display */}
          <div className="text-center mt-6">
            <p className="text-bv-text-muted text-sm">
              Kiválasztott összeg:{" "}
              <span className="text-bv-blue font-bold text-xl">
                {finalAmount.toLocaleString('hu-HU')} Ft
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PAYMENT METHODS
          ═══════════════════════════════════════════ */}
      <section className="pb-16 md:pb-24">
        <div className="content-max-width">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Válassz fizetési módot
            </h2>
            <p className="text-bv-text-secondary">
              Mindhárom szolgáltató biztonságos és PCI DSS kompatibilis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ── Stripe Card ── */}
            <Card className="bg-bv-bg-secondary border-bv-border-subtle group hover:border-[#635BFF]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#635BFF]/5">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#635BFF]/20 transition-colors">
                  <StripeLogo className="w-8 h-8 text-[#635BFF]" />
                </div>
                <CardTitle className="text-white text-xl">
                  <CreditCard className="inline size-5 mr-2 -mt-0.5" />
                  Bankkártya
                </CardTitle>
                <CardDescription className="text-bv-text-secondary">
                  Bankkártyás fizetés Stripe rendszerén keresztül. VISA, Mastercard, Apple Pay,
                  Google Pay támogatás.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setStripeOpen(true)}
                  className="w-full bg-[#635BFF] hover:bg-[#5348FF] text-white font-semibold h-11 transition-all duration-200"
                >
                  Támogatás kártyával
                  <ArrowRight size={16} className="ml-1" />
                </Button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-bv-text-muted text-xs">
                  <Lock size={12} />
                  <span>SSL titkosítás</span>
                </div>
              </CardContent>
            </Card>

            {/* ── PayPal Card ── */}
            <Card className="bg-bv-bg-secondary border-bv-border-subtle group hover:border-[#003087]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#003087]/5">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-[#003087]/10 flex items-center justify-center mb-4 group-hover:bg-[#003087]/20 transition-colors">
                  <PayPalLogo className="w-9 h-9 text-[#0070E0]" />
                </div>
                <CardTitle className="text-white text-xl">
                  <Wallet className="inline size-5 mr-2 -mt-0.5" />
                  PayPal
                </CardTitle>
                <CardDescription className="text-bv-text-secondary">
                  PayPal biztonságos fizetés. Fizethetsz PayPal egyenlegből vagy bankkártyával a
                  PayPal rendszerén keresztül.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* PayPal form - JSX formában */}
                <form
                  action="https://www.paypal.com/donate"
                  method="post"
                  target="_blank"
                  className="w-full"
                >
                  <input type="hidden" name="business" value={PLACEHOLDER_PAYPAL_EMAIL} />
                  <input
                    type="hidden"
                    name="amount"
                    value={finalAmount}
                    className="paypal-amount"
                  />
                  <input type="hidden" name="currency_code" value="HUF" />
                  <input type="hidden" name="item_name" value="BETVISION Támogatás" />
                  <input type="hidden" name="no_shipping" value="1" />
                  <input type="hidden" name="return" value={window.location.origin + '/tamogatas?koszonjuk=paypal'} />
                  <button
                    type="submit"
                    className="w-full bg-[#0070E0] hover:bg-[#005ea6] text-white font-semibold h-11 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Támogatás PayPal-lal
                    <ArrowRight size={16} />
                  </button>
                </form>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-bv-text-muted text-xs">
                  <Lock size={12} />
                  <span>PayPal Buyer Protection</span>
                </div>
              </CardContent>
            </Card>

            {/* ── Barion Card ── */}
            <Card className="bg-bv-bg-secondary border-bv-border-subtle group hover:border-[#00A896]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00A896]/5">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-[#00A896]/10 flex items-center justify-center mb-4 group-hover:bg-[#00A896]/20 transition-colors">
                  <BarionLogo className="w-7 h-7 text-[#00A896]" />
                </div>
                <CardTitle className="text-white text-xl">
                  <ShieldCheck className="inline size-5 mr-2 -mt-0.5" />
                  Barion
                </CardTitle>
                <CardDescription className="text-bv-text-secondary">
                  A Barion a magyar fizetési megoldások közül az egyik legnépszerűbb. Biztonságos és
                  gyors fizetés.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleBarionRedirect}
                  className="w-full bg-[#00A896] hover:bg-[#009884] text-white font-semibold h-11 transition-all duration-200"
                >
                  Támogatás Barionnal
                  <ArrowRight size={16} className="ml-1" />
                </Button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-bv-text-muted text-xs">
                  <Lock size={12} />
                  <span>Barion biztonsági token</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY SUPPORT SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-16 bg-bv-bg-secondary/50 border-y border-bv-border-subtle">
        <div className="content-max-width">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Mire fordítjuk a támogatást?
            </h2>
            <p className="text-bv-text-secondary max-w-2xl mx-auto">
              Minden forintot közvetlenül a platform fejlesztésére és fenntartására költünk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles size={28} className="text-bv-blue" />,
                title: 'AI fejlesztés',
                desc: 'Az AI modellek tanítása és a predikciós algoritmusok optimalizálása folyamatos munkát igényel.',
              },
              {
                icon: <CreditCard size={28} className="text-bv-gold" />,
                title: 'Szerver költségek',
                desc: 'Az élő odds adatok, API hívások és a weboldal üzemeltetése havi szinten jelentős költséggel jár.',
              },
              {
                icon: <Gift size={28} className="text-bv-purple" />,
                title: 'Új funkciók',
                desc: 'A támogatásból új sportok, elemzési eszközök és közösségi funkciók fejlesztését finanszírozzuk.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-bv-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="content-max-width max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <HelpCircle size={20} className="text-bv-blue" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Gyakran ismételt kérdések
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <FAQItem
              question="Miért van szükség támogatásra?"
              answer="A BETVISION teljesen ingyenesen használható, azonban a fejlesztéshez, szerverek üzemeltetéséhez és az AI modellek működtetéséhez jelentős költségek társulnak. A támogatásod segít fenntartani és továbbfejleszteni a platformot."
            />
            <FAQItem
              question="Biztonságos a fizetés?"
              answer="Mindhárom fizetési szolgáltató (Stripe, PayPal, Barion) PCI DSS Level 1 kompatibilis, ami a legmagasabb szintű biztonsági tanúsítás a fizetési iparban. A bankkártya adataidat mi soha nem látjuk, közvetlenül a szolgáltatókhoz kerülnek titkosított csatornán."
            />
            <FAQItem
              question="Kapok számlát a támogatásról?"
              answer="Igen, minden támogatásról automatikusan küldünk elektronikus számlát az általad megadott email címre. A számla a Stripe/PayPal/Barion rendszeréből érkezik hivatalos formában."
            />
            <FAQItem
              question="Visszakérhetem a támogatást?"
              answer="A támogatás önkéntes hozzájárulás, nem termék vásárlás vagy szolgáltatás igénybevétele. Ennek megfelelően nem áll módunkban visszatérítést biztosítani. Kivételt képeznek a jogszabály által előírt esetek."
            />
            <FAQItem
              question="Külföldről is tudok támogatni?"
              answer="Természetesen! A Stripe és a PayPal szinte minden országból elfogad fizetést. A Barion elsősorban az EU-n belül működik. A pénznem automatikusan átváltásra kerül."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THANK YOU SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-bv-bg-secondary/50 border-t border-bv-border-subtle">
        <div className="content-max-width text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-bv-green/10 flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-bv-green" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Köszönjük, hogy támogatod a BETVISION-t!
            </h2>
            <p className="text-bv-text-secondary leading-relaxed mb-8">
              Minden támogatás számít, legyen szó 1000 Ft-ról vagy többről. A te hozzájárulásod
              segít, hogy a platform ingyenes maradjon és folyamatosan fejlődjön. A támogatók
              nevét (ha kívánják) megjelenítjük a közösségi oldalainkon.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-bv-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-bv-green" />
                <span>Biztonságos fizetés</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-bv-green" />
                <span>Azonnali visszaigazolás</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-bv-green" />
                <span>Számla emailben</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLACEHOLDER NOTICE
          ═══════════════════════════════════════════ */}
      <section className="py-6 bg-yellow-500/10 border-t border-yellow-500/20">
        <div className="content-max-width">
          <div className="flex items-start gap-3 text-yellow-400/80 text-xs">
            <Sparkles size={14} className="shrink-0 mt-0.5" />
            <p>
              <strong>Fejlesztői megjegyzés:</strong> A fenti fizetési linkek jelenleg
              placeholder-ek. A saját fizetési adataid beállításához keresd meg a következő
              konstansokat a <code>src/pages/DonationPage.tsx</code> fájlban:{" "}
              <code>PLACEHOLDER_STRIPE_LINK</code>, <code>PLACEHOLDER_PAYPAL_EMAIL</code>, és
              <code>PLACEHOLDER_BARION_LINK</code>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STRIPE PAYMENT DIALOG
          ═══════════════════════════════════════════ */}
      <Dialog open={stripeOpen} onOpenChange={setStripeOpen}>
        <DialogContent className="bg-bv-bg-secondary border-bv-border-subtle text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <StripeLogo className="w-8 h-8 text-[#635BFF]" />
              Stripe fizetés
            </DialogTitle>
            <DialogDescription className="text-bv-text-secondary">
              Töltsd ki az adataidat a fizetéshez. A fizetés a Stripe biztonságos oldalán történik.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Amount summary */}
            <div className="bg-bv-bg-tertiary rounded-lg p-4 text-center">
              <p className="text-bv-text-muted text-sm mb-1">Támogatás összege</p>
              <p className="text-2xl font-bold text-white">
                {finalAmount.toLocaleString('hu-HU')} Ft
              </p>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="stripe-name" className="text-bv-text-secondary text-sm">
                <User size={12} className="inline mr-1" />
                Név
              </Label>
              <Input
                id="stripe-name"
                placeholder="Teljes név"
                value={stripeForm.name}
                onChange={(e) => setStripeForm((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-bv-bg border-bv-border-subtle text-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="stripe-email" className="text-bv-text-secondary text-sm">
                <Mail size={12} className="inline mr-1" />
                Email cím
              </Label>
              <Input
                id="stripe-email"
                type="email"
                placeholder="email@pelda.hu"
                value={stripeForm.email}
                onChange={(e) => setStripeForm((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-bv-bg border-bv-border-subtle text-white"
              />
            </div>

            {/* Message (optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="stripe-message" className="text-bv-text-secondary text-sm">
                <MessageSquare size={12} className="inline mr-1" />
                Üzenet <span className="text-bv-text-muted">(opcionális)</span>
              </Label>
              <Textarea
                id="stripe-message"
                placeholder="Egy rövid üzenet..."
                value={stripeForm.message}
                onChange={(e) => setStripeForm((prev) => ({ ...prev, message: e.target.value }))}
                className="bg-bv-bg border-bv-border-subtle text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button
              onClick={handleStripeRedirect}
              className="w-full bg-[#635BFF] hover:bg-[#5348FF] text-white font-semibold h-11"
            >
              <Lock size={14} className="mr-1" />
              Fizetés biztonságosan →
            </Button>
            <p className="text-bv-text-muted text-xs text-center">
              A fizetés a Stripe titkosított oldalán történik.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
