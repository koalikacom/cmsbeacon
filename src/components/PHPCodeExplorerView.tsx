import React, { useState, useEffect } from 'react';
import { FolderCode, Code2, Copy, Check, Download, ExternalLink, Sparkles, BookOpen, Folder } from 'lucide-react';
import { PHPFileItem } from '../types';

export const PHPCodeExplorerView: React.FC = () => {
  const [phpFiles, setPhpFiles] = useState<PHPFileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<PHPFileItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/php-files')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setPhpFiles(data.data);
          setSelectedFile(data.data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleCopyCode = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderCode className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Source Code PHP 8+ Pure Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Seluruh berkas kode PHP murni tanpa framework untuk disalin atau di-deploy langsung ke server hosting manapun.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left File Selector List */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 h-fit">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            Struktur Berkas CMS PHP
          </div>

          <div className="space-y-1">
            {phpFiles.map((f) => {
              const isActive = selectedFile?.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Code2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span className="truncate">{f.path}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-2 space-y-4">
          {selectedFile && (
            <div className="p-6 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-mono font-bold text-sm text-emerald-400">
                    {selectedFile.path}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode PHP'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px] custom-scrollbar">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
