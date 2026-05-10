import { Shield, Brain, Bell, Lock, BookOpen } from 'lucide-react';

const pillars = [
  {
    icon: Brain,
    title: 'AI Felelősség Figyelő',
    desc: 'Gépi tanulás alapú rendszerünk érzékeli a problémás fogadási mintákat: túl gyakori tétek, megnövelt tétösszegek, veszteség utáni agresszív játék.',
    color: 'text-bv-blue',
  },
  {
    icon: Bell,
    title: 'Intelligens Figyelmeztetések',
    desc: 'Automatikus értesítések: "Már 3 vesztes tipp egymás után — érdemes szünetet tartani." A rendszer tanul a szokásaidból és a megfelelő pillanatban lép be.',
    color: 'text-bv-blue-light',
  },
  {
    icon: Lock,
    title: 'Önkorlátozó Eszközök',
    desc: 'Beállíthatsz napi/heti tét- és időkorlátokat. Ha eléred a limitet, a rendszer automatikusan lezárja a fogadási lehetőséget az adott időszakra.',
    color: 'text-bv-orange',
  },
  {
    icon: BookOpen,
    title: 'Tipplabor Oktatás',
    desc: 'Interaktív tananyagok a bankroll menedzsmentről, a Kelly-kritériumról és a felelős játék alapelveiről. Tudás = hosszú távú nyeremény.',
    color: 'text-yellow-500',
  },
  {
    icon: Shield,
    title: '100% Jogi Működés',
    desc: 'Minden fogadás kizárólag a Szerencsejáték Zrt. (TippmixPro) legális rendszerén keresztül történik. NEM szervezünk saját fogadást, csak tanácsadunk.',
    color: 'text-bv-blue',
  },
];

export default function ResponsibleGamingSection() {
  return (
    <section className="section-padding bg-bv-bg-secondary">
      <div className="content-max-width">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-bv-orange/40 rounded-full px-4 py-1.5 mb-6">
            <Shield size={14} className="text-bv-orange" />
            <span className="text-bv-orange text-xs tracking-[0.15em] font-medium">FELELŐSSÉGTELES JÁTÉK</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Technológia a Játékosok Védelméért
          </h2>
          <p className="text-bv-text-secondary text-base md:text-lg mt-3 max-w-2xl mx-auto">
            A BETVISION nem csupán nyereményt hoz — védelmet is. AI-alapú rendszerünk
            a felelős játékot helyezi az első helyre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {pillars.slice(0, 3).map((p) => (
            <div
              key={p.title}
              className="bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 hover:-translate-y-1 transition-all duration-300">
              <p.icon className={`w-10 h-10 ${p.color} mb-4`} strokeWidth={1.5} />
              <h3 className="text-white text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-bv-text-secondary text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
          <div className="md:col-span-2 lg:col-span-1 bg-bv-bg-tertiary border border-bv-border-subtle rounded-xl p-6 hover:-translate-y-1 transition-all duration-300">
            <BookOpen className="w-10 h-10 text-yellow-500 mb-4" strokeWidth={1.5} />
            <h3 className="text-white text-lg font-bold mb-2">Tipplabor Oktatás</h3>
            <p className="text-bv-text-secondary text-sm leading-relaxed">{pillars[3].desc}</p>
          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-bv-green/10 to-bv-blue-light/10 border border-bv-blue/20 rounded-xl p-6 flex items-center gap-6">
            <Shield className="w-12 h-12 text-bv-blue flex-shrink-0" strokeWidth={1.5} />
            <div>
              <h3 className="text-white text-lg font-bold mb-2">100% Jogi Működés</h3>
              <p className="text-bv-text-secondary text-sm leading-relaxed">{pillars[4].desc}</p>
            </div>
          </div>
        </div>

        {/* 18+ warning */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="w-12 h-12 rounded-full border-2 border-bv-text-muted flex items-center justify-center text-bv-text-muted text-sm font-bold">
            18+
          </span>
          <p className="text-bv-text-muted text-sm">
            A szerencsejáték függőséget okozhat. Játssz felelősségteljesen. <br />
            <span className="text-bv-text-muted/60">Segélyvonal: 06-80-200-288 | Beszéljünk Róla! | jatekfelelosseg.hu</span>
          </p>
        </div>
      </div>
    </section>
  );
}
