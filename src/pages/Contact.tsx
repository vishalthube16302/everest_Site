import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings, Category } from '../types';

export function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    category_id: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, categoriesRes] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabase.from('inquiries').insert([formData]);
      setSubmitted(true);
      setFormData({ name: '', company: '', phone: '', email: '', category_id: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Thank you! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Product Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder="Your Message / Requirement"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={20} /> {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
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
