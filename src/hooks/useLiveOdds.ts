/**
 * useLiveOdds - Custom React hook élő odds adatok lekérdezéséhez
 * 60 másodpercenként automatikus frissítés
 * Fallback mock adatokra ha API hiba történik
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchUpcomingMatches, fetchOddsForFixture } from '@/services/apiFootball';
import type { ConvertedMatch } from '@/types/api';
import { liveMatches as mockMatches } from '@/data/mockData';

interface UseLiveOddsReturn {
  matches: ConvertedMatch[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  isUsingMockData: boolean;
}

/**
 * Mock mérkőzések konvertálása ConvertedMatch formátumba
 */
function getMockMatches(): ConvertedMatch[] {
  return mockMatches.map((m) => ({
    ...m,
    fixtureId: parseInt(m.id.replace('m', '')) || 0,
    leagueId: 0,
    homeTeamLogo: undefined,
    awayTeamLogo: undefined,
  }));
}

/**
 * Élő odds adatok lekérdezése automatikus frissítéssel
 * @param initialDate - Kezdeti dátum YYYY-MM-DD formátumban (opcionális)
 */
export function useLiveOdds(initialDate?: string): UseLiveOddsReturn {
  const [matches, setMatches] = useState<ConvertedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Odds adatok lekérdezése és frissítése
   */
  const loadOdds = useCallback(async () => {
    try {
      // Elsődleges: API-ról valós adatok
      const data = await fetchUpcomingMatches(initialDate);

      if (data && data.length > 0) {
        setMatches((prev) => {
          // Ha már vannak előző adatok, merge-eljük az új odds-okkal
          if (prev.length > 0) {
            return data.map((newMatch) => {
              const existing = prev.find((p) => p.fixtureId === newMatch.fixtureId);
              if (existing) {
                return {
                  ...newMatch,
                  // Animációhoz: ha változott az odds, tartsuk meg az előzőt egy pillanatra
                  homeOdds: newMatch.homeOdds,
                  drawOdds: newMatch.drawOdds,
                  awayOdds: newMatch.awayOdds,
                };
              }
              return newMatch;
            });
          }
          return data;
        });
        setIsUsingMockData(false);
        setError(null);
      } else {
        // Fallback: mock adatok
        console.warn('[useLiveOdds] API nem adott vissza adatot, mock adatok használata');
        if (matches.length === 0) {
          setMatches(getMockMatches());
          setIsUsingMockData(true);
        }
      }
    } catch (err) {
      console.error('[useLiveOdds] Hiba az adatok betöltésekor:', err);
      setError('Nem sikerült betölteni az élő odds adatokat');
      if (matches.length === 0) {
        setMatches(getMockMatches());
        setIsUsingMockData(true);
      }
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [initialDate, matches.length]);

  /**
   * Odds-ok részleges frissítése - kevesebb API hívás
   */
  const refreshOddsOnly = useCallback(async () => {
    if (matches.length === 0) return;

    // Csak az első 3 meccs odds-át frissítjük (rate limit miatt)
    const matchesToUpdate = matches.slice(0, 3);
    const updatedMatches = [...matches];

    for (const match of matchesToUpdate) {
      if (match.fixtureId > 0) {
        try {
          const odds = await fetchOddsForFixture(match.fixtureId);
          if (odds) {
            const idx = updatedMatches.findIndex((m) => m.fixtureId === match.fixtureId);
            if (idx !== -1) {
              updatedMatches[idx] = {
                ...updatedMatches[idx],
                homeOdds: odds.homeOdds,
                drawOdds: odds.drawOdds,
                awayOdds: odds.awayOdds,
              };
            }
          }
        } catch {
          // Hibát figyelmen kívül hagyjuk, megtartjuk a régi odds-okat
        }
      }
    }

    setMatches(updatedMatches);
    setLastUpdated(new Date());
  }, [matches]);

  // Első betöltés
  useEffect(() => {
    loadOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatikus frissítés 60 másodpercenként
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Teljes refresh minden 3. ciklusban, egyébként csak odds frissítés
      if (Math.random() < 0.33) {
        loadOdds();
      } else {
        refreshOddsOnly();
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadOdds, refreshOddsOnly]);

  /**
   * Kézi frissítés
   */
  const refresh = useCallback(() => {
    setLoading(true);
    loadOdds();
  }, [loadOdds]);

  return {
    matches,
    loading,
    error,
    lastUpdated,
    refresh,
    isUsingMockData,
  };
}
