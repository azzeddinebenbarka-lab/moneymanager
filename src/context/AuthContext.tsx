// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, PasswordAuth } from '../services/auth/passwordAuth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isRegistered: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await PasswordAuth.getCurrentUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  const register = async (username: string, password: string) => {
    await PasswordAuth.register(username, password);
    const ok = await PasswordAuth.login(username, password);
    if (ok) setUser({ username });
  };

  const login = async (username: string, password: string) => {
    const ok = await PasswordAuth.login(username, password);
    if (ok) setUser({ username });
    return ok;
  };

  const logout = async () => {
    await PasswordAuth.logout();
    setUser(null);
  };

  const isRegistered = async () => PasswordAuth.isRegistered();

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isRegistered }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
