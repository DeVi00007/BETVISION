import type { SubscriptionState, Tier } from '@/services/subscriptionStatus';
import {
  computeSubscriptionStatus,
  getSubscriptionState,
  resetSubscriptionMock,
  expireTrialMock,
  setSubscriptionTierAndAutoTrial,
} from '@/services/subscriptionStatus';

export interface SubscriptionStatusResponse {
  selectedTier: Tier;
  effectiveTier: Tier;
  isTrial: boolean;
  isActive: boolean;
  trialEndAt: string | null; // ISO string
  daysLeft: number | null;
}

/**
 * Mock “GET /api/billing/subscription-status” (backend nélkül).
 * Később ezt Stripe/DB-s endpointra cseréljük, a frontend interfész marad.
 */
export async function fetchSubscriptionStatus(autoTrialDays?: number): Promise<SubscriptionStatusResponse> {
  // A mock trialt a selection időpontjában számoljuk, ezért fetchnél nincs külön használata.
  // A későbbi backend-cseréhez megtartjuk a paramétert.
  void autoTrialDays;

  const state: SubscriptionState = getSubscriptionState();
  const status = computeSubscriptionStatus(state, new Date());

  return {
    selectedTier: status.selectedTier,
    effectiveTier: status.effectiveTier,
    isTrial: status.isTrial,
    isActive: status.isActive,
    trialEndAt: status.trialEndAt ? status.trialEndAt.toISOString() : null,
    daysLeft: status.daysLeft,
  };
}

/**
 * Mock “POST /api/billing/select-tier” (backend nélkül).
 * Később ezt checkout + webhook által frissített DB-re kötjük.
 */
export async function selectTierMock(tier: Tier, opts?: { autoTrialDays?: number }): Promise<void> {
  setSubscriptionTierAndAutoTrial(tier, { autoTrialDays: opts?.autoTrialDays });
}

/**
 * Mock “POST /api/billing/expire-trial”
 * Trial lejárat szimulálása: PRO/PRO+ esetén trialEndAt-et a múltba állítjuk.
 */
export async function expireTrialMockApi(): Promise<void> {
  expireTrialMock();
}

/**
 * Mock “POST /api/billing/reset”
 * Reset az alap állapotra: clear localStorage state.
 */
export async function resetSubscriptionMockApi(): Promise<void> {
  resetSubscriptionMock();
}
