import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-icon"><Compass size={56} /></div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p className="muted">La ruta que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary btn-md">Volver al inicio</Link>
    </div>
  );
}
