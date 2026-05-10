import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AITipsPage from '@/pages/AITipsPage';
import CalculatorPage from '@/pages/CalculatorPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bv-bg">
      <Navigation />
      <main>{children}</main>
      <Footer />
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
