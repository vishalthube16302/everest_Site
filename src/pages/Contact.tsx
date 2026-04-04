import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LightningService } from '../lib/lightning';
import { SiteSettings } from '../types';

export function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle()
      .then(({ data }) => { if (data) setSettings(data); });

    LightningService.createComponent('c:websiteInquiryForm', 'lwc-container')
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const phone = settings?.phone || '+91-8855820105';
  const email = settings?.email || 'everesthps@gmail.com';
  const whatsapp = settings?.whatsapp?.replace(/[^\d]/g, '') || '918855820105';

  const contactItems = [
    {
      icon: Phone, label: 'Phone', value: phone,
      href: `tel:${phone}`, color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Mail, label: 'Email', value: email,
      href: `mailto:${email}`, color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Clock, label: 'Working Hours',
      value: settings?.working_hours || 'Mon – Sat: 9:00 AM – 6:30 PM IST',
      href: undefined, color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: MapPin, label: 'Address',
      value: settings?.address || 'Kalp Residency, 109 B Wing, Chakan, Pune – 410501',
      href: undefined, color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#0f3460] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1">Get in touch</p>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-blue-200 text-sm">Inquiries, quotes, and support — we respond within 24 hours.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">

          {/* ── LEFT: contact info (2/5) ── */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Contact cards */}
            <div className="flex flex-col gap-3">
              {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-black hover:text-[#0f3460] transition-colors break-all">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-black leading-snug">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>

            {/* Map placeholder */}
            {settings?.google_maps_embed ? (
              <div className="rounded-xl overflow-hidden h-48 border border-gray-100"
                dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }} />
            ) : (
              <div className="rounded-xl h-48 bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2">
                <MapPin size={24} className="text-gray-300" />
                <p className="text-xs text-gray-400">Chakan, Pune – 410501</p>
              </div>
            )}
          </div>

          {/* ── RIGHT: LWC enquiry form (3/5) ── */}
          <div className="md:col-span-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-1 min-h-[520px] flex flex-col">
              <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-black">Send us a Message</h2>
                <p className="text-xs text-gray-500 mt-0.5">We'll get back to you within 24 hours</p>
              </div>

              {/* Spinner while LWC loads */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#0f3460] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Loading form…</p>
                </div>
              )}

              {/* LWC mounts here */}
              <div id="lwc-container" className="flex-1 p-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}