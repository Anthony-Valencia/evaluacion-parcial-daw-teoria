import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, IdCard, Lock, LogIn, UserPlus, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as usuarioService from '../services/usuarioService';
import { esCodigo, esEmail, minLen, requerido, soloLetras } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipo, setTipo] = useState<'Estudiante' | 'Docente'>('Estudiante');
  const [confirma, setConfirma] = useState('');

  const onSubmitLogin = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!requerido(codigo)) errs.codigo = 'Ingresa tu código.';
    if (!requerido(password)) errs.password = 'Ingresa tu contraseña.';
    setErrores(errs);
    if (Object.keys(errs).length) return;
    const res = login(codigo, password);
    if (!res.ok) { push('error', res.error ?? 'No se pudo iniciar sesión'); return; }
    push('success', '¡Bienvenido al sistema!');
    navigate('/', { replace: true });
  };

  const onSubmitRegistro = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!soloLetras(nombres)) errs.nombres = 'Solo letras (mínimo 2).';
    if (!soloLetras(apellidos)) errs.apellidos = 'Solo letras (mínimo 2).';
    if (!esCodigo(codigo)) errs.codigo = 'Código alfanumérico de 4 a 15 caracteres.';
    else if (usuarioService.existeCodigo(codigo)) errs.codigo = 'Ese código ya está registrado.';
    if (!esEmail(correo)) errs.correo = 'Correo electrónico inválido.';
    else if (usuarioService.existeCorreo(correo)) errs.correo = 'Ese correo ya está registrado.';
    if (!minLen(password, 6)) errs.password = 'Mínimo 6 caracteres.';
    if (password !== confirma) errs.confirma = 'Las contraseñas no coinciden.';
    setErrores(errs);
    if (Object.keys(errs).length) return;
    usuarioService.crear({ nombres: nombres.trim(), apellidos: apellidos.trim(), codigo: codigo.trim().toUpperCase(), correo: correo.trim().toLowerCase(), tipo, password, rol: 'USUARIO' });
    push('success', 'Usuario registrado. Ahora puedes iniciar sesión.');
    setModo('login');
    setNombres(''); setApellidos(''); setCorreo(''); setConfirma('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo"><Library size={30} /></div>
          <h1>Biblioteca Central</h1>
          <p>Sistema de Gestión Universitaria</p>
        </div>
        <div className="auth-tabs">
          <button className={modo === 'login' ? 'active' : ''} onClick={() => setModo('login')}>Iniciar sesión</button>
          <button className={modo === 'registro' ? 'active' : ''} onClick={() => setModo('registro')}>Registrarme</button>
        </div>
        {modo === 'login' ? (
          <form className="auth-form" onSubmit={onSubmitLogin}>
            <Input label="Código universitario" icon={<IdCard size={16} />} placeholder="ADMIN001" value={codigo} onChange={(e) => setCodigo(e.target.value)} error={errores.codigo} />
            <Input label="Contraseña" type="password" icon={<Lock size={16} />} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errores.password} />
            <Button type="submit" full icon={<LogIn size={16} />}>Ingresar</Button>
            <div className="auth-hint"><Info size={14} /><span>Demo admin → <b>ADMIN001</b> / <b>admin123</b></span></div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onSubmitRegistro}>
            <div className="grid-2">
              <Input label="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} error={errores.nombres} />
              <Input label="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} error={errores.apellidos} />
            </div>
            <Input label="Código universitario" value={codigo} onChange={(e) => setCodigo(e.target.value)} error={errores.codigo} />
            <Input label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} error={errores.correo} />
            <div className="grid-2">
              <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errores.password} />
              <Input label="Confirmar contraseña" type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} error={errores.confirma} />
            </div>
            <div className="field">
              <label className="field-label">Tipo de usuario</label>
              <div className="segmented">
                {(['Estudiante', 'Docente'] as const).map((t) => (
                  <button key={t} type="button" className={tipo === t ? 'active' : ''} onClick={() => setTipo(t)}>{t}</button>
                ))}
              </div>
            </div>
            <Button type="submit" full icon={<UserPlus size={16} />}>Crear cuenta</Button>
          </form>
        )}
      </div>
    </div>
  );
}
