import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';
import { Trash2, Edit2, Plus } from 'lucide-react';

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'zap',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order');
    if (data) setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill required fields');
      return;
    }

    try {
      if (editingId) {
        await supabase.from('services').update(formData).eq('id', editingId);
      } else {
        await supabase.from('services').insert([formData]);
      }
      resetForm();
      fetchServices();
    } catch (error) {
      alert('Error saving service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    } catch (error) {
      alert('Error deleting service');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', icon: 'zap' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <textarea
              placeholder="Service Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              rows={4}
              required
            />

            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="zap">Zap</option>
              <option value="settings">Settings</option>
              <option value="headphones">Headphones</option>
              <option value="book">Book</option>
            </select>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Service
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-lg mb-1">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(service.id);
                  setFormData(service as any);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
