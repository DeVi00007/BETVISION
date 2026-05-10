import { Brain, Search, Activity } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const features = [
  {
    icon: Brain,
    title: 'Prediktív Analitika',
    body: 'Neurális hálózataink több mint 200 változót elemeznek minden mérkőzés előtt: forma, sérülések, időjárás, motiváció, történelmi adatok.',
    color: 'text-bv-blue',
  },
  {
    icon: Search,
    title: 'Értékkereső Rendszer',
    body: 'Az AI azonnal felismeri az alul- és túlértékelt oddsokat. Ha a bookmaker hibázik, mi észrevesszük — és szólunk.',
    color: 'text-bv-blue-light',
  },
  {
    icon: Activity,
    title: 'Élő Mérkőzés Elemzés',
    body: 'Mérkőzés közben is elemezünk: gólhelyzetek, labdabirtoklás, támadási statisztikák alapján adunk valós idejű tippajánlásokat.',
    color: 'text-bv-orange',
  },
];

export default function AITipsterSection() {
  return (
    <section className="section-padding bg-bv-bg">
      <div className="content-max-width">
        <SectionHeader
          title="MESTERSÉGES INTELLIGENCIA TIPPMIX TIPPEK"
          subtitle="Gépi tanulás alapú predikciók, amelyek folyamatosan tanulnak és fejlődnek"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-[1200px] mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-8 group hover:-translate-y-1 hover:shadow-glow-blue transition-all duration-300">
              <feature.icon
                className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                strokeWidth={1.5}
              />
              <h3 className="text-white text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-bv-text-secondary text-base leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/ai-tippek"
            className="inline-flex items-center gap-2 text-bv-blue text-lg font-medium hover:gap-4 transition-all">
            Próbáld ki az AI Tippmix tippjeinket ingyen
            <span className="text-xl">→</span>
          </a>
        </div>

        {/* War Room Image */}
        <div className="mt-16 relative rounded-2xl overflow-hidden border border-bv-border-subtle max-w-[1000px] mx-auto">
          <img
            src="/war-room.jpg"
            alt="AI Elemző Központ"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bv-bg via-bv-bg/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-bv-blue text-sm font-semibold tracking-wider uppercase mb-1">
              BETVISION AI WAR ROOM
            </p>
            <p className="text-bv-text-secondary text-sm">
              Valós időben elemzett adatok a világ összes nagy bajnokságából
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
