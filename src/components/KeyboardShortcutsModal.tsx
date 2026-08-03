import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + N', desc: 'Tulis Artikel Baru' },
    { key: 'Ctrl + S', desc: 'Simpan Artikel Saat Ini' },
    { key: 'Ctrl + F', desc: 'Fokus Kolom Pencarian' },
    { key: 'Ctrl + B', desc: 'Buka Ekspor Backup JSON' },
    { key: 'Ctrl + E', desc: 'Buka Embed Sandbox' },
    { key: 'Esc', desc: 'Tutup Modal / Batal' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-500" />
            Pintasan Keyboard (Keyboard Shortcuts)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
