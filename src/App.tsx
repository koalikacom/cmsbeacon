import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ArticlesView } from './components/ArticlesView';
import { ArticleEditor } from './components/ArticleEditor';
import { CategoriesView } from './components/CategoriesView';
import { TagsView } from './components/TagsView';
import { PagesView } from './components/PagesView';
import { MediaView } from './components/MediaView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { EmbedSandboxView } from './components/EmbedSandboxView';
import { SecurityLogsView } from './components/SecurityLogsView';
import { BackupView } from './components/BackupView';
import { PHPCodeExplorerView } from './components/PHPCodeExplorerView';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ArticlePost, Category, Tag, StaticPage, SiteSettings, User, MediaFile, ActivityLog, CMSStats } from './types';
import { KeyRound, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>({
    id: 'usr-1',
    username: 'admin',
    email: 'admin@portalberita.id',
    name: 'Super Administrator',
    role: 'administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: new Date().toISOString(),
    status: 'active'
  });
  const [token, setToken] = useState<string>('cms_bearer_sec_key_998877665544332211');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // UI Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Data States
  const [stats, setStats] = useState<CMSStats | null>(null);
  const [articles, setArticles] = useState<ArticlePost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Editor Editing Article State
  const [editingArticle, setEditingArticle] = useState<Partial<ArticlePost>>({});
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [previewArticleModal, setPreviewArticleModal] = useState<Partial<ArticlePost> | null>(null);

  // Toast Helper
  const addToast = (type: ToastMessage['type'], message: string) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random(),
      type,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load All Data
  const fetchAllData = () => {
    fetch('/api/stats').then(res => res.json()).then(setStats).catch(console.error);
    fetch('/api/posts?include_deleted=true').then(res => res.json()).then(d => setArticles(d.data || [])).catch(console.error);
    fetch('/api/categories').then(res => res.json()).then(d => setCategories(d.data || [])).catch(console.error);
    fetch('/api/tags').then(res => res.json()).then(d => setTags(d.data || [])).catch(console.error);
    fetch('/api/pages').then(res => res.json()).then(d => setPages(d.data || [])).catch(console.error);
    fetch('/api/settings').then(res => res.json()).then(d => setSettings(d.data)).catch(console.error);
    fetch('/api/media').then(res => res.json()).then(d => setMediaList(d.data || [])).catch(console.error);
    fetch('/api/users').then(res => res.json()).then(d => setUsersList(d.data || [])).catch(console.error);
    fetch('/api/logs').then(res => res.json()).then(d => setLogs(d.data || [])).catch(console.error);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          handleAddNewArticle();
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setCurrentTab('backup');
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setCurrentTab('embed');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          setIsShortcutsOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setPreviewArticleModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Login Action
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setUser(data.user);
        setToken(data.token);
        setIsLoggedIn(true);
        addToast('success', `Selamat datang kembali, ${data.user.name}!`);
      } else {
        setLoginError(data.error || 'Login gagal');
      }
    } catch (err) {
      setLoginError('Gagal terhubung ke server.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    addToast('info', 'Anda telah keluar dari panel admin.');
  };

  // Article Actions
  const handleAddNewArticle = () => {
    setEditingArticle({});
    setCurrentTab('editor');
  };

  const handleEditArticle = (article: ArticlePost) => {
    setEditingArticle(article);
    setCurrentTab('editor');
  };

  const handleSaveArticle = async (articleData: Partial<ArticlePost>) => {
    const isEdit = !!articleData.id;
    const url = isEdit ? `/api/posts/${articleData.id}` : '/api/posts';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', isEdit ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil dibuat!');
        fetchAllData();
        setCurrentTab('articles');
      } else {
        addToast('error', data.error || 'Gagal menyimpan artikel');
      }
    } catch (err) {
      addToast('error', 'Terjadi kesalahan sistem');
    }
  };

  const handleDeleteArticle = async (id: string, permanent = false) => {
    try {
      const res = await fetch(`/api/posts/${id}?permanent=${permanent}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('success', permanent ? 'Artikel dihapus permanen.' : 'Artikel dipindahkan ke Tempat Sampah.');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menghapus artikel.');
    }
  };

  const handleRestoreArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/restore/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('success', 'Artikel berhasil dipulihkan!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal memulihkan artikel.');
    }
  };

  const handleDuplicateArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/duplicate/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('success', 'Artikel berhasil didplikasi!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menduplikasi artikel.');
    }
  };

  // Category Actions
  const handleAddCategory = async (catData: Partial<Category>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        addToast('success', 'Kategori baru berhasil ditambahkan!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menambah kategori.');
    }
  };

  const handleUpdateCategory = async (id: string, catData: Partial<Category>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        addToast('success', 'Kategori berhasil diperbarui!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal memperbarui kategori.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', 'Kategori berhasil dihapus.');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menghapus kategori.');
    }
  };

  // Media Actions
  const handleUploadMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', `Berkas ${file.name} berhasil diunggah!`);
        fetchAllData();
      } else {
        addToast('error', data.error || 'Gagal mengunggah berkas.');
      }
    } catch (err) {
      addToast('error', 'Gagal terhubung ke server upload.');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', 'Berkas media dihapus.');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menghapus berkas.');
    }
  };

  // Settings Save
  const handleSaveSettings = async (updatedSettings: Partial<SiteSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        addToast('success', 'Pengaturan website berhasil disimpan!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal menyimpan pengaturan.');
    }
  };

  // Cache Clear
  const handleClearCache = async () => {
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' });
      if (res.ok) {
        addToast('success', 'Flat-file cache berhasil dibersihkan!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal membersihkan cache.');
    }
  };

  // Backup JSON Download & Restore
  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/backup/create', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.data) {
        const jsonStr = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        addToast('success', 'Backup database JSON berhasil diunduh!');
      }
    } catch (err) {
      addToast('error', 'Gagal membuat backup JSON.');
    }
  };

  const handleRestoreBackup = async (jsonData: any) => {
    try {
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });
      if (res.ok) {
        addToast('success', 'Database JSON berhasil dipulihkan total!');
        fetchAllData();
      }
    } catch (err) {
      addToast('error', 'Gagal memulihkan database.');
    }
  };

  // If not logged in, render Login View
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-slate-100">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-blue-500/20">
              HC
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Login CMS Artikel Headless</h1>
            <p className="text-xs text-slate-400">Masukkan akun admin untuk mengakses panel kontrol.</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Username / Email</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Masuk ke Panel Control
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            Demo Akun: <span className="text-blue-400 font-bold">admin</span> / <span className="text-blue-400 font-bold">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onAddNewArticle={handleAddNewArticle}
        stats={{
          total_articles: stats?.total_articles || 0,
          total_categories: stats?.total_categories || 0,
          total_pages: stats?.total_pages || 0,
          total_media: stats?.total_media || 0
        }}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <Header
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenEmbedModal={() => setCurrentTab('embed')}
          onSearchClick={() => setCurrentTab('articles')}
          onLogout={handleLogout}
        />

        {/* View Switcher Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              onNavigate={setCurrentTab}
              onAddNewArticle={handleAddNewArticle}
              onEditArticle={handleEditArticle}
            />
          )}

          {currentTab === 'articles' && (
            <ArticlesView
              articles={articles}
              categories={categories}
              onAddNew={handleAddNewArticle}
              onEdit={handleEditArticle}
              onDuplicate={handleDuplicateArticle}
              onDelete={handleDeleteArticle}
              onRestore={handleRestoreArticle}
              onPreview={(p) => setPreviewArticleModal(p)}
            />
          )}

          {currentTab === 'editor' && (
            <ArticleEditor
              article={editingArticle}
              categories={categories}
              tags={tags}
              onSave={handleSaveArticle}
              onCancel={() => setCurrentTab('articles')}
              onOpenMediaPicker={(cb) => {
                setMediaPickerCallback(() => cb);
                setCurrentTab('media');
              }}
              onPreview={(p) => setPreviewArticleModal(p)}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesView
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {currentTab === 'tags' && (
            <TagsView
              tags={tags}
              onAddTag={async (name) => {
                await fetch('/api/tags', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name })
                });
                fetchAllData();
              }}
            />
          )}

          {currentTab === 'pages' && (
            <PagesView
              pages={pages}
              onAddPage={async (page) => {
                await fetch('/api/pages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(page)
                });
                fetchAllData();
              }}
              onUpdatePage={async (id, page) => {
                await fetch(`/api/pages/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(page)
                });
                fetchAllData();
              }}
              onDeletePage={async (id) => {
                await fetch(`/api/pages/${id}`, { method: 'DELETE' });
                fetchAllData();
              }}
            />
          )}

          {currentTab === 'media' && (
            <MediaView
              mediaList={mediaList}
              onUploadFile={handleUploadMedia}
              onDeleteMedia={handleDeleteMedia}
              onSelectUrl={
                mediaPickerCallback
                  ? (url) => {
                      mediaPickerCallback(url);
                      setMediaPickerCallback(null);
                      setCurrentTab('editor');
                    }
                  : undefined
              }
            />
          )}

          {currentTab === 'users' && (
            <UsersView
              users={usersList}
              onAddUser={async (u) => {
                await fetch('/api/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(u)
                });
                fetchAllData();
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView settings={settings} onSaveSettings={handleSaveSettings} />
          )}

          {currentTab === 'embed' && <EmbedSandboxView />}

          {currentTab === 'security' && (
            <SecurityLogsView logs={logs} onClearCache={handleClearCache} />
          )}

          {currentTab === 'backup' && (
            <BackupView onExportBackup={handleExportBackup} onRestoreBackup={handleRestoreBackup} />
          )}

          {currentTab === 'php-export' && <PHPCodeExplorerView />}
        </main>
      </div>

      {/* Article Preview Modal */}
      {previewArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">Pratinjau Artikel Embed</h2>
              <button
                onClick={() => setPreviewArticleModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <article className="prose dark:prose-invert max-w-none space-y-4">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {previewArticleModal.title || 'Tanpa Judul'}
              </h1>

              {previewArticleModal.featured_image && (
                <img
                  src={previewArticleModal.featured_image}
                  alt={previewArticleModal.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}

              <div
                className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: previewArticleModal.content || '' }}
              />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
