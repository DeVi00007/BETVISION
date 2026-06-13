/**
 * useQuantitativeTips — React hook a kvantitatív VB tippekhez
 *
 * A BACKEND MOTORT hívja (/api/ai/tips): Poisson + Elo + Dixon-Coles +
 * shrinkage. Ha a motor nem elérhető, a statikus adatra fallbackel, és ezt
 * a `source` mezőben jelzi, hogy a UI tájékoztathassa a felhasználót.
 */

import { useState, useEffect, useCallback } from 'react';
import { quantitativeVBData, type QuantitativeTip, type QuantitativePortfolio } from '@/data/quantitativeTips';
import { fetchQuantitativeTips } from '@/services/quantitativeTipsService';

interface UseQuantitativeTipsReturn {
  tips: QuantitativeTip[];
  portfolio: QuantitativePortfolio;
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
  tournament: string;
  modelVersion: string;
  /** 'engine' = élő motor, 'static' = fallback statikus adat */
  source: 'engine' | 'static';
  refresh: () => void;
}

export function useQuantitativeTips(): UseQuantitativeTipsReturn {
  const [data, setData] = useState(quantitativeVBData);
  const [source, setSource] = useState<'engine' | 'static'>('static');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchQuantitativeTips();
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      console.error('[useQuantitativeTips] Hiba:', err);
      setError('Nem sikerült betölteni a kvantitatív tippeket');
      setData(quantitativeVBData);
      setSource('static');
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    tips: data.tips,
    portfolio: data.portfolio,
    loading,
    error,
    lastUpdated,
    tournament: data.tournament,
    modelVersion: data.modelVersion,
    source,
    refresh: load,
  };
}
