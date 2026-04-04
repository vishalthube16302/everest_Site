import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { Zap, Settings, Headphones, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  settings: Settings,
  headphones: Headphones,
  book: BookOpen,
};

const process = [
  { step: '01', title: 'Consultation', desc: 'We understand your air demand, pressure needs, and installation space.' },
  { step: '02', title: 'Proposal', desc: 'Tailored model, HP, tank, and dryer configuration matched to your setup.' },
  { step: '03', title: 'Delivery', desc: 'Pan-India delivery with careful packaging and logistics tracking.' },
  { step: '04', title: 'Free Setup', desc: 'Full installation, commissioning, and a demo — all at no extra cost.' },
];

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      if (data) setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#0f3460] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1">What we do</p>
          <h1 className="text-3xl font-bold text-white mb-2">Our Services</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            End-to-end support — from the right product recommendation to installation, commissioning, and beyond.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => {
                const Icon = iconMap[s.icon] || Settings;
                return (
                  <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 hover:shadow-sm transition-shadow">
                    <div className="w-11 h-11 rounded-xl bg-[#0f3460]/8 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-[#0f3460]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-base mb-1.5">{s.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback if no services in DB */
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Supply & Sales', desc: 'Wide range of air compressors and material handling equipment — oil-free, screw, reciprocating, and pallet trucks.' },
                { icon: Settings, title: 'Free Installation', desc: 'Our engineers visit, install, and commission every unit we sell — completely free of charge.' },
                { icon: Headphones, title: 'After-Sales Support', desc: 'First servicing at no labour cost. Spare parts, oil, and technical help when you need it.' },
                { icon: BookOpen, title: 'Custom Configuration', desc: 'HP range, tank size, dryer, pressure setting — we configure to your exact industrial requirement.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 hover:shadow-sm transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-[#0f3460]/8 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#0f3460]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1">How it works</p>
            <h2 className="text-2xl font-bold text-black">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-100 z-0" />
            {process.map((p, i) => (
              <div key={p.step} className="flex flex-col items-center text-center px-4 relative z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm mb-4 ${i === process.length - 1
                    ? 'bg-[#e94560] text-white'
                    : 'bg-[#0f3460] text-white'
                  }`}>
                  {p.step}
                </div>
                <h3 className="font-semibold text-black text-sm mb-2">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee strip */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: '🔧', title: 'Free Installation', sub: 'On every product we sell' },
              { emoji: '🛠', title: 'Free First Service', sub: 'Labour cost waived' },
              { emoji: '🚚', title: 'Pan-India Delivery', sub: 'Fast & careful dispatch' },
            ].map(({ emoji, title, sub }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 px-6 py-5 flex items-center gap-4">
                <div className="text-2xl">{emoji}</div>
                <div>
                  <p className="font-semibold text-black text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#0f3460]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Share your requirements</h2>
          <p className="text-blue-200 text-sm mb-7">We'll configure the right solution and deliver it to your door.</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e94560] text-white font-semibold text-sm rounded-xl hover:bg-[#c73652] transition-colors">
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}