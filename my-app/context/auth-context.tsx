"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  loggedIn: boolean;
  user: UserData | null;
  token: string | null;
  loginWithToken: (token: string) => Promise<void>;
  checkLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const checkLogin = async () => {
    try {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setLoggedIn(false);
        setUser(null);
        return;
      }

      const res = await fetch("/api/check-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: stored }),
      });

      const data = await res.json();
      if (data.loggedIn) {
        setLoggedIn(true);
        setUser({
          id: data.id,
          email: data.email,
          role: data.role,
        });
        setToken(stored);
      } else {
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const loginWithToken = async (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
    await checkLogin();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, token, loginWithToken, checkLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
