import { useMemo, useState, type FormEvent } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import * as libroService from '../../services/libroService';
import * as catService from '../../services/categoriaService';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { esISBN, esEnteroPositivo } from '../../utils/validators';
import type { Libro } from '../../types';

export default function Libros() {
  const { push } = useToast();
  const [lista, setLista] = useState<Libro[]>(libroService.listar());
  const [filtro, setFiltro] = useState('');
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Libro | null>(null);

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [stock, setStock] = useState('1');
  const [errores, setErrores] = useState<Record<string, string>>({});

  const categorias = catService.listar();
  const opcionesCat = categorias.map((c) => ({ value: c.id, label: c.nombre }));

  const filtrados = useMemo(() => libroService.buscar(filtro), [filtro, lista]);

  const refrescar = () => setLista(libroService.listar());

  const abrirNueva = () => {
    setEditando(null);
    setTitulo(''); setAutor(''); setIsbn('');
    setCategoriaId(categorias[0]?.id ?? '');
    setStock('1'); setErrores({});
    setOpen(true);
  };

  const abrirEditar = (l: Libro) => {
    setEditando(l);
    setTitulo(l.titulo); setAutor(l.autor); setIsbn(l.isbn);
    setCategoriaId(l.categoriaId); setStock(String(l.stock));
    setErrores({});
    setOpen(true);
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (titulo.trim().length < 2) errs.titulo = 'Título requerido (mín. 2).';
    if (autor.trim().length < 2) errs.autor = 'Autor requerido (mín. 2).';
    if (!esISBN(isbn)) errs.isbn = 'ISBN inválido (10 o 13 dígitos).';
    else if (libroService.existeIsbn(isbn, editando?.id)) errs.isbn = 'Ese ISBN ya está registrado.';
    if (!categoriaId) errs.categoriaId = 'Selecciona una categoría.';
    if (!esEnteroPositivo(stock)) errs.stock = 'Stock debe ser un entero ≥ 0.';
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const data = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      isbn: isbn.trim(),
      categoriaId,
      stock: Number(stock)
    };

    if (editando) {
      libroService.actualizar(editando.id, data);
      push('success', 'Libro actualizado');
    } else {
      libroService.crear(data);
      push('success', 'Libro registrado');
    }
    setOpen(false);
    refrescar();
  };

  const eliminar = (l: Libro) => {
    if (!confirm(`¿Eliminar "${l.titulo}"?`)) return;
    libroService.eliminar(l.id);
    push('info', 'Libro eliminado');
    refrescar();
  };

  return (
    <>
      <PageHeader
        icon={<BookOpen size={22} />}
        title="Gestión de libros"
        subtitle="Registra, edita y elimina libros del catálogo"
        actions={<Button onClick={abrirNueva} icon={<Plus size={16} />}>Nuevo libro</Button>}
      />

      <div className="filters">
        <Input placeholder="Buscar por título, autor o ISBN..." value={filtro} onChange={(e) => setFiltro(e.target.value)} icon={<Search size={16} />} />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} />} title="Sin libros" description="No hay libros registrados que coincidan." action={<Button onClick={abrirNueva} icon={<Plus size={16} />}>Registrar el primero</Button>} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((l) => {
                const cat = categorias.find((c) => c.id === l.categoriaId);
                return (
                  <tr key={l.id}>
                    <td><strong>{l.titulo}</strong></td>
                    <td>{l.autor}</td>
                    <td><code className="code">{l.isbn}</code></td>
                    <td><Badge tone="violet">{cat?.nombre ?? '—'}</Badge></td>
                    <td><Badge tone={l.stock > 0 ? 'green' : 'red'}>{l.stock}</Badge></td>
                    <td className="cell-actions">
                      <Button size="sm" variant="secondary" onClick={() => abrirEditar(l)} icon={<Pencil size={14} />}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => eliminar(l)} icon={<Trash2 size={14} />}>Eliminar</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editando ? 'Editar libro' : 'Nuevo libro'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={guardar} icon={<Save size={16} />}>Guardar</Button>
          </>
        }
      >
        <form onSubmit={guardar} className="form-stack">
          <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} error={errores.titulo} />
          <Input label="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} error={errores.autor} />
          <Input label="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} error={errores.isbn} placeholder="9780132350884" />
          <Select label="Categoría" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} options={opcionesCat} placeholder="Selecciona..." error={errores.categoriaId} />
          <Input label="Stock disponible" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} error={errores.stock} />
        </form>
      </Modal>
    </>
  );
}
