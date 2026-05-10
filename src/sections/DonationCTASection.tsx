import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * CTA szekció a támogatáshoz.
 * Megjelenik a HomePage-en, az ÁRAZÁS szekció után.
 */
export default function DonationCTASection() {
  return (
    <section className="py-16 md:py-20 bg-bv-bg-secondary/30 border-y border-bv-border-subtle">
      <div className="content-max-width">
        <div className="relative overflow-hidden rounded-2xl bg-bv-bg-secondary border border-bv-border-subtle p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bv-blue/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Left: Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 mb-4">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Támogasd a fejlesztést</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Tetszik a BETVISION? Támogasd a fejlesztést!
              </h2>
              <p className="text-bv-text-secondary leading-relaxed max-w-xl">
                A platform ingyenes, de a szerverek és az AI fejlesztés költséges. Minden
                támogatással hozzájárulsz, hogy a BETVISION hosszú távon elérhető maradjon és
                egyre jobb legyen.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <Link
                to="/tamogatas"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-bv-bg font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Heart size={18} className="fill-yellow-700/30" />
                Támogatás
                <ArrowRight size={16} />
              </Link>
              <p className="text-bv-text-muted text-xs">
                Stripe, PayPal és Barion támogatás
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
