"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import Link from 'next/link';

interface ArticleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        featuredImage: initialData?.featuredImage || '',
        status: initialData?.status || 'DRAFT',
        tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
        author: initialData?.author || 'Top Tech Agencies Team'
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    // Auto-generate slug from title if slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const updates: any = { title };

        if (!isEditing && !formData.slug) {
            updates.slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            };

            const url = isEditing
                ? `/api/articles/${initialData.id}`
                : '/api/articles';

            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || 'Something went wrong');

            if (!isEditing) {
                // Redirect on create
                router.push('/admin/articles');
            } else {
                setMessage({ text: 'Article saved successfully!', type: 'success' });
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async () => {
        // Basic implementation: Prompt for URL
        // Ideal: Integrate with Cloudinary widget or API
        const url = window.prompt("Enter image URL:");
        if (url) {
            setFormData(prev => ({ ...prev, featuredImage: url }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Article' : 'New Article'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={formData.status}
                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-gray-900 outline-none"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Article Title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="w-full px-0 text-4xl font-bold border-none focus:ring-0 placeholder-gray-300"
                            required
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>slug:</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="flex-grow bg-transparent border-none focus:ring-0 p-0 text-gray-600 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Content</label>
                        <TiptapEditor
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Excerpt</label>
                        <textarea
                            rows={3}
                            value={formData.excerpt}
                            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none resize-none"
                            placeholder="Brief summary for search results..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Featured Image</h3>
                        {formData.featuredImage ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 group">
                                <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-colors gap-2"
                            >
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-xs font-medium">Add Image</span>
                            </button>
                        )}
                        <input
                            type="text"
                            placeholder="Or paste URL here..."
                            value={formData.featuredImage}
                            onChange={e => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                        />
                    </div>

                    {/* Meta Data */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">SEO Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    placeholder={formData.title}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.metaDescription}
                                    onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Organization</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Tech, Design, SEO"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
