/**
 * Modell Kalibráció — Brier Score, Log-Loss, Reliability
 *
 * Ez a modul a modell valószínűségeinek MINŐSÉGÉT méri historikus,
 * már eldőlt meccseken. Ez váltja ki a korábbi önbeteljesítő `confidence`
 * mezőt (ami pusztán a value lineáris függvénye volt → tautológia).
 *
 * EGY VALÓSZÍNŰSÉG AKKOR "KALIBRÁLT", ha amikor a modell 70%-ot mond,
 * az események ~70%-a tényleg bekövetkezik. A reliability-diagram ezt
 * sávonként méri; a Brier-score és a log-loss egyetlen számba sűríti.
 *
 * Forrás: Brier (1950), Murphy (1973) — a meteorológiából átvett,
 * a sportfogadásban standard pontossági mértékek.
 */

export interface CalibrationSample {
  /** A modell által az BEKÖVETKEZETT kimenetre adott valószínűség (0..1) */
  predictedProb: number;
  /** Tényleg bekövetkezett-e az esemény (1 = igen, 0 = nem) */
  outcome: 0 | 1;
}

export interface CalibrationBin {
  rangeLow: number;
  rangeHigh: number;
  count: number;
  avgPredicted: number;   // a sávba eső predikciók átlaga
  observedFreq: number;   // a ténylegesen bekövetkezett arány
  gap: number;            // |avgPredicted - observedFreq| (0 = tökéletes)
}

export interface CalibrationReport {
  sampleSize: number;
  brierScore: number;       // 0 = tökéletes, 0.25 = random (50/50), alacsonyabb = jobb
  brierSkillScore: number;  // referencia (alaprátához képest); >0 = jobb a naivnál
  logLoss: number;          // alacsonyabb = jobb; ∞ büntetés a magabiztos hibákra
  expectedCalibrationError: number; // ECE: súlyozott átlag gap, 0 = tökéletes
  maxCalibrationError: number;      // MCE: legrosszabb sáv gap
  reliabilityBins: CalibrationBin[];
  interpretation: string;
}

/**
 * Brier Score = átlag( (predictedProb - outcome)^2 )
 * Bináris eseményre. 0 = tökéletes, 0.25 = tiszta 50/50 tipp, 1 = mindig rossz.
 */
export function brierScore(samples: CalibrationSample[]): number {
  if (samples.length === 0) return NaN;
  const sum = samples.reduce(
    (s, x) => s + (x.predictedProb - x.outcome) ** 2,
    0
  );
  return sum / samples.length;
}

/**
 * Brier Skill Score = 1 - (BS_model / BS_reference)
 * A referencia a "mindig az alaprátát tippeli" naiv modell.
 * BSS > 0 → a modell jobb a naivnál. BSS = 1 → tökéletes.
 */
export function brierSkillScore(samples: CalibrationSample[]): number {
  if (samples.length === 0) return NaN;
  const baseRate = samples.reduce((s, x) => s + x.outcome, 0) / samples.length;
  const bsRef = samples.reduce((s, x) => s + (baseRate - x.outcome) ** 2, 0) / samples.length;
  if (bsRef === 0) return 0;
  const bs = brierScore(samples);
  return 1 - bs / bsRef;
}

/**
 * Log-Loss (cross-entropy) = -átlag( y·ln(p) + (1-y)·ln(1-p) )
 * A magabiztos tévedéseket erősen bünteti. Alacsonyabb = jobb.
 * A p-t [ε, 1-ε] közé clampeljük, hogy elkerüljük a ln(0) = -∞ esetet.
 */
export function logLoss(samples: CalibrationSample[]): number {
  if (samples.length === 0) return NaN;
  const eps = 1e-15;
  const sum = samples.reduce((s, x) => {
    const p = Math.min(1 - eps, Math.max(eps, x.predictedProb));
    return s + (x.outcome * Math.log(p) + (1 - x.outcome) * Math.log(1 - p));
  }, 0);
  return -sum / samples.length;
}

/**
 * Reliability-diagram sávok + ECE/MCE.
 * A predikciókat `nBins` sávba osztja, és sávonként összeveti a
 * modell-átlagot a tényleges bekövetkezési aránnyal.
 */
export function reliabilityBins(
  samples: CalibrationSample[],
  nBins: number = 10
): { bins: CalibrationBin[]; ece: number; mce: number } {
  const bins: CalibrationBin[] = [];
  let ece = 0;
  let mce = 0;

  for (let i = 0; i < nBins; i++) {
    const low = i / nBins;
    const high = (i + 1) / nBins;
    const inBin = samples.filter(
      (x) => x.predictedProb >= low && (i === nBins - 1 ? x.predictedProb <= high : x.predictedProb < high)
    );
    if (inBin.length === 0) {
      bins.push({ rangeLow: low, rangeHigh: high, count: 0, avgPredicted: NaN, observedFreq: NaN, gap: NaN });
      continue;
    }
    const avgPredicted = inBin.reduce((s, x) => s + x.predictedProb, 0) / inBin.length;
    const observedFreq = inBin.reduce((s, x) => s + x.outcome, 0) / inBin.length;
    const gap = Math.abs(avgPredicted - observedFreq);
    bins.push({ rangeLow: low, rangeHigh: high, count: inBin.length, avgPredicted, observedFreq, gap });

    ece += (inBin.length / samples.length) * gap; // súlyozott
    mce = Math.max(mce, gap);
  }

  return { bins, ece, mce };
}

/**
 * Teljes kalibrációs jelentés egyetlen hívással.
 * Ezt hívd minden eldőlt fordulóra, hogy lásd: a modell valószínűségei
 * megbízhatók-e — ÉS hogy a confidence valódi alapra épüljön.
 */
export function buildCalibrationReport(
  samples: CalibrationSample[],
  nBins: number = 10
): CalibrationReport {
  const bs = brierScore(samples);
  const bss = brierSkillScore(samples);
  const ll = logLoss(samples);
  const { bins, ece, mce } = reliabilityBins(samples, nBins);

  let interpretation: string;
  if (samples.length < 30) {
    interpretation = `⚠️ Túl kevés minta (${samples.length}). Kalibrációhoz min. 30-50 eldőlt esemény kell — addig a confidence ne legyen "high".`;
  } else if (bss > 0.05 && ece < 0.10) {
    interpretation = `✅ A modell kalibrált és veri a naiv alaprátát (BSS=${bss.toFixed(3)}, ECE=${ece.toFixed(3)}). A valószínűségek megbízhatók.`;
  } else if (bss <= 0) {
    interpretation = `❌ A modell NEM jobb a naiv alaprátánál (BSS=${bss.toFixed(3)}). A value-becslések megbízhatatlanok — NE tétezz Kelly szerint.`;
  } else {
    interpretation = `🟡 Részben kalibrált (BSS=${bss.toFixed(3)}, ECE=${ece.toFixed(3)}). Használj Quarter-Kelly-t, amíg ECE < 0.10 nem teljesül.`;
  }

  return {
    sampleSize: samples.length,
    brierScore: bs,
    brierSkillScore: bss,
    logLoss: ll,
    expectedCalibrationError: ece,
    maxCalibrationError: mce,
    reliabilityBins: bins,
    interpretation,
  };
}

/**
 * Kalibráció-alapú confidence: a value HELYETT a modell historikus
 * megbízhatóságából + a value nagyságából képez confidence-t.
 *
 * Amíg nincs elég eldőlt minta (calibrationReady=false), a confidence
 * felülről korlátozott, hogy ne sugalljon hamis bizonyosságot.
 */
export function calibratedConfidence(
  valueEdge: number,        // (P·odds - 1), pl. 0.24 = +24% EV
  report: CalibrationReport | null
): number {
  const rawFromValue = Math.min(95, 50 + valueEdge * 200);

  if (!report || report.sampleSize < 30) {
    // Nincs hitelesítve a modell → konzervatív felső korlát
    return Math.min(60, rawFromValue);
  }
  // Kalibrációs minőség [0..1] faktor: jó kalibráció felskáláz, rossz lefokoz
  const calFactor = Math.max(0, Math.min(1, report.brierSkillScore * 2 + (1 - report.expectedCalibrationError * 5)));
  return Math.round(Math.min(95, 50 + valueEdge * 200 * calFactor));
}
