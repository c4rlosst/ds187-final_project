/** Friendly messages for sign-in and sign-up errors. */
export function explainAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return "Incorrect email or password.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email first. Check your inbox for the confirmation link.";
  }
  if (/already registered|already been registered/i.test(message)) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (/rate limit|too many/i.test(message)) {
    return "Too many attempts. Please wait a bit and try again.";
  }
  if (/password.*(short|least|weak)|weak password/i.test(message)) {
    return "That password is too weak. Use at least 8 characters.";
  }
  if (/invalid.*email|unable to validate email/i.test(message)) {
    return "Please enter a valid email address.";
  }
  return explainSupabaseError(message);
}

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
