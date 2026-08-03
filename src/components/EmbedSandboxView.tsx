import React, { useState } from 'react';
import { Code2, Play, Copy, Check, ExternalLink, Sparkles, Layers, Globe, Smartphone, Monitor } from 'lucide-react';
import { EmbedConfig } from '../types';

export const EmbedSandboxView: React.FC = () => {
  const [config, setConfig] = useState<EmbedConfig>({
    endpoint: '/embed/posts.php',
    type: 'posts',
    format: 'html',
    limit: 5,
    category_slug: 'teknologi',
    theme: 'light'
  });

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const getEmbedURL = () => {
    let url = `${config.endpoint}?format=${config.format}&limit=${config.limit}`;
    if (config.category_slug) url += `&category=${config.category_slug}`;
    return url;
  };

  const getIframeCode = () => {
    return `<iframe src="${getEmbedURL()}" width="100%" height="550" frameborder="0" loading="lazy" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;"></iframe>`;
  };

  const getJSWidgetCode = () => {
    return `<script src="/embed/widget.js" data-type="${config.type}" data-limit="${config.limit}" data-container="cms-articles-widget"></script>\n<div id="cms-articles-widget"></div>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Embed & REST API Playground (Sandbox)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Uji coba langsung endpoint embed, dapatkan kode HTML Iframe, JavaScript Widget, dan output JSON untuk di-embed pada website lain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Config Controls */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Konfigurasi Parameter Embed
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Pilih Endpoint PHP
            </label>
            <select
              value={config.endpoint}
              onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
            >
              <option value="/embed/posts.php">embed/posts.php (Daftar Artikel)</option>
              <option value="/embed/article.php">embed/article.php (Single Artikel Detail)</option>
              <option value="/embed/latest.php">embed/latest.php (Artikel Terbaru)</option>
              <option value="/embed/popular.php">embed/popular.php (Artikel Terpopuler)</option>
              <option value="/embed/search.php">embed/search.php (Pencarian)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Format Output
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, format: 'html' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                  config.format === 'html'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                Render HTML
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, format: 'json' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                  config.format === 'json'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Jumlah Artikel (Limit)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={config.limit}
              onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) || 5 })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
            />
          </div>

          {/* Quick Code Snippets to Copy */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Kode Iframe HTML</span>
                <button
                  onClick={() => copyToClipboard(getIframeCode(), 'iframe')}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedType === 'iframe' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Salin
                </button>
              </div>
              <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto leading-relaxed">
                {getIframeCode()}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">JavaScript Widget Script</span>
                <button
                  onClick={() => copyToClipboard(getJSWidgetCode(), 'js')}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedType === 'js' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Salin
                </button>
              </div>
              <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto leading-relaxed">
                {getJSWidgetCode()}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Live Preview Frame */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Live Endpoint: {getEmbedURL()}</span>
            </div>

            <a
              href={getEmbedURL()}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <span>Buka Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe Live Display */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-lg min-h-[500px]">
            <iframe
              key={getEmbedURL()}
              src={getEmbedURL()}
              className="w-full h-[550px] border-none"
              title="Embed Sandbox Live Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
