import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogOut, Settings, Package, MessageSquare, Image, Zap } from 'lucide-react';
import { AdminSettings } from '../../components/admin/AdminSettings';
import { AdminProducts } from '../../components/admin/AdminProducts';
import { AdminInquiries } from '../../components/admin/AdminInquiries';
import { AdminGallery } from '../../components/admin/AdminGallery';
import { AdminServices } from '../../components/admin/AdminServices';
import { AdminCategories } from '../../components/admin/AdminCategories';
import { AdminPages } from '../../components/admin/AdminPages';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    products: 0,
    inquiries: 0,
    categories: 0,
    services: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!adminData) {
        navigate('/admin/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const fetchCounts = async () => {
        const [products, inquiries, categories, services] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
        ]);

        setCounts({
          products: products.count || 0,
          inquiries: inquiries.count || 0,
          categories: categories.count || 0,
          services: services.count || 0,
        });
      };
      fetchCounts();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Everest Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Settings },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'services', label: 'Services', icon: Zap },
            { id: 'gallery', label: 'Gallery', icon: Image },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
            { id: 'pages', label: 'Pages', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${currentTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <tab.icon size={20} /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {['Products', 'Inquiries', 'Categories', 'Services'].map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <p className="text-gray-600 text-sm">{item}</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {counts[item.toLowerCase() as keyof typeof counts]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentTab === 'settings' && <AdminSettings />}
          {currentTab === 'categories' && <AdminCategories />}
          {currentTab === 'products' && <AdminProducts />}
          {currentTab === 'services' && <AdminServices />}
          {currentTab === 'gallery' && <AdminGallery />}
          {currentTab === 'inquiries' && <AdminInquiries />}
          {currentTab === 'pages' && <AdminPages />}
        </div>
      </div>
    </div>
  );
}
