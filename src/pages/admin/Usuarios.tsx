import { useState, type FormEvent } from 'react';
import { Users, Plus, Trash2, Save, Search, GraduationCap, Briefcase } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import * as usuarioService from '../../services/usuarioService';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { esCodigo, esEmail, minLen, soloLetras } from '../../utils/validators';
import type { Usuario } from '../../types';

export default function Usuarios() {
  const { push } = useToast();
  const [lista, setLista] = useState<Usuario[]>(usuarioService.listar());
  const [filtro, setFiltro] = useState('');
  const [open, setOpen] = useState(false);

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [codigo, setCodigo] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipo, setTipo] = useState<'Estudiante' | 'Docente'>('Estudiante');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});

  const refrescar = () => setLista(usuarioService.listar());

  const filtrados = lista.filter((u) => {
    const t = filtro.trim().toLowerCase();
    return t === '' ||
      u.nombres.toLowerCase().includes(t) ||
      u.apellidos.toLowerCase().includes(t) ||
      u.codigo.toLowerCase().includes(t) ||
      u.correo.toLowerCase().includes(t);
  });

  const abrirNuevo = () => {
    setNombres(''); setApellidos(''); setCodigo(''); setCorreo('');
    setTipo('Estudiante'); setPassword(''); setErrores({});
    setOpen(true);
  };

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!soloLetras(nombres) || nombres.trim().length < 2) errs.nombres = 'Solo letras (mín. 2).';
    if (!soloLetras(apellidos) || apellidos.trim().length < 2) errs.apellidos = 'Solo letras (mín. 2).';
    if (!esCodigo(codigo)) errs.codigo = 'Código alfanumérico de 4 a 15 caracteres.';
    else if (usuarioService.existeCodigo(codigo)) errs.codigo = 'Ese código ya está registrado.';
    if (!esEmail(correo)) errs.correo = 'Correo inválido.';
    else if (usuarioService.existeCorreo(correo)) errs.correo = 'Ese correo ya está registrado.';
    if (!minLen(password, 6)) errs.password = 'Contraseña mínima de 6 caracteres.';
    setErrores(errs);
    if (Object.keys(errs).length) return;

    usuarioService.crear({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      codigo: codigo.trim().toUpperCase(),
      correo: correo.trim().toLowerCase(),
      tipo,
      password,
      rol: 'USUARIO'
    });
    push('success', 'Usuario registrado');
    setOpen(false);
    refrescar();
  };

  const eliminar = (u: Usuario) => {
    if (u.rol === 'ADMIN') { push('error', 'No puedes eliminar a un administrador.'); return; }
    if (!confirm(`¿Eliminar a ${u.nombres} ${u.apellidos}?`)) return;
    usuarioService.eliminar(u.id);
    push('info', 'Usuario eliminado');
    refrescar();
  };

  return (
    <>
      <PageHeader
        icon={<Users size={22} />}
        title="Gestión de usuarios"
        subtitle="Registra estudiantes y docentes del sistema"
        actions={<Button onClick={abrirNuevo} icon={<Plus size={16} />}>Nuevo usuario</Button>}
      />

      <div className="filters">
        <Input placeholder="Buscar por nombre, código o correo..." value={filtro} onChange={(e) => setFiltro(e.target.value)} icon={<Search size={16} />} />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="Sin usuarios" description="No hay usuarios que coincidan con la búsqueda." action={<Button onClick={abrirNuevo} icon={<Plus size={16} />}>Registrar el primero</Button>} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nombres} {u.apellidos}</strong></td>
                  <td><code className="code">{u.codigo}</code></td>
                  <td>{u.correo}</td>
                  <td>
                    <Badge tone={u.tipo === 'Docente' ? 'violet' : 'blue'}>
                      {u.tipo === 'Docente' ? <Briefcase size={12} /> : <GraduationCap size={12} />} {u.tipo}
                    </Badge>
                  </td>
                  <td><Badge tone={u.rol === 'ADMIN' ? 'amber' : 'slate'}>{u.rol}</Badge></td>
                  <td className="cell-actions">
                    {u.rol !== 'ADMIN' && (
                      <Button size="sm" variant="danger" onClick={() => eliminar(u)} icon={<Trash2 size={14} />}>Eliminar</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo usuario"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={guardar} icon={<Save size={16} />}>Guardar</Button>
          </>
        }
      >
        <form onSubmit={guardar} className="form-stack">
          <div className="grid-2">
            <Input label="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} error={errores.nombres} />
            <Input label="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} error={errores.apellidos} />
          </div>
          <Input label="Código universitario" value={codigo} onChange={(e) => setCodigo(e.target.value)} error={errores.codigo} placeholder="Ej. 20201234" />
          <Input label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} error={errores.correo} placeholder="usuario@universidad.edu.pe" />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errores.password} />
          <div className="field">
            <label className="field-label">Tipo de usuario</label>
            <div className="segmented">
              {(['Estudiante', 'Docente'] as const).map((t) => (
                <button key={t} type="button" className={tipo === t ? 'active' : ''} onClick={() => setTipo(t)}>{t}</button>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
