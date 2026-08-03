import React from 'react';
import {
  FileText,
  FolderTree,
  FileCode,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Code2,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { CMSStats, ArticlePost } from '../types';

interface DashboardViewProps {
  stats: CMSStats | null;
  onNavigate: (tab: any) => void;
  onAddNewArticle: () => void;
  onEditArticle: (article: ArticlePost) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onNavigate,
  onAddNewArticle,
  onEditArticle
}) => {
  const metricCards = [
    {
      title: 'Total Artikel',
      value: stats?.total_articles || 0,
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
      tab: 'articles'
    },
    {
      title: 'Total Kategori',
      value: stats?.total_categories || 0,
      icon: FolderTree,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      tab: 'categories'
    },
    {
      title: 'Halaman Statis',
      value: stats?.total_pages || 0,
      icon: FileCode,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      tab: 'pages'
    },
    {
      title: 'Pengguna System',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      tab: 'users'
    },
    {
      title: 'Total Pembaca (Views)',
      value: (stats?.total_views || 0).toLocaleString('id-ID'),
      icon: Eye,
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
      tab: 'articles'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Headless Content Architecture • Zero SQL Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Panel CMS Artikel
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Seluruh konten artikel, kategori, dan media Anda siap di-embed atau dipanggil via REST API JSON dari website frontend manapun.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNewArticle}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Artikel Baru</span>
            </button>
            <button
              onClick={() => onNavigate('embed')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Uji Endpoint Embed</span>
            </button>
            <button
              onClick={() => onNavigate('php-export')}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-medium text-sm flex items-center gap-2 border border-emerald-800/50 transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Source Code PHP 8+</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid SVG */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Articles Overview + Quick System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Popular & Recent Articles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Articles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Artikel Terbaru
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daftar publikasi artikel paling mutakhir.
                </p>
              </div>
              <button
                onClick={() => onNavigate('articles')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {stats?.recent_articles && stats.recent_articles.length > 0 ? (
                stats.recent_articles.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onEditArticle(post)}
                    className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 font-bold text-xs">
                          NO IMG
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {post.category_name || 'Teknologi'}
                          </span>
                          <span>•</span>
                          <span>{new Date(post.publish_date).toLocaleDateString('id-ID')}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                        post.status === 'publish'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-slate-400">Belum ada artikel.</div>
              )}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Artikel Terpopuler
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Artikel dengan jumlah pembaca terbanyak.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {stats?.popular_articles?.map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => onEditArticle(post)}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-4 hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0 bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{(post.views_count || 0).toLocaleString('id-ID')} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: System Status & Embed Snippets */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Status Sistem Headless
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  JSON Flat-File Engine
                </span>
                <span className="font-mono text-[11px] bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-blue-900 dark:text-blue-200">
                <span className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  REST API & Embed PHP
                </span>
                <span className="font-mono text-[11px] bg-blue-200/60 dark:bg-blue-900 px-2 py-0.5 rounded font-bold">
                  READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between text-indigo-900 dark:text-indigo-200">
                <span className="font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  XSS & Anti-CSRF Protection
                </span>
                <span className="font-mono text-[11px] bg-indigo-200/60 dark:bg-indigo-900 px-2 py-0.5 rounded font-bold">
                  ENABLED
                </span>
              </div>
            </div>
          </div>

          {/* Quick Embed Sample */}
          <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              Cara Embed Ke Website Lain
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Cukup tempelkan tag iframe berikut pada website HTML / PHP Anda:
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
              <code>&lt;iframe src="/embed/posts.php?limit=5" width="100%" height="500" frameborder="0"&gt;&lt;/iframe&gt;</code>
            </div>

            <button
              onClick={() => onNavigate('embed')}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buka Live Embed Sandbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
