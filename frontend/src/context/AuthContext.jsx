import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/api";
import { ROLES } from "@/utils";

const AuthContext = createContext(null);

const STORAGE_KEY = "ngo-auth-user";
const TOKEN_KEY = "ngo-token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = String(email ?? "").trim();
    const normalizedPassword = String(password ?? "");

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, error: "Email and password are required." };
    }

    try {
      const result = await authApi.login(normalizedEmail, normalizedPassword);
      if (result?.token && result.user) {
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: "Invalid email or password" };
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      const validationMessage = error?.response?.data?.errors?.[0]?.message;
      const message =
        responseMessage === "Validation failed" && validationMessage
          ? validationMessage
          : responseMessage || "Invalid email or password";
      return { success: false, error: message };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const result = await authApi.register({ name, email, password });
      if (result?.token && result.user) {
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: "An account with this email already exists" };
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to create account";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

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
