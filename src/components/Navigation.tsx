import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';

const navLinks = [
  { label: 'ÉLŐ ODDS', path: '/#live-odds' },
  { label: 'AI TIPPEK', path: '/ai-tippek' },
  { label: 'KALKULÁTOR', path: '/kalkulator' },
  { label: 'ELEMZÉSEK', path: '/elemzesek/m1' },
  { label: 'RANGLISTA', path: '/ranglista' },
  { label: 'ÁRAZÁS', path: '/#pricing' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return location.pathname === '/';
    return location.pathname.startsWith(path.split('/')[1] ? '/' + path.split('/')[1] : path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center"
      style={{
        background: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
      <div className="content-max-width w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-bv-green to-emerald-600 flex items-center justify-center">
            <span className="text-bv-bg font-bold text-sm font-mono">BV</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">BET</span>
            <span className="text-bv-blue font-normal">VISION</span>
          </span>
        </Link>

        {/* Center Nav - Desktop */}
        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm tracking-[0.08em] py-2 transition-colors duration-300 ${
                isActive(link.path)
                  ? 'text-white'
                  : 'text-bv-text-secondary hover:text-white'
              }`}>
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-bv-blue transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
                style={{ width: isActive(link.path) ? '100%' : undefined }}
              />
              {!isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-bv-blue transition-all duration-300 group-hover:w-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-bv-text-secondary hover:text-white text-sm transition-colors">
            BELÉPÉS
          </button>
          <button className="hidden md:block bg-bv-blue text-bv-bg text-sm font-semibold px-5 py-2 rounded-full hover:brightness-110 transition-all">
            REGISZTRÁCIÓ
          </button>
          <button className="relative text-bv-text-secondary hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-bv-blue rounded-full animate-pulse-dot" />
          </button>
          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-bv-bg z-40 flex flex-col items-center pt-12 gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`text-2xl font-semibold tracking-wider ${
                isActive(link.path) ? 'text-bv-blue' : 'text-white'
              }`}>
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-8">
            <button className="text-bv-text-secondary text-lg">BELÉPÉS</button>
            <button className="bg-bv-blue text-bv-bg text-lg font-semibold px-8 py-3 rounded-full">
              REGISZTRÁCIÓ
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
