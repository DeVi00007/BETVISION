/**
 * Closing Line Value (CLV) — az edge EGYETLEN hiteles bizonyítéka
 *
 * A profi fogadás aranystandardja. A logika: a záró odds (a meccs kezdete
 * előtti utolsó piaci odds) a leghatékonyabb becslés a valódi valószínűségre,
 * mert addigra minden információ és pénz beépült. Ha TE konzisztensen
 * jobb oddson (= magasabb decimális odds az általad fogadott kimenetre)
 * kötsz, mint a záró, akkor pozitív CLV-d van → matematikailag bizonyítottan
 * van edge-ed, FÜGGETLENÜL attól, hogy az adott tipp nyert vagy bukott.
 *
 * Miért jobb ez a nyer/bukik követésnél? Mert egyetlen forduló kimenete
 * zajos (szerencse). A CLV minden egyes fogadásnál mér, eldől-e a meccs
 * vagy sem — így sokkal gyorsabban és tisztábban mutatja az edge-et.
 *
 * Beck (2000), Pinnacle "Closing Line Value" módszertan alapján.
 */

export interface ClvRecord {
  matchId: string;
  selection: string;
  /** Az az odds, amin TE fogadtál (a tipp rögzítésekor) */
  betOdds: number;
  /** A záró odds ugyanarra a kimenetre (meccs előtti utolsó piaci érték) */
  closingOdds: number;
  /** Tét Ft-ban (a CLV súlyozásához) */
  stakeFt: number;
}

export interface ClvResult extends ClvRecord {
  /** Beépített margó eltávolítása után a TE implikált valószínűséged */
  betImpliedProb: number;
  /** A záró implikált valószínűség */
  closingImpliedProb: number;
  /**
   * CLV % = (betOdds / closingOdds - 1) × 100
   * Pozitív → jobb oddson fogadtál, mint a záró → +edge jele.
   */
  clvPct: number;
  /** Beat the close? (true = jobb oddson fogadtál) */
  beatClose: boolean;
}

export interface ClvSummary {
  sampleSize: number;
  avgClvPct: number;          // átlagos CLV %
  weightedClvPct: number;     // tét-súlyozott átlag CLV %
  beatCloseRate: number;      // hány %-ban verted a zárót (cél: >55%)
  medianClvPct: number;
  records: ClvResult[];
  interpretation: string;
}

/**
 * Egy fogadás CLV-jének kiszámítása.
 * Megjegyzés: a nyers decimális oddsban benne van a bukméker margója,
 * de mivel ugyanazt a kimenetet hasonlítjuk össze (bet vs close),
 * a margó nagyrészt kiesik — a CLV% a valódi mozgást méri.
 */
export function calculateClv(record: ClvRecord): ClvResult {
  const betImpliedProb = 1 / record.betOdds;
  const closingImpliedProb = 1 / record.closingOdds;
  const clvPct = (record.betOdds / record.closingOdds - 1) * 100;
  return {
    ...record,
    betImpliedProb,
    closingImpliedProb,
    clvPct,
    beatClose: record.betOdds > record.closingOdds,
  };
}

/**
 * Teljes CLV-összegzés egy fogadás-halmazra.
 * Ezt futtasd hetente/fordulónként — ez mondja meg, van-e VALÓS edge-ed.
 */
export function summarizeClv(records: ClvRecord[]): ClvSummary {
  if (records.length === 0) {
    return {
      sampleSize: 0, avgClvPct: NaN, weightedClvPct: NaN, beatCloseRate: NaN,
      medianClvPct: NaN, records: [],
      interpretation: 'Nincs adat. Rögzítsd a fogadott oddsot ÉS a záró oddsot minden tippnél.',
    };
  }

  const results = records.map(calculateClv);
  const n = results.length;

  const avgClvPct = results.reduce((s, r) => s + r.clvPct, 0) / n;

  const totalStake = results.reduce((s, r) => s + r.stakeFt, 0);
  const weightedClvPct = totalStake > 0
    ? results.reduce((s, r) => s + r.clvPct * r.stakeFt, 0) / totalStake
    : avgClvPct;

  const beatCloseRate = (results.filter((r) => r.beatClose).length / n) * 100;

  const sortedClv = [...results].map((r) => r.clvPct).sort((a, b) => a - b);
  const medianClvPct = sortedClv[Math.floor(n * 0.5)];

  let interpretation: string;
  if (n < 20) {
    interpretation = `⚠️ Túl kevés minta (${n}). CLV-trendhez min. 20-30 fogadás kell.`;
  } else if (weightedClvPct > 1.5 && beatCloseRate > 55) {
    interpretation = `✅ BIZONYÍTOTT EDGE: +${weightedClvPct.toFixed(2)}% súlyozott CLV, a zárót ${beatCloseRate.toFixed(0)}%-ban verted. Ez valós, szerencsétől független szél.`;
  } else if (weightedClvPct > 0) {
    interpretation = `🟡 Gyenge pozitív CLV (+${weightedClvPct.toFixed(2)}%). Van jel, de még nem meggyőző — tartsd a Quarter-Kelly-t.`;
  } else {
    interpretation = `❌ NEGATÍV CLV (${weightedClvPct.toFixed(2)}%). A piac jobb nálad — a modell NEM ad valós edge-et. Állítsd le a Kelly-méretezést és kalibrálj újra.`;
  }

  return {
    sampleSize: n,
    avgClvPct,
    weightedClvPct,
    beatCloseRate,
    medianClvPct,
    records: results,
    interpretation,
  };
}
