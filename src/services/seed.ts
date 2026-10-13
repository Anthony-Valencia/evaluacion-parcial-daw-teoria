import type { Categoria, Libro, Usuario } from '../types';
import { KEYS, getItem, setItem } from './storage';
export function seedData(): void {
  const usuarios = getItem<Usuario[]>(KEYS.usuarios, []);
  if (!usuarios.some((u) => u.rol === 'ADMIN')) {
    usuarios.push({
      id: 'usr-admin', nombres: 'Administrador', apellidos: 'del Sistema',
      codigo: 'ADMIN001', correo: 'admin@universidad.edu.pe', tipo: 'Docente',
      password: 'admin123', rol: 'ADMIN', createdAt: new Date().toISOString()
    });
    setItem(KEYS.usuarios, usuarios);
  }
  let categorias = getItem<Categoria[]>(KEYS.categorias, []);
  if (categorias.length === 0) {
    categorias = [
      { id: 'cat-software', nombre: 'Ingeniería de Software', descripcion: 'Desarrollo, arquitectura y metodologías ágiles.' },
      { id: 'cat-bd', nombre: 'Bases de Datos', descripcion: 'Modelado, SQL y sistemas gestores de datos.' },
      { id: 'cat-redes', nombre: 'Redes y Comunicaciones', descripcion: 'Protocolos, infraestructura y seguridad de redes.' },
      { id: 'cat-mate', nombre: 'Matemáticas', descripcion: 'Álgebra, cálculo, estadística y algoritmos.' }
    ];
    setItem(KEYS.categorias, categorias);
  }
  const libros = getItem<Libro[]>(KEYS.libros, []);
  if (libros.length === 0) {
    const ahora = new Date().toISOString();
    const base: Libro[] = [
      { id: 'lib-001', titulo: 'Clean Code', autor: 'Robert C. Martin', isbn: '9780132350884', categoriaId: 'cat-software', stock: 4, createdAt: ahora },
      { id: 'lib-002', titulo: 'Refactoring', autor: 'Martin Fowler', isbn: '9780134757599', categoriaId: 'cat-software', stock: 2, createdAt: ahora },
      { id: 'lib-003', titulo: 'Design Patterns', autor: 'Erich Gamma', isbn: '9780201633610', categoriaId: 'cat-software', stock: 3, createdAt: ahora },
      { id: 'lib-004', titulo: 'Fundamentos de Bases de Datos', autor: 'Abraham Silberschatz', isbn: '9780078022159', categoriaId: 'cat-bd', stock: 5, createdAt: ahora },
      { id: 'lib-005', titulo: 'Introducción a los Algoritmos', autor: 'Thomas H. Cormen', isbn: '9780262033848', categoriaId: 'cat-mate', stock: 2, createdAt: ahora },
      { id: 'lib-006', titulo: 'Redes de Computadoras', autor: 'Andrew S. Tanenbaum', isbn: '9780132126953', categoriaId: 'cat-redes', stock: 1, createdAt: ahora }
    ];
    setItem(KEYS.libros, base);
  }
}
