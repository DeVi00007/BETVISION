import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Lock,
  ArrowRight,
  X,
} from 'lucide-react';

/* ============================================================
   FIGYELEM: A fizetési linkek PLACEHOLDER-ek!
   Cseréld ki a saját fizetési adataidra mielőtt élesíted.
   ============================================================ */

const PLACEHOLDER_STRIPE_LINK = 'https://donate.stripe.com/test_YOUR_STRIPE_LINK';
const PLACEHOLDER_BARION_LINK = 'https://www.barion.com/pay/YOUR_BARION_LINK';
const PLACEHOLDER_PAYPAL_EMAIL = 'YOUR_PAYPAL_EMAIL@example.com';

const PRESET_AMOUNTS = [1000, 3000, 5000];

type PaymentMethod = 'stripe' | 'paypal' | 'barion';

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Támogatás modal komponens (Dialog).
 * Használat bármelyik komponensből:
 *
 *   const [open, setOpen] = useState(false);
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Támogatás</button>
 *       <DonationModal open={open} onOpenChange={setOpen} />
 *     </>
 *   );
 */
export default function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(3000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');

  const finalAmount = showCustom && customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handlePayment = () => {
    if (paymentMethod === 'stripe') {
      // TODO: Cseréld ki a PLACEHOLDER-t a saját Stripe link-edre
      const url = `${PLACEHOLDER_STRIPE_LINK}?prefilled_amount=${finalAmount * 100}`;
      window.open(url, '_blank');
    } else if (paymentMethod === 'barion') {
      // TODO: Cseréld ki a PLACEHOLDER-t a saját Barion link-edre
      const url = `${PLACEHOLDER_BARION_LINK}?amount=${finalAmount}`;
      window.open(url, '_blank');
    }
    // PayPal a form submitjával történik
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bv-bg-secondary border-bv-border-subtle text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            Támogasd a BETVISION-t
          </DialogTitle>
          <DialogDescription className="text-bv-text-secondary">
            Válaszd ki az összeget és a fizetési módot.
          </DialogDescription>
        </DialogHeader>

        {/* ── Amount Selection ── */}
        <div className="space-y-4 py-2">
          {/* Amount buttons */}
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setShowCustom(false);
                }}
                className={cn(
                  'px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200',
                  !showCustom && selectedAmount === amount
                    ? 'bg-bv-blue text-bv-bg'
                    : 'bg-bv-bg border border-bv-border-subtle text-white hover:border-bv-blue/30'
                )}
              >
                {amount.toLocaleString('hu-HU')} Ft
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <button
            onClick={() => setShowCustom(true)}
            className={cn(
              'w-full px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200',
              showCustom
                ? 'bg-bv-blue text-bv-bg'
                : 'bg-bv-bg border border-bv-border-subtle text-white hover:border-bv-blue/30'
            )}
          >
            Egyéni összeg
          </button>

          {showCustom && (
            <div className="relative">
              <Input
                type="number"
                placeholder="Add meg az összeget (Ft)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="h-11 text-center text-lg bg-bv-bg border-bv-border-subtle text-white"
                min={100}
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bv-text-muted text-sm">
                Ft
              </span>
            </div>
          )}

          {/* Selected amount display */}
          <div className="bg-bv-bg rounded-lg p-3 text-center border border-bv-border-subtle">
            <span className="text-bv-text-muted text-sm">Fizetendő: </span>
            <span className="text-bv-blue font-bold text-xl">
              {finalAmount.toLocaleString('hu-HU')} Ft
            </span>
          </div>

          {/* ── Payment Method Selection ── */}
          <div className="space-y-2 pt-2">
            <Label className="text-bv-text-secondary text-sm">Fizetési mód</Label>

            {/* Stripe */}
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                paymentMethod === 'stripe'
                  ? 'border-[#635BFF] bg-[#635BFF]/10'
                  : 'border-bv-border-subtle bg-bv-bg hover:border-[#635BFF]/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center shrink-0">
                <CreditCard size={20} className="text-[#635BFF]" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Bankkártya (Stripe)</p>
                <p className="text-bv-text-muted text-xs">VISA, Mastercard, Apple Pay</p>
              </div>
              <div className="ml-auto">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === 'stripe'
                      ? 'border-[#635BFF] bg-[#635BFF]'
                      : 'border-bv-text-muted'
                  )}
                >
                  {paymentMethod === 'stripe' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>

            {/* PayPal */}
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                paymentMethod === 'paypal'
                  ? 'border-[#0070E0] bg-[#0070E0]/10'
                  : 'border-bv-border-subtle bg-bv-bg hover:border-[#0070E0]/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-[#0070E0]/10 flex items-center justify-center shrink-0">
                <Wallet size={20} className="text-[#0070E0]" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">PayPal</p>
                <p className="text-bv-text-muted text-xs">PayPal egyenleg vagy kártya</p>
              </div>
              <div className="ml-auto">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === 'paypal'
                      ? 'border-[#0070E0] bg-[#0070E0]'
                      : 'border-bv-text-muted'
                  )}
                >
                  {paymentMethod === 'paypal' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>

            {/* Barion */}
            <button
              onClick={() => setPaymentMethod('barion')}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                paymentMethod === 'barion'
                  ? 'border-[#00A896] bg-[#00A896]/10'
                  : 'border-bv-border-subtle bg-bv-bg hover:border-[#00A896]/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-[#00A896]/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-[#00A896]" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Barion</p>
                <p className="text-bv-text-muted text-xs">Magyar fizetési megoldás</p>
              </div>
              <div className="ml-auto">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === 'barion'
                      ? 'border-[#00A896] bg-[#00A896]'
                      : 'border-bv-text-muted'
                  )}
                >
                  {paymentMethod === 'barion' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ── PayPal Form (hidden, only shown when PayPal selected) ── */}
        {paymentMethod === 'paypal' ? (
          <DialogFooter className="flex-col gap-2">
            <form
              action="https://www.paypal.com/donate"
              method="post"
              target="_blank"
              className="w-full"
            >
              <input type="hidden" name="business" value={PLACEHOLDER_PAYPAL_EMAIL} />
              <input type="hidden" name="amount" value={finalAmount} />
              <input type="hidden" name="currency_code" value="HUF" />
              <input type="hidden" name="item_name" value="BETVISION Támogatás" />
              <input type="hidden" name="no_shipping" value="1" />
              <button
                type="submit"
                onClick={() => onOpenChange(false)}
                className="w-full bg-[#0070E0] hover:bg-[#005ea6] text-white font-semibold h-11 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                Támogatás PayPal-lal
                <ArrowRight size={16} />
              </button>
            </form>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-bv-text-muted hover:text-white"
            >
              <X size={14} className="mr-1" />
              Mégse
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex-col gap-2">
            <Button
              onClick={handlePayment}
              className={cn(
                'w-full font-semibold h-11 text-white',
                paymentMethod === 'stripe'
                  ? 'bg-[#635BFF] hover:bg-[#5348FF]'
                  : 'bg-[#00A896] hover:bg-[#009884]'
              )}
            >
              <Lock size={14} className="mr-1" />
              {paymentMethod === 'stripe' ? 'Fizetés Stripe-szal' : 'Fizetés Barionnal'}
              <ArrowRight size={16} className="ml-1" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-bv-text-muted hover:text-white"
            >
              <X size={14} className="mr-1" />
              Mégse
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
