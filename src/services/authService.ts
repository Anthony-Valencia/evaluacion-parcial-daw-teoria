import type { Usuario } from '../types';
import { KEYS, getItem, setItem, removeItem } from './storage';
type LoginResult = { ok: true; user: Usuario } | { ok: false; error: string };
export function login(codigo: string, password: string): LoginResult {
  const usuarios = getItem<Usuario[]>(KEYS.usuarios, []);
  const user = usuarios.find((u) => u.codigo.toLowerCase() === codigo.trim().toLowerCase());
  if (!user) return { ok: false, error: 'El código universitario no está registrado.' };
  if (user.password !== password) return { ok: false, error: 'La contraseña es incorrecta.' };
  setItem(KEYS.sesion, user.id);
  return { ok: true, user };
}
export function logout(): void { removeItem(KEYS.sesion); }
export function getSesion(): Usuario | null {
  const id = getItem<string | null>(KEYS.sesion, null);
  if (!id) return null;
  const usuarios = getItem<Usuario[]>(KEYS.usuarios, []);
  return usuarios.find((u) => u.id === id) ?? null;
}
