import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const companyName = settings?.company_name?.trim() || 'Everest HPS';
  const currentYear = new Date().getFullYear(); // ← was hardcoded to 2020

  return (
    <footer className="bg-[#0a2240] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              {settings?.logo_url && (
                <img src={settings.logo_url} alt={companyName} className="h-8 w-auto object-contain brightness-0 invert" />
              )}
              <span className="font-bold text-base">{companyName}</span>
            </div>
            <p className="text-blue-300 text-xs leading-relaxed mb-4">
              {settings?.tagline || 'Engineering Power. Delivering Trust.'}
            </p>
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                WhatsApp Us
              </a>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              {['/', '/products', '/services', '/about', '/contact'].map((path, i) => {
                const labels = ['Home', 'Products', 'Services', 'About', 'Contact'];
                return (
                  <Link key={path} to={path} className="text-blue-200 hover:text-white text-sm transition-colors">
                    {labels[i]}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
                  <Phone size={14} className="shrink-0" /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
                  <Mail size={14} className="shrink-0" /> {settings.email}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-start gap-2 text-blue-200 text-sm">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Working Hours</h4>
            <p className="text-blue-200 text-sm">{settings?.working_hours || 'Mon – Sat: 9:00 AM – 6:30 PM IST'}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-blue-400">GST Registration</p>
              <p className="text-sm text-blue-200 font-mono">{settings?.gst_number || '—'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-400">
          <p>© {currentYear} {companyName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
