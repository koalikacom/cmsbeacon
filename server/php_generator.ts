export interface PHPFileItem {
  path: string;
  filename: string;
  category: string;
  description: string;
  code: string;
}

export function getPHPProjectFiles(): PHPFileItem[] {
  return [
    {
      path: 'config/config.php',
      filename: 'config.php',
      category: 'Configuration',
      description: 'Central configuration file for website metadata, paths, and security tokens.',
      code: `<?php
/**
 * Headless Article CMS - Central Config
 * PHP 8+ Flat-File Architecture
 */

define('APP_NAME', 'Portal Berita & Wawasan Teknologi');
define('APP_VERSION', '1.0.0');
define('BASE_URL', (isset($_SERVER['HTTPS']) ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost'));

define('DIR_DATA', __DIR__ . '/../data');
define('DIR_UPLOADS', __DIR__ . '/../uploads');
define('DIR_CACHE', __DIR__ . '/../cache');
define('DIR_LOGS', __DIR__ . '/../logs');

define('API_SECRET_TOKEN', 'cms_bearer_sec_key_998877665544332211');
define('TIMEZONE', 'Asia/Jakarta');
date_default_timezone_set(TIMEZONE);

// Helper for loading JSON Flat-File
function json_read(string $filename, $default = []) {
    $path = DIR_DATA . '/' . $filename;
    if (!file_exists($path)) {
        return $default;
    }
    $json = file_get_contents($path);
    return json_decode($json, true) ?? $default;
}

function json_write(string $filename, $data): bool {
    if (!is_dir(DIR_DATA)) {
        mkdir(DIR_DATA, 0755, true);
    }
    $path = DIR_DATA . '/' . $filename;
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}
`
    },
    {
      path: 'config/security.php',
      filename: 'security.php',
      category: 'Security Engine',
      description: 'CSRF token protection, input sanitization, rate limiting, and security headers.',
      code: `<?php
/**
 * Headless Article CMS - Security Module
 * Cross-Site Scripting (XSS), CSRF, Rate Limiting & Path Traversal Shields
 */

// Set Hardened HTTP Headers
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("X-Frame-Options: SAMEORIGIN");
header("Referrer-Policy: strict-origin-when-cross-origin");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// CSRF Protection
function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// XSS Escaping Helper
function escape(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Sanitization for File Uploads & Path Traversal
function sanitize_filename(string $filename): string {
    $filename = basename($filename);
    return preg_replace('/[^a-zA-Z0-9_\\.-]/', '', $filename);
}

// Rate Limiter Helper for API / Login
function check_rate_limit(string $ip, int $max_attempts = 10, int $window_seconds = 60): bool {
    $cache_file = DIR_CACHE . '/rate_' . md5($ip) . '.json';
    $now = time();
    $attempts = [];
    
    if (file_exists($cache_file)) {
        $attempts = json_decode(file_get_contents($cache_file), true) ?? [];
        $attempts = array_filter($attempts, fn($t) => ($now - $t) < $window_seconds);
    }
    
    if (count($attempts) >= $max_attempts) {
        return false;
    }
    
    $attempts[] = $now;
    if (!is_dir(DIR_CACHE)) mkdir(DIR_CACHE, 0755, true);
    file_put_contents($cache_file, json_encode($attempts));
    return true;
}
`
    },
    {
      path: 'embed/posts.php',
      filename: 'posts.php',
      category: 'Embed Engine',
      description: 'Embed endpoint for fetching articles list in JSON or rendered HTML cards.',
      code: `<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/security.php';

header('Access-Control-Allow-Origin: *');

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$cat = $_GET['category'] ?? null;
$tag = $_GET['tag'] ?? null;
$search = $_GET['q'] ?? null;
$format = $_GET['format'] ?? 'json'; // 'json' or 'html'

$posts = json_read('posts.json', []);

// Filter Published & Non-Deleted
$filtered = array_filter($posts, function($p) use ($cat, $tag, $search) {
    if ($p['is_deleted'] || $p['status'] !== 'publish') return false;
    if ($cat && ($p['category_slug'] ?? '') !== $cat) return false;
    if ($tag && !in_array($tag, $p['tags'] ?? [])) return false;
    if ($search && stripos($p['title'], $search) === false && stripos($p['summary'], $search) === false) return false;
    return true;
});

$filtered = array_slice(array_values($filtered), 0, $limit);

if ($format === 'html') {
    header('Content-Type: text/html; charset=utf-8');
    echo '<div class="cms-embed-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; font-family: sans-serif;">';
    foreach ($filtered as $post) {
        echo '<article style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff;">';
        if (!empty($post['featured_image'])) {
            echo '<img src="' . escape($post['featured_image']) . '" alt="' . escape($post['title']) . '" style="width:100%; height:160px; object-fit:cover;">';
        }
        echo '<div style="padding: 12px;">';
        echo '<h3 style="margin: 0 0 8px 0; font-size: 16px;"><a href="' . BASE_URL . '/embed/article.php?id=' . $post['slug'] . '" style="color:#1e293b; text-decoration:none;">' . escape($post['title']) . '</a></h3>';
        echo '<p style="font-size: 13px; color: #64748b; line-height: 1.4; margin: 0 0 8px 0;">' . escape($post['summary']) . '</p>';
        echo '<span style="font-size: 11px; color:#94a3b8;">' . date('d M Y', strtotime($post['publish_date'])) . ' • ' . $post['reading_time_minutes'] . ' min read</span>';
        echo '</div></article>';
    }
    echo '</div>';
    exit;
}

header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'total' => count($filtered),
    'data' => $filtered
]);
`
    },
    {
      path: 'embed/article.php',
      filename: 'article.php',
      category: 'Embed Engine',
      description: 'Embed endpoint for single article view with JSON-LD schema, OG tags, and HTML view.',
      code: `<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/security.php';

header('Access-Control-Allow-Origin: *');

$id = $_GET['id'] ?? $_GET['slug'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing post ID or slug parameter']);
    exit;
}

$posts = json_read('posts.json', []);
$found = null;

foreach ($posts as $p) {
    if (!$p['is_deleted'] && ($p['id'] === $id || $p['slug'] === $id)) {
        $found = $p;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Article not found']);
    exit;
}

$format = $_GET['format'] ?? 'html';

if ($format === 'json') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $found]);
    exit;
}

// Render Standalone Embed HTML Card / Page
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= escape($found['meta_title'] ?: $found['title']) ?></title>
    <meta name="description" content="<?= escape($found['meta_description'] ?: $found['summary']) ?>">
    <meta property="og:title" content="<?= escape($found['title']) ?>">
    <meta property="og:image" content="<?= escape($found['featured_image']) ?>">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "<?= addslashes($found['title']) ?>",
      "image": "<?= escape($found['featured_image']) ?>",
      "datePublished": "<?= $found['publish_date'] ?>"
    }
    </script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; background: #fff; color: #1f2937; line-height: 1.6; }
        .article-title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .article-meta { font-size: 13px; color: #6b7280; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        .featured-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 16px; }
    </style>
</head>
<body>
    <article>
        <h1 class="article-title"><?= escape($found['title']) ?></h1>
        <div class="article-meta">
            Oleh <?= escape($found['author_name'] ?? 'Redaksi') ?> • <?= date('d M Y', strtotime($found['publish_date'])) ?> • <?= $found['reading_time_minutes'] ?> Menit Baca
        </div>
        <?php if (!empty($found['featured_image'])): ?>
            <img class="featured-img" src="<?= escape($found['featured_image']) ?>" alt="<?= escape($found['title']) ?>">
        <?php endif; ?>
        <div class="content">
            <?= $found['content'] ?>
        </div>
    </article>
</body>
</html>
`
    },
    {
      path: 'api/posts.php',
      filename: 'posts.php',
      category: 'REST API',
      description: 'RESTful API for CRUD operations on Articles with Bearer Authentication token check.',
      code: `<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/security.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Bearer Token Auth Check for Mutations
$headers = getallheaders();
$auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = str_replace('Bearer ', '', $auth);

$method = $_SERVER['REQUEST_METHOD'];
$posts = json_read('posts.json', []);

if ($method === 'GET') {
    echo json_encode(['status' => 'success', 'data' => array_values($posts)]);
    exit;
}

if ($token !== API_SECRET_TOKEN) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized Bearer Token']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $newPost = [
        'id' => 'post-' . time(),
        'title' => escape($input['title'] ?? 'Untitled'),
        'slug' => escape($input['slug'] ?? 'post-' . time()),
        'content' => $input['content'] ?? '',
        'summary' => escape($input['summary'] ?? ''),
        'status' => $input['status'] ?? 'draft',
        'publish_date' => date('c'),
        'update_date' => date('c'),
        'views_count' => 0,
        'is_deleted' => false
    ];
    $posts[] = $newPost;
    json_write('posts.json', $posts);
    echo json_encode(['status' => 'success', 'data' => $newPost]);
    exit;
}
`
    },
    {
      path: 'sitemap.php',
      filename: 'sitemap.php',
      category: 'SEO Automation',
      description: 'Automatic XML Sitemap generator for search engine crawlers.',
      code: `<?php
require_once __DIR__ . '/config/config.php';

header('Content-Type: application/xml; charset=utf-8');
$posts = json_read('posts.json', []);

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc><?= BASE_URL ?></loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
<?php foreach ($posts as $p): if (!$p['is_deleted'] && $p['status'] === 'publish'): ?>
    <url>
        <loc><?= BASE_URL ?>/embed/article.php?id=<?= $p['slug'] ?></loc>
        <lastmod><?= date('Y-m-d', strtotime($p['update_date'])) ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
<?php endif; endforeach; ?>
</urlset>
`
    }
  ];
}
