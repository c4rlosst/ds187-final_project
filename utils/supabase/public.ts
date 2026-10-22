import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less client for public, server-side reads (recipes, places).
 * It never reads or refreshes the visitor's login session, so rendering a
 * page can't rotate or invalidate it. Logging in and out happens in the browser
 * through utils/supabase/client.ts.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
