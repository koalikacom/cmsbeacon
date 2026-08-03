import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Share2,
  Code2,
  Save,
  ShieldCheck,
  Search,
  DollarSign,
  FileText
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

  const [activeTab, setActiveTab] = useState<'profile' | 'socials' | 'seo' | 'scripts' | 'api'>('profile');

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
          { id: 'api', label: 'Token API & Performa', icon: ShieldCheck }
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
      </div>
    </form>
  );
};
