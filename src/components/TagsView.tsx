import React, { useState } from 'react';
import { Tags, Plus, Trash2, Hash } from 'lucide-react';
import { Tag } from '../types';

interface TagsViewProps {
  tags: Tag[];
  onAddTag: (name: string) => void;
}

export const TagsView: React.FC<TagsViewProps> = ({ tags, onAddTag }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddTag(name.trim());
    setName('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Tags className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Manajemen Tag Artikel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Kelola kata kunci tag untuk pengelompokan artikel dan fitur autocomplete editor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Add Tag */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Tambah Tag Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Nama Tag
              </label>
              <input
                type="text"
                placeholder="Contoh: PHP 8"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Tag</span>
            </button>
          </form>
        </div>

        {/* Tags Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Daftar Tag Terdaftar ({tags.length})
          </h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-3 hover:border-emerald-400 transition-colors"
              >
                <Hash className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {tag.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    /{tag.slug}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
