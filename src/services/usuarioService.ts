import type { Usuario } from '../types';
import { KEYS, getItem, setItem, uid } from './storage';
export const listar = (): Usuario[] => getItem<Usuario[]>(KEYS.usuarios, []);
export const obtener = (id: string) => listar().find((u) => u.id === id);
export function crear(data: Omit<Usuario, 'id' | 'createdAt' | 'rol'> & { rol?: Usuario['rol'] }): Usuario {
  const nuevo: Usuario = { ...data, rol: data.rol ?? 'USUARIO', id: uid('usr_'), createdAt: new Date().toISOString() };
  setItem(KEYS.usuarios, [...listar(), nuevo]);
  return nuevo;
}
export function actualizar(id: string, data: Partial<Omit<Usuario, 'id'>>): void {
  setItem(KEYS.usuarios, listar().map((u) => (u.id === id ? { ...u, ...data } : u)));
}
export function eliminar(id: string): void {
  setItem(KEYS.usuarios, listar().filter((u) => u.id !== id));
}
export function existeCodigo(codigo: string, exceptoId?: string): boolean {
  const c = codigo.trim().toLowerCase();
  return listar().some((u) => u.codigo.trim().toLowerCase() === c && u.id !== exceptoId);
}
export function existeCorreo(correo: string, exceptoId?: string): boolean {
  const e = correo.trim().toLowerCase();
  return listar().some((u) => u.correo.trim().toLowerCase() === e && u.id !== exceptoId);
}
