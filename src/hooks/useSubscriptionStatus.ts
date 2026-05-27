import { useEffect, useMemo, useState } from 'react';
import type { Tier, SubscriptionStatus, SubscriptionState } from '@/services/subscriptionStatus';
import {
  fetchSubscriptionStatus,
  selectTierMock,
  expireTrialMockApi,
  resetSubscriptionMockApi,
} from '@/api/billing/subscriptionStatusApi';

export function useSubscriptionStatus(autoTrialDays?: number) {
  const [state, setState] = useState<SubscriptionState | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus>(() => ({
    selectedTier: 'ALAP',
    effectiveTier: 'ALAP',
    isTrial: false,
    isActive: true,
    trialEndAt: null,
    daysLeft: null,
  }));

  const load = async () => {
    const res = await fetchSubscriptionStatus(autoTrialDays);
    // state-et most nem használjuk közvetlenül a UI-ban, de megtartjuk a későbbi bővítéshez
    setState((prev) => {
      const prevState = prev ?? {
        tier: res.selectedTier,
        provider: 'mock' as const,
        trialStartAt: res.trialEndAt ? new Date().toISOString() : null,
        trialEndAt: res.trialEndAt,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prevState,
        tier: res.selectedTier,
        trialEndAt: res.trialEndAt,
      };
    });

    setStatus({
      selectedTier: res.selectedTier,
      effectiveTier: res.effectiveTier,
      isTrial: res.isTrial,
      isActive: res.isActive,
      trialEndAt: res.trialEndAt ? new Date(res.trialEndAt) : null,
      daysLeft: res.daysLeft,
    });
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      void load();
    }, 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrialDays]);

  const selectTier = async (tier: Tier) => {
    await selectTierMock(tier, { autoTrialDays });
    await load();
  };

  const expireTrial = async () => {
    await expireTrialMockApi();
    await load();
  };

  const resetSubscription = async () => {
    await resetSubscriptionMockApi();
    await load();
  };

  const refresh = async () => load();

  const memoStatus = useMemo(() => status, [status]);

  return {
    state,
    status: memoStatus,
    refresh,
    selectTier,
    expireTrial,
    resetSubscription,
  };
}
