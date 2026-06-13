/**
 * Vercel Serverless Function
 * Proxy az api-football.com hívásokhoz
 * 
 * Használat: GET /api/sports?endpoint=fixtures&live=all
 *           GET /api/sports?endpoint=odds&fixture=123456
 * 
 * Az API kulcsot a VERCEL_API_FOOTBALL_KEY környezeti változóból olvassa,
 * fallback a frontendben használt kulcsra (prototípus verzió).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE_URL = 'https://v3.football.api-sports.io';

/**
 * Az API kulcsot a Vercel környezeti változóból olvassa.
 * Beállítás a Vercel Dashboardon: VERCEL_API_FOOTBALL_KEY
 * 
 * NINCS FALLBACK — ha a környezeti változó hiányzik, a függvény
 * 500-as hibát ad vissza. Ennek az oka: a korábbi FALLBACK_KEY
 * commitolva volt a publikus repóba, így bárki használhatta volna.
 */

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Csak GET metódus támogatott' });
    return;
  }

  const { endpoint, ...queryParams } = request.query as Record<string, string>;

  if (!endpoint || typeof endpoint !== 'string') {
    response.status(400).json({ error: 'Hiányzó "endpoint" paraméter' });
    return;
  }

  // Biztonsági szűrés: csak engedélyezett endpoint-ok
  const allowedEndpoints = [
    'fixtures',
    'odds',
    'leagues',
    'fixtures/statistics',
    'fixtures/events',
    'standings',
    'teams',
    'countries',
  ];

  if (!allowedEndpoints.includes(endpoint)) {
    response.status(403).json({ error: `Nem engedélyezett endpoint: ${endpoint}` });
    return;
  }

  // Paraméterek tisztítása (csak string-ek)
  const cleanParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      cleanParams[key] = String(value);
    }
  }

  try {
    const apiKey = process.env.VERCEL_API_FOOTBALL_KEY;
    if (!apiKey) {
      console.error('[API Proxy] HIÁNYZIK a VERCEL_API_FOOTBALL_KEY környezeti változó');
      response.status(500).json({ error: 'API kulcs hiányzik. Állítsd be a VERCEL_API_FOOTBALL_KEY env változót.' });
      return;
    }
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    const apiResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      console.error(`[API Proxy] HTTP ${apiResponse.status} for ${endpoint}`);
      response.status(apiResponse.status).json({
        error: `API hiba: ${apiResponse.status}`,
        endpoint,
      });
      return;
    }

    const data = await apiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    console.error('[API Proxy] Hálózati hiba:', error);
    response.status(502).json({
      error: 'Hálózati hiba az API hívás során',
      endpoint,
    });
  }
}
