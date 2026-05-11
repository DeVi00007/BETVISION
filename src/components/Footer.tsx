import { Link } from 'react-router-dom';

const pageLinks = [
  { label: 'Főoldal', path: '/' },
  { label: 'Élő Odds', path: '/#live-odds' },
  { label: 'AI Tippek', path: '/ai-tippek' },
  { label: 'Kalkulátor', path: '/kalkulator' },
  { label: 'Elemzések', path: '/elemzesek/m1' },
  { label: 'Ranglista', path: '/ranglista' },
];

const legalLinks = [
  { label: 'ÁSZF', path: '/aszf' },
  { label: 'Adatvédelem', path: '/adatvedelem' },
  { label: 'Felelősség', path: '/felelosseg' },
  { label: 'Cookie szabályzat', path: '/suti-szabalyzat' },
];

export default function Footer() {
  return (
    <footer className="border-t border-bv-border-subtle bg-bv-bg pt-16 pb-8">
      <div className="content-max-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-bv-green to-emerald-600 flex items-center justify-center">
                <span className="text-bv-bg font-bold text-sm font-mono">BV</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">BET</span>
                <span className="text-bv-blue font-normal">VISION</span>
              </span>
            </div>
            <p className="text-bv-text-secondary text-sm">
              Az intelligens sportfogadás jövője
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Oldalak</h4>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-bv-text-secondary text-sm hover:text-bv-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Jogi</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-bv-text-secondary text-sm hover:text-bv-blue transition-colors cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">Közösség</h4>
            <div className="flex gap-4">
              {['Discord', 'Telegram', 'Facebook', 'Instagram'].map((social) => (
                <span
                  key={social}
                  className="w-9 h-9 rounded-full bg-bv-bg-tertiary flex items-center justify-center text-bv-text-secondary hover:text-bv-blue hover:bg-bv-bg-secondary transition-all cursor-pointer text-xs font-bold">
                  {social[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gambling warning */}
        <div className="border-t border-bv-border-subtle pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-full border-2 border-bv-text-muted flex items-center justify-center text-bv-text-muted text-xs font-bold">
              18+
            </span>
            <p className="text-bv-text-muted text-xs">
              Szerencsejáték függőséget okozhat. Játssz felelősségteljesen.
            </p>
          </div>
          <p className="text-bv-text-muted text-xs">
            © 2025 BETVISION. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
