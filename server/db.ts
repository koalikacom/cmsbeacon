import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  ArticlePost,
  Category,
  Tag,
  StaticPage,
  SiteSettings,
  User,
  MediaFile,
  ActivityLog
} from '../src/types.js';

const PROJECT_DATA_DIR = path.join(process.cwd(), 'data');
const DATA_DIR = PROJECT_DATA_DIR;
const TMP_DATA_DIR = path.join(os.tmpdir(), 'cms_data');
const CACHE_DIR = path.join(TMP_DATA_DIR, 'cache');

// In-Memory store cache for serverless read-only environments (e.g. Vercel)
const inMemoryCache: Record<string, any> = {};

// Ensure directories exist safely
function ensureDirs() {
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore
  }

  try {
    if (!fs.existsSync(PROJECT_DATA_DIR)) {
      fs.mkdirSync(PROJECT_DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore read-only filesystem errors (Vercel)
  }
}

function readJSON<T>(filename: string, defaultValue: T): T {
  ensureDirs();

  // 1. Check in-memory cache first if already loaded
  if (inMemoryCache[filename] !== undefined) {
    return inMemoryCache[filename] as T;
  }

  // 2. Check /tmp/cms_data/
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  if (fs.existsSync(tmpPath)) {
    try {
      const content = fs.readFileSync(tmpPath, 'utf-8');
      const data = JSON.parse(content) as T;
      inMemoryCache[filename] = data;
      return data;
    } catch (err) {
      console.error(`Error reading /tmp/${filename}:`, err);
    }
  }

  // 3. Check project data directory
  const projectPath = path.join(PROJECT_DATA_DIR, filename);
  if (fs.existsSync(projectPath)) {
    try {
      const content = fs.readFileSync(projectPath, 'utf-8');
      const data = JSON.parse(content) as T;
      inMemoryCache[filename] = data;
      return data;
    } catch (err) {
      console.error(`Error reading ${filename}:`, err);
    }
  }

  inMemoryCache[filename] = defaultValue;
  return defaultValue;
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDirs();
  inMemoryCache[filename] = data;

  // Try writing to /tmp/cms_data/ (always writable on Vercel/serverless)
  try {
    const tmpPath = path.join(TMP_DATA_DIR, filename);
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to write to /tmp/${filename}:`, err);
  }

  // Try writing to project data directory (for local development persistence)
  try {
    const projectPath = path.join(PROJECT_DATA_DIR, filename);
    const tempPath = `${projectPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, projectPath);
  } catch {
    // Read-only filesystem on Vercel - safely ignored as data is saved in memory & /tmp
  }
}

// Initial Seed Data Generator
export function initSeedData() {
  ensureDirs();

  // Settings
  const settingsFile = path.join(DATA_DIR, 'settings.json');
  if (!fs.existsSync(settingsFile)) {
    const defaultSettings: SiteSettings = {
      site_name: 'Portal Berita & Wawasan Teknologi',
      tagline: 'Headless CMS Artikel Indonesia Modern & Cepat',
      description: 'Platform manajemen konten artikel headless flat-file tanpa database SQL.',
      logo: '/assets/logo.svg',
      favicon: '/assets/favicon.ico',
      address: 'Jl. Jenderal Sudirman No. 88, Jakarta Selatan, Indonesia',
      email: 'redaksi@portalberita.id',
      phone: '+62 812 3456 7890',
      socials: {
        facebook: 'https://facebook.com/portalberita',
        instagram: 'https://instagram.com/portalberita',
        twitter: 'https://twitter.com/portalberita',
        youtube: 'https://youtube.com/portalberita',
        linkedin: 'https://linkedin.com/company/portalberita',
        tiktok: 'https://tiktok.com/@portalberita'
      },
      timezone: 'Asia/Jakarta',
      language: 'id',
      default_author: 'Redaksi Utama',
      footer_text: '© 2026 Portal Berita. Powered by Headless Article CMS.',
      google_analytics_id: 'G-MEASUREMENT_ID',
      google_search_console: 'google-site-verification=XYZ123ABC',
      google_adsense_id: 'ca-pub-1234567890123456',
      verification_code: 'VERIFICATION_HASH_CODE_2026',
      custom_header_script: '<!-- Custom Header Meta / Scripts -->',
      custom_footer_script: '<!-- Custom Footer Analytics / Widgets -->',
      robots_txt: "User-agent: *\nAllow: /\nSitemap: /api/sitemap.xml",
      api_secret_token: 'cms_bearer_sec_key_998877665544332211',
      rate_limit_per_minute: 60,
      auto_save_interval_sec: 30
    };
    writeJSON('settings.json', defaultSettings);
  }

  // Users
  const usersFile = path.join(DATA_DIR, 'users.json');
  if (!fs.existsSync(usersFile)) {
    const defaultUsers: User[] = [
      {
        id: 'usr-1',
        username: 'admin',
        email: 'admin@portalberita.id',
        name: 'Super Administrator',
        role: 'administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Senior Content Architect & System Administrator.',
        created_at: new Date().toISOString(),
        status: 'active',
        last_login: new Date().toISOString()
      },
      {
        id: 'usr-2',
        username: 'editor_budi',
        email: 'budi@portalberita.id',
        name: 'Budi Santoso',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Chief Editor Teknologi & AI.',
        created_at: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'usr-3',
        username: 'author_siti',
        email: 'siti@portalberita.id',
        name: 'Siti Rahma',
        role: 'author',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Penulis Spesialis Cyber Security & Software Engineering.',
        created_at: new Date().toISOString(),
        status: 'active'
      }
    ];
    writeJSON('users.json', defaultUsers);
  }

  // Categories
  const catFile = path.join(DATA_DIR, 'categories.json');
  if (!fs.existsSync(catFile)) {
    const defaultCategories: Category[] = [
      {
        id: 'cat-1',
        name: 'Teknologi',
        slug: 'teknologi',
        description: 'Berita dan tren teknologi terkini di Indonesia dan mancanegara.',
        parent_id: null,
        icon: 'Cpu',
        meta_description: 'Kumpulan artikel teknologi terbaru.',
        order: 1
      },
      {
        id: 'cat-2',
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'Perkembangan kecerdasan buatan, LLM, dan machine learning.',
        parent_id: 'cat-1',
        icon: 'Bot',
        meta_description: 'Artikel seputar AI dan Machine Learning.',
        order: 2
      },
      {
        id: 'cat-3',
        name: 'Cyber Security',
        slug: 'cyber-security',
        description: 'Panduan keamanan siber, enkripsi, dan privasi data.',
        parent_id: 'cat-1',
        icon: 'ShieldCheck',
        meta_description: 'Edukasi dan riset keamanan siber.',
        order: 3
      },
      {
        id: 'cat-4',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Tutorial PHP, JavaScript, Flat-file CMS, dan arsitektur web modern.',
        parent_id: null,
        icon: 'Code',
        meta_description: 'Tutorial dan wawasan pengembangan web modern.',
        order: 4
      }
    ];
    writeJSON('categories.json', defaultCategories);
  }

  // Tags
  const tagFile = path.join(DATA_DIR, 'tags.json');
  if (!fs.existsSync(tagFile)) {
    const defaultTags: Tag[] = [
      { id: 'tag-1', name: 'AI & Generative Tech', slug: 'ai-generative-tech', count: 3 },
      { id: 'tag-2', name: 'PHP 8', slug: 'php-8', count: 2 },
      { id: 'tag-3', name: 'JSON Flat File', slug: 'json-flat-file', count: 2 },
      { id: 'tag-4', name: 'Security & CSRF', slug: 'security-csrf', count: 2 },
      { id: 'tag-5', name: 'REST API', slug: 'rest-api', count: 3 }
    ];
    writeJSON('tags.json', defaultTags);
  }

  // Articles
  const postsFile = path.join(DATA_DIR, 'posts.json');
  if (!fs.existsSync(postsFile)) {
    const defaultPosts: ArticlePost[] = [
      {
        id: 'post-101',
        title: 'Membangun Arsitektur Headless CMS Tanpa Database SQL Menggunakan JSON Flat-File',
        slug: 'membangun-arsitektur-headless-cms-tanpa-database-sql',
        meta_title: 'Arsitektur Headless CMS Flat-File JSON Berkecepatan Tinggi',
        meta_description: 'Panduan mendalam cara membuat CMS Artikel headless modern tanpa MySQL, menggunakan flat-file JSON storage yang aman, cepat, dan mudah di-embed.',
        focus_keyword: 'headless cms json',
        summary: 'Headless CMS dengan penyimpan data JSON flat-file memberikan performa tinggi, kemudahan migrasi tanpa ketergantungan database relational SQL.',
        content: `
<h2>Mengapa Memilih Headless CMS Flat-File?</h2>
<p>Dalam lanskap pengembang web modern, kecepatan dan fleksibilitas arsitektur adalah prioritas utama. Menggunakan database relational tradisional seperti MySQL seringkali menambah overhead perawatan server dan kerentanan SQL Injection jika tidak dikelola dengan benar.</p>
<p>Dengan menerapkan <strong>Flat-File JSON Database</strong>, seluruh data disimpan secara terstruktur dalam berkas JSON lokal. Pendekatan ini menawarkan beberapa keunggulan mutlak:</p>
<ul>
  <li><strong>Portabilitas Maksimal:</strong> Backup dan restore hanya memerlukan penyalinan berkas JSON.</li>
  <li><strong>Performa Ekstrem:</strong> Dibantu oleh sistem caching flat-file, waktu respon API berada di bawah 15ms.</li>
  <li><strong>Zero SQL Injection:</strong> Karena tidak ada engine database SQL, serangan SQL Injection 100% tereliminasi.</li>
</ul>
<blockquote>"Arsitektur terpisah (headless) memberikan kebebasan bagi pengembang untuk mendesain tampilan di platform manapun — baik website HTML static, mobile app, maupun IoT."</blockquote>
<h3>Contoh Penggunaan Embed & Rest API</h3>
<p>Anda dapat mengintegrasikan artikel ini ke website apapun cukup dengan script embed sederhana:</p>
<pre><code>&lt;iframe src="https://cms-domain.com/embed/article.php?id=membangun-arsitektur-headless-cms-tanpa-database-sql" width="100%" height="600" frameborder="0"&gt;&lt;/iframe&gt;</code></pre>
        `,
        featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000',
        gallery: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'
        ],
        tags: ['JSON Flat File', 'PHP 8', 'REST API'],
        category_id: 'cat-4',
        category_name: 'Web Development',
        author_id: 'usr-1',
        author_name: 'Super Administrator',
        author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: 'publish',
        publish_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        update_date: new Date().toISOString(),
        reading_time_minutes: 4,
        word_count: 320,
        is_featured: true,
        is_pinned: true,
        comments_enabled: true,
        visibility: 'public',
        views_count: 1420,
        is_deleted: false
      },
      {
        id: 'post-102',
        title: 'Tren Keamanan Siber 2026: Strategi Proteksi XSS, CSRF, dan Rate Limiting pada CMS',
        slug: 'tren-keamanan-siber-2026-proteksi-xss-csrf-rate-limiting',
        meta_title: 'Strategi Cyber Security 2026 untuk Pengamanan Panel Administrasi CMS',
        meta_description: 'Pelajari implementasi pertahanan berlapis untuk proteksi Cross-Site Scripting (XSS), CSRF Token, Sanitasi Input, dan Rate Limiting login.',
        focus_keyword: 'keamanan cms 2026',
        summary: 'Keamanan panel admin CMS memerlukan pengerasan sistem otomatis mulai dari token anti-CSRF, pembersihan XSS, hingga proteksi serangan Brute-Force.',
        content: `
<h2>Prinsip Utama Defense-in-Depth pada Panel CMS</h2>
<p>Panel administrasi merupakan sasaran utama peretas. Oleh karena itu, pengerasan sistem (security hardening) wajib diimplementasikan sejak tahap arsitektur awal.</p>
<h3>1. Proteksi CSRF (Cross-Site Request Forgery)</h3>
<p>Setiap form mutasi data (Create, Update, Delete) menyertakan token unik per sesi yang divalidasi ketat pada backend:</p>
<pre><code>$csrf_token = bin2hex(random_bytes(32));</code></pre>
<h3>2. Rate Limiting &amp; Anti Brute Force</h3>
<p>Membatasi batas percobaan login maksimal 5 kali per 15 menit per IP address untuk mencegah serangan Automated Password Guessing.</p>
        `,
        featured_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000',
        gallery: [],
        tags: ['Security & CSRF', 'REST API'],
        category_id: 'cat-3',
        category_name: 'Cyber Security',
        author_id: 'usr-3',
        author_name: 'Siti Rahma',
        author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        status: 'publish',
        publish_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        update_date: new Date().toISOString(),
        reading_time_minutes: 3,
        word_count: 240,
        is_featured: false,
        is_pinned: false,
        comments_enabled: true,
        visibility: 'public',
        views_count: 890,
        is_deleted: false
      },
      {
        id: 'post-103',
        title: 'Revolusi Kecerdasan Buatan Generatif dalam Manajemen Konten Digital',
        slug: 'revolusi-kecerdasan-buatan-generatif-manajemen-konten',
        meta_title: 'Pemanfaatan Generative AI dalam Otomasi Editorial CMS',
        meta_description: 'Bagaimana integrasi kecerdasan buatan membantu generasi ringkasan otomatis, saran kata kunci SEO, dan optimasi artikel.',
        focus_keyword: 'ai generasi konten',
        summary: 'Eksplorasi integrasi fitur kecerdasan buatan dalam mendukung editor berita menghasilkan konten terstruktur dan ramah mesin pencari.',
        content: `
<h2>Peran AI dalam Ekosistem Redaksi Modern</h2>
<p>Kecerdasan buatan tidak menggantikan penulis manusia, melainkan menjadi asisten cerdas dalam menganalisis keterbacaan, menyuguhkan rangkuman singkat, dan memverifikasi kata kunci SEO secara otomatis.</p>
        `,
        featured_image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000',
        gallery: [],
        tags: ['AI & Generative Tech'],
        category_id: 'cat-2',
        category_name: 'Artificial Intelligence',
        author_id: 'usr-2',
        author_name: 'Budi Santoso',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        status: 'publish',
        publish_date: new Date(Date.now() - 86400000 * 10).toISOString(),
        update_date: new Date().toISOString(),
        reading_time_minutes: 2,
        word_count: 180,
        is_featured: true,
        is_pinned: false,
        comments_enabled: true,
        visibility: 'public',
        views_count: 2310,
        is_deleted: false
      }
    ];
    writeJSON('posts.json', defaultPosts);
  }

  // Static Pages
  const pagesFile = path.join(DATA_DIR, 'pages.json');
  if (!fs.existsSync(pagesFile)) {
    const defaultPages: StaticPage[] = [
      {
        id: 'page-1',
        title: 'Tentang Kami',
        slug: 'tentang-kami',
        content: '<h2>Profil Redaksi</h2><p>Kami adalah penyedia solusi konten berita dan informasi berbasis arsitektur headless CMS modern.</p>',
        meta_title: 'Tentang Kami - Portal Berita',
        meta_description: 'Informasi latar belakang dan visi misi portal berita headless kami.',
        status: 'publish',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'page-2',
        title: 'Kebijakan Privasi',
        slug: 'kebijakan-privasi',
        content: '<h2>Kebijakan Privasi Data</h2><p>Halaman ini menjelaskan komitmen kami menjaga privasi pengunjung dan perlindungan data pribadi.</p>',
        meta_title: 'Kebijakan Privasi - Protection Statement',
        meta_description: 'Pernyataan resmi perlindungan data privasi pengguna.',
        status: 'publish',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'page-3',
        title: 'Kontak Redaksi',
        slug: 'kontak-redaksi',
        content: '<h2>Hubungi Tim Redaksi</h2><p>Kirimkan masukan, siaran pers, atau pertanyaan kerjasama ke email: redaksi@portalberita.id</p>',
        meta_title: 'Kontak Redaksi - Alamat & Email',
        meta_description: 'Formulir kontak dan info layanan redaksi kami.',
        status: 'publish',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    writeJSON('pages.json', defaultPages);
  }

  // Logs
  const logsFile = path.join(DATA_DIR, 'logs.json');
  if (!fs.existsSync(logsFile)) {
    const defaultLogs: ActivityLog[] = [
      {
        id: 'log-1',
        type: 'activity',
        message: 'Inisialisasi sistem database Flat-File JSON berhasil.',
        user_name: 'System Engine',
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString()
      },
      {
        id: 'log-2',
        type: 'login',
        message: 'Pengguna admin berhasil masuk ke panel kontrol.',
        user_name: 'admin',
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString()
      }
    ];
    writeJSON('logs.json', defaultLogs);
  }

  // Media
  const mediaFile = path.join(DATA_DIR, 'media.json');
  if (!fs.existsSync(mediaFile)) {
    writeJSON('media.json', []);
  }
}

// Data Access Object Methods
export const DB = {
  getPosts(): ArticlePost[] {
    return readJSON<ArticlePost[]>('posts.json', []);
  },
  savePosts(posts: ArticlePost[]): void {
    writeJSON('posts.json', posts);
  },
  getCategories(): Category[] {
    return readJSON<Category[]>('categories.json', []);
  },
  saveCategories(cats: Category[]): void {
    writeJSON('categories.json', cats);
  },
  getTags(): Tag[] {
    return readJSON<Tag[]>('tags.json', []);
  },
  saveTags(tags: Tag[]): void {
    writeJSON('tags.json', tags);
  },
  getPages(): StaticPage[] {
    return readJSON<StaticPage[]>('pages.json', []);
  },
  savePages(pages: StaticPage[]): void {
    writeJSON('pages.json', pages);
  },
  getSettings(): SiteSettings {
    return readJSON<SiteSettings>('settings.json', {} as SiteSettings);
  },
  saveSettings(settings: SiteSettings): void {
    writeJSON('settings.json', settings);
  },
  getUsers(): User[] {
    return readJSON<User[]>('users.json', []);
  },
  saveUsers(users: User[]): void {
    writeJSON('users.json', users);
  },
  getMedia(): MediaFile[] {
    return readJSON<MediaFile[]>('media.json', []);
  },
  saveMedia(media: MediaFile[]): void {
    writeJSON('media.json', media);
  },
  getLogs(): ActivityLog[] {
    return readJSON<ActivityLog[]>('logs.json', []);
  },
  addLog(type: ActivityLog['type'], message: string, userName = 'Guest', ip = '127.0.0.1') {
    const logs = readJSON<ActivityLog[]>('logs.json', []);
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      message,
      user_name: userName,
      ip_address: ip,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep last 200 logs
    if (logs.length > 200) logs.pop();
    writeJSON('logs.json', logs);
  },
  clearCache(): boolean {
    ensureDirs();
    try {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach((file) => fs.unlinkSync(path.join(CACHE_DIR, file)));
      return true;
    } catch {
      return false;
    }
  }
};
