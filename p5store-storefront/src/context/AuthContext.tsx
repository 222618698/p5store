import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '@/api/auth';
import { clearToken, getToken, setToken } from '@/api/client';
import type { AuthResponse, RegisterRequest, UserRole } from '@/types';

interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'p5store_customer_user';

function loadStoredUser(): AuthUser | null {
  const token = getToken();
  const raw = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const persist = (res: AuthResponse) => {
    setToken(res.token);
    const nextUser: AuthUser = { userId: res.userId, email: res.email, role: res.role };
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    persist(res);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await authApi.register(payload);
    persist(res);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Fired by the API client when a request comes back 401 for a session
  // that looked valid locally (expired token, or the user was wiped from
  // the dev database) — drop the stale session so the UI reflects reality.
  useEffect(() => {
    const onInvalidated = () => setUser(null);
    window.addEventListener('auth-invalidated', onInvalidated);
    return () => window.removeEventListener('auth-invalidated', onInvalidated);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
