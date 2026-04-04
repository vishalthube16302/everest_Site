import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { Zap, Settings, Headphones, BookOpen } from 'lucide-react';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('sort_order');
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const iconMap: Record<string, any> = {
    zap: Zap,
    settings: Settings,
    headphones: Headphones,
    book: BookOpen,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">Comprehensive solutions tailored to your needs</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Settings;
                return (
                  <div key={service.id} className="flex gap-6 p-8 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <IconComponent size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-700">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">No services added yet</div>
          )}

          {/* Process Flow */}
          <div className="bg-blue-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Service Process</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Consultation', desc: 'Understand your requirements' },
                { step: '2', title: 'Proposal', desc: 'Tailored solution design' },
                { step: '3', title: 'Implementation', desc: 'Efficient product delivery' },
                { step: '4', title: 'Support', desc: 'Ongoing technical assistance' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="inline-block w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-6">Share Your Requirements</h2>
            <p className="text-lg text-gray-700 mb-8">Let us create a customized solution for your business</p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
