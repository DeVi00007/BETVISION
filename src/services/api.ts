/**
 * API Service modul - api-football.com integráció
 * Alap HTTP kliens fetch alapon, hibakezeléssel és mock fallback-lel
 */

import type { ApiResponse } from '@/types/api';

// API konfiguráció
const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = 'c2e659119f7d1c12b7bb8768fa0a9a2f';

// Rate limiting állapot
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // ms - minimum 2 hívás/mp ingyenes tier-en

/**
 * Ellenőrzi és karbantartja a rate limitet
 * Az ingyenes tier maximum ~2 hívás/mp, ezért várunk ha túl gyorsan hívnánk
 */
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
}

/**
 * Alap API hívás fetch-szel
 * Minden híváshoz automatikusan hozzáadja a szükséges headereket
 */
async function apiCall<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T | null> {
  try {
    await enforceRateLimit();

    // Query paraméterek összeállítása
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[API] HTTP hiba: ${response.status} ${response.statusText} - ${endpoint}`);
      return null;
    }

    const data = (await response.json()) as ApiResponse<T>;

    // API hibák ellenőrzése
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.warn('[API] API hiba:', data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      console.warn(`[API] Üres válasz: ${endpoint}`);
      return null;
    }

    return data.response as T;
  } catch (error) {
    console.error(`[API] Hálózati hiba (${endpoint}):`, error);
    return null;
  }
}

// ============================================================
// Mérkőzés lekérdezések
// ============================================================

/**
 * Élő mérkőzések lekérdezése
 * Visszaadja a jelenleg folyamatban lévő meccseket
 */
export async function getLiveMatches<T>(): Promise<T | null> {
  return apiCall<T>('fixtures', { live: 'all' });
}

/**
 * Közelgő mérkőzések lekérdezése dátum és bajnokság alapján
 * @param date - Dátum YYYY-MM-DD formátumban (alapértelmezett: mai nap)
 * @param league - Bajnokság ID (opcionális)
 */
export async function getFixtures<T>(
  date?: string,
  league?: number
): Promise<T | null> {
  const today = new Date().toISOString().split('T')[0];
  return apiCall<T>('fixtures', {
    date: date || today,
    league,
    season: new Date().getFullYear(),
    timezone: 'Europe/Budapest',
  });
}

/**
 * Odds adatok lekérdezése egy konkrét mérkőzéshez
 * @param fixtureId - A mérkőzés egyedi azonosítója
 */
export async function getOdds<T>(fixtureId: number): Promise<T | null> {
  return apiCall<T>('odds', {
    fixture: fixtureId,
    bet: 1, // Match Winner
    bookmaker: 1, // Bet365 (általánosan elérhető)
  });
}

/**
 * Elérhető bajnokságok lekérdezése
 */
export async function getLeagues<T>(): Promise<T | null> {
  return apiCall<T>('leagues', {
    type: 'league',
    current: 'true',
  });
}

/**
 * Mérkőzés statisztikák lekérdezése
 * @param fixtureId - A mérkőzés egyedi azonosítója
 */
export async function getFixtureStatistics<T>(fixtureId: number): Promise<T | null> {
  return apiCall<T>('fixtures/statistics', {
    fixture: fixtureId,
  });
}

/**
 * Mérkőzés események lekérdezése (gólok, sárga lapok stb.)
 * @param fixtureId - A mérkőzés egyedi azonosítója
 */
export async function getFixtureEvents<T>(fixtureId: number): Promise<T | null> {
  return apiCall<T>('fixtures/events', {
    fixture: fixtureId,
  });
}

/**
 * Pontállás lekérdezése egy bajnoksághoz
 * @param leagueId - Bajnokság ID
 * @param season - Szezon éve
 */
export async function getStandings<T>(
  leagueId: number,
  season: number
): Promise<T | null> {
  return apiCall<T>('standings', {
    league: leagueId,
    season,
  });
}

// ============================================================
// Cache kezelés
// ============================================================

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60000; // 60 másodperc

/**
 * Cache-ből adat lekérdezése
 */
export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

/**
 * Adat mentése cache-be
 */
export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Cache törlése
 */
export function clearCache(): void {
  cache.clear();
}

export { apiCall };
