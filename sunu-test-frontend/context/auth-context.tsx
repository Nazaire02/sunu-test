"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getTokens, clearTokens } from "@/lib/auth";
import { isTokenExpired } from "@/lib/jwt";
import { refreshAccessToken } from "@/features/auth/services/auth-services";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const tokens = getTokens();
    if (!tokens?.access) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(tokens.access)) {
      const refreshed = await refreshAccessToken();
      setIsAuthenticated(refreshed);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};