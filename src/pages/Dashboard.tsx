import { Link } from 'react-router-dom';
import { BookOpen, Tags, Users, ClipboardList, Library, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as libroService from '../services/libroService';
import * as catService from '../services/categoriaService';
import * as usrService from '../services/usuarioService';
import * as prestService from '../services/prestamoService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { fmtFecha, diasRestantes } from '../utils/format';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const libros = libroService.listar();
  const categorias = catService.listar();
  const usuarios = usrService.listar();
  const prestamos = prestService.listar();

  if (!isAdmin && user) {
    const mis = prestService.listarPorUsuario(user.id);
    const activos = mis.filter((p) => p.estado === 'Activo');
    const vencidos = activos.filter(prestService.estaVencido);

    return (
      <>
        <PageHeader icon={<Library size={22} />} title={`Hola, ${user.nombres}`} subtitle="Resumen de tu actividad en la biblioteca" />
        <div className="stats-grid">
          <div className="stat stat-blue"><div className="stat-icon"><BookOpen size={22} /></div><div><span className="stat-value">{activos.length}</span><span className="stat-label">Préstamos activos</span></div></div>
          <div className="stat stat-green"><div className="stat-icon"><ClipboardList size={22} /></div><div><span className="stat-value">{mis.length}</span><span className="stat-label">Historial total</span></div></div>
          <div className="stat stat-red"><div className="stat-icon"><AlertTriangle size={22} /></div><div><span className="stat-value">{vencidos.length}</span><span className="stat-label">Vencidos</span></div></div>
        </div>
        <Card title="Préstamos activos" actions={<Link to="/mis-prestamos" className="link">Ver historial <ArrowRight size={14} /></Link>}>
          {activos.length === 0 ? (
            <p className="muted">No tienes préstamos activos. Visita el <Link to="/catalogo">catálogo</Link>.</p>
          ) : (
            <ul className="list">
              {activos.slice(0, 5).map((p) => (
                <li key={p.id} className="list-item">
                  <div><strong>{p.libroTitulo}</strong><span className="muted">{p.libroAutor} · Límite: {fmtFecha(p.fechaLimite)}</span></div>
                  <Badge tone={prestService.estaVencido(p) ? 'red' : diasRestantes(p.fechaLimite) <= 2 ? 'amber' : 'green'}>
                    {prestService.estaVencido(p) ? 'Vencido' : `${diasRestantes(p.fechaLimite)} días`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </>
    );
  }

  const activos = prestService.contarActivos();
  const sinStock = libros.filter((l) => l.stock === 0).length;
  const recientes = [...prestamos].sort((a, b) => +new Date(b.fechaPrestamo) - +new Date(a.fechaPrestamo)).slice(0, 6);

  return (
    <>
      <PageHeader icon={<Library size={22} />} title="Panel de administración" subtitle="Indicadores generales del sistema de biblioteca" />
      <div className="stats-grid">
        <div className="stat stat-blue"><div className="stat-icon"><BookOpen size={22} /></div><div><span className="stat-value">{libros.length}</span><span className="stat-label">Libros registrados</span></div></div>
        <div className="stat stat-violet"><div className="stat-icon"><Tags size={22} /></div><div><span className="stat-value">{categorias.length}</span><span className="stat-label">Categorías</span></div></div>
        <div className="stat stat-green"><div className="stat-icon"><Users size={22} /></div><div><span className="stat-value">{usuarios.length}</span><span className="stat-label">Usuarios</span></div></div>
        <div className="stat stat-amber"><div className="stat-icon"><TrendingUp size={22} /></div><div><span className="stat-value">{activos}</span><span className="stat-label">Préstamos activos</span></div></div>
      </div>
      <div className="grid-2 gap-lg">
        <Card title="Accesos rápidos">
          <div className="quick-grid">
            <Link to="/admin/categorias" className="quick"><Tags size={20} /><span>Categorías</span></Link>
            <Link to="/admin/libros" className="quick"><BookOpen size={20} /><span>Libros</span></Link>
            <Link to="/admin/usuarios" className="quick"><Users size={20} /><span>Usuarios</span></Link>
            <Link to="/admin/prestamos" className="quick"><ClipboardList size={20} /><span>Préstamos</span></Link>
          </div>
          {sinStock > 0 && (<div className="alert alert-warn"><AlertTriangle size={16} /> {sinStock} libro(s) sin ejemplares disponibles.</div>)}
        </Card>
        <Card title="Préstamos recientes">
          {recientes.length === 0 ? (<p className="muted">Aún no se registran préstamos.</p>) : (
            <ul className="list">
              {recientes.map((p) => (
                <li key={p.id} className="list-item">
                  <div><strong>{p.libroTitulo}</strong><span className="muted">{p.usuarioNombre} · {fmtFecha(p.fechaPrestamo)}</span></div>
                  <Badge tone={p.estado === 'Activo' ? 'blue' : 'green'}>{p.estado}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
