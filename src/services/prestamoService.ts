import type { Libro, Prestamo, Usuario } from '../types';
import { KEYS, getItem, setItem } from './storage';
import * as libroService from './libroService';
export const DIAS_PRESTAMO = 7;
export const listar = (): Prestamo[] => getItem<Prestamo[]>(KEYS.prestamos, []);
export const listarPorUsuario = (usuarioId: string): Prestamo[] =>
  listar().filter((p) => p.usuarioId === usuarioId).sort((a, b) => +new Date(b.fechaPrestamo) - +new Date(a.fechaPrestamo));
export const obtener = (id: string) => listar().find((p) => p.id === id);
function generarCodigo(): string {
  const year = new Date().getFullYear();
  const todos = listar();
  let n = todos.length + 1;
  let codigo = `PRE-${year}-${String(n).padStart(4, '0')}`;
  while (todos.some((p) => p.id === codigo)) { n += 1; codigo = `PRE-${year}-${String(n).padStart(4, '0')}`; }
  return codigo;
}
export type ResultadoPrestamo = { ok: true; prestamo: Prestamo } | { ok: false; error: string };
export function crear(usuario: Usuario, libroId: string, dias = DIAS_PRESTAMO): ResultadoPrestamo {
  const libro: Libro | undefined = libroService.obtener(libroId);
  if (!libro) return { ok: false, error: 'El libro seleccionado no existe.' };
  if (libro.stock <= 0) return { ok: false, error: 'No hay ejemplares disponibles (stock = 0).' };
  const yaPrestado = listar().some((p) => p.usuarioId === usuario.id && p.libroId === libro.id && p.estado === 'Activo');
  if (yaPrestado) return { ok: false, error: 'Ya tienes un préstamo activo de este libro.' };
  libroService.actualizar(libro.id, { stock: libro.stock - 1 });
  const hoy = new Date();
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + dias);
  const prestamo: Prestamo = {
    id: generarCodigo(), usuarioId: usuario.id,
    usuarioNombre: `${usuario.nombres} ${usuario.apellidos}`.trim(),
    usuarioCodigo: usuario.codigo, libroId: libro.id, libroTitulo: libro.titulo,
    libroAutor: libro.autor, libroIsbn: libro.isbn,
    fechaPrestamo: hoy.toISOString(), fechaLimite: limite.toISOString(),
    fechaDevolucion: null, dias, estado: 'Activo'
  };
  setItem(KEYS.prestamos, [...listar(), prestamo]);
  return { ok: true, prestamo };
}
export function devolver(prestamoId: string): { ok: boolean; error?: string } {
  const todos = listar();
  const prestamo = todos.find((p) => p.id === prestamoId);
  if (!prestamo) return { ok: false, error: 'El préstamo no existe.' };
  if (prestamo.estado === 'Devuelto') return { ok: false, error: 'Este préstamo ya fue devuelto.' };
  const libro = libroService.obtener(prestamo.libroId);
  if (libro) libroService.actualizar(libro.id, { stock: libro.stock + 1 });
  setItem(KEYS.prestamos, todos.map((p) => p.id === prestamoId ? { ...p, estado: 'Devuelto' as const, fechaDevolucion: new Date().toISOString() } : p));
  return { ok: true };
}
export const estaVencido = (p: Prestamo): boolean => p.estado === 'Activo' && new Date(p.fechaLimite) < new Date();
export const contarActivos = (): number => listar().filter((p) => p.estado === 'Activo').length;
