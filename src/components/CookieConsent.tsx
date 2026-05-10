import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, Settings2 } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'betvision_cookie_consent';

function getStoredPreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CookiePreferences;
    }
  } catch {
    // Hibatűrés: ha a localStorage nem elérhető
  }
  return null;
}

function savePreferences(prefs: CookiePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Hibatűrés: ha a localStorage nem elérhető
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const stored = getStoredPreferences();
    if (stored) {
      setPreferences(stored);
    } else {
      // Ha nincs eltárolt választás, megjelenítjük a banner-t
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    setVisible(false);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    const newPrefs: CookiePreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    setVisible(false);
    setShowSettings(false);
  };

  const handleRejectOptional = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    setVisible(false);
    setShowSettings(false);
  };

  const handleToggle = (key: keyof Omit<CookiePreferences, 'necessary' | 'timestamp'>) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Fő banner - alsó sáv */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] border-t border-bv-border-subtle"
        style={{
          background: 'rgba(11, 17, 32, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="content-max-width py-4 md:py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Ikon és szöveg */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-bv-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0">
                <Cookie className="w-5 h-5 text-bv-blue" />
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">Süti beállítások</p>
                <p className="text-bv-text-secondary text-xs md:text-sm leading-relaxed">
                  Ez a weboldal sütiket használ a jobb felhasználói élmény érdekében.
                  További részletekért olvassa el{' '}
                  <Link
                    to="/suti-szabalyzat"
                    className="text-bv-blue hover:underline"
                    onClick={() => setVisible(false)}
                  >
                    Süti Szabályzatunkat
                  </Link>{' '}
                  és{' '}
                  <Link
                    to="/adatvedelem"
                    className="text-bv-blue hover:underline"
                    onClick={() => setVisible(false)}
                  >
                    Adatvédelmi Nyilatkozatunkat
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Gombok */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                Elfogadom
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bv-bg-tertiary hover:bg-bv-bg-secondary text-bv-text-secondary hover:text-white text-sm font-medium transition-colors border border-bv-border-subtle"
              >
                <Settings2 className="w-4 h-4" />
                Beállítások
              </button>
              <button
                onClick={handleRejectOptional}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-bv-bg-tertiary hover:bg-red-500/20 text-bv-text-muted hover:text-red-400 transition-colors"
                title="Csak a kötelező sütik elfogadása"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Beállítások dialog */}
      {showSettings && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          {/* Háttér overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowSettings(false)}
          />

          {/* Dialog tartalom */}
          <div
            className="relative w-full max-w-lg rounded-2xl border border-bv-border-subtle shadow-2xl"
            style={{
              background: 'rgba(11, 17, 32, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Fejléc */}
            <div className="flex items-center justify-between p-5 border-b border-bv-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bv-blue/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-bv-blue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Süti beállítások</h3>
                  <p className="text-bv-text-muted text-xs">Válassza ki az engedélyezni kívánt sütiket</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-lg bg-bv-bg-tertiary flex items-center justify-center text-bv-text-muted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Süti típusok lista */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Kötelező */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle">
                <div className="w-5 h-5 rounded border-2 border-bv-blue bg-bv-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-bv-bg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Kötelező sütik</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-bv-blue/10 text-bv-blue">
                      Szükséges
                    </span>
                  </div>
                  <p className="text-bv-text-secondary text-xs mt-1 leading-relaxed">
                    Ezek a sütik elengedhetetlenek az oldal alapvető működéséhez, biztonságához
                    és a süti beállítások tárolásához. Nem kapcsolhatók ki.
                  </p>
                </div>
              </div>

              {/* Funkcionális */}
              <button
                onClick={() => handleToggle('functional')}
                className="w-full flex items-start gap-3 p-4 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle hover:border-bv-purple/30 transition-colors text-left"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    preferences.functional
                      ? 'border-bv-purple bg-bv-purple'
                      : 'border-bv-text-muted'
                  }`}
                >
                  {preferences.functional && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Funkcionális sütik</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-bv-purple/10 text-bv-purple">
                      Opcionális
                    </span>
                  </div>
                  <p className="text-bv-text-secondary text-xs mt-1 leading-relaxed">
                    Lehetővé teszik, hogy az oldal megjegyezze a beállításait és preferenciáit
                    (pl. nyelv, téma), így személyre szabottabb élményt nyújtanak.
                  </p>
                </div>
              </button>

              {/* Analitikai */}
              <button
                onClick={() => handleToggle('analytics')}
                className="w-full flex items-start gap-3 p-4 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle hover:border-bv-orange/30 transition-colors text-left"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    preferences.analytics
                      ? 'border-bv-orange bg-bv-orange'
                      : 'border-bv-text-muted'
                  }`}
                >
                  {preferences.analytics && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Analitikai sütik</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-bv-orange/10 text-bv-orange">
                      Opcionális
                    </span>
                  </div>
                  <p className="text-bv-text-secondary text-xs mt-1 leading-relaxed">
                    Anonimizált adatokat gyűjtenek arról, hogyan használja az oldalt.
                    Segítenek a Platform fejlesztésében és a felhasználói élmény javításában.
                    (Google Analytics)
                  </p>
                </div>
              </button>

              {/* Marketing */}
              <button
                onClick={() => handleToggle('marketing')}
                className="w-full flex items-start gap-3 p-4 rounded-xl bg-bv-bg-secondary border border-bv-border-subtle hover:border-bv-orange2/30 transition-colors text-left"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    preferences.marketing
                      ? 'border-bv-orange2 bg-bv-orange2'
                      : 'border-bv-text-muted'
                  }`}
                >
                  {preferences.marketing && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Marketing sütik</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-bv-orange2/10 text-bv-orange2">
                      Nem alkalmazott
                    </span>
                  </div>
                  <p className="text-bv-text-secondary text-xs mt-1 leading-relaxed">
                    Személyre szabott hirdetések megjelenítését teszik lehetővé.
                    A BETVISION jelenleg NEM használ marketing sütiket.
                  </p>
                </div>
              </button>
            </div>

            {/* Lábléc gombok */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 p-5 border-t border-bv-border-subtle">
              <button
                onClick={handleAcceptSelected}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bv-blue hover:brightness-110 text-bv-bg text-sm font-semibold transition-all"
              >
                <Check className="w-4 h-4" />
                Kiválasztottak mentése
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                <Check className="w-4 h-4" />
                Mind elfogadása
              </button>
              <button
                onClick={handleRejectOptional}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bv-bg-tertiary hover:bg-red-500/20 text-bv-text-secondary hover:text-red-400 text-sm font-medium transition-colors border border-bv-border-subtle"
              >
                <X className="w-4 h-4" />
                Csak kötelező
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
