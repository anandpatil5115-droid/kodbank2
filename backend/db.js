import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    console.error('❌ CRITICAL ERROR: SUPABASE_URL is missing or invalid in environment variables.');
    console.error(`Current value: "${supabaseUrl}"`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
