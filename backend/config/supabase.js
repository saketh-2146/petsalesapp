import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
// Fallback to SUPABASE_SERVICE_KEY if SUPABASE_SERVICE_ROLE_KEY is missing
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

console.log('=== Supabase Configuration Check ===');
console.log('SUPABASE_URL loaded:', !!supabaseUrl, supabaseUrl ? `(Starts with ${supabaseUrl.substring(0, 15)}...)` : '❌ MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY loaded:', !!supabaseServiceRoleKey, supabaseServiceRoleKey && supabaseServiceRoleKey !== 'YOUR_SERVICE_ROLE_KEY_HERE' ? `(Starts with ${supabaseServiceRoleKey.substring(0, 5)}...)` : '❌ MISSING OR PLACEHOLDER');
console.log('SUPABASE_ANON_KEY loaded:', !!supabaseAnonKey, supabaseAnonKey ? `(Starts with ${supabaseAnonKey.substring(0, 5)}...)` : '❌ MISSING');
console.log('====================================');

// Validate required environment variables
if (!supabaseUrl) {
  console.error('FATAL: Missing SUPABASE_URL environment variable.');
}
if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is missing or placeholder. Server-side operations requiring admin privileges will fail. Get it from Supabase Dashboard → Settings → API.');
}
if (!supabaseAnonKey) {
  console.warn('WARNING: Missing SUPABASE_ANON_KEY environment variable.');
}

/**
 * Admin client — uses Service Role Key.
 * Bypasses RLS. Use ONLY for server-side privileged operations
 * (e.g., creating users, admin queries, storage uploads on behalf of users).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Anon client — uses Anon Key.
 * Respects RLS. Use for operations that should follow normal user permissions.
 */
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Legacy export for backwards compatibility — maps to admin client
// so existing controllers that import { supabase } still work
export const supabase = supabaseAdmin;

console.log('Supabase clients initialized successfully.');
