import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SiteSettings } from '../../types';

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings(data);
      } else {
        const newSettings = {
          company_name: 'Everest Hydro Pneumatic Solutions',
          tagline: 'Reliable Hydraulic & Pneumatic Solutions',
          primary_color: '#003366',
          secondary_color: '#333333',
          accent_color: '#FF6B35',
        };
        const { data: created } = await supabase
          .from('site_settings')
          .insert([newSettings])
          .select()
          .single();
        if (created) setSettings(created);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', settings.id);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={settings?.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={settings?.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
          <input
            type="text"
            value={settings?.logo_url || ''}
            onChange={(e) => handleChange('logo_url', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={settings?.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            value={settings?.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
            <input
              type="text"
              value={settings?.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours</label>
            <input
              type="text"
              value={settings?.working_hours || ''}
              onChange={(e) => handleChange('working_hours', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings?.company_name_color || '#111827'}
                onChange={(e) => handleChange('company_name_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={settings?.company_name_color || '#111827'}
                onChange={(e) => handleChange('company_name_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings?.primary_color || '#003366'}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={settings?.primary_color || '#003366'}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings?.secondary_color || '#333333'}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={settings?.secondary_color || '#333333'}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings?.accent_color || '#FF6B35'}
                onChange={(e) => handleChange('accent_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={settings?.accent_color || '#FF6B35'}
                onChange={(e) => handleChange('accent_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">About Text</label>
          <textarea
            value={settings?.about_text || ''}
            onChange={(e) => handleChange('about_text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mission</label>
          <textarea
            value={settings?.mission || ''}
            onChange={(e) => handleChange('mission', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vision</label>
          <textarea
            value={settings?.vision || ''}
            onChange={(e) => handleChange('vision', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
