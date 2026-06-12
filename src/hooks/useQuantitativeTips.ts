/**
 * useQuantitativeTips — React hook a kvantitatív VB tippekhez
 * Poisson + Elo + Kelly modellel számolt tippek
 */

import { useState, useMemo } from 'react';
import { quantitativeVBData, type QuantitativeTip, type QuantitativePortfolio } from '@/data/quantitativeTips';

interface UseQuantitativeTipsReturn {
  tips: QuantitativeTip[];
  portfolio: QuantitativePortfolio;
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
  tournament: string;
  modelVersion: string;
}

/**
 * Kvantitatív VB tippek — a matematikai modell által számolt értékek
 * Nincs API hívás, a számítás a backend Poisson+Elo motorjával történt
 */
export function useQuantitativeTips(): UseQuantitativeTipsReturn {
  const [lastUpdated] = useState(new Date());

  const data = useMemo(() => quantitativeVBData, []);

  return {
    tips: data.tips,
    portfolio: data.portfolio,
    loading: false,
    error: null,
    lastUpdated,
    tournament: data.tournament,
    modelVersion: data.modelVersion,
  };
}
