import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { Link, useLocation } from 'react-router-dom';

import { Page } from '../types';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<Page[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (settingsData) setSettings(settingsData);

      // Fetch pages
      const { data: pagesData } = await supabase
        .from('pages')
        .select('*')
        .eq('is_enabled', true)
        .order('sort_order', { ascending: true });

      if (pagesData) setNavItems(pagesData);
    };
    fetchData();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <div className="flex gap-6">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-blue-400">
                <Phone size={16} /> {settings.phone}
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-blue-400">
                <Mail size={16} /> {settings.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: settings?.primary_color || '#003366' }}></div>
            )}
            <span className="hidden sm:inline text-gray-900" style={{ color: settings?.company_name_color }}>{settings?.company_name || 'Everest'}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-medium transition-colors ${isActive(item.path)
                  ? 'text-blue-600 border-b-2 pb-1'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <a
              href="/contact"
              className="px-4 py-2 text-base font-medium text-white rounded-lg transition-all"
              style={{ backgroundColor: settings?.accent_color || '#FF6B35' }}
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium py-2 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="/contact"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg text-center"
                style={{ backgroundColor: settings?.accent_color || '#FF6B35' }}
              >
                Get Quote
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
