import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Trash2, AlertTriangle, ShieldAlert, Key, UserCheck, HardDrive } from 'lucide-react';
import { ActivityLog } from '../types';

interface SecurityLogsViewProps {
  logs: ActivityLog[];
  onClearCache: () => void;
}

export const SecurityLogsView: React.FC<SecurityLogsViewProps> = ({ logs, onClearCache }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'activity' | 'login' | 'security' | 'error'>('all');

  const filteredLogs = logs.filter(l => activeTab === 'all' || l.type === activeTab);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Keamanan & Log Aktivitas (Security Engine)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor log keamanan, login, proteksi XSS/CSRF, serta manajemen cache flat-file.
          </p>
        </div>

        <button
          onClick={onClearCache}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Bersihkan Flat-File Cache</span>
        </button>
      </div>

      {/* Security Shields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">CSRF Protection</div>
            <div className="text-[10px] text-emerald-600 font-semibold">TOKEN ACTIVE</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Rate Limit Login</div>
            <div className="text-[10px] text-blue-600 font-semibold">MAX 5/15 MIN</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Zero SQL Injection</div>
            <div className="text-[10px] text-purple-600 font-semibold">JSON STORAGE</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">XSS Sanitizer</div>
            <div className="text-[10px] text-amber-600 font-semibold">ENABLED</div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            {['all', 'activity', 'login', 'security', 'error'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  activeTab === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                  log.type === 'security' ? 'bg-rose-100 text-rose-700' :
                  log.type === 'login' ? 'bg-blue-100 text-blue-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {log.type}
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{log.message}</p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono shrink-0">
                <span>{log.user_name}</span>
                <span>{log.ip_address}</span>
                <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
