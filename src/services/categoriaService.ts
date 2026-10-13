import type { Categoria } from '../types';
import { KEYS, getItem, setItem, uid } from './storage';
export const listar = (): Categoria[] => getItem<Categoria[]>(KEYS.categorias, []);
export const obtener = (id: string) => listar().find((c) => c.id === id);
export function crear(data: Omit<Categoria, 'id'>): Categoria {
  const items = listar();
  const nueva: Categoria = { ...data, id: uid('cat_') };
  setItem(KEYS.categorias, [...items, nueva]);
  return nueva;
}
export function actualizar(id: string, data: Partial<Omit<Categoria, 'id'>>): void {
  setItem(KEYS.categorias, listar().map((c) => (c.id === id ? { ...c, ...data } : c)));
}
export function eliminar(id: string): void {
  setItem(KEYS.categorias, listar().filter((c) => c.id !== id));
}
export function existeNombre(nombre: string, exceptoId?: string): boolean {
  const n = nombre.trim().toLowerCase();
  return listar().some((c) => c.nombre.trim().toLowerCase() === n && c.id !== exceptoId);
}
