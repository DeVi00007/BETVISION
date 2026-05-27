/**
 * API Service modul - Vercel proxy-n keresztüli api-football.com integráció
 * 
 * A böngészőből a /api/sports proxy endpoint-ot hívja,
 * ami Vercel serverless function-ként továbbítja a kéréseket.
 * Az API kulcs nem kerül ki a frontendre.
 */

const PROXY_BASE_URL = '/api/sports';

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500;

// ============================================================
// Cache System
// ============================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 percig cache

export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

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

async function apiCall(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<any[] | null> {
  try {
    await enforceRateLimit();

    const queryParams = new URLSearchParams();
    queryParams.append('endpoint', endpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${PROXY_BASE_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[API] HTTP hiba: ${response.status} - ${endpoint}`);
      return null;
    }

    const data = await response.json() as { response?: any[]; errors?: any };

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.warn('[API] API hiba:', data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      console.warn(`[API] Üres válasz: ${endpoint}`);
      return null;
    }

    return data.response;
  } catch (error) {
    console.error(`[API] Hálózati hiba (${endpoint}):`, error);
    return null;
  }
}

export async function getLiveMatches(): Promise<any[] | null> {
  return apiCall('fixtures', { live: 'all' });
}

export async function getFixtures(
  date?: string,
  league?: number
): Promise<any[] | null> {
  const today = new Date().toISOString().split('T')[0];
  return apiCall('fixtures', {
    date: date || today,
    league,
    season: new Date().getFullYear(),
    timezone: 'Europe/Budapest',
  });
}

export async function getOdds(fixtureId: number): Promise<any | null> {
  const response = await apiCall('odds', {
    fixture: fixtureId,
    bet: 1,
    bookmaker: 1,
  });
  return response && response.length > 0 ? response[0] : null;
}

export async function getLeagues(): Promise<any[] | null> {
  return apiCall('leagues');
}

export async function getFixtureStatistics(fixtureId: number): Promise<any | null> {
  const response = await apiCall('fixtures/statistics', { fixture: fixtureId });
  return response && response.length > 0 ? response[0] : null;
}

export async function getFixtureEvents(fixtureId: number): Promise<any[] | null> {
  return apiCall('fixtures/events', { fixture: fixtureId });
}

export async function getStandings(leagueId: number, season?: number): Promise<any[] | null> {
  return apiCall('standings', {
    league: leagueId,
    season: season || new Date().getFullYear(),
  });
}
