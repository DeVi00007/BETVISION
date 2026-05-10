import SectionHeader from '@/components/SectionHeader';
import {
  Ban,
  Building,
  BrainCircuit,
  AlertOctagon,
  ShieldAlert,
  Phone,
  HeartPulse,
} from 'lucide-react';

const sections = [
  {
    id: 'nem-szervezo',
    icon: Ban,
    title: '1. NEM fogadásszervező',
    content: [
      {
        subtitle: '1.1. Tanácsadó platform',
        text: 'A BETVISION kizárólag egy mesterséges intelligenciára épülő sportfogadási tanácsadó platform. Nem szervezünk, nem közvetítünk és nem bonyolítunk le szerencsejátékot vagy sportfogadást. A Platformon megjelenő valamennyi információ, tipp, elemzés és számítás kizárólag tájékoztató és oktató jellegű.',
      },
      {
        subtitle: '1.2. Nincs fogadási tevékenység',
        text: 'A Platformon nem lehet fogadást kötni, pénzt feltölteni, szelvényt érvényesíteni vagy nyereményt felvenni. A BETVISION semmilyen formában nem vesz részt a fogadási tranzakciókban, és nem kezel pénzügyi eszközöket a felhasználók nevében.',
      },
      {
        subtitle: '1.3. Függetlenség',
        text: 'A BETVISION független entitás, amely nem áll kapcsolatban semmilyen fogadásszervezővel, szerencsejáték-szervezővel vagy kaszinóval. A Platformon megjelenő tartalmak nem minősülnek semmilyen fogadásszervező reklámjának vagy ajánlatának.',
      },
    ],
  },
  {
    id: 'tippmixpro',
    icon: Building,
    title: '2. Minden fogadás a Szerencsejáték Zrt. TippmixPro rendszerén keresztül történik',
    content: [
      {
        subtitle: '2.1. TippmixPro rendszer',
        text: 'Magyarországon a sportfogadás törvényes szervezője a Szerencsejáték Zrt. A TippmixPro rendszerén keresztül lehet törvényesen sportfogadást kötni Magyarországon. A Platformon elérhető információk alapján történő fogadás kizárólag a Szerencsejáték Zrt. TippmixPro platformján keresztül lehetséges.',
      },
      {
        subtitle: '2.2. Saját felelősség',
        text: 'A felhasználó tudomásul veszi, hogy minden fogadási tevékenység, amelyet a Platformon látott információk alapján hozott döntése nyomán köt meg, kizárólag a saját felelősségére történik. A BETVISION semmilyen felelősséget nem vállal a TippmixPro rendszerében történő fogadásokért.',
      },
      {
        subtitle: '2.3. Szerencsejáték Zrt. általános szerződési feltételei',
        text: 'A TippmixPro használata a Szerencsejáték Zrt. saját általános szerződési feltételeihez és játékszabályzataihoz kötött. A fogadás megkötése előtt a felhasználó köteles megismerni és elfogadni a Szerencsejáték Zrt. vonatkozó szabályzatait.',
      },
    ],
  },
  {
    id: 'ai-tippek',
    icon: BrainCircuit,
    title: '3. Az AI tippek nem jelentenek garanciát',
    content: [
      {
        subtitle: '3.1. Tájékoztató jelleg',
        text: 'A Platform mesterséges intelligencia algoritmusai által generált tippek, elemzések és előrejelzések kizárólag tájékoztató jellegűek. Ezek nem minősülnek befektetési tanácsnak, pénzügyi ajánlatnak vagy garanciának a nyereményre.',
      },
      {
        subtitle: '3.2. AI korlátai',
        text: 'A mesterséges intelligencia algoritmusok a rendelkezésre álló történelmi adatok, statisztikák és minták alapján készítenek előrejelzéseket. Azonban a sportesemények kimenetele számos előre nem látható tényezőtől függ (sérülések, időjárás, emberi tényezők stb.), amelyeket az AI nem tud biztosan előrejelezni.',
      },
      {
        subtitle: '3.3. Múltbeli eredmények nem jövőbeli garancia',
        text: 'A Platformon megjelenített korábbi AI tipp eredmények, nyerési ráták és statisztikák nem jelentenek garanciát a jövőbeli eredményekre. Minden sportesemény független, és a múltbeli teljesítmény nem jelzi előre a jövőbeli eredményeket.',
      },
      {
        subtitle: '3.4. Döntési felelősség',
        text: 'A fogadási döntés meghozatala kizárólag a felhasználó saját felelőssége. A Platformon elérhető információk csak egyike a döntéshozatal során figyelembe vehető tényezőknek. Javasoljuk, hogy a fogadás előtt a felhasználó saját kutatást is végezzen.',
      },
    ],
  },
  {
    id: 'kockazatok',
    icon: AlertOctagon,
    title: '4. Szerencsejáték kockázatai',
    content: [
      {
        subtitle: '4.1. Pénzügyi veszteség kockázata',
        text: 'A szerencsejáték és a sportfogadás jelentős pénzügyi veszteséggel járhat. A felhasználó soha ne játsszon olyan pénzzel, amelynek elvesztése pénzügyi nehézségeket okozna. Soha ne kölcsönzött pénzzel játsszon, és soha ne próbálja meg visszanyerni a veszteségeket több játékkal.',
      },
      {
        subtitle: '4.2. Függőség veszélye',
        text: 'A szerencsejáték pszichikailag is függőséget okozhat. A problémás szerencsejáték viselkedés jelei lehetnek: a játék gondolatainak állandó ismétlődése, a játékidő növelése, a tét növelése az izgalom érdekében, a veszteségek titkolása, a játék abbahagyásának képtelensége.',
      },
      {
        subtitle: '4.3. Felelősségteljes játék',
        text: 'Játsszon felelősségteljesen! Határozzon meg idő- és pénzügyi keretet a játékhoz, és tartsa be azt. Vegyen szüneteket, és ne játsszon stressz vagy depresszió alatt. Ha úgy érzi, hogy a játék problémát okoz az életében, kérjen segítséget.',
      },
    ],
  },
  {
    id: 'korhatar',
    icon: ShieldAlert,
    title: '5. 18+ korhatár szigorú betartása',
    content: [
      {
        subtitle: '5.1. Törvényi korhatár',
        text: 'Magyarországon a szerencsejáték törvényes korhatára 18 év. A Platform használata kizárólag 18. életévét betöltött személyek számára engedélyezett. A regisztrációval a felhasználó kijelenti, hogy betöltötte a 18. életévét.',
      },
      {
        subtitle: '5.2. Korhatár-ellenőrzés',
        text: 'A Platform fenntartja a jogot, hogy a felhasználó életkorát bármikor ellenőrizze. A korhatár-ellenőrzés elutasítása vagy meghiúsítása a regisztráció felfüggesztéséhez vagy megszüntetéséhez vezethet.',
      },
      {
        subtitle: '5.3. Kiskorúak védelme',
        text: 'A Platform kizárólag felnőttek számára készült. Kérjük, hogy szülőket és gondviselőket, akik kiskorúaknak adnak számítógép- vagy internet-hozzáférést, hogy telepítsenek szűrőszoftvert, amely megakadályozza a kiskorúak hozzáférését a szerencsejátékhoz kapcsolódó tartalmakhoz.',
      },
    ],
  },
  {
    id: 'segelyvonal',
    icon: Phone,
    title: '6. Segélyvonal és felelősségteljes játék',
    content: [
      {
        subtitle: '6.1. Ingyenes segélyvonal',
        text: 'Ha Ön vagy valaki a környezetében szerencsejáték-függőséggel küzd, kérjen segítséget az ingyenes, anonim segélyvonalon: 06-80-200-288 (ingyenesen hívható zöld szám).',
      },
      {
        subtitle: '6.2. Online segítség',
        text: 'További információk és segítségkérés a felelősségteljes játékkal kapcsolatban: www.jatekfelelosseg.hu. Az oldal részletes tájékoztatást nyújt a szerencsejáték-függőség jeleiről, megelőzéséről és kezeléséről.',
      },
      {
        subtitle: '6.3. Szakmai segítség',
        text: 'A problémás szerencsejáték kezelése szakmai segítséget igényel. Magyarországon több szervezet is foglalkozik a szerencsejáték-függőség kezelésével, többek között pszichológusok, addiktológiai szakemberek és önsegítő csoportok.',
      },
    ],
  },
  {
    id: 'fuggoseg',
    icon: HeartPulse,
    title: '7. Szerencsejáték-függőség figyelmeztetés',
    content: [
      {
        subtitle: '7.1. Figyelmeztetés',
        text: 'A SZERENCSEJÁTÉK FÜGGŐSÉGET OKOZHAT. A fogadás és a szerencsejáték nem megfelelő módon történő űzése pénzügyi veszteségekhez, családi konfliktusokhoz, munkahelyi problémákhoz és pszichés megbetegedésekhez vezethet.',
      },
      {
        subtitle: '7.2. Önellenőrző kérdések',
        text: 'Tegye fel magának a következő kérdéseket: Gyakran gondol a szerencsejátékra? Növelte már a tétet az izgalom növelése érdekében? Próbált már újra és újra visszanyerni veszteségeit? Hazudott már a szerencsejátékkal töltött időről vagy pénzről? Érezte-e már, hogy a játék miatt problémái vannak? Ha ezek közül többre is igennel válaszolt, kérjen segítséget.',
      },
      {
        subtitle: '7.3. Önkizárási lehetőség',
        text: 'A Szerencsejáték Zrt. TippmixPro rendszerében lehetőség van önkizárásra, amely során a felhasználó ideiglenesen vagy véglegesen letilthatja magát a játékból. A BETVISION Platformon is kérheti fiókja deaktiválását a privacy@betvision.hu címen.',
      },
      {
        subtitle: '7.4. További figyelmeztetés',
        text: 'Ez a Platform nem garantálja a nyereményt. Az AI tippek nem helyettesítik a saját felelősségteljes döntéshozatalt. A fogadás mindig kockázattal jár. Soha ne fogadjon többel, mint amit megengedhet magának elveszíteni.',
      },
    ],
  },
];

export default function FelelossegPage() {
  return (
    <div className="min-h-screen bg-bv-bg pt-[72px]">
      {/* Hero szekció */}
      <section className="py-16 md:py-24 border-b border-bv-border-subtle">
        <div className="content-max-width">
          <SectionHeader
            title="Felelősségkizárás"
            subtitle="Fontos tájékoztató a BETVISION Platform használatával kapcsolatban"
            centered
          />
          <p className="text-center text-bv-text-muted text-sm mt-6">
            Hatályos: 2025. január 1-től | Utolsó frissítés: 2025. január 1.
          </p>
        </div>
      </section>

      {/* Tartalom */}
      <section className="section-padding">
        <div className="content-max-width max-w-4xl">
          {/* Bevezető figyelmeztetés */}
          <div className="mb-16 p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  FIGYELEM!
                </h3>
                <p className="text-bv-text-secondary text-sm leading-relaxed">
                  A BETVISION Platform kizárólag tájékoztató és tanácsadó jellegű szolgáltatást nyújt.
                  Nem szervezünk szerencsejátékot, és nem vállalunk felelősséget a Platformon látható
                  információk alapján hozott döntések következményeiért. A szerencsejáték függőséget
                  okozhat és pénzügyi veszteséggel járhat. Kérjük, játsszon felelősségteljesen.
                  Ha segítségre van szüksége, hívja a <span className="text-red-400 font-semibold">06-80-200-288</span> ingyenes segélyvonalat.
                </p>
              </div>
            </div>
          </div>

          {/* Szekciók */}
          <div className="space-y-16">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[80px]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-bv-blue/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-bv-blue" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index} className="border-l-2 border-bv-border-subtle pl-5">
                        <h3 className="text-base font-semibold text-white mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-bv-text-secondary text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Segélyvonal kiemelt szekció */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-bv-blue/10 to-bv-purple/10 border border-bv-blue/20">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-bv-blue/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-8 h-8 text-bv-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Segélyvonal – Ingyenes és anonim
                </h3>
                <p className="text-bv-text-secondary text-sm mb-4">
                  Ha Ön vagy valaki a környezetében problémát észlel a szerencsejátékkal kapcsolatban,
                  ne habozzon segítséget kérni!
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <a
                    href="tel:+3680200288"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bv-blue text-bv-bg font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    06-80-200-288
                  </a>
                  <a
                    href="https://jatekfelelosseg.hu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-bv-blue text-bv-blue font-semibold text-sm hover:bg-bv-blue/10 transition-all"
                  >
                    <HeartPulse className="w-4 h-4" />
                    jatekfelelosseg.hu
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Záró nyilatkozat */}
          <div className="mt-16 p-6 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle">
            <h3 className="text-base font-semibold text-white mb-3">
              Záró nyilatkozat
            </h3>
            <p className="text-bv-text-secondary text-sm leading-relaxed">
              A BETVISION mindent megtesz annak érdekében, hogy a Platformon megjelenő információk
              pontosak és naprakészek legyenek, azonban nem vállal felelősséget az esetleges
              hibákért vagy hiányosságokért. A Platform használatával a felhasználó elfogadja,
              hogy minden döntését saját felelősségére hozza. A BETVISION fenntartja a jogot,
              hogy jelen Felelősségkizárást bármikor módosítsa. A módosításokról a Platformon
              keresztül értesítjük a felhasználókat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
