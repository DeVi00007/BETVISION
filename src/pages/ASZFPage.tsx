import SectionHeader from '@/components/SectionHeader';
import { Link } from 'react-router-dom';
import { FileText, Scale, UserCheck, AlertTriangle, Copyright, Database, Edit3, Gavel } from 'lucide-react';

const sections = [
  {
    id: 'altalanos',
    icon: FileText,
    title: '1. Általános rendelkezések',
    content: [
      {
        subtitle: '1.1. A platform bemutatása',
        text: 'A BETVISION ("Platform") egy mesterséges intelligenciára épülő sportfogadási tanácsadó szolgáltatás, amely AI-alapú elemzéseket, tippmix tippeket, odds-összehasonlításokat és kalkulátor eszközöket biztosít felhasználói számára. A Platform kizárólag tájékoztató és tanácsadó jellegű szolgáltatást nyújt, és nem minősül szerencsejáték-szervezésnek vagy fogadásszervezésnek.',
      },
      {
        subtitle: '1.2. Szolgáltató adatai',
        text: 'A Platform üzemeltetője és szolgáltatója: BETVISION Technologies Kft. (kitalált társaság, illusztrációs célokat szolgál). Székhely: 1051 Budapest, Példa utca 1. (kitalált cím). Cégjegyzékszám: 01-09-123456 (kitalált). Adószám: 12345678-1-42 (kitalált). Elektronikus elérhetőség: info@betvision.hu',
      },
      {
        subtitle: '1.3. Elérhetőségek',
        text: 'Ügyfélszolgálat: info@betvision.hu. Jogi kérdések: legal@betvision.hu. Adatvédelmi kérdések: privacy@betvision.hu. Postai cím: 1051 Budapest, Példa utca 1. (kitalált)',
      },
      {
        subtitle: '1.4. Hatály',
        text: 'Jelen Általános Szerződési Feltételek (ÁSZF) hatálya kiterjed minden személyre, aki a Platformot bármilyen formában használja, ideértve a regisztrált és nem regisztrált felhasználókat egyaránt. A Platform használatával a felhasználó elfogadja jelen ÁSZF valamennyi rendelkezését.',
      },
    ],
  },
  {
    id: 'szolgaltatas',
    icon: Scale,
    title: '2. Szolgáltatás leírása',
    content: [
      {
        subtitle: '2.1. AI tippmix tippek',
        text: 'A Platform mesterséges intelligencia algoritmusok segítségével elemzi a sportesemények adatait, statisztikáit és történelmi eredményeit, és ez alapján készít tájékoztató jellegű tippeket. Az AI tippek nem minősülnek garanciának vagy biztos nyereményt ígérő ajánlatnak.',
      },
      {
        subtitle: '2.2. Odds elemzés',
        text: 'A Platform valós időben gyűjt és jelenít meg odds adatokat különböző fogadási eseményekhez. Az odds adatok kizárólag tájékoztató jellegűek, és azok valós idejű változásáért a Platform nem vállal felelősséget.',
      },
      {
        subtitle: '2.3. Kalkulátor eszközök',
        text: 'A Platform matematikai kalkulátorokat biztosít a felhasználók számára, amelyekkel kiszámíthatják a lehetséges nyereményeket, kombinált fogadások visszatérítését és egyéb matematikai műveleteket. A kalkulátorok eredményei kizárólag tájékoztató jellegűek.',
      },
      {
        subtitle: '2.4. Tájékoztató jelleg',
        text: 'A Platform által nyújtott valamennyi szolgáltatás – ideértve az AI tippeket, elemzéseket, odds adatokat és kalkulátor eredményeket – kizárólag tájékoztató és oktató jellegű. A Platform nem szervez szerencsejátékot, nem fogad fogadásokat, és nem közvetít fogadási tevékenységet.',
      },
    ],
  },
  {
    id: 'felhasznalo',
    icon: UserCheck,
    title: '3. Felhasználói feltételek',
    content: [
      {
        subtitle: '3.1. 18+ korhatár',
        text: 'A Platform használata kizárólag 18. életévét betöltött, cselekvőképes természetes személyek számára engedélyezett. A regisztrációval a felhasználó kijelenti, hogy betöltötte a 18. életévét, és cselekvőképes. A Platformon való regisztrációval a felhasználó elfogadja az életkor-ellenőrzési követelményeket.',
      },
      {
        subtitle: '3.2. Regisztráció kötelezettségei',
        text: 'A regisztráció során a felhasználó köteles valós és pontos adatokat megadni. Egy felhasználó egy regisztrációval rendelkezhet. A regisztráció során megadott jelszó biztonságáért a felhasználó felel. A felhasználó köteles haladéktalanul értesíteni a Platformot, ha fiókjával visszaélést észlel.',
      },
      {
        subtitle: '3.3. Felelősségvállalás',
        text: 'A felhasználó tudomásul veszi, hogy a Platform által nyújtott információk alapján hozott döntésekért – ideértve a fogadási tevékenységeket is – kizárólag ő tartozik felelősséggel. A Platform nem vállal felelősséget a felhasználó által hozott döntések következményeiért.',
      },
      {
        subtitle: '3.4. Tiltott tevékenységek',
        text: 'A felhasználó vállalja, hogy nem használja a Platformot törvénytelen célokra, nem próbálja meg feltörni vagy károsítani a Platformot, nem terjeszt vírusokat vagy káros szoftvereket, és nem sérti más felhasználók jogait.',
      },
    ],
  },
  {
    id: 'szerencsejatek',
    icon: AlertTriangle,
    title: '4. Szerencsejátékra vonatkozó nyilatkozat',
    content: [
      {
        subtitle: '4.1. Nem fogadásszervező',
        text: 'A BETVISION Platform NEM minősül fogadásszervezőnek vagy szerencsejáték-szervezőnek. A Platform nem fogad és nem közvetít fogadásokat, nem szervez szerencsejátékot, és nem működtet fogadási irodát.',
      },
      {
        subtitle: '4.2. Kizárólag tanácsadás',
        text: 'A Platform kizárólag tanácsadó és tájékoztató szolgáltatást nyújt. Az AI által generált tippek, elemzések és javaslatok nem minősülnek befektetési tanácsnak, garanciának vagy kötelező érvényű ajánlatnak.',
      },
      {
        subtitle: '4.3. Szerencsejáték Zrt. – TippmixPro',
        text: 'Minden fogadási tevékenység a Szerencsejáték Zrt. TippmixPro rendszerén keresztül történik. A Szerencsejáték Zrt. az egyetlen törvényes szervezője a sportfogadásnak Magyarországon. A Platform nem áll kapcsolatban a Szerencsejáték Zrt.-vel, és nem képviseli az érdekeit. A TippmixPro használata a Szerencsejáték Zrt. saját általános szerződési feltételeihez kötött.',
      },
    ],
  },
  {
    id: 'felelossegkizaras',
    icon: Gavel,
    title: '5. Felelősségkizárás',
    content: [
      {
        subtitle: '5.1. AI tippek nem garanciák',
        text: 'A Platform mesterséges intelligencia által generált tippei és elemzései nem jelentenek garanciát a nyereményre. Az AI algoritmusok a rendelkezésre álló adatok alapján készítenek előrejelzéseket, azonban a sportesemények kimenetele véletlenszerű és előre nem látható.',
      },
      {
        subtitle: '5.2. Saját felelősség',
        text: 'A felhasználó saját felelősségére dönt a fogadási tevékenységekben való részvételről. A Platform nem vállal felelősséget a felhasználó által elszenvedett pénzügyi veszteségekért, ideértve a fogadásokon elszenvedett veszteségeket is.',
      },
      {
        subtitle: '5.3. Nyeremény/veszteség',
        text: 'A Platform nem vállal felelősséget semmilyen nyeremény elmaradásáért vagy veszteség bekövetkeztéért, amely a Platformon elérhető információk alapján történő fogadásból ered. A felhasználó tudomásul veszi, hogy a szerencsejáték veszteséggel járhat.',
      },
      {
        subtitle: '5.4. Technikai problémák',
        text: 'A Platform törekszik a folyamatos rendelkezésre állásra, azonban nem vállal felelősséget technikai problémákért, szerverleállásokért, adatvesztésért vagy egyéb technikai jellegű zavarokért.',
      },
    ],
  },
  {
    id: 'szellemitulajdon',
    icon: Copyright,
    title: '6. Szellemi tulajdon',
    content: [
      {
        subtitle: '6.1. BETVISION védjegy',
        text: 'A BETVISION név, logó, valamint a Platformon megjelenő valamennyi grafikai elem, szoftver és tartalom a BETVISION Technologies Kft. kizárólagos tulajdonát képezi, és szerzői jogi, védjegyjogi és egyéb szellemi tulajdonjogi védelem alatt áll.',
      },
      {
        subtitle: '6.2. Tartalom védelme',
        text: 'A Platformon közzétett valamennyi tartalom – ideértve az AI elemzéseket, statisztikákat, grafikonokat, szoftvereket és egyéb anyagokat – a szolgáltató szellemi tulajdonát képezi. Ezek másolása, terjesztése, módosítása vagy kereskedelmi célú felhasználása a szolgáltató előzetes írásbeli hozzájárulása nélkül szigorúan tilos.',
      },
      {
        subtitle: '6.3. Licenc',
        text: 'A szolgáltató a felhasználó részére korlátozott, személyes, nem kizárólagos, nem átruházható licencet ad a Platform használatára a jelen ÁSZF-ben foglalt feltételek szerint.',
      },
    ],
  },
  {
    id: 'adatkezeles',
    icon: Database,
    title: '7. Adatkezelés',
    content: [
      {
        subtitle: '7.1. GDPR megfelelés',
        text: 'A Platform az Európai Unió Általános Adatvédelmi Rendeletének (GDPR) megfelelően kezeli a felhasználók személyes adatait. Az adatkezelésről részletes tájékoztatás az Adatvédelmi Nyilatkozatban található.',
      },
      {
        subtitle: '7.2. Adatvédelmi nyilatkozat',
        text: 'A személyes adatok kezelésére, tárolására és védelmére vonatkozó részletes információkért kérjük, olvassa el Adatvédelmi Nyilatkozatunkat.',
        link: { to: '/adatvedelem', label: 'Adatvédelmi Nyilatkozat megtekintése' },
      },
    ],
  },
  {
    id: 'modositas',
    icon: Edit3,
    title: '8. Szerződés módosítása és megszüntetése',
    content: [
      {
        subtitle: '8.1. ÁSZF módosítása',
        text: 'A szolgáltató fenntartja a jogot, hogy jelen ÁSZF-et bármikor, egyoldalúan módosítsa. Az ÁSZF módosításairól a Platform a módosítás hatálybalépése előtt legalább 15 nappal értesíti a felhasználókat. A módosított ÁSZF hatálybalépését követően a Platform további használata a módosítások elfogadását jelenti.',
      },
      {
        subtitle: '8.2. Szerződés megszüntetése',
        text: 'A felhasználó bármikor megszüntetheti regisztrációját a Platformon. A szolgáltató fenntartja a jogot, hogy a jelen ÁSZF-et súlyosan megsértő felhasználók regisztrációját felfüggeszthesse vagy megszüntethesse.',
      },
    ],
  },
  {
    id: 'jogervenyesites',
    icon: Gavel,
    title: '9. Jogérvényesítés',
    content: [
      {
        subtitle: '9.1. Magyar jog hatálya',
        text: 'Jelen ÁSZF-re és a Platform használatára a magyar jog rendelkezései az irányadók, különös tekintettel a Polgári Törvénykönyvről szóló 2013. évi V. törvény, az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény, valamint a szerencsejáték szervezéséről szóló 1991. évi XXXIV. törvény rendelkezéseire.',
      },
      {
        subtitle: '9.2. Bíróságok illetékessége',
        text: 'A Platform használatából eredő jogvitákban a magyar bíróságok rendelkeznek illetékességgel. A felek megállapodnak abban, hogy a jogviták eldöntésére a szolgáltató székhelye szerinti bíróság az illetékes.',
      },
      {
        subtitle: '9.3. Felelősségkizárás',
        text: 'A Platform használatával kapcsolatos bármely jogvita esetén a felhasználó köteles először a szolgáltatóval egyeztetni. A szolgáltató törekszik a jogviták békés úton történő rendezésére.',
      },
    ],
  },
];

export default function ASZFPage() {
  return (
    <div className="min-h-screen bg-bv-bg pt-[72px]">
      {/* Hero szekció */}
      <section className="py-16 md:py-24 border-b border-bv-border-subtle">
        <div className="content-max-width">
          <SectionHeader
            title="Általános Szerződési Feltételek"
            subtitle="A BETVISION Platform használatának feltételei és szabályai"
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
          {/* Bevezető */}
          <div className="mb-16 p-6 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle">
            <p className="text-bv-text-secondary leading-relaxed">
              Jelen Általános Szerződési Feltételek (a továbbiakban: „ÁSZF") szabályozza a BETVISION
              Platform (a továbbiakban: „Platform") használatának feltételeit. A Platformra épülő
              szolgáltatások igénybevételével Ön (a továbbiakban: „Felhasználó") elfogadja jelen ÁSZF
              valamennyi rendelkezését. Kérjük, figyelmesen olvassa el az alábbiakat.
            </p>
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

                  <div className="space-y-6 pl-0 md:pl-13">
                    {section.content.map((item, index) => (
                      <div key={index} className="border-l-2 border-bv-border-subtle pl-5">
                        <h3 className="text-base font-semibold text-white mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-bv-text-secondary text-sm leading-relaxed">
                          {item.text}
                        </p>
                        {'link' in item && item.link && (
                          <Link
                            to={item.link.to}
                            className="inline-block mt-2 text-bv-blue text-sm hover:underline"
                          >
                            {item.link.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Záró nyilatkozat */}
          <div className="mt-16 p-6 rounded-xl bg-bv-bg-secondary border border-bv-orange/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-bv-orange flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-white mb-2">Fontos tudnivaló</h3>
                <p className="text-bv-text-secondary text-sm leading-relaxed">
                  A Platform használata kizárólag 18 éven felüli felhasználók számára engedélyezett.
                  A szerencsejáték függőséget okozhat. Kérjük, játsszon felelősségteljesen. Ha Ön
                  vagy valaki a környezetében szerencsejáték-függőséggel küzd, kérjen segítséget a
                  <a href="https://jatekfelelosseg.hu" target="_blank" rel="noopener noreferrer" className="text-bv-blue hover:underline ml-1">jatekfelelosseg.hu</a> weboldalon
                  vagy a <span className="text-bv-blue">06-80-200-288</span> ingyenes segélyvonalon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
