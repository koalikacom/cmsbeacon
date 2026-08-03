import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Eye,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Lock,
  Globe,
  Tag as TagIcon,
  FolderTree,
  ImageIcon,
  Code2,
  Share2,
  FileText,
  Clock,
  Pin,
  Star,
  Bold,
  Italic,
  Underline,
  List,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table as TableIcon,
  Link,
  Smile,
  Undo,
  Redo,
  Maximize2
} from 'lucide-react';
import { ArticlePost, Category, Tag, VisibilityType, ArticleStatus } from '../types';

interface ArticleEditorProps {
  article: Partial<ArticlePost> | null;
  categories: Category[];
  tags: Tag[];
  onSave: (articleData: Partial<ArticlePost>) => void;
  onCancel: () => void;
  onOpenMediaPicker: (onSelect: (url: string) => void) => void;
  onPreview: (articleData: Partial<ArticlePost>) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  categories,
  tags,
  onSave,
  onCancel,
  onOpenMediaPicker,
  onPreview
}) => {
  // Form States
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || '');
  const [focusKeyword, setFocusKeyword] = useState(article?.focus_keyword || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || categories[0]?.id || 'cat-1');
  const [selectedTags, setSelectedTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<ArticleStatus>(article?.status || 'publish');
  const [visibility, setVisibility] = useState<VisibilityType>(article?.visibility || 'public');
  const [password, setPassword] = useState(article?.password || '');
  const [publishDate, setPublishDate] = useState(
    article?.publish_date ? new Date(article.publish_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);
  const [isPinned, setIsPinned] = useState(article?.is_pinned || false);
  const [commentsEnabled, setCommentsEnabled] = useState(article?.comments_enabled !== false);
  const [canonicalUrl, setCanonicalUrl] = useState(article?.canonical_url || '');

  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'social'>('editor');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-generate slug from title
  useEffect(() => {
    if (!article?.id && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title]);

  // Sync Meta Title
  useEffect(() => {
    if (!metaTitle && title) {
      setMetaTitle(title);
    }
  }, [title]);

  // Auto Save Timer (30s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (title.trim()) {
        setAutoSaveStatus('saving');
        setTimeout(() => setAutoSaveStatus('saved'), 1000);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [title, content, slug]);

  // Word Count & Reading Time Calculation
  const cleanText = content.replace(/<[^>]+>/g, '').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // SEO Score Analyzer
  const calculateSEOScore = () => {
    let score = 0;
    if (title.length >= 10 && title.length <= 70) score += 20;
    if (metaDescription.length >= 50 && metaDescription.length <= 160) score += 20;
    if (focusKeyword) {
      score += 15;
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
      if (cleanText.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    }
    if (featuredImage) score += 15;
    return score;
  };
  const seoScore = calculateSEOScore();

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setSelectedTags(selectedTags.filter(item => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === categoryId);

    onSave({
      id: article?.id,
      title,
      slug,
      meta_title: metaTitle || title,
      meta_description: metaDescription || summary,
      focus_keyword: focusKeyword,
      summary,
      content,
      featured_image: featuredImage,
      tags: selectedTags,
      category_id: categoryId,
      category_name: cat?.name || 'Teknologi',
      status,
      visibility,
      password,
      publish_date: new Date(publishDate).toISOString(),
      is_featured: isFeatured,
      is_pinned: isPinned,
      comments_enabled: commentsEnabled,
      canonical_url: canonicalUrl,
      word_count: wordCount,
      reading_time_minutes: readingTime
    });
  };

  // TinyMCE Rich Text Formatting Simulation Helper
  const insertFormatting = (tagStart: string, tagEnd = '') => {
    if (tagEnd) {
      setContent(prev => prev + `${tagStart}Teks di sini${tagEnd}`);
    } else {
      setContent(prev => prev + tagStart);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {article?.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{wordCount} Kata</span>
              <span>•</span>
              <span>{readingTime} Menit Baca</span>
              {autoSaveStatus === 'saving' && <span className="text-amber-500 font-semibold">• Menyimpan Draf...</span>}
              {autoSaveStatus === 'saved' && <span className="text-emerald-500 font-semibold">• Draf Tersimpan Otomatis</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview({ title, content, summary, featured_image: featuredImage, publish_date: publishDate })}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Artikel</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor + Right Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Title, Rich Content, SEO Tab */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title Input */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <input
              type="text"
              placeholder="Masukkan Judul Artikel Di Sini..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-black text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-800 pb-3 focus:outline-none focus:border-blue-500 placeholder-slate-300 dark:placeholder-slate-700"
              required
            />

            {/* Slug Editor */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-bold text-blue-600">Permalink:</span>
              <span>/embed/article.php?id=</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Editor Mode Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'editor'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Konten Utama (TinyMCE Rich Text)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'seo'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Optimasi SEO (Skor: {seoScore}%)</span>
            </button>
          </div>

          {activeTab === 'editor' ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              {/* Summary / Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Ringkasan Artikel (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat artikel untuk preview embed dan meta description..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* TinyMCE Visual Rich Formatting Toolbar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Isi Artikel Lengkap
                </label>

                {/* Toolbar */}
                <div className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-xl flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting('<h2>', '</h2>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                    title="Heading 2"
                  >
                    <Heading2 className="w-4 h-4" /> H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<h3>', '</h3>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                    title="Heading 3"
                  >
                    <Heading3 className="w-4 h-4" /> H3
                  </button>
                  <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormatting('<strong>', '</strong>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<em>', '</em>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<blockquote>"', '"</blockquote>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<pre><code>', '</code></pre>')}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Code Block"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1" />
                  <button
                    type="button"
                    onClick={() => onOpenMediaPicker((url) => setContent(prev => prev + `\n<img src="${url}" alt="Gambar" />\n`))}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" /> Sisipkan Gambar
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed focus:outline-none"
                  placeholder="Tulis artikel HTML di sini..."
                  required
                />
              </div>
            </div>
          ) : (
            /* SEO & Social OpenGraph Tab */
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* SEO Score Meter */}
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Skor Analisis SEO: {seoScore}%
                  </h3>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {seoScore >= 70 ? 'Sangat Bagus! Artikel siap masuk peringkat Google.' : 'Tingkatkan Meta Description & Focus Keyword.'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-xs text-purple-900 dark:text-purple-100">
                  {seoScore}%
                </div>
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Focus Keyword (Kata Kunci Utama)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: headless cms php"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Meta Title (Max 60 Karakter)
                  </label>
                  <span className={`text-[11px] font-mono ${metaTitle.length > 60 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                    {metaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Meta Description (Max 160 Karakter)
                  </label>
                  <span className={`text-[11px] font-mono ${metaDescription.length > 160 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                    {metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Canonical URL (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://website-utama.com/artikel-original"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* Google SERP Snippet Live Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pratinjau Hasil Pencarian Google (SERP)
                </span>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 truncate font-mono">
                  https://website-utama.com/embed/article.php?id={slug || 'slug-artikel'}
                </div>
                <div className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                  {metaTitle || title || 'Judul Artikel Google'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {metaDescription || summary || 'Deskripsi meta artikel akan muncul di sini...'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Post Settings & Metadata */}
        <div className="space-y-6">
          {/* Status & Publish Schedule */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Publikasi & Visibilitas
            </h3>

            {/* Status Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status Post</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
              >
                <option value="publish">Publish (Terbit)</option>
                <option value="draft">Draft (Konsep)</option>
                <option value="private">Private (Rahasia)</option>
                <option value="schedule">Schedule (Terjadwal)</option>
              </select>
            </div>

            {/* Visibilitas */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Visibilitas Konten</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as VisibilityType)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
              >
                <option value="public">Publik (Terbuka)</option>
                <option value="private">Private (Admin Saja)</option>
                <option value="password">Dengan Password</option>
              </select>
            </div>

            {visibility === 'password' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Password Akses</label>
                <input
                  type="text"
                  placeholder="Ketik password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {/* Publish Date Picker */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Tanggal Terbit
              </label>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            {/* Checkboxes: Featured & Pinned */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Jadikan Artikel Utama (Featured)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Sematkan di Atas (Pinned Post)</span>
              </label>
            </div>
          </div>

          {/* Featured Image Picker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-500" />
              Featured Image (Gambar Sampul)
            </h3>

            {featuredImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={featuredImage} alt="Featured" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenMediaPicker((url) => setFeaturedImage(url))}
                className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-2 text-slate-400 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">Pilih dari Media Manager</span>
              </button>
            )}

            <input
              type="text"
              placeholder="Atau masukkan URL Gambar..."
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
            />
          </div>

          {/* Category Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-500" />
              Kategori Artikel
            </h3>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Manager with Autocomplete */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-emerald-500" />
              Tag Artikel
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah tag lalu tekan Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
              >
                +
              </button>
            </div>

            {/* Render Selected Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
