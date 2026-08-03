import React, { useState } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  FileText,
  Grid,
  List
} from 'lucide-react';
import { MediaFile } from '../types';

interface MediaViewProps {
  mediaList: MediaFile[];
  onUploadFile: (file: File) => void;
  onDeleteMedia: (id: string) => void;
  onSelectUrl?: (url: string) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({
  mediaList,
  onUploadFile,
  onDeleteMedia,
  onSelectUrl
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      await onUploadFile(e.target.files[0]);
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Media Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Unggah dan kelola berkas gambar (JPG, PNG, WEBP, GIF, SVG), PDF, dan media pendukung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-sm' : 'text-slate-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-sm' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Mengunggah...' : 'Unggah Berkas'}</span>
            <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.zip,.mp4" />
          </label>
        </div>
      </div>

      {/* Media Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.length > 0 ? (
            mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                {/* Media Thumbnail */}
                <div className="h-36 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
                  {item.mime_type.startsWith('image/') ? (
                    <img src={item.url} alt={item.original_name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-400" />
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {onSelectUrl ? (
                      <button
                        onClick={() => onSelectUrl(item.url)}
                        className="p-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-md"
                      >
                        Pilih Gambar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCopy(item.url, item.id)}
                          className="p-2 rounded-xl bg-white text-slate-900 font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                          title="Salin URL Gambar"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus berkas media ini?')) onDeleteMedia(item.id);
                          }}
                          className="p-2 rounded-xl bg-rose-600 text-white font-semibold text-xs cursor-pointer shadow-md"
                          title="Hapus Media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.original_name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{item.folder_path}</span>
                    <span>{(item.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400">
              <UploadCloud className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">Belum ada berkas media diunggah.</p>
              <p className="text-xs">Klik tombol Unggah Berkas di atas.</p>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mediaList.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.url} alt={item.original_name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{item.original_name}</p>
                    <p className="text-xs font-mono text-slate-400">{item.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleCopy(item.url, item.id)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600">
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onDeleteMedia(item.id)} className="p-2 rounded-lg text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
