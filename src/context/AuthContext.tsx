"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string | null;
  token: string | null;
};

type AuthContextType = {
  user: User;
  login: (token: string, name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: null,
    token: null,
  });

  const router = useRouter();

  // Load user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && name) {
      setUser({ token, name });
    }
  }, []);

  const login = (token: string, name: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    setUser({ token, name });
    router.push("/chat");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUser({ token: null, name: null });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
