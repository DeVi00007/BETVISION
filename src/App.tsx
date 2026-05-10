import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import HomePage from '@/pages/HomePage';
import AITipsPage from '@/pages/AITipsPage';
import CalculatorPage from '@/pages/CalculatorPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ASZFPage from '@/pages/ASZFPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CookiePage from '@/pages/CookiePage';
import FelelossegPage from '@/pages/FelelossegPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bv-bg">
      <Navigation />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-tippek" element={<AITipsPage />} />
          <Route path="/kalkulator" element={<CalculatorPage />} />
          <Route path="/elemzesek/:matchId" element={<AnalyticsPage />} />
          <Route path="/ranglista" element={<LeaderboardPage />} />
          <Route path="/aszf" element={<ASZFPage />} />
          <Route path="/adatvedelem" element={<PrivacyPage />} />
          <Route path="/suti-szabalyzat" element={<CookiePage />} />
          <Route path="/felelosseg" element={<FelelossegPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
