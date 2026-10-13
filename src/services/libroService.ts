import type { Libro } from '../types';
import { KEYS, getItem, setItem, uid } from './storage';
export const listar = (): Libro[] => getItem<Libro[]>(KEYS.libros, []);
export const obtener = (id: string) => listar().find((l) => l.id === id);
export function crear(data: Omit<Libro, 'id' | 'createdAt'>): Libro {
  const nuevo: Libro = { ...data, id: uid('lib_'), createdAt: new Date().toISOString() };
  setItem(KEYS.libros, [...listar(), nuevo]);
  return nuevo;
}
export function actualizar(id: string, data: Partial<Omit<Libro, 'id'>>): void {
  setItem(KEYS.libros, listar().map((l) => (l.id === id ? { ...l, ...data } : l)));
}
export function eliminar(id: string): void {
  setItem(KEYS.libros, listar().filter((l) => l.id !== id));
}
export function existeIsbn(isbn: string, exceptoId?: string): boolean {
  const limpio = isbn.replace(/[-\s]/g, '');
  return listar().some((l) => l.isbn.replace(/[-\s]/g, '') === limpio && l.id !== exceptoId);
}
export function buscar(termino: string, categoriaId = ''): Libro[] {
  const t = termino.trim().toLowerCase();
  return listar().filter((l) => {
    const coincideTexto = t === '' || l.titulo.toLowerCase().includes(t) || l.autor.toLowerCase().includes(t) || l.isbn.includes(t);
    const coincideCategoria = categoriaId === '' || l.categoriaId === categoriaId;
    return coincideTexto && coincideCategoria;
  });
}
