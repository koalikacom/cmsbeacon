import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  FileCode,
  Image as ImageIcon,
  Users,
  Settings,
  Code2,
  ShieldCheck,
  Database,
  FolderCode,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'articles'
  | 'editor'
  | 'categories'
  | 'tags'
  | 'pages'
  | 'media'
  | 'users'
  | 'settings'
  | 'embed'
  | 'security'
  | 'backup'
  | 'php-export';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onAddNewArticle: () => void;
  stats?: {
    total_articles: number;
    total_categories: number;
    total_pages: number;
    total_media: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onAddNewArticle,
  stats
}) => {
  const menuGroup1 = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'articles' as NavTab,
      label: 'Artikel',
      icon: FileText,
      badge: stats?.total_articles
    },
    {
      id: 'categories' as NavTab,
      label: 'Kategori',
      icon: FolderTree,
      badge: stats?.total_categories
    },
    { id: 'tags' as NavTab, label: 'Tag Artikel', icon: Tags },
    {
      id: 'pages' as NavTab,
      label: 'Halaman Statis',
      icon: FileCode,
      badge: stats?.total_pages
    },
    {
      id: 'media' as NavTab,
      label: 'Media Manager',
      icon: ImageIcon,
      badge: stats?.total_media
    }
  ];

  const menuGroup2 = [
    { id: 'users' as NavTab, label: 'Pengguna & Akses', icon: Users },
    { id: 'settings' as NavTab, label: 'Pengaturan CMS', icon: Settings }
  ];

  const menuGroup3 = [
    {
      id: 'embed' as NavTab,
      label: 'Embed & REST API',
      icon: Code2,
      special: true
    },
    { id: 'security' as NavTab, label: 'Keamanan & Logs', icon: ShieldCheck },
    { id: 'backup' as NavTab, label: 'Backup & Restore', icon: Database },
    {
      id: 'php-export' as NavTab,
      label: 'Source Code PHP 8+',
      icon: FolderCode,
      highlight: true
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col h-screen shrink-0 select-none">
      {/* CMS Brand Logo */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-lg">
            HC
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              Headless CMS
            </h1>
            <p className="text-xs text-blue-400 font-medium">Engine Artikel v1.0</p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={onAddNewArticle}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-600/25 group cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
        {/* Konten Utama */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Manajemen Konten
          </div>
          <nav className="space-y-1">
            {menuGroup1.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administrasi */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pengaturan & Akun
          </div>
          <nav className="space-y-1">
            {menuGroup2.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Developer & Integration Tools */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Integration & Security
          </div>
          <nav className="space-y-1">
            {menuGroup3.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : item.highlight
                      ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Export
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <p className="font-semibold text-slate-200">Headless Mode</p>
              <p className="text-[10px] text-slate-400">REST & Embed Ready</p>
            </div>
          </div>
          <a
            href="/embed/posts.php"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Buka Embed Endpoint"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
};
