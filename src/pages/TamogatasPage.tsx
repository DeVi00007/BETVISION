import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TamogatasPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/elofizetes', { replace: true });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Előfizetések - BetVision</title>
        <meta name="description" content="Előfizetési csomagok a BETVISION-hez. Átirányítás /elofizetesre." />
      </Helmet>

      <div className="pt-[72px] min-h-screen bg-bv-bg flex items-center justify-center">
        <div className="text-center text-bv-text-secondary text-sm">
          Átirányítás…
        </div>
      </div>
    </>
  );
}
