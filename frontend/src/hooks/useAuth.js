import { useAuthContext } from "@/context/AuthContext";

// Thin wrapper around the context so components can `useAuth()` directly.
export function useAuth() {
  return useAuthContext();
}
