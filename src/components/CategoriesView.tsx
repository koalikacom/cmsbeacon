import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Folder,
  Layers,
  Sparkles,
  ChevronRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Category } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (cat: Partial<Category>) => void;
  onUpdateCategory: (id: string, cat: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [metaDesc, setMetaDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSlugGen = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateCategory(editingId, {
        name,
        slug,
        description,
        parent_id: parentId === 'none' ? null : parentId,
        meta_description: metaDesc
      });
      setEditingId(null);
    } else {
      onAddCategory({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        parent_id: parentId === 'none' ? null : parentId,
        meta_description: metaDesc
      });
    }

    resetForm();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setParentId(cat.parent_id || 'none');
    setMetaDesc(cat.meta_description || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setParentId('none');
    setMetaDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FolderTree className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Manajemen Kategori Artikel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Kelola struktur hierarki kategori bersarang (parent-child), slug dinamis, dan meta SEO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Add / Edit Category */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span>{editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                Batal Edit
              </button>
            )}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                placeholder="Contoh: Kecerdasan Buatan"
                value={name}
                onChange={(e) => handleSlugGen(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Slug URL Dinamis
              </label>
              <input
                type="text"
                placeholder="kecerdasan-buatan"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Induk Kategori (Parent Category)
              </label>
              <select
                value={parentId || 'none'}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="none">-- Tanpa Induk (Kategori Utama) --</option>
                {categories
                  .filter((c) => c.id !== editingId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                placeholder="Deskripsi singkat seputar topik kategori ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Meta Description SEO
              </label>
              <input
                type="text"
                placeholder="Meta description untuk hasil pencarian Google..."
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
            </button>
          </form>
        </div>

        {/* Right List: Tree View Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 font-bold text-xs uppercase tracking-wider text-slate-500">
            Daftar Kategori Terdaftar
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => {
              const parent = categories.find((p) => p.id === cat.parent_id);
              return (
                <div
                  key={cat.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0">
                      <Folder className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {cat.name}
                        </h3>
                        {parent && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                            Induk: {parent.name}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {cat.description || 'Tidak ada deskripsi'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>slug: /{cat.slug}</span>
                        <span>•</span>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          {cat.article_count || 0} Artikel
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                      title="Edit Kategori"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus kategori "${cat.name}"?`)) onDeleteCategory(cat.id);
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
