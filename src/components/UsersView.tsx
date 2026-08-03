import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, Edit, Trash2, Mail, Calendar } from 'lucide-react';
import { User, UserRole } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (u: Partial<User>) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onAddUser }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('author');
  const [bio, setBio] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;

    onAddUser({
      name: name || username,
      username,
      email,
      role,
      bio,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
    });

    setIsFormOpen(false);
    setName('');
    setUsername('');
    setEmail('');
    setBio('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Pengguna & Hak Akses (User Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola tim redaksi dengan peran Administrator, Editor, dan Author.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Tambah Pengguna Redaksi Baru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Rina Wijaya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Username Login</label>
              <input
                type="text"
                placeholder="rina_editor"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
              <input
                type="email"
                placeholder="rina@portalberita.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Role Peran</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="administrator">Administrator (Akses Penuh)</option>
                <option value="editor">Editor (Kelola Semua Artikel & Kategori)</option>
                <option value="author">Author (Tulis Artikel Sendiri)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Bio Penulis</label>
              <input
                type="text"
                placeholder="Penulis spesialis bidang teknologi..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>
          </div>

          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer">
            Simpan Pengguna
          </button>
        </form>
      )}

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{u.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
                    {u.role}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{u.bio || 'Belum ada bio.'}</p>

              <div className="space-y-1.5 text-xs font-mono text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{u.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Login Terakhir: {u.last_login ? new Date(u.last_login).toLocaleDateString('id-ID') : 'Belum Pernah'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
