import SectionHeader from '@/components/SectionHeader';
import { Link } from 'react-router-dom';
import {
  Building2,
  Database,
  Target,
  Shield,
  Clock,
  Share2,
  UserCheck,
  Cookie,
  AlertCircle,
} from 'lucide-react';

const sections = [
  {
    id: 'adatkezelo',
    icon: Building2,
    title: '1. Adatkezelő adatai',
    content: [
      {
        subtitle: '1.1. Adatkezelő',
        text: 'A személyes adatok kezelője: BETVISION Technologies Kft. (kitalált társaság). Székhely: 1051 Budapest, Példa utca 1. (kitalált cím). Cégjegyzékszám: 01-09-123456 (kitalált). Adószám: 12345678-1-42 (kitalált).',
      },
      {
        subtitle: '1.2. Kapcsolattartó',
        text: 'Adatvédelmi kérdésekben az alábbi elérhetőségen fordulhat hozzánk: E-mail: privacy@betvision.hu. Postai cím: 1051 Budapest, Példa utca 1. (kitalált) – „Adatvédelem" jeligére. Válaszidő: 15 munkanapon belül.',
      },
      {
        subtitle: '1.3. Adatvédelmi tisztviselő',
        text: 'Társaságunk nem köteles adatvédelmi tisztviselő kinevezésére az GDPR 37. cikk alapján, azonban az adatvédelmi kérdések koordinálására kijelölt munkavállalónk elérhető a privacy@betvision.hu címen.',
      },
    ],
  },
  {
    id: 'adatgyujtes',
    icon: Database,
    title: '2. Milyen adatokat gyűjtünk',
    content: [
      {
        subtitle: '2.1. Regisztráció során megadott adatok',
        text: 'Név (vezetéknév és keresztnév), e-mail cím, jelszó (titkosított formában tárolva), születési dátum (az életkor ellenőrzéséhez).',
      },
      {
        subtitle: '2.2. Automatikusan gyűjtött adatok',
        text: 'IP cím, böngésző típusa és verziója, operációs rendszer, látogatás időpontja és időtartama, megtekintett oldalak, kattintások és interakciók a Platformon.',
      },
      {
        subtitle: '2.3. Fogadási preferenciák',
        text: 'Az Ön által követett sportok, csapatok, kedvenc AI tippek, fogadási szokások és preferenciák. Ezeket az adatokat kizárólag a személyre szabott élmény nyújtása érdekében gyűjtjük.',
      },
      {
        subtitle: '2.4. Kommunikációs adatok',
        text: 'Ügyfélszolgálati levelezés, visszajelzések, panaszok és egyéb kommunikáció tartalma.',
      },
    ],
  },
  {
    id: 'cel-jogalap',
    icon: Target,
    title: '3. Adatgyűjtés célja és jogalapja',
    content: [
      {
        subtitle: '3.1. Szolgáltatás nyújtása (szerződés teljesítése)',
        text: 'A regisztráció során megadott adatok kezelésének jogalapja az Ön és közöttünk létrejövő szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont). Ezek az adatok nélkülözhetetlenek a Platform szolgáltatásainak biztosításához.',
      },
      {
        subtitle: '3.2. Személyre szabás (hozzájárulás)',
        text: 'A fogadási preferenciák és viselkedési adatok kezelésének jogalapja az Ön önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont). A hozzájárulást bármikor visszavonhatja a fiókbeállításokban vagy a privacy@betvision.hu címen.',
      },
      {
        subtitle: '3.3. Statisztika és fejlesztés (jogos érdek)',
        text: 'Az anonimizált használati statisztikák készítésének jogalapja a jogos érdek (GDPR 6. cikk (1) bekezdés f) pont), nevezetesen a Platform fejlesztése és a felhasználói élmény javítása.',
      },
      {
        subtitle: '3.4. Jogi kötelezettségek teljesítése',
        text: 'Egyes adatok kezelése – különösen az életkor-ellenőrzéshez kapcsolódó adatok – jogi kötelezettség teljesítéséhez szükséges (GDPR 6. cikk (1) bekezdés c) pont), ideértve a szerencsejáték törvényi előírásokat.',
      },
    ],
  },
  {
    id: 'tarolas-vedelem',
    icon: Shield,
    title: '4. Adatok tárolása és védelme',
    content: [
      {
        subtitle: '4.1. Titkosítás',
        text: 'Minden személyes adatot AES-256 titkosítással tárolunk. A jelszavakat bcrypt algoritmussal hasheljük. Az adatátvitel SSL/TLS protokollal történik. A fizetési adatokat soha nem tároljuk a szervereinken.',
      },
      {
        subtitle: '4.2. Szerverek helye',
        text: 'Az adatokat EU területén található szervereken tároljuk, amelyek megfelelnek az ISO 27001 információbiztonsági szabványnak. Az adatok tárolása Németországban történik, az EU GDPR irányelveinek megfelelően.',
      },
      {
        subtitle: '4.3. Biztonsági intézkedések',
        text: 'Tűzfalak, DDoS védelem, rendszeres biztonsági auditok, penetrációs tesztek, hozzáférési naplók és kétfaktoros hitelesítés az adminisztrátori fiókokhoz. Rendszeres biztonsági mentések készülnek.',
      },
      {
        subtitle: '4.4. Adatvédelmi incidensek',
        text: 'Adatvédelmi incidens esetén 72 órán belül értesítjük a felhasználókat és a Nemzeti Adatvédelmi és Információszabadság Hatóságot (NAIH).',
      },
    ],
  },
  {
    id: 'megorzesi-ido',
    icon: Clock,
    title: '5. Adatok megőrzési ideje',
    content: [
      {
        subtitle: '5.1. Aktív fiókok',
        text: 'A regisztrációs adatokat a fiók aktív időszakában tároljuk. Az aktív fiók az, amelybe az utolsó 24 hónapban történt bejelentkezés.',
      },
      {
        subtitle: '5.2. Inaktív fiókok',
        text: '24 hónap inaktivitás után a felhasználót e-mailben értesítjük, és további 12 hónap elteltével – ha nem történik bejelentkezés – töröljük a személyes adatokat.',
      },
      {
        subtitle: '5.3. Anonimizált adatok',
        text: 'A használati statisztikákat anonimizált formában korlátlan ideig megőrizhetjük, mivel ezek nem tartalmaznak személyes adatokat.',
      },
    ],
  },
  {
    id: 'harmadik-fel',
    icon: Share2,
    title: '6. Harmadik félnek átadás',
    content: [
      {
        subtitle: '6.1. Szolgáltatók',
        text: 'Személyes adatait csak olyan megbízott szolgáltatókkal osztjuk meg, amelyek a Platform működéséhez elengedhetetlenek: tárhelyszolgáltató (EU szerverek), e-mail küldő szolgáltató, analitikai szolgáltató (anonimizált adatokkal).',
      },
      {
        subtitle: '6.2. Jogi kötelezettség',
        text: 'Adatokat hatósági megkeresés esetén – törvényi kötelezettség alapján – továbbíthatunk a magyar bíróságok, ügyészségek, rendőrség és egyéb jogszabályban feljogosított szervek felé.',
      },
      {
        subtitle: '6.3. Harmadik féllel való adatmegosztás korlátozása',
        text: 'Személyes adatait nem adjuk el, nem adjuk bérbe, és nem osztjuk meg harmadik felekkel marketing célokra az Ön kifejezett hozzájárulása nélkül.',
      },
    ],
  },
  {
    id: 'felhasznaloi-jogok',
    icon: UserCheck,
    title: '7. Felhasználói jogok',
    content: [
      {
        subtitle: '7.1. Hozzáférés joga',
        text: 'Ön jogosult arra, hogy visszajelzést kapjon arról, hogy személyes adatainak kezelése folyamatban van-e, és ha igen, jogosult az adatokhoz való hozzáférésre.',
      },
      {
        subtitle: '7.2. Helyesbítés joga',
        text: 'Ön jogosult arra, hogy kérje a rá vonatkozó pontatlan személyes adatok helyesbítését, valamint a hiányos adatok kiegészítését.',
      },
      {
        subtitle: '7.3. Törlés joga ("elfeledtetéshez való jog")',
        text: 'Ön jogosult arra, hogy kérje a rá vonatkozó személyes adatok törlését, ha az adatokra már nincs szükség, vagy ha visszavonja a hozzájárulást. A törlési kérelem elutasítható, ha az adatkezelés jogi kötelezettség teljesítéséhez szükséges.',
      },
      {
        subtitle: '7.4. Adathordozhatóság joga',
        text: 'Ön jogosult arra, hogy a rá vonatkozó, általa a Platformon megadott személyes adatokat tagolt, széles körben használt, géppel olvasható formátumban megkapja, és ezeket egy másik adatkezelőnek továbbítsa.',
      },
      {
        subtitle: '7.5. A feldolgozás korlátozásához való jog',
        text: 'Ön jogosult arra, hogy kérje az adatkezelés korlátozását, ha vitatja az adatok pontosságát, vagy ha az adatkezelés jogellenes, de ellenzi az adatok törlését.',
      },
      {
        subtitle: '7.6. Tiltakozás joga',
        text: 'Ön jogosult arra, hogy bármikor tiltakozzon személyes adatainak jogos érdek alapján történő kezelése ellen. Ebben az esetben nem kezelhetjük tovább az adatokat, kivéve, ha bizonyítjuk, hogy az adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget élveznek az Ön érdekeivel szemben.',
      },
    ],
  },
  {
    id: 'cookie-k',
    icon: Cookie,
    title: '8. Cookie-k használata',
    content: [
      {
        subtitle: '8.1. Sütikről általánosan',
        text: 'A Platform sütiket (cookie-kat) használ a felhasználói élmény javítása, a Platform biztonsága és a forgalom elemzése érdekében. A sütikkel kapcsolatos részletes tájékoztatás a Süti Szabályzatban található.',
      },
      {
        subtitle: '8.2. Süti szabályzat',
        text: 'A süti beállításokat bármikor módosíthatja a böngészőjében vagy a Süti Szabályzatunkban található utasítások alapján.',
        link: { to: '/suti-szabalyzat', label: 'Süti Szabályzat megtekintése' },
      },
    ],
  },
  {
    id: 'panasz',
    icon: AlertCircle,
    title: '9. Panasz benyújtása',
    content: [
      {
        subtitle: '9.1. Belső panaszkezelés',
        text: 'Amennyiben úgy véli, hogy személyes adatai kezelése során jogait megsértettük, kérjük, forduljon hozzánk a privacy@betvision.hu címen. Panaszát 30 napon belül kivizsgáljuk és válaszolunk.',
      },
      {
        subtitle: '9.2. Hatósági panasz',
        text: 'Ha panaszával nem ért egyet a válaszunkkal, vagy ha úgy ítéli meg, hogy adatkezelésünk nem felel meg a jogszabályoknak, panaszt nyújthat be a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH).',
      },
      {
        subtitle: '9.3. NAIH elérhetőségei',
        text: 'Cím: 1055 Budapest, Falk Miksa utca 9-11. Telefon: +36 (1) 391-1400. Fax: +36 (1) 391-1410. E-mail: ugyfelszolgalat@naih.hu. Honlap: www.naih.hu. A NAIH-hoz fordulás jogát az is megilleti, aki nem éltek a belső panaszkezelési lehetőséggel.',
      },
      {
        subtitle: '9.4. Bírósági jogérvényesítés',
        text: 'Az Ön jogszabályban meghatározott jogainak megsértése esetén bírósághoz fordulhat. A per elbírálása a törvényszék hatáskörébe tartozik.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bv-bg pt-[72px]">
      {/* Hero szekció */}
      <section className="py-16 md:py-24 border-b border-bv-border-subtle">
        <div className="content-max-width">
          <SectionHeader
            title="Adatvédelmi Nyilatkozat"
            subtitle="GDPR megfelelő adatvédelmi tájékoztató a BETVISION Platformhoz"
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
              Tisztelt Felhasználó! A BETVISION Technologies Kft. (a továbbiakban: „Adatkezelő")
              elkötelezett az Ön személyes adatainak védelme iránt. Jelen Adatvédelmi Nyilatkozat
              tájékoztatja Önt arról, hogy milyen adatokat gyűjtünk, hogyan használjuk fel azokat,
              és milyen jogai vannak az adatkezeléssel kapcsolatban, az Európai Parlament és a
              Tanács (EU) 2016/679 rendelete (GDPR) alapján.
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

                  <div className="space-y-6">
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

          {/* Záró rész */}
          <div className="mt-16 p-6 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle">
            <h3 className="text-base font-semibold text-white mb-3">
              Adatvédelmi Nyilatkozat módosítása
            </h3>
            <p className="text-bv-text-secondary text-sm leading-relaxed">
              Fenntartjuk a jogot, hogy jelen Adatvédelmi Nyilatkozatot bármikor módosítsuk.
              A módosításokról a Platformon keresztül értesítjük a felhasználókat. A módosított
              nyilatkozat hatálybalépését követően a Platform további használata a módosítások
              elfogadását jelenti. Amennyiben kérdése van az adatkezeléssel kapcsolatban,
              kérjük, írjon nekünk a <span className="text-bv-blue">privacy@betvision.hu</span> címre.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
