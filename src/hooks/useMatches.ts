/**
 * useMatches - Custom React hook mérkőzések listájának lekérdezéséhez
 * Dátum és bajnokság szerinti szűrés támogatása
 * Loading és error állapotok kezelése
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchUpcomingMatches, fetchLiveMatches } from '@/services/apiFootball';
import type { ConvertedMatch } from '@/types/api';
import { liveMatches as mockMatches } from '@/data/mockData';

interface UseMatchesReturn {
  matches: ConvertedMatch[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  isUsingMockData: boolean;
}

interface UseMatchesOptions {
  date?: string;
  leagueId?: number;
  live?: boolean;
  limit?: number;
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
 * Mérkőzések lekérdezése szűrési lehetőségekkel
 * @param options - Szűrési opciók (dátum, bajnokság, élő meccsek)
 */
export function useMatches(options: UseMatchesOptions = {}): UseMatchesReturn {
  const { date, leagueId, live = false, limit } = options;

  const [matches, setMatches] = useState<ConvertedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: ConvertedMatch[];

      if (live) {
        // Élő mérkőzések lekérdezése
        data = await fetchLiveMatches();
      } else {
        // Közelgő mérkőzések lekérdezése
        data = await fetchUpcomingMatches(date, leagueId);
      }

      // Limit alkalmazása
      if (limit && data.length > limit) {
        data = data.slice(0, limit);
      }

      if (data.length > 0) {
        setMatches(data);
        setIsUsingMockData(false);
        setError(null);
      } else {
        // Üres válasz -> mock adatok
        console.warn('[useMatches] Üres API válasz, mock adatok használata');
        setMatches(getMockMatches());
        setIsUsingMockData(true);
      }
    } catch (err) {
      console.error('[useMatches] Hiba a mérkőzések betöltésekor:', err);
      setError('Nem sikerült betölteni a mérkőzéseket');
      setMatches(getMockMatches());
      setIsUsingMockData(true);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [date, leagueId, live, limit]);

  // Automatikus betöltés
  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, leagueId, live, limit]);

  /**
   * Kézi frissítés
   */
  const refresh = useCallback(() => {
    setLoading(true);
    loadMatches();
  }, [loadMatches]);

  return {
    matches,
    loading,
    error,
    lastUpdated,
    refresh,
    isUsingMockData,
  };
}
