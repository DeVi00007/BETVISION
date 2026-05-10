import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/mockData';

const stats = [
  { value: 15000, suffix: '+', label: 'Regisztrált felhasználó' },
  { value: 68, suffix: '%', label: 'AI tipp sikerességi arány' },
  { value: 2400000, suffix: '+', label: 'Elemzett mérkőzés', display: '2.4M+' },
  { value: 24, suffix: '/7', label: 'Élő adatfrissítés', display: '24/7' },
];

function AnimatedCounter({ end, suffix, display }: { end: number; suffix: string; display?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  const formatNumber = (n: number) => {
    if (display) return display;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  };

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-mono font-bold text-bv-blue mb-1">
        {display ? display : formatNumber(count) + suffix}
      </div>
      <div className="text-bv-text-secondary text-sm">{stats.find((s) => s.value === end)?.label}</div>
    </div>
  );
}

export default function CommunityTrustSection() {
  return (
    <section className="section-padding bg-bv-bg">
      <div className="content-max-width">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-20">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.value}
              suffix={stat.suffix}
              display={stat.display}
            />
          ))}
        </div>

        {/* Winner Ticket Image */}
        <div className="relative rounded-2xl overflow-hidden mb-16 max-w-3xl mx-auto border border-bv-border-subtle">
          <img
            src="/winner-ticket-hd.png"
            alt="Nyeres szelvény"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bv-bg via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-bv-blue text-sm font-semibold tracking-wider uppercase">
              Valós nyeremények a felhasználóinktól
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <h3 className="text-2xl font-bold text-white text-center mb-10">
          Amit a felhasználóink mondanak
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 hover:-translate-y-1 transition-all duration-300">
              <p className="text-bv-text-secondary text-base italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">{t.author}</p>
                  {t.isPremium && (
                    <span className="text-bv-blue text-xs">Prémium tag</span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-bv-blue fill-bv-green" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
