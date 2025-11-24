import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: settings?.accent_color || '#FF6B35' }}></div>
              <h3 className="font-bold text-lg">{settings?.company_name || 'Everest'}</h3>
            </div>
            <p className="text-gray-400 text-sm">{settings?.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={16} /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} /> {settings.email}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="flex-shrink-0 mt-1" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Working Hours</h4>
            <p className="text-sm text-gray-400">{settings?.working_hours}</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} {settings?.company_name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
