import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings, Page } from '../types';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<Page[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('pages').select('*').eq('is_enabled', true).order('sort_order'),
      ]);
      if (s) setSettings(s);
      if (p) setNavItems(p);
    };
    fetchData();
  }, []);

  // Fallback when company_name is empty string in DB
  const isSettingsLoaded = settings !== null;
  const companyName = isSettingsLoaded ? (settings.company_name?.trim() || '') : 'Everest HPS';
  const tagline = settings?.tagline?.trim() || '';
  const showText = companyName.length > 0;

  const primary = settings?.primary_color || '#0f3460';
  const accent = settings?.accent_color || '#e94560';
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top info bar */}
      <div className="hidden md:block text-white text-xs py-1.5" style={{ backgroundColor: primary }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="opacity-75">Mon – Sat: 9:00 AM – 6:30 PM IST</span>
          <div className="flex items-center gap-5">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <Phone size={12} />
                {settings.phone}
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="opacity-90 hover:opacity-100 transition-opacity">
                {settings.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-premium-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={companyName || 'Logo'} className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: primary }} />
            )}
            {showText && (
              <div className="hidden sm:flex flex-col justify-center leading-tight">
                <span
                  className="font-display font-bold text-xl tracking-tight leading-none"
                  style={{ color: settings?.company_name_color || primary }}
                >
                  {companyName}
                </span>

                {tagline && (
                  <span
                    className="text-[11px] font-medium tracking-wide text-gray-500 mt-1"
                  >
                    {tagline}
                  </span>
                )}
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                style={isActive(item.path) ? { backgroundColor: primary } : {}}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                WhatsApp
              </a>
            )}
            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="flex flex-col p-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  style={isActive(item.path) ? { backgroundColor: primary } : {}}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-1 flex flex-col gap-2">
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-center text-green-700 bg-green-50"
                  >
                    Chat on WhatsApp
                  </a>
                )}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-center text-white"
                  style={{ backgroundColor: accent }}
                >
                  Get a Quote
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}