import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Page } from '../../types';
import { Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export function AdminPages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        const { data } = await supabase
            .from('pages')
            .select('*')
            .order('sort_order', { ascending: true });

        if (data) setPages(data);
        setLoading(false);
    };

    const handleToggleEnabled = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('pages')
            .update({ is_enabled: !currentStatus })
            .eq('id', id);

        if (!error) {
            setPages(pages.map(p =>
                p.id === id ? { ...p, is_enabled: !currentStatus } : p
            ));
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === pages.length - 1)
        ) return;

        const newPages = [...pages];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap items
        [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];

        // Update sort_order locally
        const updatedPages = newPages.map((page, idx) => ({
            ...page,
            sort_order: (idx + 1) * 10
        }));

        setPages(updatedPages);

        // Save new order to database
        setSaving(true);
        const updates = updatedPages.map(p => ({
            id: p.id,
            sort_order: p.sort_order
        }));

        for (const update of updates) {
            await supabase
                .from('pages')
                .update({ sort_order: update.sort_order })
                .eq('id', update.id);
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Pages</h2>
                {saving && <span className="text-sm text-gray-500 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Saving order...</span>}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500">Page Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500">Path</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500">Order</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pages.map((page, index) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{page.label}</td>
                                <td className="px-6 py-4 text-gray-500">{page.path}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {page.is_enabled ? 'Visible' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{page.sort_order}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleEnabled(page.id, page.is_enabled)}
                                            className={`p-1 rounded hover:bg-gray-200 ${page.is_enabled ? 'text-green-600' : 'text-red-600'}`}
                                            title={page.is_enabled ? 'Disable' : 'Enable'}
                                        >
                                            {page.is_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <div className="flex gap-1 ml-2 border-l pl-3">
                                            <button
                                                onClick={() => handleMove(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleMove(index, 'down')}
                                                disabled={index === pages.length - 1}
                                                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
