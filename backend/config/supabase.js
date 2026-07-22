import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Support both SUPABASE_SERVICE_KEY and SUPABASE_KEY env var names
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl) {
  console.error('ERROR: Missing SUPABASE_URL environment variable.');
}
if (!supabaseKey) {
  console.error('ERROR: Missing SUPABASE_SERVICE_KEY environment variable.');
} else {
  console.log('Supabase connection configured successfully.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
