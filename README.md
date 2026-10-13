# Sistema de Gestión de Biblioteca Universitaria

## Objetivo

Implementar un sistema completo que cubra los dos perfiles de usuario:

- **Administradores**: gestionan categorías, libros, usuarios y préstamos.
- **Usuarios registrados** (estudiantes o docentes): buscan libros, solicitan préstamos, descargan comprobantes y consultan su historial.

---

## Backlog desarrollado por cada estudiante

### Hinojosa Yaranga Renzo Sebastián

| Módulo | Descripción |

| Gestión de categorías y libros | CRUD completo de categorías y libros con validación de ISBN único y stock entero. Persistencia en LocalStorage. |
| Solicitud y préstamo de libros | Búsqueda por título/autor/ISBN/categoría, control de stock cero y actualización automática del inventario. |

---

### Valencia Bernaola Andrés Anthony

| Módulo | Descripción |

| Gestión de usuarios | Registro con código universitario único, correo único, tipo (Estudiante/Docente) y validaciones de formulario. |
| Generación de comprobante digital | Comprobante con código único `PRE-YYYY-####`, datos del usuario, libro y fechas. Visualización y descarga en PDF. |
| Historial de préstamos | Vista personal con filtros por estado, devolución con un clic y actualización automática del stock. |

---

### Trabajo compartido

- Definición de la arquitectura del proyecto (capas: `pages`, `components`, `services`, `context`, `utils`).
- Implementación de la capa de persistencia (`storage.ts`) y datos semilla (`seed.ts`).
- Componentes reutilizables de UI (`Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `EmptyState`, `PageHeader`).
- Autenticación, rutas protegidas y layout responsivo (`AuthContext`, `ProtectedRoute`, `Layout`).
- Diseño global y estilos (`index.css`).
- Pruebas de integración y corrección de errores.

---

## Credenciales de prueba

| Rol | Código | Contraseña |
|---|---|---|
| **Administrador** | `ADMIN001` | `admin123` |
| **Usuario (Estudiante)** | `12345670` | `valencia1234` |

> El administrador se crea automáticamente al iniciar la app (seed).  
> El usuario se puede crear desde el panel de administrador.

También puedes crear usuarios nuevos desde la pestaña **"Registrarme"** en la pantalla de login.

---

