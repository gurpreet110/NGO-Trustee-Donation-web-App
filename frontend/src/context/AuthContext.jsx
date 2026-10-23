import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/api";
import { ROLES } from "@/utils";

const AuthContext = createContext(null);

const STORAGE_KEY = "ngo-auth-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    if (result) {
      setUser(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = async ({ name, email, password }) => {
    const result = await authApi.register({ name, email, password });
    if (result) {
      setUser(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      return { success: true };
    }
    return { success: false, error: "An account with this email already exists" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Convenience getters.
  const role = user?.role ?? ROLES.VISITOR;
  const isAuthenticated = !!user;

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
