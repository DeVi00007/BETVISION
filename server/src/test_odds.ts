/**
 * Teszt: The Odds API + BestOdds lekérés
 */
import { fetchWorldCupOdds, getBestOdds, getUsageStats } from './services/oddsApiService.js';

async function main() {
  console.log('=== Valos VB odds-ok letoltese ===');
  const matches = await fetchWorldCupOdds();
  console.log(`Meccsek szama: ${matches.length}`);
  
  for (const m of matches.slice(0, 5)) {
    const best = getBestOdds(m);
    console.log(`\n  ${best.homeTeam} vs ${best.awayTeam}`);
    console.log(`  1: ${best.homeOdds.toFixed(2)} | X: ${best.drawOdds.toFixed(2)} | 2: ${best.awayOdds.toFixed(2)}`);
    console.log(`  Legjobb bookmaker: ${best.bestBookmaker}`);
  }
  
  console.log(`\nAPI hasznalat: ${JSON.stringify(getUsageStats())}`);
}

main().catch(console.error);
