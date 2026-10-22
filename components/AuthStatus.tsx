"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "./AuthProvider";

export default function AuthStatus() {
  const { user, loading } = useAuth();

  // Reserve the space so the header doesn't jump once we know the state.
  if (loading) return <span className="inline-block h-9 w-20" aria-hidden />;

  if (!user) {
    return (
      <Link href="/login" className="btn btn-primary">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-40 truncate text-sm text-stone-600 sm:inline"
        title={user.email}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => createClient().auth.signOut()}
        className="btn"
      >
        Sign out
      </button>
    </div>
  );
}
