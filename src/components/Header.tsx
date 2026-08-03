import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Keyboard,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenShortcuts: () => void;
  onOpenEmbedModal: () => void;
  onSearchClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenShortcuts,
  onOpenEmbedModal,
  onSearchClick,
  onLogout
}) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-400 text-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors group cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="flex-1 text-left text-slate-400 dark:text-slate-500">
            Cari artikel, kategori, atau tag...
          </span>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            Ctrl + F
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Embed Link */}
        <button
          onClick={onOpenEmbedModal}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Embed Sandbox</span>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Pintasan Keyboard (Ctrl + K)"
        >
          <Keyboard className="w-5 h-5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* User Profile */}
        <div className="pl-3 border-l border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name || 'User Avatar'}
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/40"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold capitalize">
              {user?.role || 'administrator'}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
