import { Helmet } from 'react-helmet-async';

export default function SubscriptionPage() {
  return (
    <>
      <Helmet>
        <title>Előfizetés - BetVision</title>
        <meta name="description" content="Előfizetési lehetőségek a BetVision-nél" />
      </Helmet>

      <div className="min-h-screen bg-bv-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Előfizetési Oldal</h1>
          <p className="text-gray-400">Ez az oldal hamarosan elkészül...</p>
        </div>
      </div>
    </>
  );
}
