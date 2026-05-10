import SectionHeader from '@/components/SectionHeader';
import {
  HelpCircle,
  Settings,
  BarChart3,
  Globe,         
  Table,
} from 'lucide-react';

interface CookieItem {
  nev: string;
  cel: string;
  tipus: string;
  lejarat: string;
  szolgaltato: string;
}

const cookieTypes = [
  {
    id: 'kotelezo',
    title: 'Kötelező (Szükséges) sütik',
    color: 'bg-bv-blue',
    colorLight: 'bg-bv-blue/10',
    textColor: 'text-bv-blue',
    description:
      'Ezek a sütik elengedhetetlenek a Platform alapvető működéséhez. Nélkülük az oldal megfelelő működése nem garantálható. Ezek a sütik nem gyűjtenek személyes adatokat, és nem kapcsolhatók össze konkrét személlyel.',
    examples: [
      'Bejelentkezési állapot megőrzése',
      'Munkamenet-azonosítás',
      'Biztonsági funkciók (pl. CSRF védelem)',
      'Cookie-beállítások tárolása',
    ],
  },
  {
    id: 'funkcionalis',
    title: 'Funkcionális sütik',
    color: 'bg-bv-purple',
    colorLight: 'bg-bv-purple/10',
    textColor: 'text-bv-purple',
    description:
      'Ezek a sütik lehetővé teszik, hogy a Platform megjegyezze a felhasználó beállításait és preferenciáit, így személyre szabottabb élményt nyújtson. Ezek nélkül a Platform használható, de bizonyos funkciók nem működnek optimálisan.',
    examples: [
      'Nyelvi beállítások megőrzése',
      'Téma/színséma preferencia',
      'Űrlapok automatikus kitöltése',
      'Egyéni megjelenítési beállítások',
    ],
  },
  {
    id: 'analitikai',
    title: 'Analitikai (Teljesítmény) sütik',
    color: 'bg-bv-orange',
    colorLight: 'bg-bv-orange/10',
    textColor: 'text-bv-orange',
    description:
      'Ezek a sütik anonimizált információkat gyűjtenek arról, hogy a felhasználók hogyan használják a Platformot. Segítenek azonosítani a problémás területeket és a fejlesztési lehetőségeket. Az összegyűjtött adatok anonimizáltak.',
    examples: [
      'Oldalmegtekintések száma',
      'Látogatási időtartam mérése',
      'Hibák rögzítése',
      'Felhasználói útvonalak elemzése',
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing (Célzó) sütik',
    color: 'bg-bv-orange2',
    colorLight: 'bg-bv-orange2/10',
    textColor: 'text-bv-orange2',
    description:
      'Ezek a sütik a felhasználó érdeklődési körének megfelelő, személyre szabott tartalmak és hirdetések megjelenítését teszik lehetővé. A Platform jelenleg NEM használ marketing sütiket.',
    examples: [
      'Személyre szabott ajánlatok (jelenleg nem alkalmazott)',
      'Közösségi média integrációk (jelenleg nem alkalmazott)',
      'Retargeting (jelenleg nem alkalmazott)',
    ],
  },
];

const cookieList: CookieItem[] = [
  {
    nev: 'session_id',
    cel: 'Felhasználói munkamenet azonosítása és bejelentkezési állapot megőrzése',
    tipus: 'Kötelező',
    lejarat: 'Munkamenet',
    szolgaltato: 'BETVISION',
  },
  {
    nev: 'csrf_token',
    cel: 'Cross-Site Request Forgery támadások elleni védelem',
    tipus: 'Kötelező',
    lejarat: 'Munkamenet',
    szolgaltato: 'BETVISION',
  },
  {
    nev: 'cookie_consent',
    cel: 'A felhasználó süti beállításainak tárolása',
    tipus: 'Kötelező',
    lejarat: '1 év',
    szolgaltato: 'BETVISION',
  },
  {
    nev: 'theme_preference',
    cel: 'A felhasználó által választott színséma/megjelenés tárolása',
    tipus: 'Funkcionális',
    lejarat: '1 év',
    szolgaltato: 'BETVISION',
  },
  {
    nev: 'language',
    cel: 'Nyelvi beállítás megőrzése',
    tipus: 'Funkcionális',
    lejarat: '1 év',
    szolgaltato: 'BETVISION',
  },
  {
    nev: '_ga',
    cel: 'Google Analytics – Egyedi felhasználó azonosítása',
    tipus: 'Analitikai',
    lejarat: '2 év',
    szolgaltato: 'Google LLC',
  },
  {
    nev: '_gid',
    cel: 'Google Analytics – Egyedi felhasználó azonosítása (munkamenetenként)',
    tipus: 'Analitikai',
    lejarat: '24 óra',
    szolgaltato: 'Google LLC',
  },
  {
    nev: '_gat',
    cel: 'Google Analytics – Kérések számának szabályozása',
    tipus: 'Analitikai',
    lejarat: '1 perc',
    szolgaltato: 'Google LLC',
  },
  {
    nev: '_ga_*',
    cel: 'Google Analytics 4 – Munkamenet és események követése',
    tipus: 'Analitikai',
    lejarat: '2 év',
    szolgaltato: 'Google LLC',
  },
];

const sections = [
  {
    id: 'mi-a-suti',
    icon: HelpCircle,
    title: '1. Mi az a süti (cookie)?',
    content: `A süti (cookie) egy kis szöveges fájl, amelyet a weboldal az Ön számítógépén vagy
    mobileszközén tárol el, amikor meglátogatja az oldalt. A sütik lehetővé teszik, hogy a
    weboldal megjegyezze az Ön műveleteit és beállításait (például a bejelentkezési adatokat,
    a nyelvet, a betűméretet és egyéb megjelenítési beállításokat) egy időtartamra, így Önnek
    nem kell azokat minden egyes alkalommal újra megadnia, amikor visszatér az oldalra,
    vagy egyik oldalról a másikra böngészik.`,
  },
  {
    id: 'suti-tipusok',
    icon: Settings,
    title: '2. Milyen sütiket használunk?',
    content: `A Platform négy kategóriába sorolja a használt sütiket: kötelező (szükséges),
    funkcionális, analitikai és marketing sütik. Az Ön hozzájárulása szükséges a
    kötelező sütiken kívüli egyéb sütik használatához.`,
  },
  {
    id: 'google-analytics',
    icon: BarChart3,
    title: '3. Google Analytics',
    content: `A Platform Google Analytics 4-et használ a felhasználói forgalom anonimizált elemzésére.
    A Google Analytics sütik segítségével információkat gyűjt arról, hogyan használják a
    felhasználók a Platformot. Ezek az adatok anonimizáltak, és nem tartalmaznak személyes
    azonosításra alkalmas információkat.

    A Google Analytics adatvédelmi gyakorlatáról bővebben tájékozódhat a
    Google Adatvédelmi Irányelvek oldalon.

    Az IP-anonimizálás be van kapcsolva, ami azt jelenti, hogy a Google rövidítve tárolja
    az IP-címeket az Európai Unió tagállamaiban és az Európai Gazdasági Térség tagállamaiban.
    Kivételes esetekben a teljes IP-cím továbbításra kerül a Google USA-beli szerverére,
    ahol rövidítik.`,
  },
  {
    id: 'suti-kezeles',
    icon: Globe,
    title: '4. Süti kezelés beállítása',
    content: `A legtöbb böngésző alapértelmezés szerint elfogadja a sütiket, de Ön beállíthatja
    böngészőjét, hogy elutasítsa az összes sütit, vagy figyelmeztesse Önt, amikor süti
    kerül elküldésre. Fontos megjegyezni, hogy bizonyos oldalak funkciói nem működnek
    megfelelően, ha a sütik le vannak tiltva.

    Böngészők süti beállításai:
    • Google Chrome: Beállítások > Adatvédelem és biztonság > Sütik
    • Mozilla Firefox: Beállítások > Adatvédelem és biztonság > Sütik
    • Safari: Beállítások > Adatvédelem > Sütik
    • Microsoft Edge: Beállítások > Sütik és webhelyengedélyek`,
  },
];

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-bv-bg pt-[72px]">
      {/* Hero szekció */}
      <section className="py-16 md:py-24 border-b border-bv-border-subtle">
        <div className="content-max-width">
          <SectionHeader
            title="Süti (Cookie) Szabályzat"
            subtitle="A BETVISION Platform sütik használatáról szóló tájékoztatója"
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
              Jelen Süti Szabályzat tájékoztatja Önt arról, hogy a BETVISION Platform milyen
              sütiket (cookie-kat) használ, milyen célból, és hogyan kezelheti süti
              beállításait. A szabályzat az Európai Unió Elektronikus Hírközlési Adatvédelmi
              Irányelvének (ePrivacy Irányelv) megfelelően készült.
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

                  <div className="border-l-2 border-bv-border-subtle pl-5">
                    <p className="text-bv-text-secondary text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Süti típusok részletesen */}
          <div className="mt-16" id="suti-kategoriak">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-bv-blue/10 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-bv-blue" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Süti kategóriák részletesen
              </h2>
            </div>

            <div className="space-y-8">
              {cookieTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-6 rounded-xl border border-bv-border-subtle ${type.colorLight}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <h3 className="text-base font-semibold text-white">{type.title}</h3>
                  </div>
                  <p className="text-bv-text-secondary text-sm leading-relaxed mb-4">
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 rounded-full text-xs bg-bv-bg-tertiary text-bv-text-secondary"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Süti táblázat */}
          <div className="mt-16" id="suti-lista">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-bv-blue/10 flex items-center justify-center flex-shrink-0">
                <Table className="w-5 h-5 text-bv-blue" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                5. Süti lista
              </h2>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-bv-border-subtle">
                    <th className="text-left text-white font-semibold py-3 px-4 bg-bv-bg-secondary rounded-tl-lg">
                      Név
                    </th>
                    <th className="text-left text-white font-semibold py-3 px-4 bg-bv-bg-secondary">
                      Cél
                    </th>
                    <th className="text-left text-white font-semibold py-3 px-4 bg-bv-bg-secondary">
                      Típus
                    </th>
                    <th className="text-left text-white font-semibold py-3 px-4 bg-bv-bg-secondary">
                      Lejárat
                    </th>
                    <th className="text-left text-white font-semibold py-3 px-4 bg-bv-bg-secondary rounded-tr-lg">
                      Szolgáltató
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cookieList.map((cookie, index) => (
                    <tr
                      key={index}
                      className="border-b border-bv-border-subtle hover:bg-bv-bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-bv-blue font-mono text-xs">
                        {cookie.nev}
                      </td>
                      <td className="py-3 px-4 text-bv-text-secondary">
                        {cookie.cel}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            cookie.tipus === 'Kötelező'
                              ? 'bg-bv-blue/10 text-bv-blue'
                              : cookie.tipus === 'Funkcionális'
                              ? 'bg-bv-purple/10 text-bv-purple'
                              : 'bg-bv-orange/10 text-bv-orange'
                          }`}
                        >
                          {cookie.tipus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-bv-text-secondary text-xs">
                        {cookie.lejarat}
                      </td>
                      <td className="py-3 px-4 text-bv-text-secondary text-xs">
                        {cookie.szolgaltato}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-bv-text-muted text-xs mt-4">
              * A süti lista nem feltétlenül tartalmazza az összes használt sütit, mivel időnként
              új sütik kerülhetnek bevezetésre a Platform fejlesztése során. A lista rendszeresen
              frissítésre kerül.
            </p>
          </div>

          {/* Záró rész */}
          <div className="mt-16 p-6 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle">
            <h3 className="text-base font-semibold text-white mb-3">
              Süti Szabályzat módosítása
            </h3>
            <p className="text-bv-text-secondary text-sm leading-relaxed">
              Fenntartjuk a jogot, hogy jelen Süti Szabályzatot bármikor módosítsuk.
              A módosításokról a Platformon keresztül értesítjük a felhasználókat.
              Amennyiben kérdése van a sütikkel kapcsolatban, kérjük, írjon nekünk a{' '}
              <span className="text-bv-blue">privacy@betvision.hu</span> címre.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
