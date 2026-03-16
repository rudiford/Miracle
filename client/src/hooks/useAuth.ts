import { useEffect, useState } from "react";
import type { User } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [hasSession, setHasSession] = useState(false); // true = logged into Supabase, even if no profile yet
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
        fetchUser(session.access_token);
      } else {
        setHasSession(false);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setHasSession(true);
        fetchUser(session.access_token);
      } else {
        setHasSession(false);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUser(token: string) {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        // 404 = no profile yet (new user), that's fine
        setUser(null);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    user: user || null,
    isLoading,
    // isAuthenticated = has Supabase session (used for routing)
    isAuthenticated: hasSession,
    error,
  };
}
