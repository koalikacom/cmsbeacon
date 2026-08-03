import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  ShieldAlert,
  Pin,
  Star,
  CheckSquare,
  Square
} from 'lucide-react';
import { ArticlePost, ArticleStatus, Category } from '../types';

interface ArticlesViewProps {
  articles: ArticlePost[];
  categories: Category[];
  onAddNew: () => void;
  onEdit: (article: ArticlePost) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string, permanent?: boolean) => void;
  onRestore: (id: string) => void;
  onPreview: (article: ArticlePost) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  categories,
  onAddNew,
  onEdit,
  onDuplicate,
  onDelete,
  onRestore,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'all' | ArticleStatus | 'trash'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter Logic
  const filtered = articles.filter((post) => {
    // Trash check
    if (activeTab === 'trash') {
      if (!post.is_deleted) return false;
    } else {
      if (post.is_deleted) return false;
      if (activeTab !== 'all' && post.status !== activeTab) return false;
    }

    if (selectedCategory !== 'all' && post.category_id !== selectedCategory && post.category_name !== selectedCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchSummary = post.summary.toLowerCase().includes(q);
      const matchKeyword = post.focus_keyword && post.focus_keyword.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchKeyword) return false;
    }

    return true;
  });

  const countByStatus = (status: 'all' | ArticleStatus | 'trash') => {
    if (status === 'trash') return articles.filter(a => a.is_deleted).length;
    if (status === 'all') return articles.filter(a => !a.is_deleted).length;
    return articles.filter(a => !a.is_deleted && a.status === status).length;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(f => f.id));
    }
  };

  const toggleSelectId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkTrash = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Pindahkan ${selectedIds.length} artikel ke tempat sampah?`)) {
      selectedIds.forEach(id => onDelete(id, activeTab === 'trash'));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Manajemen Artikel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola publikasi, draf, jadwal terbit, meta SEO, dan status visibilitas artikel.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Artikel</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'Semua Artikel' },
          { id: 'publish', label: 'Diterbitkan' },
          { id: 'draft', label: 'Draf' },
          { id: 'private', label: 'Private' },
          { id: 'schedule', label: 'Terjadwal' },
          { id: 'trash', label: 'Tempat Sampah' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const count = countByStatus(tab.id as any);
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedIds([]);
              }}
              className={`py-3 px-4 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search, Category Filter, Bulk Action */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul artikel atau keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Action Button */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {selectedIds.length} dipilih
            </span>
            <button
              onClick={handleBulkTrash}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{activeTab === 'trash' ? 'Hapus Permanen' : 'Pindah Sampah'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Artikel</th>
                <th className="py-3.5 px-4">Kategori & Tag</th>
                <th className="py-3.5 px-4">Penulis</th>
                <th className="py-3.5 px-4">Status & Waktu</th>
                <th className="py-3.5 px-4 text-center">Pembaca</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.length > 0 ? (
                filtered.map((post) => {
                  const isSelected = selectedIds.includes(post.id);
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectId(post.id)}
                          className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Title & Info */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-start gap-3">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                              NO IMG
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              {post.is_pinned && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                                  <Pin className="w-2.5 h-2.5" /> Pinned
                                </span>
                              )}
                              {post.is_featured && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded">
                                  <Star className="w-2.5 h-2.5" /> Featured
                                </span>
                              )}
                              <a
                                href={`/embed/article.php?id=${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                              >
                                {post.title}
                              </a>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mb-1">
                              {post.summary || 'Tidak ada ringkasan'}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                slug: /{post.slug}
                              </span>
                              <span>•</span>
                              <span>{post.word_count || 0} kata</span>
                              <span>•</span>
                              <span>{post.reading_time_minutes || 1} min baca</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tags */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                            {post.category_name || 'Umum'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              post.author_avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                            }
                            alt={post.author_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {post.author_name || 'Redaksi'}
                          </span>
                        </div>
                      </td>

                      {/* Status & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              post.status === 'publish'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : post.status === 'draft'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                : post.status === 'private'
                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {post.status}
                          </span>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(post.publish_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {(post.views_count || 0).toLocaleString('id-ID')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {activeTab === 'trash' ? (
                            <>
                              <button
                                onClick={() => onRestore(post.id)}
                                className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                                title="Pulihkan Artikel"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDelete(post.id, true)}
                                className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                title="Hapus Permanen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => onPreview(post)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Pratinjau Artikel"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onEdit(post)}
                                className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                                title="Edit Artikel"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDuplicate(post.id)}
                                className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                                title="Duplikasi Artikel"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDelete(post.id, false)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                title="Pindahkan ke Tempat Sampah"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">Tidak ada artikel ditemukan.</p>
                    <p className="text-xs">Coba ubah kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
