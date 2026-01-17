import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Copy, RefreshCw, Loader } from 'lucide-react';

interface StorageFile {
    name: string;
    id: string | null;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
}

export function AdminImageManager() {
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const BUCKET_NAME = 'Product Images';

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('Error fetching files:', error);
            alert('Error fetching files: ' + error.message);
        } else {
            setFiles(data || []);
        }
        setLoading(false);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            await fetchFiles();
        } catch (error: any) {
            alert('Error uploading file: ' + error.message);
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

        try {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName]);

            if (error) {
                throw error;
            }

            await fetchFiles();
        } catch (error: any) {
            alert('Error deleting file: ' + error.message);
        }
    };

    const getPublicUrl = (fileName: string) => {
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);
        return data.publicUrl;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('URL copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            alert('URL copied to clipboard!');
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Image Manager</h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchFiles}
                        className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                        {uploading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
                        <span>Upload Image</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-6 py-3">Preview</th>
                                <th className="px-6 py-3">Filename</th>
                                <th className="px-6 py-3">Size</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {files.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No images found. Upload one to get started.
                                    </td>
                                </tr>
                            ) : (
                                files.map((file) => {
                                    if (file.name === '.emptyFolderPlaceholder') return null;
                                    const publicUrl = getPublicUrl(file.name);
                                    return (
                                        <tr key={file.id || file.name} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={publicUrl}
                                                        alt={file.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Error';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={file.name}>
                                                    {file.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {file.metadata ? formatBytes(file.metadata.size) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {file.created_at ? formatDate(file.created_at) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(publicUrl)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                                                        title="Copy URL"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(file.name)}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
