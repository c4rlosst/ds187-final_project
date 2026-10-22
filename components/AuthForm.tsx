"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { explainAuthError } from "@/lib/supabaseErrors";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "./AuthProvider";

type Mode = "signin" | "signup";

export default function AuthForm({ next }: { next: string }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Once someone is signed in (just now, or already), leave the login page.
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setError(null);
    setNotice(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const credentials = { email: email.trim(), password };

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) setError(explainAuthError(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({
        ...credentials,
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });
      if (error) {
        setError(explainAuthError(error.message));
      } else if (!data.session) {
        // The project requires email confirmation before the first sign-in.
        setNotice(
          "Account created. Check your email for a confirmation link, then sign in.",
        );
      }
    }

    setBusy(false);
  }

  const signingUp = mode === "signup";

  return (
    <form onSubmit={submit} className="card flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">
        {signingUp ? "Create an account" : "Sign in"}
      </h1>

      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="input font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={signingUp ? "new-password" : "current-password"}
          minLength={8}
          required
          className="input font-normal"
        />
        {signingUp && (
          <span className="text-xs font-normal text-stone-500">
            At least 8 characters.
          </span>
        )}
      </label>

      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          {notice}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary">
        {busy
          ? signingUp
            ? "Creating account..."
            : "Signing in..."
          : signingUp
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-sm text-stone-600">
        {signingUp ? "Already have an account? " : "New here? "}
        <button
          type="button"
          onClick={() => switchMode(signingUp ? "signin" : "signup")}
          className="link"
        >
          {signingUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}
