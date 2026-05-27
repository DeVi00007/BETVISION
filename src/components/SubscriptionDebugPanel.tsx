import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

export default function SubscriptionDebugPanel() {
  const { status } = useSubscriptionStatus(7);

  return (
    <div className="fixed bottom-4 left-4 z-[9999] w-[320px] rounded-xl border border-bv-border-subtle bg-bv-bg-tertiary/95 p-4 shadow-glow-blue/10">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white font-bold text-sm">DEBUG • Subscription</div>
        <div className="text-bv-blue text-[10px] font-mono">mock</div>
      </div>

      <div className="space-y-1 text-[11px] text-bv-text-secondary">
        <div>
          <span className="text-bv-text-muted">selectedTier:</span> {status.selectedTier}
        </div>
        <div>
          <span className="text-bv-text-muted">effectiveTier:</span> {status.effectiveTier}
        </div>
        <div>
          <span className="text-bv-text-muted">isTrial:</span> {String(status.isTrial)}
        </div>
        <div>
          <span className="text-bv-text-muted">isActive:</span> {String(status.isActive)}
        </div>
        <div>
          <span className="text-bv-text-muted">daysLeft:</span> {status.daysLeft ?? 'null'}
        </div>
        <div>
          <span className="text-bv-text-muted">trialEndAt:</span>{' '}
          {status.trialEndAt ? status.trialEndAt.toLocaleString('hu-HU') : 'null'}
        </div>
      </div>
    </div>
  );
}
