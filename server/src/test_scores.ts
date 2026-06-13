/**
 * Teszt: The Odds API Scores endpoint
 * Eredmények automata lekérése a lejátszott VB meccsekről
 */
const API_KEY = 'a8e5531b0522a4fdf01a696cbab69cff';
const BASE_URL = 'https://api.the-odds-api.com/v4';

async function main() {
  // Eredmények lekérése az elmúlt 2 napból
  const url = `${BASE_URL}/sports/soccer_fifa_world_cup/scores/?apiKey=${API_KEY}&daysFrom=2`;
  console.log('Lekerdezes:', url.replace(API_KEY, '***'));
  
  const resp = await fetch(url);
  const data = await resp.json();
  
  // Használati statisztika
  console.log(`Requests remaining: ${resp.headers.get('x-requests-remaining')}`);
  console.log(`Meccsek szama: ${data.length}`);
  
  // Lejátszott meccsek szűrése
  const completed = data.filter((m: any) => m.completed);
  console.log(`Lejatszott: ${completed.length}`);
  
  for (const m of completed) {
    const homeScore = m.scores?.[0]?.score || 0;
    const awayScore = m.scores?.[1]?.score || 0;
    console.log(`\n  ${m.home_team} ${homeScore}-${awayScore} ${m.away_team}`);
    if (m.last_update) console.log(`    Utolso frissites: ${m.last_update}`);
  }
  
  // Remaining request count
  console.log(`\nFelhasznalhato requestek: ${resp.headers.get('x-requests-remaining')}/${resp.headers.get('x-requests-used')}`);
}

main().catch(console.error);
