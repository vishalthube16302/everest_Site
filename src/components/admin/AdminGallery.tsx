import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GalleryImage } from '../../types';
import { Trash2, Plus } from 'lucide-react';

export function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    description: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery_images').select('*').order('sort_order');
    if (data) setImages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please provide an image URL');
      return;
    }

    try {
      await supabase.from('gallery_images').insert([formData]);
      setFormData({ title: '', image_url: '', description: '' });
      setShowForm(false);
      fetchImages();
    } catch (error) {
      alert('Error saving image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await supabase.from('gallery_images').delete().eq('id', id);
      fetchImages();
    } catch (error) {
      alert('Error deleting image');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Image
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Image Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />

            <textarea
              placeholder="Image Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />

            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', image_url: '', description: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-200 overflow-hidden">
              <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              {image.title && <p className="font-semibold text-sm mb-2">{image.title}</p>}
              <button
                onClick={() => handleDelete(image.id)}
                className="w-full flex items-center justify-center gap-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
