import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Inquiry, Category } from '../../types';
import { Trash2, Eye, EyeOff } from 'lucide-react';

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [inquiriesRes, categoriesRes] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
    ]);
    if (inquiriesRes.data) setInquiries(inquiriesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      await supabase.from('inquiries').update({ is_read: !isRead }).eq('id', id);
      fetchData();
    } catch (error) {
      alert('Error updating inquiry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await supabase.from('inquiries').delete().eq('id', id);
      setSelectedInquiry(null);
      fetchData();
    } catch (error) {
      alert('Error deleting inquiry');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'N/A';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Inquiries</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="md:col-span-1 space-y-2 max-h-96 overflow-y-auto">
          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No inquiries yet</div>
          ) : (
            inquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`w-full text-left px-4 py-3 rounded-lg border-l-4 transition-colors ${
                  selectedInquiry?.id === inquiry.id
                    ? 'bg-blue-50 border-blue-600'
                    : inquiry.is_read
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <p className={`font-semibold ${!inquiry.is_read ? 'text-yellow-700' : 'text-gray-700'}`}>
                  {inquiry.name}
                </p>
                <p className="text-sm text-gray-600">{inquiry.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Inquiry Details */}
        <div className="md:col-span-2">
          {selectedInquiry ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{selectedInquiry.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedInquiry.id, selectedInquiry.is_read)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    title={selectedInquiry.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedInquiry.is_read ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>

                {selectedInquiry.company && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Company</label>
                    <p className="text-gray-800">{selectedInquiry.company}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <p className="text-gray-800">{getCategoryName(selectedInquiry.category_id)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <p className="text-gray-800">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-800 bg-white p-4 rounded-lg whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
