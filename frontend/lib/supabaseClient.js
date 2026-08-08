import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.demo-signature';

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo-project.supabase.co'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Sign up user with email and password via Supabase Auth
 */
export const supabaseSignUpWithEmail = async (email, password, userMetadata = {}) => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Sign in user with email and password via Supabase Auth
 */
export const supabaseSignInWithEmail = async (email, password) => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Sign out from Supabase Auth
 */
export const supabaseSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[Supabase] Sign out error:', error.message);
  }
};
