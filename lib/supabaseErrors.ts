/** Turns a raw Supabase/network error message into something actionable. */
export function explainSupabaseError(message: string): string {
  if (/fetch failed|failed to fetch|enotfound|network/i.test(message)) {
    return "Could not reach Supabase. Check that the project is not paused (free projects pause after a week of inactivity) and that NEXT_PUBLIC_SUPABASE_URL in .env.local is correct.";
  }
  if (/schema cache|does not exist/i.test(message)) {
    return "The database tables are missing. Run supabase/schema.sql, then supabase/seed.sql, in the Supabase SQL editor.";
  }
  return message;
}
