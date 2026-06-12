import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import WireframeStadium from '@/components/three/WireframeStadium';

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Crystal ball football background image v2 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-ball-v2.png"
          alt=""
          className="w-full h-full object-cover object-center opacity-50"
        />
      </div>

      {/* Three.js WireframeStadium — 3D interaktív háttér */}
      {mounted && (
        <div className={`absolute inset-0 z-[1] ${isMobile ? 'opacity-30' : 'opacity-60'}`}>
          <Canvas
            camera={{ position: [0, 1, 8], fov: 50 }}
            dpr={isMobile ? [0.5, 1.2] : [1, 2]}
            gl={{ antialias: !isMobile, alpha: true }}
            style={{ background: 'transparent' }}
          >
            {/* Adaptive performance for low-end/mobile */}
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <Suspense fallback={null}>
              <WireframeStadium />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.45) 30%, rgba(5,10,20,0.55) 60%, rgba(11,17,32,1) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 border border-bv-blue/60 rounded-full px-4 py-1.5 mb-8 animate-in fade-in duration-700">
          <span className="w-2 h-2 rounded-full bg-bv-blue animate-pulse-dot" />
          <span className="text-bv-blue text-xs tracking-[0.15em] font-medium">
            AI-VEZÉRELT SPORTFOGADÁS
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] font-black tracking-[-0.04em] leading-[0.95] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <span className="text-white block">A JÖVŐ</span>
          <span className="text-bv-blue block mt-2">TIPPMIX TIPPEK</span>
        </h1>

        {/* Subheadline */}
        <p className="text-bv-text-secondary text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed animate-in fade-in duration-700 delay-300">
          Mesterséges intelligencia, valós idejű odds elemzés és profi kalkulátor egy platformon.{' '}
          Növeld meg a nyerési esélyeidet adatvezérelt döntésekkel.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-in fade-in duration-700 delay-500">
          <a
            href="/ai-tippek"
            className="bg-bv-blue text-bv-bg font-semibold text-base px-8 py-4 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02] shadow-glow-blue"
          >
            AI TIPPEK MEGTEKINTÉSE
          </a>
          <a
            href="/kalkulator"
            className="border border-white/30 text-white font-medium text-base px-8 py-4 rounded-lg hover:bg-white/5 transition-all hover:border-white/50"
          >
            KALKULÁTOR MEGNYITÁSA
          </a>
        </div>

        {/* Live stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 animate-in fade-in duration-700 delay-700">
          {[
            { label: 'Élő mérkőzések', value: '1,247' },
            { label: 'Napi AI tipp', value: '342' },
            { label: 'Aktív felhasználó', value: '8,592' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-bv-blue animate-pulse-dot" />
              <span className="text-bv-text-secondary text-sm">
                {stat.label}:{''}
                <span className="text-bv-blue font-mono font-semibold ml-1">
                  {stat.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle animate-in fade-in duration-1000 delay-1000">
        <ChevronDown className="w-6 h-6 text-bv-text-muted" />
      </div>
    </section>
  );
}
