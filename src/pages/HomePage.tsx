import HeroSection from '@/sections/HeroSection';
import LiveOddsStreamSection from '@/sections/LiveOddsStreamSection';
import AITipsterSection from '@/sections/AITipsterSection';
import CalculatorPreviewSection from '@/sections/CalculatorPreviewSection';
import CommunityTrustSection from '@/sections/CommunityTrustSection';
import PricingSection from '@/sections/PricingSection';
import ResponsibleGamingSection from '@/sections/ResponsibleGamingSection';
import CTABanner from '@/sections/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveOddsStreamSection />
      <AITipsterSection />
      <CalculatorPreviewSection />
      <CommunityTrustSection />
      <PricingSection />
      <ResponsibleGamingSection />
      <CTABanner />
    </>
  );
}
