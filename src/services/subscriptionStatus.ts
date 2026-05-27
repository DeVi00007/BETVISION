export type Tier = 'ALAP' | 'PRO' | 'PRO+';

export type Provider = 'mock';

export interface SubscriptionState {
  tier: Tier;
  provider: Provider;
  trialStartAt: string | null; // ISO
  trialEndAt: string | null; // ISO
  updatedAt: string; // ISO
}

const STORAGE_KEY = 'betvision_subscription_state_v1';

function nowIso(d = new Date()): string {
  return d.toISOString();
}

function safeParseState(raw: string | null): SubscriptionState | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SubscriptionState>;
    if (!parsed || typeof parsed !== 'object') return null;

    if (parsed.tier !== 'ALAP' && parsed.tier !== 'PRO' && parsed.tier !== 'PRO+') return null;
    if (parsed.provider !== 'mock') return null;

    const updatedAt = typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso();
    const trialStartAt = typeof parsed.trialStartAt === 'string' ? parsed.trialStartAt : null;
    const trialEndAt = typeof parsed.trialEndAt === 'string' ? parsed.trialEndAt : null;

    return {
      tier: parsed.tier,
      provider: 'mock',
      trialStartAt,
      trialEndAt,
      updatedAt,
    };
  } catch {
    return null;
  }
}

export function getSubscriptionState(): SubscriptionState {
  const state = safeParseState(
    typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
  );

  if (state) return state;

  return {
    tier: 'ALAP',
    provider: 'mock',
    trialStartAt: null,
    trialEndAt: null,
    updatedAt: nowIso(),
  };
}

export function setSubscriptionTierAndAutoTrial(tier: Tier, opts?: { autoTrialDays?: number }): void {
  // A választáskor induljon az automatikus 7 napos próba minden nem-ALAP csomagra.
  // ALAP csomag esetén nincs trial.
  const autoTrialDays = opts?.autoTrialDays ?? 7;

  const dStart = new Date();

  const nextState: SubscriptionState =
    tier === 'ALAP'
      ? {
          tier,
          provider: 'mock',
          trialStartAt: null,
          trialEndAt: null,
          updatedAt: nowIso(),
        }
      : {
          tier,
          provider: 'mock',
          trialStartAt: nowIso(dStart),
          trialEndAt: nowIso(new Date(dStart.getTime() + autoTrialDays * 24 * 60 * 60 * 1000)),
          updatedAt: nowIso(),
        };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }
}

export function clearSubscriptionState(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Mock trial “lejárat szimulálása”:
 * PRO/PRO+ esetén a trialEndAt-et beállítja a múltba, így effectiveTier visszaesik ALAP-ra.
 */
export function expireTrialMock(): void {
  if (typeof window === 'undefined') return;

  const current = getSubscriptionState();
  if (current.tier === 'ALAP') return;

  const next: SubscriptionState = {
    ...current,
    trialStartAt: current.trialStartAt,
    trialEndAt: new Date(Date.now() - 60 * 1000).toISOString(), // 1 perccel ezelőtt
    updatedAt: nowIso(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/**
 * Mock “reset előfizetés”:
 * törli a localStorage állapotot, így resetel ALAP-ra.
 */
export function resetSubscriptionMock(): void {
  clearSubscriptionState();
}

export interface SubscriptionStatus {
  selectedTier: Tier; // amit a felhasználó kiválasztott
  effectiveTier: Tier; // trial lejárata után ALAP lesz
  isTrial: boolean; // PRO/PRO+ trial esetén
  isActive: boolean; // effectiveTier != 'ALAP'
  trialEndAt: Date | null;
  daysLeft: number | null;
}

export function computeSubscriptionStatus(
  state: SubscriptionState,
  now = new Date()
): SubscriptionStatus {
  const trialEndAt = state.trialEndAt ? new Date(state.trialEndAt) : null;
  const hasTrial = !!trialEndAt && !Number.isNaN(trialEndAt.getTime());

  if (state.tier === 'ALAP') {
    return {
      selectedTier: state.tier,
      effectiveTier: 'ALAP',
      isTrial: false,
      isActive: true,
      trialEndAt: null,
      daysLeft: null,
    };
  }

  const isTrialActive = hasTrial ? now.getTime() <= trialEndAt!.getTime() : false;

  const daysLeft = hasTrial
    ? Math.ceil((trialEndAt!.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    : null;

  return {
    selectedTier: state.tier,
    effectiveTier: isTrialActive ? state.tier : 'ALAP',
    isTrial: isTrialActive,
    isActive: isTrialActive,
    trialEndAt: hasTrial ? trialEndAt : null,
    daysLeft: isTrialActive ? (daysLeft ?? 0) : (daysLeft ?? 0),
  };
}
