import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const companyName = settings?.company_name?.trim() || 'Everest HPS';
  const tagline = settings?.tagline;
  const primary = settings?.primary_color || '#ffffff';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a2240] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {settings?.logo_url && (
                <img
                  src={settings.logo_url}
                  alt={companyName}
                  className="h-10 w-auto object-contain rounded bg-white/95 p-1"
                />
              )}

              <div className="flex flex-col leading-tight">
                <span
                  className="font-display font-bold text-2xl tracking-tight leading-none"
                  style={{ color: '#ffffff' }}
                >
                  {companyName}
                </span>

                {tagline && (
                  <span
                    className="text-xs font-medium tracking-wide text-blue-300 mt-1"
                  >
                    {tagline}
                  </span>
                )}
              </div>
            </div>

            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                WhatsApp Us
              </a>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">Navigation</h4>
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
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
                  <Phone size={14} /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
                  <Mail size={14} /> {settings.email}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-start gap-2 text-blue-200 text-sm">
                  <MapPin size={14} className="mt-1" />
                  <span className="leading-relaxed">{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">Working Hours</h4>
            <p className="text-blue-200 text-sm leading-relaxed">
              {settings?.working_hours || 'Mon – Sat: 9:00 AM – 6:30 PM IST'}
            </p>

            {settings?.gst_number && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-blue-400 mb-1">GST Registration</p>
                <p className="text-sm text-blue-200 font-mono">{settings.gst_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-blue-400">
          <p>
            © {currentYear}{' '}
            <span style={{ color: primary }}>{companyName}</span>. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}