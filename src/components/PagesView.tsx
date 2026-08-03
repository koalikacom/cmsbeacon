import React, { useState } from 'react';
import { FileCode, Plus, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { StaticPage } from '../types';

interface PagesViewProps {
  pages: StaticPage[];
  onAddPage: (page: Partial<StaticPage>) => void;
  onUpdatePage: (id: string, page: Partial<StaticPage>) => void;
  onDeletePage: (id: string) => void;
}

export const PagesView: React.FC<PagesViewProps> = ({
  pages,
  onAddPage,
  onUpdatePage,
  onDeletePage
}) => {
  const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  const openAdd = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaTitle('');
    setMetaDesc('');
    setIsFormOpen(true);
  };

  const openEdit = (p: StaticPage) => {
    setEditingPage(p);
    setTitle(p.title);
    setSlug(p.slug);
    setContent(p.content);
    setMetaTitle(p.meta_title || '');
    setMetaDesc(p.meta_description || '');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingPage?.id) {
      onUpdatePage(editingPage.id, {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content,
        meta_title: metaTitle,
        meta_description: metaDesc
      });
    } else {
      onAddPage({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content,
        meta_title: metaTitle || title,
        meta_description: metaDesc
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCode className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            Halaman Statis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola halaman khusus seperti Tentang Kami, Kontak, Kebijakan Privasi, dan Disclaimer.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Halaman</span>
        </button>
      </div>

      {isFormOpen ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingPage?.id ? 'Edit Halaman Statis' : 'Buat Halaman Baru'}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-rose-500 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Judul Halaman
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tentang Kami"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingPage) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Isi Konten Halaman (HTML)
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
                placeholder="<h2>Sub Judul</h2><p>Isi paragraf...</p>"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Simpan Halaman
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pages.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded uppercase">
                    Static Page
                  </span>
                  <a
                    href={`/embed/page.php?slug=${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-amber-500"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {p.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 mb-4">/{p.slug}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(p.updated_at).toLocaleDateString('id-ID')}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus halaman "${p.title}"?`)) onDeletePage(p.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
