import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Share2,
  Code2,
  Save,
  ShieldCheck,
  Search,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy
} from 'lucide-react';
import { SiteSettings } from '../types';

interface SettingsViewProps {
  settings: SiteSettings | null;
  onSaveSettings: (updated: Partial<SiteSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<SiteSettings>(
    settings || ({
      site_name: '',
      tagline: '',
      description: '',
      logo: '',
      favicon: '',
      address: '',
      email: '',
      phone: '',
      socials: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '', tiktok: '' },
      timezone: 'Asia/Jakarta',
      language: 'id',
      default_author: 'Redaksi Utama',
      footer_text: '',
      google_analytics_id: '',
      google_search_console: '',
      google_adsense_id: '',
      verification_code: '',
      custom_header_script: '',
      custom_footer_script: '',
      robots_txt: "User-agent: *\nAllow: /\nSitemap: /api/sitemap.xml",
      api_secret_token: 'cms_bearer_sec_key_998877665544332211',
      rate_limit_per_minute: 60,
      auto_save_interval_sec: 30
    } as SiteSettings)
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'socials' | 'seo' | 'scripts' | 'api' | 'database'>('profile');
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const checkSupabaseStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch {
      setSupabaseStatus({ status: 'error', message: 'Gagal terhubung ke server API.' });
    } finally {
      setLoadingStatus(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'database') {
      checkSupabaseStatus();
    }
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Pengaturan Website & CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola profil situs, sosial media, integrasi Google Analytics, Adsense, serta script kustom.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Pengaturan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'profile', label: 'Profil Website', icon: Globe },
          { id: 'socials', label: 'Media Sosial', icon: Share2 },
          { id: 'seo', label: 'SEO & Analytics', icon: Search },
          { id: 'scripts', label: 'Custom Scripts & Robots', icon: Code2 },
          { id: 'api', label: 'Token API & Performa', icon: ShieldCheck },
          { id: 'database', label: 'Database Cloud (Supabase)', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nama Website
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Deskripsi Umum Situs
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Kontak Redaksi
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Zona Waktu (Timezone)
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Teks Hak Cipta Footer
              </label>
              <input
                type="text"
                value={formData.footer_text}
                onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === 'socials' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'tiktok'].map((platform) => (
              <div key={platform}>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 capitalize">
                  URL {platform}
                </label>
                <input
                  type="url"
                  placeholder={`https://${platform}.com/username`}
                  value={(formData.socials as any)[platform] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, [platform]: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={formData.google_analytics_id}
                  onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Google Search Console Tag
                </label>
                <input
                  type="text"
                  placeholder="google-site-verification=..."
                  value={formData.google_search_console}
                  onChange={(e) => setFormData({ ...formData, google_search_console: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Google Adsense Publisher ID
                </label>
                <input
                  type="text"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  value={formData.google_adsense_id}
                  onChange={(e) => setFormData({ ...formData, google_adsense_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Custom Header Script (&lt;head&gt;)
              </label>
              <textarea
                rows={4}
                value={formData.custom_header_script}
                onChange={(e) => setFormData({ ...formData, custom_header_script: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Isi robots.txt
              </label>
              <textarea
                rows={4}
                value={formData.robots_txt}
                onChange={(e) => setFormData({ ...formData, robots_txt: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                API Secret Bearer Token
              </label>
              <input
                type="text"
                value={formData.api_secret_token}
                onChange={(e) => setFormData({ ...formData, api_secret_token: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Status Integrasi Supabase Cloud</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Penyimpanan permanen artikel, kategori, tag, dan media untuk Vercel & GitHub.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={checkSupabaseStatus}
                disabled={loadingStatus}
                className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                <span>Cek Ulang Status</span>
              </button>
            </div>

            {supabaseStatus && (
              <div className="space-y-4">
                {supabaseStatus.status === 'connected' && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Supabase Terhubung & Siap Digunakan!</p>
                      <p className="text-xs mt-1">{supabaseStatus.message}</p>
                    </div>
                  </div>
                )}

                {supabaseStatus.status === 'table_missing' && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="font-bold text-sm">Supabase Terhubung, Jalankan Query SQL Ini Di Dashboard Supabase:</p>
                        <p className="text-xs mt-1 text-amber-700 dark:text-amber-300">
                          Buka Dashboard Supabase → <b>SQL Editor</b> → Paste kode di bawah ini lalu klik <b>RUN</b>:
                        </p>
                      </div>
                    </div>

                    <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                      <pre>{supabaseStatus.setup_sql}</pre>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(supabaseStatus.setup_sql);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2000);
                        }}
                        className="absolute top-2 right-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {supabaseStatus.status === 'not_configured' && (
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <p className="font-bold text-sm">Supabase Belum Dikonfigurasi</p>
                    <p className="text-xs mt-1">Variabel lingkungan <code>SUPABASE_URL</code> dan <code>SUPABASE_ANON_KEY</code> belum terdeteksi.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
