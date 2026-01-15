import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export function Contact() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (data) setSettings(data);
    };
    fetchSettings();

    // Lightning Out Integration
    const scriptSrc = "https://fwseries3-dev-ed.develop.my.site.com/External/lightning/lightning.out.js";
    const lightningEndpoint = "https://fwseries3-dev-ed.develop.my.site.com/External";
    const appName = "c:WebsiteInquiryApp";
    const componentName = "c:websiteInquiryForm";
    const authToken = "";

    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${scriptSrc}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Lightning Out script'));
        document.body.appendChild(script);
      });
    };

    const initLightning = async () => {
      try {
        await loadScript();

        if ((window as any).$Lightning) {
          (window as any).$Lightning.use(appName, function () {
            (window as any).$Lightning.createComponent(
              componentName,
              {},
              "lightning-container",
              function (cmp: any) {
                console.log("Inquiry Form created successfully!");
                setLoading(false);
              }
            );
          }, lightningEndpoint, authToken);
        }
      } catch (error) {
        console.error("Error initializing Lightning component:", error);
        setLoading(false);
      }
    };

    initLightning();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">Get in touch for inquiries, quotes, and support</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {settings?.phone && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <Phone className="text-blue-600 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <a href={`tel:${settings.phone}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                {settings.phone}
              </a>
            </div>
          )}

          {settings?.email && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <Mail className="text-blue-600 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <a href={`mailto:${settings.email}`} className="text-blue-600 hover:text-blue-700 font-semibold break-all">
                {settings.email}
              </a>
            </div>
          )}

          {settings?.address && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <MapPin className="text-blue-600 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-gray-700">{settings.address}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form - LWC Container */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            {/* Loading Spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading form...</p>
              </div>
            )}
            {/* LWC Container */}
            <div
              id="lightning-container"
              className="min-h-[400px]"
            ></div>
          </div>

          {/* Info & Map */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            {settings?.working_hours && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3 mb-3">
                  <Clock className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Working Hours</p>
                    <p className="text-gray-700">{settings.working_hours}</p>
                  </div>
                </div>
              </div>
            )}

            {settings?.google_maps_embed ? (
              <div className="rounded-lg overflow-hidden h-80">
                <div dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }} />
              </div>
            ) : (
              <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            )}

            {settings?.whatsapp && (
              <div className="mt-6">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
