import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          console.error('Auth fetch failed:', res.status, res.statusText);
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        const userData = await res.json();
        console.log('Auth data received:', userData);
        return userData;
      } catch (err) {
        console.error('Auth query error:', err);
        throw err;
      }
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
