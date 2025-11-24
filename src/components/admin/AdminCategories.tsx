import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { Trash2, Edit2, Plus } from 'lucide-react';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert('Please fill required fields');
      return;
    }

    try {
      if (editingId) {
        await supabase.from('categories').update(formData).eq('id', editingId);
      } else {
        await supabase.from('categories').insert([formData]);
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image_url: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Category
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

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(category.id);
                  setFormData(category as any);
                  setShowForm(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded"
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
