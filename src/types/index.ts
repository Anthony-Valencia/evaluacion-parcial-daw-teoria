export type Rol = 'ADMIN' | 'USUARIO';
export type TipoUsuario = 'Estudiante' | 'Docente';
export type EstadoPrestamo = 'Activo' | 'Devuelto';
export interface Categoria { id: string; nombre: string; descripcion: string; }
export interface Libro { id: string; titulo: string; autor: string; isbn: string; categoriaId: string; stock: number; createdAt: string; }
export interface Usuario { id: string; nombres: string; apellidos: string; codigo: string; correo: string; tipo: TipoUsuario; password: string; rol: Rol; createdAt: string; }
export interface Prestamo { id: string; usuarioId: string; usuarioNombre: string; usuarioCodigo: string; libroId: string; libroTitulo: string; libroAutor: string; libroIsbn: string; fechaPrestamo: string; fechaLimite: string; fechaDevolucion: string | null; dias: number; estado: EstadoPrestamo; }
