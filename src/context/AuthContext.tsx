import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Usuario } from '../types';
import * as authService from '../services/authService';
interface AuthCtx { user: Usuario | null; login: (c: string, p: string) => { ok: boolean; error?: string }; logout: () => void; isAdmin: boolean; }
const Ctx = createContext<AuthCtx | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => authService.getSesion());
  const login = useCallback((codigo: string, password: string) => {
    const res = authService.login(codigo, password);
    if (res.ok) { setUser(res.user); return { ok: true }; }
    return { ok: false, error: res.error };
  }, []);
  const logout = useCallback(() => { authService.logout(); setUser(null); }, []);
  const value = useMemo<AuthCtx>(() => ({ user, login, logout, isAdmin: user?.rol === 'ADMIN' }), [user, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
