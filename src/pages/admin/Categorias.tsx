import { useState, type FormEvent } from 'react';
import { Tags, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import * as catService from '../../services/categoriaService';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';
import type { Categoria } from '../../types';

export default function Categorias() {
  const { push } = useToast();
  const [lista, setLista] = useState<Categoria[]>(catService.listar());
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const refrescar = () => setLista(catService.listar());

  const abrirNueva = () => {
    setEditando(null);
    setNombre('');
    setDescripcion('');
    setError('');
    setOpen(true);
  };

  const abrirEditar = (c: Categoria) => {
    setEditando(c);
    setNombre(c.nombre);
    setDescripcion(c.descripcion);
    setError('');
    setOpen(true);
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 3) { setError('El nombre debe tener al menos 3 caracteres.'); return; }
    if (catService.existeNombre(nombre, editando?.id)) { setError('Ya existe una categoría con ese nombre.'); return; }

    if (editando) {
      catService.actualizar(editando.id, { nombre: nombre.trim(), descripcion: descripcion.trim() });
      push('success', 'Categoría actualizada');
    } else {
      catService.crear({ nombre: nombre.trim(), descripcion: descripcion.trim() });
      push('success', 'Categoría creada');
    }
    setOpen(false);
    refrescar();
  };

  const eliminar = (c: Categoria) => {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    catService.eliminar(c.id);
    push('info', 'Categoría eliminada');
    refrescar();
  };

  return (
    <>
      <PageHeader
        icon={<Tags size={22} />}
        title="Gestión de categorías"
        subtitle="Administra las categorías de libros de la biblioteca"
        actions={<Button onClick={abrirNueva} icon={<Plus size={16} />}>Nueva categoría</Button>}
      />

      {lista.length === 0 ? (
        <EmptyState icon={<Tags size={40} />} title="Sin categorías" description="Aún no has registrado categorías." action={<Button onClick={abrirNueva} icon={<Plus size={16} />}>Crear la primera</Button>} />
      ) : (
        <div className="cards-grid">
          {lista.map((c) => (
            <Card key={c.id} title={c.nombre}>
              <p className="muted">{c.descripcion || 'Sin descripción'}</p>
              <div className="row-actions">
                <Button size="sm" variant="secondary" onClick={() => abrirEditar(c)} icon={<Pencil size={14} />}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => eliminar(c)} icon={<Trash2 size={14} />}>Eliminar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editando ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={guardar} icon={<Save size={16} />}>Guardar</Button>
          </>
        }
      >
        <form onSubmit={guardar} className="form-stack">
          <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} error={error} placeholder="Ej. Ingeniería de Software" />
          <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Breve descripción" />
        </form>
      </Modal>
    </>
  );
}
