import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';
import { CheckCircle2 } from 'lucide-react';

export function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const qualities = [
    'Precision engineering & robust construction',
    'High-pressure endurance rated performance',
    'Long-lasting durability, low maintenance',
    'Free installation & commissioning',
    'First servicing at no labour cost',
    'Pan-India delivery with timely dispatch',
  ];

  const stats = [
    { num: '2020', label: 'Est. Year' },
    { num: '50+', label: 'Products' },
    { num: '200+', label: 'Clients' },
    { num: '75 HP', label: 'Max Capacity' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#0f3460] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-2">About us</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Everest Hydro Pneumatic Solution
              </h1>
              <p className="text-blue-200 text-sm leading-relaxed">
                Manufacturer &amp; supplier of industrial air compressors and material handling equipment — Pune, Maharashtra since 2020.
              </p>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ num, label }) => (
                <div key={label} className="bg-white/8 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{num}</div>
                  <div className="text-xs text-blue-300 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Text col — 3/5 */}
            <div className="md:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-2">Who we are</p>
              <h2 className="text-2xl font-bold text-black mb-5">Built on precision. Trusted by industry.</h2>

              {/* Pull first 2 clean paras from about_text */}
              {settings?.about_text ? (
                <div className="space-y-3">
                  {settings.about_text
                    .split('\n\n')
                    .filter(p => p.trim().length > 30)
                    .slice(0, 2)
                    .map((para, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">{para.trim()}</p>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  Established in <strong>2020</strong> in Pune, Maharashtra, Everest Hydro Pneumatic Solution is a reliable manufacturer and supplier of high-performance air compressors and material handling equipment, serving manufacturing, automotive, dental, construction, and packaging industries across India.
                </p>
              )}

              {/* Mission & Vision compact */}
              {(settings?.mission || settings?.vision) && (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {settings.mission && (
                    <div className="bg-[#0f3460]/4 rounded-xl p-4 border-l-4 border-[#0f3460]">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-2">Mission</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{settings.mission.slice(0, 160)}…</p>
                    </div>
                  )}
                  {settings?.vision && (
                    <div className="bg-[#e94560]/4 rounded-xl p-4 border-l-4 border-[#e94560]">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#e94560] mb-2">Vision</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {settings.vision.replace(/To become the most trusted\s*/i, '').slice(0, 160)}…
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Why us col — 2/5 */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Why choose us</p>
                <div className="flex flex-col gap-3">
                  {qualities.map((q) => (
                    <div key={q} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factsheet */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-black mb-6 text-center">Company Factsheet</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-4">Business Info</p>
                <div className="space-y-3">
                  {[
                    ['Nature of Business', 'Manufacturer & Service Provider'],
                    ['Additional Business', 'Wholesale Trade'],
                    ['Legal Status', 'Proprietorship'],
                    ['Annual Turnover', '₹0 – 40 Lakhs'],
                    ['GST Number', settings?.gst_number || '27ATEPT3692E1ZD'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-xs text-gray-500 w-36 flex-shrink-0">{label}</span>
                      <span className="text-xs font-medium text-black text-right font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-4">Contact Details</p>
                <div className="space-y-3">
                  {[
                    ['Phone / WhatsApp', settings?.phone || '+91-8855820105'],
                    ['Email', settings?.email || 'everesthps@gmail.com'],
                    ['Working Hours', settings?.working_hours || 'Mon – Sat, 9 AM – 6:30 PM'],
                    ['GST Reg. Date', '01-09-2020'],
                    ['Location', 'Chakan, Pune – 410501, Maharashtra'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-xs text-gray-500 w-32 flex-shrink-0">{label}</span>
                      <span className="text-xs font-medium text-black text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team strip */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Our team</p>
            <h3 className="text-lg font-bold text-black">Skilled professionals, deep expertise</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-md">
              Led by <strong>Vishal</strong> (Sales Engineer), our team handles every client requirement with technical precision and market knowledge.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <div className="text-xl font-bold text-[#0f3460]">5+</div>
              <div className="text-xs text-gray-500">Years Exp.</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <div className="text-xl font-bold text-[#0f3460]">11</div>
              <div className="text-xs text-gray-500">Team Size</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <div className="text-xl font-bold text-[#0f3460]">PAN</div>
              <div className="text-xs text-gray-500">India Reach</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}