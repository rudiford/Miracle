import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    throwOnError: false,
  });

  // Don't log 401 errors as these are expected for unauthenticated users
  if (error && !error.message.includes('401')) {
    console.log('Auth error (non-401):', error);
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
