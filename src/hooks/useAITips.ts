/**
 * useAITips - Custom React hook AI tippek generálásához
 * Valós mérkőzés adatok alapján generál AI elemzéseket
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchUpcomingMatches, generateAITip } from '@/services/apiFootball';
import type { ConvertedMatch } from '@/types/api';
import type { AITipData } from '@/services/apiFootball';
import { aiTips as mockTips } from '@/data/mockData';

interface UseAITipsReturn {
  tips: AITipData[];
  matches: ConvertedMatch[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  isUsingMockData: boolean;
}

interface UseAITipsOptions {
  limit?: number;
  minConfidence?: number;
}

/**
 * Mock tippek konvertálása AITipData formátumba
 */
function getMockTips(): AITipData[] {
  return mockTips.map((t) => ({
    id: t.id,
    matchId: t.matchId,
    homeTeam: t.homeTeam,
    awayTeam: t.awayTeam,
    league: t.league,
    aiPick: t.aiPick,
    aiConfidence: t.aiConfidence,
    odds: t.odds,
    analysis: t.analysis,
    sport: t.sport,
    time: t.time,
    homeForm: t.homeForm,
    awayForm: t.awayForm,
    h2h: t.h2h,
  }));
}

/**
 * AI tippek lekérdezése és generálása valós mérkőzés adatok alapján
 * @param options - Opcionális beállítások (limit, minConfidence)
 */
export function useAITips(options: UseAITipsOptions = {}): UseAITipsReturn {
  const { limit = 5, minConfidence = 0 } = options;

  const [matches, setMatches] = useState<ConvertedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Valós mérkőzések lekérdezése
      const data = await fetchUpcomingMatches();

      if (data && data.length > 0) {
        // Limit alkalmazása
        const limited = limit ? data.slice(0, limit) : data;
        setMatches(limited);
        setIsUsingMockData(false);
        setError(null);
      } else {
        // Fallback mock adatokra
        console.warn('[useAITips] API nem adott vissza adatot, mock tippek használata');
        setMatches([]);
        setIsUsingMockData(true);
      }
    } catch (err) {
      console.error('[useAITips] Hiba az adatok betöltésekor:', err);
      setError('Nem sikerült betölteni az AI tippekhez szükséges adatokat');
      setMatches([]);
      setIsUsingMockData(true);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [limit]);

  // AI tippek generálása a mérkőzésekből
  const tips = useMemo(() => {
    if (matches.length === 0) {
      return isUsingMockData ? getMockTips() : [];
    }

    const generated = matches.map((match) => generateAITip(match));

    // Confidence szűrés
    if (minConfidence > 0) {
      return generated.filter((t) => t.aiConfidence >= minConfidence);
    }

    return generated;
  }, [matches, isUsingMockData, minConfidence]);

  // Első betöltés
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Kézi frissítés
   */
  const refresh = useCallback(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  return {
    tips,
    matches,
    loading,
    error,
    lastUpdated,
    refresh,
    isUsingMockData,
  };
}
