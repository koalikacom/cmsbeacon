export type ArticleStatus = 'draft' | 'publish' | 'private' | 'schedule';
export type VisibilityType = 'public' | 'private' | 'password';
export type UserRole = 'administrator' | 'editor' | 'author';

export interface PHPFileItem {
  path: string;
  category: string;
  description: string;
  code: string;
}

export interface ArticlePost {
  id: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  summary: string;
  content: string;
  featured_image: string;
  gallery: string[];
  tags: string[];
  category_id: string;
  category_name?: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  status: ArticleStatus;
  publish_date: string;
  update_date: string;
  scheduled_at?: string;
  seo_url?: string;
  canonical_url?: string;
  og_image?: string;
  reading_time_minutes: number;
  word_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  comments_enabled: boolean;
  visibility: VisibilityType;
  password?: string;
  views_count: number;
  is_deleted: boolean; // Trash management
  deleted_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  icon?: string;
  meta_description?: string;
  order: number;
  article_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: 'publish' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  address: string;
  email: string;
  phone: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    tiktok: string;
  };
  timezone: string;
  language: string;
  default_author: string;
  footer_text: string;
  google_analytics_id: string;
  google_search_console: string;
  google_adsense_id: string;
  verification_code: string;
  custom_header_script: string;
  custom_footer_script: string;
  robots_txt: string;
  api_secret_token: string;
  rate_limit_per_minute: number;
  auto_save_interval_sec: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  last_login?: string;
  created_at: string;
  status: 'active' | 'suspended';
}

export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number; // in bytes
  dimensions?: { width: number; height: number };
  uploaded_by: string;
  folder_path: string; // e.g. 2026/08
  created_at: string;
}

export interface ActivityLog {
  id: string;
  type: 'activity' | 'login' | 'error' | 'security';
  message: string;
  user_name: string;
  ip_address: string;
  user_agent?: string;
  timestamp: string;
}

export interface CMSStats {
  total_articles: number;
  total_categories: number;
  total_pages: number;
  total_users: number;
  total_views: number;
  total_media: number;
  recent_articles: ArticlePost[];
  popular_articles: ArticlePost[];
}

export interface EmbedConfig {
  endpoint: string;
  type: 'posts' | 'article' | 'category' | 'latest' | 'popular' | 'search' | 'tag' | 'page';
  format: 'json' | 'html' | 'js';
  limit: number;
  category_slug?: string;
  tag_slug?: string;
  search_query?: string;
  theme?: 'light' | 'dark';
}
