import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Search, CheckCircle2, FileText, User, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import * as prestService from '../../services/prestamoService';
import * as usrService from '../../services/usuarioService';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { fmtFecha, diasRestantes } from '../../utils/format';

type Filtro = 'Todos' | 'Activo' | 'Devuelto' | 'Vencido';

export default function Prestamos() {
  const { push } = useToast();
  const [refresh, setRefresh] = useState(0);
  const [termino, setTermino] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('Todos');

  const prestamos = useMemo(() => prestService.listar(), [refresh]);

  const filtrados = prestamos.filter((p) => {
    const t = termino.trim().toLowerCase();
    const coincideTexto = t === '' ||
      p.id.toLowerCase().includes(t) ||
      p.usuarioNombre.toLowerCase().includes(t) ||
      p.usuarioCodigo.toLowerCase().includes(t) ||
      p.libroTitulo.toLowerCase().includes(t);

    const coincideEstado =
      filtro === 'Todos' ? true :
      filtro === 'Vencido' ? prestService.estaVencido(p) :
      p.estado === filtro;

    return coincideTexto && coincideEstado;
  }).sort((a, b) => +new Date(b.fechaPrestamo) - +new Date(a.fechaPrestamo));

  const devolver = (id: string) => {
    const res = prestService.devolver(id);
    if (!res.ok) { push('error', res.error ?? 'Error al devolver'); return; }
    push('success', 'Devolución registrada');
    setRefresh((v) => v + 1);
  };

  return (
    <>
      <PageHeader
        icon={<ClipboardList size={22} />}
        title="Gestión de préstamos"
        subtitle="Administra todos los préstamos de la biblioteca"
      />

      <div className="stats-grid">
        <div className="stat stat-blue"><div className="stat-icon"><ClipboardList size={22} /></div><div><span className="stat-value">{prestamos.length}</span><span className="stat-label">Total</span></div></div>
        <div className="stat stat-amber"><div className="stat-icon"><ClipboardList size={22} /></div><div><span className="stat-value">{prestamos.filter((p) => p.estado === 'Activo').length}</span><span className="stat-label">Activos</span></div></div>
        <div className="stat stat-green"><div className="stat-icon"><CheckCircle2 size={22} /></div><div><span className="stat-value">{prestamos.filter((p) => p.estado === 'Devuelto').length}</span><span className="stat-label">Devueltos</span></div></div>
        <div className="stat stat-red"><div className="stat-icon"><ClipboardList size={22} /></div><div><span className="stat-value">{prestamos.filter(prestService.estaVencido).length}</span><span className="stat-label">Vencidos</span></div></div>
      </div>

      <div className="filters">
        <Input placeholder="Buscar por código, usuario o libro..." value={termino} onChange={(e) => setTermino(e.target.value)} icon={<Search size={16} />} />
        <Select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          options={[
            { value: 'Todos', label: 'Todos' },
            { value: 'Activo', label: 'Activos' },
            { value: 'Devuelto', label: 'Devueltos' },
            { value: 'Vencido', label: 'Vencidos' }
          ]}
        />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} />} title="Sin préstamos" description="No hay préstamos que coincidan con el filtro." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
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
                    <td>
                      <div className="cell-user"><User size={14} /><strong>{p.usuarioNombre}</strong></div>
                      <div className="muted">{p.usuarioCodigo}</div>
                    </td>
                    <td>
                      <div className="cell-user"><BookOpen size={14} /><strong>{p.libroTitulo}</strong></div>
                      <div className="muted">{p.libroAutor}</div>
                    </td>
                    <td>{fmtFecha(p.fechaPrestamo)}</td>
                    <td>{fmtFecha(p.fechaLimite)}</td>
                    <td>
                      {p.estado === 'Devuelto' ? (
                        <Badge tone="green">Devuelto</Badge>
                      ) : vencido ? (
                        <Badge tone="red">Vencido</Badge>
                      ) : (
                        <Badge tone="blue">{diasRestantes(p.fechaLimite)}d</Badge>
                      )}
                    </td>
                    <td className="cell-actions">
                      <Link to={`/comprobante/${p.id}`} className="btn btn-ghost btn-sm"><FileText size={14} /></Link>
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
