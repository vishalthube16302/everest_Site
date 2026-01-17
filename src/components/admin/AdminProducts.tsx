import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    long_description: '',
    category_id: '',
    image_url: '',
    price_range: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      alert('Please fill required fields');
      return;
    }

    try {
      // Parse images from JSON
      let mainImageUrl = '';
      let additionalImagesList: string[] = [];

      try {
        if (additionalImages.trim()) {
          const parsed = JSON.parse(additionalImages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            mainImageUrl = parsed[0];
            additionalImagesList = parsed.slice(1);
          }
        }
      } catch (e) {
        alert('Invalid JSON format for images. Please check the array format.');
        return;
      }

      const productData = {
        ...formData,
        image_url: mainImageUrl
      };

      let productId = editingId;
      if (editingId) {
        await supabase.from('products').update(productData).eq('id', editingId);
      } else {
        const { data } = await supabase.from('products').insert([productData]).select().single();
        if (data) productId = data.id;
      }

      // Handle additional images
      if (productId) {
        // Delete existing additional images
        await supabase.from('product_images').delete().eq('product_id', productId);

        // Insert new additional images
        if (additionalImagesList.length > 0) {
          const imageInserts = additionalImagesList.map((url: string, index: number) => ({
            product_id: productId,
            image_url: url,
            sort_order: index,
            alt_text: `${formData.name} - Image ${index + 2}` // Start from 2 since 1 is main
          }));
          await supabase.from('product_images').insert(imageInserts);
        }
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingId(product.id);
    setFormData(product as any);

    // Fetch images for this product
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', product.id)
      .order('sort_order');

    // Combine main image and additional images
    const allImages = [product.image_url];
    if (images && images.length > 0) {
      allImages.push(...images.map(img => img.image_url));
    }

    // Filter out empty strings if any
    const validImages = allImages.filter(Boolean);

    if (validImages.length > 0) {
      setAdditionalImages(JSON.stringify(validImages, null, 2));
    } else {
      setAdditionalImages('');
    }

    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      long_description: '',
      category_id: '',
      image_url: '',
      price_range: '',
      is_featured: false,
    });
    setAdditionalImages('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Product</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                rows={2}
              />

              <textarea
                placeholder="Long Description"
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Price Range (e.g., ₹500-1000)"
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images (JSON Array)
                </label>
                <textarea
                  placeholder='[\n  "https://example.com/main-image.jpg",\n  "https://example.com/other-image.jpg"\n]'
                  value={additionalImages}
                  onChange={(e) => setAdditionalImages(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={6}
                />
                <p className="text-xs text-gray-500">
                  Enter image URLs as a JSON array. The first image will be the main product image.
                </p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span>Featured Product</span>
              </label>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingId ? 'Update' : 'Add'} Product
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
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Featured</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">
                  {categories.find((c) => c.id === product.category_id)?.name}
                </td>
                <td className="px-4 py-3">{product.price_range}</td>
                <td className="px-4 py-3">{product.is_featured ? '✓' : '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}
