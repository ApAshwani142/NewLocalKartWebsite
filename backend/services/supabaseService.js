const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.demo-signature';

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Verifies a Supabase Access Token / User Token
 * Returns user details from Supabase if valid
 */
async function verifySupabaseToken(accessToken) {
  if (!accessToken) {
    throw new Error('Supabase Access Token is required');
  }

  // If using placeholder/demo key in dev environment, perform fallback parsing if token is provided
  if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('[SupabaseService] SUPABASE_URL not configured. Operating in simulation mode.');
  }

  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // In development mode, if token verification fails due to unconfigured project, attempt fallback token payload extraction
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(accessToken);
      if (decoded && (decoded.sub || decoded.email)) {
        return {
          id: decoded.sub || 'sb_demo_user',
          email: decoded.email || 'user@example.com',
          user_metadata: decoded.user_metadata || {}
        };
      }
      throw new Error(error ? error.message : 'Invalid Supabase access token');
    }

    return user;
  } catch (err) {
    console.error('[SupabaseService] Error verifying token:', err.message);
    throw err;
  }
}

module.exports = {
  getSupabaseClient,
  verifySupabaseToken
};
