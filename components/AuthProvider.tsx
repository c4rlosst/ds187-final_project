"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AuthState = {
  user: User | null;
  /** True until the browser has reported whether someone is signed in. */
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ user: null, loading: true });

/**
 * Keeps track of who is signed in. The session lives in the browser and is
 * refreshed by the Supabase client, so pages never have to handle tokens.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const supabase = createClient();
    // Fires once straight away with the stored session, then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
