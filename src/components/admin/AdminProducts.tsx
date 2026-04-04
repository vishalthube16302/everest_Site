import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types';
import { Trash2, Edit2, Plus, X, GripVertical, ImagePlus, Upload, Loader } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface SpecRow {
  key: string;
  value: string;
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const BUCKET_NAME = 'Product Images';

  // Image list (dynamic URLs instead of JSON)
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  // Specifications (dynamic key/value pairs instead of JSON)
  const [specRows, setSpecRows] = useState<SpecRow[]>([{ key: '', value: '' }]);

  // Rich text for long description
  const [longDesc, setLongDesc] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    image_url: '',
    price_range: '',
    is_featured: false,
    sort_order: 0,
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

  // ─── Specification Helpers ───────────────────────────
  const addSpecRow = () => setSpecRows([...specRows, { key: '', value: '' }]);
  const removeSpecRow = (idx: number) => setSpecRows(specRows.filter((_, i) => i !== idx));
  const updateSpecRow = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specRows];
    updated[idx][field] = val;
    setSpecRows(updated);
  };

  // ─── Image URL Helpers ───────────────────────────────
  const addImageUrl = () => setImageUrls([...imageUrls, '']);
  const removeImageUrl = (idx: number) => setImageUrls(imageUrls.filter((_, i) => i !== idx));
  const updateImageUrl = (idx: number, val: string) => {
    const updated = [...imageUrls];
    updated[idx] = val;
    setImageUrls(updated);
  };

  // ─── Submit ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      alert('Please fill in Product Name and Category.');
      return;
    }

    try {
      // Build specifications as an ordered array of [key, value] pairs
      const specifications: [string, string][] = specRows
        .filter((row) => row.key.trim())
        .map((row) => [row.key.trim(), row.value.trim()]);

      // First valid image is the main one
      const validImages = imageUrls.filter((url) => url.trim() !== '');
      const mainImageUrl = validImages.length > 0 ? validImages[0] : '';
      const additionalImagesList = validImages.slice(1);

      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        ...formData,
        slug,
        long_description: longDesc,
        image_url: mainImageUrl,
        specifications,
      };

      let productId = editingId;
      if (editingId) {
        await supabase.from('products').update(productData).eq('id', editingId);
      } else {
        const { data } = await supabase.from('products').insert([productData]).select().single();
        if (data) productId = data.id;
      }

      // Handle additional images in product_images table
      if (productId) {
        await supabase.from('product_images').delete().eq('product_id', productId);
        if (additionalImagesList.length > 0) {
          const imageInserts = additionalImagesList.map((url, index) => ({
            product_id: productId,
            image_url: url,
            sort_order: index,
            alt_text: `${formData.name} - Image ${index + 2}`,
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
      await supabase.from('product_images').delete().eq('product_id', id);
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      price_range: product.price_range || '',
      is_featured: product.is_featured || false,
      sort_order: product.sort_order || 0,
    });

    // Set long description
    setLongDesc(product.long_description || '');

    // Load specifications into key/value rows
    // Support both array format [[key,value],...] and legacy object format {key:value,...}
    const specs = product.specifications;
    let rows: SpecRow[] = [];
    if (Array.isArray(specs)) {
      rows = specs.map(([key, value]: [string, string]) => ({ key, value: String(value) }));
    } else if (specs && typeof specs === 'object') {
      rows = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
    }
    setSpecRows(rows.length > 0 ? rows : [{ key: '', value: '' }]);

    // Load images
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', product.id)
      .order('sort_order');

    const allImages = [product.image_url || ''];
    if (images && images.length > 0) {
      allImages.push(...images.map((img) => img.image_url));
    }
    const validImages = allImages.filter(Boolean);
    setImageUrls(validImages.length > 0 ? validImages : ['']);

    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      image_url: '',
      price_range: '',
      is_featured: false,
      sort_order: 0,
    });
    setLongDesc('');
    setSpecRows([{ key: '', value: '' }]);
    setImageUrls(['']);
    setEditingId(null);
    setShowForm(false);
  };

  // Quill toolbar configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  // ─── Multi-file upload to Supabase Storage ───────────
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error for', file.name, uploadError);
          continue;
        }

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        if (data?.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }

      if (newUrls.length > 0) {
        // Filter out empty placeholder entries, then append new uploaded URLs
        setImageUrls((prev) => {
          const existing = prev.filter((u) => u.trim() !== '');
          return [...existing, ...newUrls];
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading images');
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
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

      {/* ─── FORM MODAL ──────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Product</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name, Category, Sort Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. 3HP Screw Air Compressor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
                <textarea
                  placeholder="Brief product overview (1–2 lines)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={2}
                />
              </div>

              {/* Row 3: Long Description — Rich Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={longDesc}
                    onChange={setLongDesc}
                    modules={quillModules}
                    placeholder="Write a detailed product description with formatting…"
                    style={{ minHeight: '160px' }}
                  />
                </div>
              </div>

              {/* Row 4: Price Range + Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹80,000 – ₹1,00,000"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-center h-[42px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* ─── SPECIFICATIONS (Dynamic Key/Value) ──── */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Plus size={16} /> Add Row
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_1fr_36px] gap-2 text-xs font-semibold text-gray-500 uppercase px-1">
                    <span>Property</span>
                    <span>Value</span>
                    <span></span>
                  </div>
                  {specRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. Motor Power"
                        value={row.key}
                        onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="e.g. 3 HP"
                        value={row.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Remove row"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  {specRows.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No specifications added. Click "Add Row" above.
                    </p>
                  )}
                </div>
              </div>

              {/* ─── IMAGES (Dynamic URL list) ───────────── */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Product Images
                  </label>
                  <div className="flex gap-2">
                    <label className={`flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${
                      uploadingImages ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                    }`}>
                      {uploadingImages ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploadingImages ? 'Uploading…' : 'Upload Files'}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploadingImages}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ImagePlus size={16} /> Add URL
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="flex items-center justify-center w-8 text-xs text-gray-400 font-semibold shrink-0">
                        {idx === 0 ? (
                          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Main</span>
                        ) : (
                          <GripVertical size={16} className="text-gray-300" />
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => updateImageUrl(idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      {/* Show small preview if URL is valid */}
                      {url.trim() && (
                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-100">
                          <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 shrink-0"
                        title="Remove image"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  {imageUrls.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No images added. Click "Add Image" above.
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    The first image is used as the main product image. Additional images appear in the gallery.
                  </p>
                </div>
              </div>

              {/* ─── Actions ─────────────────────────────── */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {editingId ? 'Update' : 'Add'} Product
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PRODUCT TABLE ───────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">Price</th>
              <th className="text-center px-4 py-2 text-sm font-semibold text-gray-600">Order</th>
              <th className="text-center px-4 py-2 text-sm font-semibold text-gray-600">Specs</th>
              <th className="text-center px-4 py-2 text-sm font-semibold text-gray-600">Featured</th>
              <th className="text-right px-4 py-2 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {categories.find((c) => c.id === product.category_id)?.name || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{product.price_range || '—'}</td>
                <td className="px-4 py-3 text-center text-gray-500">{product.sort_order ?? 0}</td>
                <td className="px-4 py-3 text-center">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {Object.keys(product.specifications).length}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">{product.is_featured ? '✓' : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8">No products added yet.</p>
        )}
      </div>
    </div>
  );
}
