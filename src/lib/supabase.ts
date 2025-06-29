import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Test connection function
export const testConnection = async () => {
  if (!supabase) {
    return { 
      connected: false, 
      error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.' 
    };
  }

  try {
    const { data, error } = await supabase.from('recipes').select('count').limit(1);
    if (error) throw error;
    return { connected: true, error: null };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
};