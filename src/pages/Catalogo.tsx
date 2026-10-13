import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Library, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as libroService from '../services/libroService';
import * as catService from '../services/categoriaService';
import * as prestService from '../services/prestamoService';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import type { Libro, Prestamo } from '../types';

export default function Catalogo() {
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [termino, setTermino] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [seleccionado, setSeleccionado] = useState<Libro | null>(null);
  const [comprobante, setComprobante] = useState<Prestamo | null>(null);

  const categorias = catService.listar();
  const libros = useMemo(() => libroService.buscar(termino, categoriaId), [termino, categoriaId]);

  const opcionesCat = [{ value: '', label: 'Todas las categorías' }, ...categorias.map((c) => ({ value: c.id, label: c.nombre }))];

  const solicitar = () => {
    if (!seleccionado || !user) return;
    const res = prestService.crear(user, seleccionado.id);
    if (!res.ok) {
      push('error', res.error);
      return;
    }
    push('success', 'Préstamo registrado correctamente');
    setSeleccionado(null);
    setComprobante(res.prestamo);
  };

  return (
    <>
      <PageHeader icon={<Library size={22} />} title="Catálogo de libros" subtitle="Busca y solicita préstamos de libros disponibles" />

      <div className="filters">
        <Input placeholder="Buscar por título, autor o ISBN..." value={termino} onChange={(e) => setTermino(e.target.value)} icon={<Search size={16} />} />
        <Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} options={opcionesCat} />
      </div>

      {libros.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} />} title="Sin resultados" description="No se encontraron libros con esos criterios." />
      ) : (
        <div className="books-grid">
          {libros.map((l) => {
            const cat = categorias.find((c) => c.id === l.categoriaId);
            return (
              <div key={l.id} className="book-card">
                <div className="book-cover"><BookOpen size={26} /></div>
                <div className="book-info">
                  <h3>{l.titulo}</h3>
                  <p className="book-author">{l.autor}</p>
                  <p className="book-isbn">ISBN: {l.isbn}</p>
                  <div className="book-meta">
                    <Badge tone="violet">{cat?.nombre ?? 'Sin categoría'}</Badge>
                    <Badge tone={l.stock > 0 ? 'green' : 'red'}>{l.stock > 0 ? `${l.stock} disponibles` : 'Sin stock'}</Badge>
                  </div>
                </div>
                <Button full disabled={l.stock === 0} onClick={() => setSeleccionado(l)} icon={<FileText size={16} />}>
                  {l.stock === 0 ? 'No disponible' : 'Solicitar préstamo'}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!seleccionado}
        onClose={() => setSeleccionado(null)}
        title="Confirmar préstamo"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSeleccionado(null)}>Cancelar</Button>
            <Button onClick={solicitar} icon={<FileText size={16} />}>Confirmar</Button>
          </>
        }
      >
        {seleccionado && (
          <div className="confirm-block">
            <p><strong>{seleccionado.titulo}</strong></p>
            <p className="muted">{seleccionado.autor}</p>
            <p className="muted">ISBN: {seleccionado.isbn}</p>
            <p className="muted">Días de préstamo: <b>{prestService.DIAS_PRESTAMO}</b></p>
            <p className="muted">Stock disponible después del préstamo: <b>{seleccionado.stock - 1}</b></p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!comprobante}
        onClose={() => setComprobante(null)}
        title="Préstamo registrado"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setComprobante(null)}>Cerrar</Button>
            <Button onClick={() => comprobante && navigate(`/comprobante/${comprobante.id}`)} icon={<FileText size={16} />}>Ver comprobante</Button>
          </>
        }
      >
        {comprobante && (
          <div className="confirm-block">
            <p><strong>{comprobante.libroTitulo}</strong></p>
            <p className="muted">Código: <b>{comprobante.id}</b></p>
            <p className="muted">Devuelve antes del: <b>{new Date(comprobante.fechaLimite).toLocaleDateString('es-PE')}</b></p>
          </div>
        )}
      </Modal>
    </>
  );
}
