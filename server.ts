import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { DB, initSeedData } from './server/db.js';
import { getPHPProjectFiles } from './server/php_generator.js';
import { ArticlePost, Category, Tag, StaticPage, SiteSettings, User, MediaFile } from './src/types.js';

// Initialize default JSON data if not existing
initSeedData();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set Security & Embed Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Allow iframe embedding from any domain for Headless CMS Embeds
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  next();
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const folderPath = path.join(process.cwd(), 'uploads', `${year}`, `${month}`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'application/zip', 'video/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung! Format yang diizinkan: JPG, PNG, WEBP, GIF, SVG, PDF, ZIP, MP4.'));
    }
  }
});

// Serve Uploaded Files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Auth Login Simulation
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const ip = req.ip || '127.0.0.1';
  
  if (!username || !password) {
    DB.addLog('security', `Login gagal: Username/password kosong dari IP ${ip}`, username || 'Unknown', ip);
    return res.status(400).json({ error: 'Username dan password wajib diisi!' });
  }

  const users = DB.getUsers();
  const foundUser = users.find(u => u.username === username || u.email === username);

  if (foundUser && (password === 'admin123' || password === 'admin' || password === 'password')) {
    foundUser.last_login = new Date().toISOString();
    DB.saveUsers(users);
    DB.addLog('login', `Login berhasil untuk pengguna ${foundUser.username}`, foundUser.name, ip);

    const settings = DB.getSettings();
    return res.json({
      status: 'success',
      token: settings.api_secret_token || 'token_' + Date.now(),
      user: foundUser
    });
  }

  DB.addLog('security', `Percobaan login gagal untuk username: ${username} dari IP ${ip}`, username, ip);
  return res.status(401).json({ error: 'Username atau password salah! Gunakan admin / admin123' });
});

// Stats Endpoint
app.get('/api/stats', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const categories = DB.getCategories();
  const pages = DB.getPages();
  const users = DB.getUsers();
  const media = DB.getMedia();

  const activePosts = posts.filter(p => !p.is_deleted);
  const totalViews = activePosts.reduce((acc, p) => acc + (p.views_count || 0), 0);

  const popularArticles = [...activePosts]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  const recentArticles = [...activePosts]
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
    .slice(0, 5);

  res.json({
    total_articles: activePosts.length,
    total_categories: categories.length,
    total_pages: pages.length,
    total_users: users.length,
    total_views: totalViews,
    total_media: media.length,
    recent_articles: recentArticles,
    popular_articles: popularArticles
  });
});

// Articles CRUD
app.get('/api/posts', (req: Request, res: Response) => {
  let posts = DB.getPosts();

  const { status, category, tag, search, include_deleted, sort, limit, page } = req.query;

  if (include_deleted === 'true') {
    posts = posts.filter(p => p.is_deleted);
  } else {
    posts = posts.filter(p => !p.is_deleted);
  }

  if (status && status !== 'all') {
    posts = posts.filter(p => p.status === status);
  }

  if (category) {
    posts = posts.filter(p => p.category_id === category || p.category_name === category);
  }

  if (tag) {
    posts = posts.filter(p => p.tags && p.tags.includes(tag as string));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.focus_keyword && p.focus_keyword.toLowerCase().includes(q))
    );
  }

  if (sort === 'popular') {
    posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
  } else if (sort === 'title') {
    posts.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default newest
    posts.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
  }

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedPosts = posts.slice(startIndex, startIndex + limitNum);

  res.json({
    total: posts.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedPosts
  });
});

// Get Single Post
app.get('/api/posts/:id', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const post = posts.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan!' });
  }

  // Increment view count
  post.views_count = (post.views_count || 0) + 1;
  DB.savePosts(posts);

  res.json({ data: post });
});

// Create Post
app.post('/api/posts', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const input = req.body;

  if (!input.title) {
    return res.status(400).json({ error: 'Judul artikel wajib diisi!' });
  }

  const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const wordCount = input.content ? input.content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const newPost: ArticlePost = {
    id: 'post-' + Date.now(),
    title: input.title,
    slug: slug,
    meta_title: input.meta_title || input.title,
    meta_description: input.meta_description || input.summary || '',
    focus_keyword: input.focus_keyword || '',
    summary: input.summary || '',
    content: input.content || '',
    featured_image: input.featured_image || '',
    gallery: input.gallery || [],
    tags: input.tags || [],
    category_id: input.category_id || 'cat-1',
    category_name: input.category_name || 'Teknologi',
    author_id: input.author_id || 'usr-1',
    author_name: input.author_name || 'Super Administrator',
    author_avatar: input.author_avatar || '',
    status: input.status || 'draft',
    publish_date: input.publish_date || new Date().toISOString(),
    update_date: new Date().toISOString(),
    scheduled_at: input.scheduled_at,
    seo_url: input.seo_url,
    canonical_url: input.canonical_url,
    og_image: input.og_image,
    reading_time_minutes: readingTime,
    word_count: wordCount,
    is_featured: !!input.is_featured,
    is_pinned: !!input.is_pinned,
    comments_enabled: input.comments_enabled !== false,
    visibility: input.visibility || 'public',
    password: input.password || '',
    views_count: 0,
    is_deleted: false
  };

  posts.unshift(newPost);
  DB.savePosts(posts);
  DB.addLog('activity', `Membuat artikel baru: "${newPost.title}"`, newPost.author_name);

  res.status(201).json({ status: 'success', data: newPost });
});

// Update Post
app.put('/api/posts/:id', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const idx = posts.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan!' });
  }

  const input = req.body;
  const current = posts[idx];

  const wordCount = input.content !== undefined ? input.content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length : current.word_count;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const updated: ArticlePost = {
    ...current,
    ...input,
    id: current.id,
    update_date: new Date().toISOString(),
    word_count: wordCount,
    reading_time_minutes: readingTime
  };

  posts[idx] = updated;
  DB.savePosts(posts);
  DB.addLog('activity', `Memperbarui artikel: "${updated.title}"`, updated.author_name);

  res.json({ status: 'success', data: updated });
});

// Move to Trash or Permanent Delete
app.delete('/api/posts/:id', (req: Request, res: Response) => {
  let posts = DB.getPosts();
  const post = posts.find(p => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan!' });
  }

  const permanent = req.query.permanent === 'true';

  if (permanent) {
    posts = posts.filter(p => p.id !== req.params.id);
    DB.savePosts(posts);
    DB.addLog('activity', `Menghapus permanen artikel ID: ${req.params.id}`, 'Admin');
    return res.json({ status: 'success', message: 'Artikel berhasil dihapus permanen.' });
  } else {
    post.is_deleted = true;
    post.deleted_at = new Date().toISOString();
    DB.savePosts(posts);
    DB.addLog('activity', `Memindahkan artikel ke tempat sampah: "${post.title}"`, 'Admin');
    return res.json({ status: 'success', message: 'Artikel dipindahkan ke Tempat Sampah.' });
  }
});

// Restore Post from Trash
app.post('/api/posts/restore/:id', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const post = posts.find(p => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan!' });
  }

  post.is_deleted = false;
  post.deleted_at = undefined;
  DB.savePosts(posts);
  DB.addLog('activity', `Mengembalikan artikel dari tempat sampah: "${post.title}"`, 'Admin');

  res.json({ status: 'success', message: 'Artikel berhasil dipulihkan.' });
});

// Duplicate Post
app.post('/api/posts/duplicate/:id', (req: Request, res: Response) => {
  const posts = DB.getPosts();
  const post = posts.find(p => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Artikel tidak ditemukan!' });
  }

  const duplicate: ArticlePost = {
    ...post,
    id: 'post-' + Date.now(),
    title: `${post.title} (Salinan)`,
    slug: `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`,
    status: 'draft',
    views_count: 0,
    publish_date: new Date().toISOString(),
    update_date: new Date().toISOString(),
    is_deleted: false
  };

  posts.unshift(duplicate);
  DB.savePosts(posts);
  DB.addLog('activity', `Menduplikasi artikel: "${post.title}"`, 'Admin');

  res.json({ status: 'success', data: duplicate });
});

// Categories API
app.get('/api/categories', (req: Request, res: Response) => {
  const categories = DB.getCategories();
  const posts = DB.getPosts().filter(p => !p.is_deleted);

  const list = categories.map(cat => ({
    ...cat,
    article_count: posts.filter(p => p.category_id === cat.id || p.category_name === cat.name).length
  }));

  res.json({ data: list });
});

app.post('/api/categories', (req: Request, res: Response) => {
  const categories = DB.getCategories();
  const { name, slug, description, parent_id, icon, meta_description } = req.body;

  if (!name) return res.status(400).json({ error: 'Nama kategori wajib diisi!' });

  const newCat: Category = {
    id: 'cat-' + Date.now(),
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    parent_id: parent_id || null,
    icon: icon || 'Folder',
    meta_description: meta_description || '',
    order: categories.length + 1
  };

  categories.push(newCat);
  DB.saveCategories(categories);
  DB.addLog('activity', `Menambah kategori baru: ${name}`, 'Admin');

  res.status(201).json({ status: 'success', data: newCat });
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const categories = DB.getCategories();
  const idx = categories.findIndex(c => c.id === req.params.id);

  if (idx === -1) return res.status(404).json({ error: 'Kategori tidak ditemukan!' });

  categories[idx] = { ...categories[idx], ...req.body, id: categories[idx].id };
  DB.saveCategories(categories);
  DB.addLog('activity', `Memperbarui kategori: ${categories[idx].name}`, 'Admin');

  res.json({ status: 'success', data: categories[idx] });
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  let categories = DB.getCategories();
  categories = categories.filter(c => c.id !== req.params.id);
  DB.saveCategories(categories);
  DB.addLog('activity', `Menghapus kategori ID: ${req.params.id}`, 'Admin');

  res.json({ status: 'success', message: 'Kategori berhasil dihapus.' });
});

// Tags API
app.get('/api/tags', (req: Request, res: Response) => {
  const tags = DB.getTags();
  res.json({ data: tags });
});

app.post('/api/tags', (req: Request, res: Response) => {
  const tags = DB.getTags();
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nama tag wajib diisi!' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = tags.find(t => t.slug === slug);
  if (existing) return res.json({ data: existing });

  const newTag: Tag = {
    id: 'tag-' + Date.now(),
    name,
    slug,
    count: 1
  };
  tags.push(newTag);
  DB.saveTags(tags);
  res.status(201).json({ status: 'success', data: newTag });
});

// Static Pages API
app.get('/api/pages', (req: Request, res: Response) => {
  const pages = DB.getPages();
  res.json({ data: pages });
});

app.post('/api/pages', (req: Request, res: Response) => {
  const pages = DB.getPages();
  const { title, slug, content, meta_title, meta_description } = req.body;

  if (!title) return res.status(400).json({ error: 'Judul halaman wajib diisi!' });

  const newPage: StaticPage = {
    id: 'page-' + Date.now(),
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    content: content || '',
    meta_title: meta_title || title,
    meta_description: meta_description || '',
    status: 'publish',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  pages.push(newPage);
  DB.savePages(pages);
  DB.addLog('activity', `Membuat halaman baru: ${title}`, 'Admin');

  res.status(201).json({ status: 'success', data: newPage });
});

app.put('/api/pages/:id', (req: Request, res: Response) => {
  const pages = DB.getPages();
  const idx = pages.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Halaman tidak ditemukan!' });

  pages[idx] = { ...pages[idx], ...req.body, id: pages[idx].id, updated_at: new Date().toISOString() };
  DB.savePages(pages);
  DB.addLog('activity', `Memperbarui halaman: ${pages[idx].title}`, 'Admin');

  res.json({ status: 'success', data: pages[idx] });
});

app.delete('/api/pages/:id', (req: Request, res: Response) => {
  let pages = DB.getPages();
  pages = pages.filter(p => p.id !== req.params.id);
  DB.savePages(pages);
  res.json({ status: 'success', message: 'Halaman berhasil dihapus.' });
});

// Settings API
app.get('/api/settings', (req: Request, res: Response) => {
  const settings = DB.getSettings();
  res.json({ data: settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const settings = DB.getSettings();
  const updated = { ...settings, ...req.body };
  DB.saveSettings(updated);
  DB.addLog('activity', 'Memperbarui Pengaturan Website', 'Admin');
  res.json({ status: 'success', data: updated });
});

// Media API (File Upload)
app.get('/api/media', (req: Request, res: Response) => {
  const media = DB.getMedia();
  res.json({ data: media });
});

app.post('/api/media/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada berkas yang diunggah!' });
  }

  const mediaList = DB.getMedia();
  const now = new Date();
  const folderPath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const fileUrl = `/uploads/${folderPath}/${req.file.filename}`;

  const newMedia: MediaFile = {
    id: 'med-' + Date.now(),
    filename: req.file.filename,
    original_name: req.file.originalname,
    url: fileUrl,
    mime_type: req.file.mimetype,
    size: req.file.size,
    uploaded_by: 'Admin',
    folder_path: folderPath,
    created_at: new Date().toISOString()
  };

  mediaList.unshift(newMedia);
  DB.saveMedia(mediaList);
  DB.addLog('activity', `Mengunggah berkas media: ${req.file.originalname}`, 'Admin');

  res.status(201).json({ status: 'success', data: newMedia });
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  let mediaList = DB.getMedia();
  const media = mediaList.find(m => m.id === req.params.id);

  if (media) {
    const filePath = path.join(process.cwd(), media.url);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { console.error(e); }
    }
    mediaList = mediaList.filter(m => m.id !== req.params.id);
    DB.saveMedia(mediaList);
    DB.addLog('activity', `Menghapus media berkas: ${media.filename}`, 'Admin');
  }

  res.json({ status: 'success', message: 'Berkas media berhasil dihapus.' });
});

// User Management API
app.get('/api/users', (req: Request, res: Response) => {
  const users = DB.getUsers();
  res.json({ data: users });
});

app.post('/api/users', (req: Request, res: Response) => {
  const users = DB.getUsers();
  const { username, email, name, role, avatar, bio } = req.body;

  if (!username || !email) return res.status(400).json({ error: 'Username dan email wajib diisi!' });

  const newUser: User = {
    id: 'usr-' + Date.now(),
    username,
    email,
    name: name || username,
    role: role || 'author',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: bio || '',
    created_at: new Date().toISOString(),
    status: 'active'
  };

  users.push(newUser);
  DB.saveUsers(users);
  DB.addLog('activity', `Menambah pengguna baru: ${name}`, 'Admin');

  res.status(201).json({ status: 'success', data: newUser });
});

// Logs API
app.get('/api/logs', (req: Request, res: Response) => {
  const logs = DB.getLogs();
  res.json({ data: logs });
});

// Cache Clear API
app.post('/api/cache/clear', (req: Request, res: Response) => {
  const ok = DB.clearCache();
  DB.addLog('activity', 'Membersihkan Flat-File Cache secara manual', 'Admin');
  res.json({ status: ok ? 'success' : 'error', message: 'Cache flat-file berhasil dibersihkan!' });
});

// Backup API
app.post('/api/backup/create', (req: Request, res: Response) => {
  const backup = {
    timestamp: new Date().toISOString(),
    settings: DB.getSettings(),
    users: DB.getUsers(),
    categories: DB.getCategories(),
    tags: DB.getTags(),
    posts: DB.getPosts(),
    pages: DB.getPages(),
    media: DB.getMedia()
  };

  DB.addLog('activity', 'Membuat Backup Database JSON Single-Click', 'Admin');
  res.json({ status: 'success', data: backup });
});

app.post('/api/backup/restore', (req: Request, res: Response) => {
  const { settings, users, categories, tags, posts, pages, media } = req.body;
  if (!posts || !categories) return res.status(400).json({ error: 'Struktur backup JSON tidak valid!' });

  if (settings) DB.saveSettings(settings);
  if (users) DB.saveUsers(users);
  if (categories) DB.saveCategories(categories);
  if (tags) DB.saveTags(tags);
  if (posts) DB.savePosts(posts);
  if (pages) DB.savePages(pages);
  if (media) DB.saveMedia(media);

  DB.addLog('activity', 'Melakukan Restore Database JSON', 'Admin');
  res.json({ status: 'success', message: 'Database JSON berhasil dipulihkan total!' });
});

// PHP Pure Source Code List API
app.get('/api/php-files', (req: Request, res: Response) => {
  res.json({ data: getPHPProjectFiles() });
});

// ==========================================
// EMBED ENDPOINTS (Supporting PHP style URL routes)
// ==========================================

const handleEmbedPosts = (req: Request, res: Response) => {
  const { limit, category, tag, q, format, sort } = req.query;

  let posts = DB.getPosts().filter(p => !p.is_deleted && p.status === 'publish');

  if (category) {
    const cats = DB.getCategories();
    const targetCat = cats.find(c => c.slug === category || c.id === category || c.name === category);
    if (targetCat) {
      posts = posts.filter(p => p.category_id === targetCat.id);
    } else {
      posts = posts.filter(p => p.category_name === category || p.category_id === category);
    }
  }

  if (tag) {
    posts = posts.filter(p => p.tags && p.tags.includes(tag as string));
  }

  if (q) {
    const query = (q as string).toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query));
  }

  if (sort === 'popular') {
    posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
  } else {
    posts.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
  }

  const limitNum = parseInt(limit as string) || 10;
  posts = posts.slice(0, limitNum);

  if (format === 'html' || req.path.endsWith('.php')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    let html = `<div class="cms-embed-container" style="font-family: system-ui, sans-serif; max-width: 100%; margin: 0 auto; box-sizing: border-box;">`;
    html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">`;

    posts.forEach(p => {
      html += `
        <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          ${p.featured_image ? `<img src="${p.featured_image}" alt="${p.title}" style="width:100%; height:160px; object-fit:cover;">` : ''}
          <div style="padding: 16px;">
            <span style="font-size: 11px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">${p.category_name || 'Berita'}</span>
            <h3 style="margin: 6px 0 8px 0; font-size: 16px; line-height: 1.4;"><a href="/embed/article.php?id=${p.slug}" style="color: #0f172a; text-decoration: none;">${p.title}</a></h3>
            <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.summary}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px;">
              <span>${p.author_name || 'Redaksi'}</span>
              <span>${p.reading_time_minutes} min baca</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    return res.send(html);
  }

  return res.json({ status: 'success', total: posts.length, data: posts });
};

app.get('/embed/posts.php', handleEmbedPosts);
app.get('/embed/posts', handleEmbedPosts);
app.get('/embed/latest.php', handleEmbedPosts);
app.get('/embed/latest', handleEmbedPosts);

app.get('/embed/popular.php', (req, res) => {
  req.query.sort = 'popular';
  handleEmbedPosts(req, res);
});
app.get('/embed/popular', (req, res) => {
  req.query.sort = 'popular';
  handleEmbedPosts(req, res);
});

app.get('/embed/search.php', handleEmbedPosts);
app.get('/embed/search', handleEmbedPosts);

// Single Article Embed
const handleEmbedArticle = (req: Request, res: Response) => {
  const id = (req.query.id || req.query.slug) as string;
  if (!id) return res.status(400).json({ error: 'Missing article ID or slug' });

  const posts = DB.getPosts();
  const post = posts.find(p => !p.is_deleted && (p.id === id || p.slug === id));

  if (!post) return res.status(404).send('<h2 style="font-family:sans-serif; text-align:center;">Artikel tidak ditemukan</h2>');

  // Increment view
  post.views_count = (post.views_count || 0) + 1;
  DB.savePosts(posts);

  if (req.query.format === 'json') {
    return res.json({ status: 'success', data: post });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${post.meta_title || post.title}</title>
      <meta name="description" content="${post.meta_description || post.summary}">
      <meta property="og:title" content="${post.title}">
      <meta property="og:image" content="${post.featured_image}">
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${post.title}",
        "image": "${post.featured_image}",
        "datePublished": "${post.publish_date}",
        "author": { "@type": "Person", "name": "${post.author_name || 'Redaksi'}" }
      }
      </script>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.7; background: #fff; }
        h1 { font-size: 28px; color: #0f172a; margin-bottom: 8px; line-height: 1.3; }
        .meta { font-size: 13px; color: #64748b; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; display: flex; gap: 16px; align-items: center; }
        .hero { width: 100%; max-height: 420px; object-fit: cover; border-radius: 12px; margin-bottom: 24px; }
        .content { font-size: 16px; color: #334155; }
        .content img { max-width: 100%; border-radius: 8px; }
        blockquote { border-left: 4px solid #3b82f6; margin: 20px 0; padding: 8px 16px; background: #f8fafc; font-style: italic; color: #475569; }
        pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <article>
        <h1>${post.title}</h1>
        <div class="meta">
          <span>Oleh <strong>${post.author_name || 'Redaksi'}</strong></span>
          <span>•</span>
          <span>${new Date(post.publish_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>•</span>
          <span>${post.reading_time_minutes} Menit Baca</span>
        </div>
        ${post.featured_image ? `<img class="hero" src="${post.featured_image}" alt="${post.title}" />` : ''}
        <div class="content">${post.content}</div>
      </article>
    </body>
    </html>
  `);
};

app.get('/embed/article.php', handleEmbedArticle);
app.get('/embed/post.php', handleEmbedArticle);
app.get('/embed/article', handleEmbedArticle);

// JS Embed Loader Widget
app.get('/embed/widget.js', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    (function() {
      var scripts = document.getElementsByTagName('script');
      var currentScript = scripts[scripts.length - 1];
      var type = currentScript.getAttribute('data-type') || 'latest';
      var limit = currentScript.getAttribute('data-limit') || '5';
      var containerId = currentScript.getAttribute('data-container') || 'cms-embed-root';
      
      var container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
      }
      
      var iframe = document.createElement('iframe');
      iframe.src = '/embed/posts.php?format=html&limit=' + limit + '&type=' + type;
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.minHeight = '400px';
      iframe.setAttribute('loading', 'lazy');
      container.appendChild(iframe);
    })();
  `);
});

// Sitemap & RSS
app.get(['/sitemap.xml', '/api/sitemap.xml'], (req: Request, res: Response) => {
  const posts = DB.getPosts().filter(p => !p.is_deleted && p.status === 'publish');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>https://${req.get('host')}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

  posts.forEach(p => {
    xml += `  <url><loc>https://${req.get('host')}/embed/article.php?id=${p.slug}</loc><lastmod>${p.update_date.split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  xml += `</urlset>`;
  res.send(xml);
});

app.get(['/rss.xml', '/api/rss.xml'], (req: Request, res: Response) => {
  const posts = DB.getPosts().filter(p => !p.is_deleted && p.status === 'publish').slice(0, 20);
  const settings = DB.getSettings();
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n`;
  xml += `  <title>${settings.site_name || 'Headless CMS'}</title>\n`;
  xml += `  <description>${settings.description || 'RSS Feed'}</description>\n`;
  xml += `  <link>https://${req.get('host')}</link>\n`;

  posts.forEach(p => {
    xml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <description><![CDATA[${p.summary}]]></description>\n    <link>https://${req.get('host')}/embed/article.php?id=${p.slug}</link>\n    <pubDate>${new Date(p.publish_date).toUTCString()}</pubDate>\n  </item>\n`;
  });

  xml += `</channel>\n</rss>`;
  res.send(xml);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const settings = DB.getSettings();
  res.setHeader('Content-Type', 'text/plain');
  res.send(settings.robots_txt || "User-agent: *\nAllow: /\nSitemap: /sitemap.xml");
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Headless CMS running on http://0.0.0.0:${PORT}`);
  });
}

start();
