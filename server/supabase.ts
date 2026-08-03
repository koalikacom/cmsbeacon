import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false }
      });
      console.log('✅ Supabase client initialized successfully:', url);
    } catch (err) {
      console.error('❌ Failed to initialize Supabase client:', err);
    }
  } else {
    console.warn('⚠️ Supabase environment variables not found or invalid. URL:', url ? 'Set' : 'Missing');
  }

  return supabaseClient;
}

/**
 * Ensures table `cms_store` exists or can store JSON payload by key
 */
export async function syncToSupabase(key: string, data: any): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('cms_store')
      .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.warn(`[Supabase Sync Warning] Key "${key}":`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Sync Error] Key "${key}":`, err);
    return false;
  }
}

/**
 * Reads payload by key from Supabase `cms_store` table
 */
export async function fetchFromSupabase<T>(key: string): Promise<T | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('cms_store')
      .select('data')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Fetch Warning] Key "${key}":`, error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as T;
    }
  } catch (err) {
    console.error(`[Supabase Fetch Error] Key "${key}":`, err);
  }

  return null;
}
