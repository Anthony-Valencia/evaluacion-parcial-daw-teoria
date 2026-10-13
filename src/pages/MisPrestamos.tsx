import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as prestService from '../services/prestamoService';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { fmtFecha, diasRestantes } from '../utils/format';

type Filtro = 'Todos' | 'Activo' | 'Devuelto';

export default function MisPrestamos() {
  const { user } = useAuth();
  const { push } = useToast();
  const [filtro, setFiltro] = useState<Filtro>('Todos');
  const [refresh, setRefresh] = useState(0);

  const prestamos = useMemo(() => user ? prestService.listarPorUsuario(user.id) : [], [user, refresh]);

  const filtrados = filtro === 'Todos' ? prestamos : prestamos.filter((p) => p.estado === filtro);

  const devolver = (id: string) => {
    const res = prestService.devolver(id);
    if (!res.ok) { push('error', res.error ?? 'No se pudo devolver'); return; }
    push('success', 'Libro devuelto correctamente');
    setRefresh((v) => v + 1);
  };

  const countActivos = prestamos.filter((p) => p.estado === 'Activo').length;
  const countDevueltos = prestamos.filter((p) => p.estado === 'Devuelto').length;
  const countVencidos = prestamos.filter(prestService.estaVencido).length;

  return (
    <>
      <PageHeader icon={<FileText size={22} />} title="Mis préstamos" subtitle="Consulta tu historial y devuelve libros" />

      <div className="stats-grid">
        <div className="stat stat-blue"><div className="stat-icon"><Clock size={22} /></div><div><span className="stat-value">{countActivos}</span><span className="stat-label">Activos</span></div></div>
        <div className="stat stat-green"><div className="stat-icon"><CheckCircle2 size={22} /></div><div><span className="stat-value">{countDevueltos}</span><span className="stat-label">Devueltos</span></div></div>
        <div className="stat stat-red"><div className="stat-icon"><AlertTriangle size={22} /></div><div><span className="stat-value">{countVencidos}</span><span className="stat-label">Vencidos</span></div></div>
      </div>

      <div className="segmented segmented-lg">
        {(['Todos', 'Activo', 'Devuelto'] as const).map((f) => (
          <button key={f} className={filtro === f ? 'active' : ''} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} />} title="Sin préstamos" description="No tienes préstamos que mostrar." action={<Link to="/catalogo" className="btn btn-primary btn-md">Ir al catálogo</Link>} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Libro</th>
                <th>Prestado</th>
                <th>Límite</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const vencido = prestService.estaVencido(p);
                return (
                  <tr key={p.id}>
                    <td><code className="code">{p.id}</code></td>
                    <td><strong>{p.libroTitulo}</strong><div className="muted">{p.libroAutor}</div></td>
                    <td>{fmtFecha(p.fechaPrestamo)}</td>
                    <td>{fmtFecha(p.fechaLimite)}</td>
                    <td>
                      {p.estado === 'Devuelto' ? (
                        <Badge tone="green">Devuelto</Badge>
                      ) : vencido ? (
                        <Badge tone="red">Vencido</Badge>
                      ) : diasRestantes(p.fechaLimite) <= 2 ? (
                        <Badge tone="amber">{diasRestantes(p.fechaLimite)}d restantes</Badge>
                      ) : (
                        <Badge tone="blue">{diasRestantes(p.fechaLimite)}d restantes</Badge>
                      )}
                    </td>
                    <td className="cell-actions">
                      <Link to={`/comprobante/${p.id}`} className="btn btn-ghost btn-sm"><FileText size={14} /> Comprobante</Link>
                      {p.estado === 'Activo' && (
                        <Button size="sm" variant="success" onClick={() => devolver(p.id)} icon={<CheckCircle2 size={14} />}>Devolver</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
