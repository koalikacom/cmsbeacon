import React, { useState } from 'react';
import { Database, Download, Upload, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface BackupViewProps {
  onExportBackup: () => void;
  onRestoreBackup: (jsonData: any) => void;
}

export const BackupView: React.FC<BackupViewProps> = ({ onExportBackup, onRestoreBackup }) => {
  const [restoreJson, setRestoreJson] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onRestoreBackup(parsed);
          setStatusMsg('Restore database JSON berhasil!');
        } catch (err) {
          alert('File JSON backup tidak valid!');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Database className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Backup & Restore Database JSON
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ekspor seluruh data artikel, kategori, halaman, dan pengaturan dalam sekali klik tanpa kerumitan database SQL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Backup Export */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Ekspor Single-Click JSON Backup
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Unduh seluruh arsip data CMS meliputi posts, categories, tags, pages, settings, dan users ke dalam satu berkas `.json` portabel.
          </p>

          <button
            onClick={onExportBackup}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Backup JSON Sekali Klik</span>
          </button>
        </div>

        {/* Restore */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Restore Database dari Berkas JSON
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Unggah berkas cadangan JSON untuk memulihkan seluruh struktur data artikel dan kategori secara instan.
          </p>

          <label className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Pilih & Upload Berkas JSON Backup</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
