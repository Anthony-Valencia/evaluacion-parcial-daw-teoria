import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, Users, ClipboardList, Library, LogOut, FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { iniciales } from '../../utils/format';
export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const cerrarSesion = () => { logout(); navigate('/login', { replace: true }); };
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;
  const links = isAdmin
    ? [
        { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/admin/categorias', label: 'Categorías', icon: <Tags size={18} /> },
        { to: '/admin/libros', label: 'Libros', icon: <BookOpen size={18} /> },
        { to: '/admin/usuarios', label: 'Usuarios', icon: <Users size={18} /> },
        { to: '/admin/prestamos', label: 'Préstamos', icon: <ClipboardList size={18} /> }
      ]
    : [
        { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/catalogo', label: 'Catálogo', icon: <Library size={18} /> },
        { to: '/mis-prestamos', label: 'Mis Préstamos', icon: <FileText size={18} /> }
      ];
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-logo"><Library size={20} /></div>
          <div className="brand-text"><strong>Biblioteca</strong><small>Central Universitaria</small></div>
        </div>
        <nav className="nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.icon}<span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">{user ? iniciales(user.nombres, user.apellidos) : '??'}</span>
            <div className="user-chip-info">
              <strong>{user?.nombres} {user?.apellidos}</strong>
              <small>{isAdmin ? 'Administrador' : user?.tipo}</small>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-full" onClick={cerrarSesion}><LogOut size={16} /> Cerrar sesión</button>
        </div>
      </aside>
      <main className="main">
        <button className="hamburger" onClick={() => setOpen((v) => !v)} aria-label="Menú">{open ? <X size={20} /> : <Menu size={20} />}</button>
        <div className="main-content"><Outlet /></div>
      </main>
    </div>
  );
}
