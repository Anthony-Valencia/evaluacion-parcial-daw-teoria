import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileText, Download, ArrowLeft, CheckCircle2, Clock, User, BookOpen, Calendar } from 'lucide-react';
import * as prestService from '../services/prestamoService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { descargarComprobante } from '../utils/pdf';
import { fmtFecha, fmtFechaHora } from '../utils/format';

export default function Comprobante() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prestamo = id ? prestService.obtener(id) : undefined;

  if (!prestamo) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        title="Comprobante no encontrado"
        description="El código del préstamo no existe o fue eliminado."
        action={<Link to="/mis-prestamos" className="btn btn-primary btn-md">Volver a mis préstamos</Link>}
      />
    );
  }

  const vencido = prestService.estaVencido(prestamo);

  return (
    <>
      <PageHeader
        icon={<FileText size={22} />}
        title="Comprobante digital"
        subtitle="Detalle completo del préstamo"
        actions={
          <div className="row-actions">
            <Button variant="ghost" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>Volver</Button>
            <Button onClick={() => descargarComprobante(prestamo)} icon={<Download size={16} />}>Descargar PDF</Button>
          </div>
        }
      />

      <div className="comprobante">
        <div className="comprobante-header">
          <div className="comprobante-brand">
            <div className="comprobante-logo"><BookOpen size={26} /></div>
            <div>
              <h2>Biblioteca Central</h2>
              <p>Sistema de Gestión Universitaria</p>
            </div>
          </div>
          <div className="comprobante-codigo">
            <span>Código único</span>
            <strong>{prestamo.id}</strong>
          </div>
        </div>

        <div className="comprobante-status">
          {prestamo.estado === 'Devuelto' ? (
            <Badge tone="green"><CheckCircle2 size={14} /> Devuelto</Badge>
          ) : vencido ? (
            <Badge tone="red"><Clock size={14} /> Vencido</Badge>
          ) : (
            <Badge tone="blue"><Clock size={14} /> Activo</Badge>
          )}
        </div>

        <div className="comprobante-grid">
          <Card title="Datos del usuario">
            <ul className="detail-list">
              <li><User size={16} /><span>Nombre</span><strong>{prestamo.usuarioNombre}</strong></li>
              <li><User size={16} /><span>Código</span><strong>{prestamo.usuarioCodigo}</strong></li>
            </ul>
          </Card>

          <Card title="Datos del libro">
            <ul className="detail-list">
              <li><BookOpen size={16} /><span>Título</span><strong>{prestamo.libroTitulo}</strong></li>
              <li><BookOpen size={16} /><span>Autor</span><strong>{prestamo.libroAutor}</strong></li>
              <li><BookOpen size={16} /><span>ISBN</span><strong>{prestamo.libroIsbn}</strong></li>
            </ul>
          </Card>

          <Card title="Fechas del préstamo">
            <ul className="detail-list">
              <li><Calendar size={16} /><span>Fecha de préstamo</span><strong>{fmtFecha(prestamo.fechaPrestamo)}</strong></li>
              <li><Calendar size={16} /><span>Fecha límite</span><strong>{fmtFecha(prestamo.fechaLimite)}</strong></li>
              <li><Calendar size={16} /><span>Fecha de devolución</span><strong>{prestamo.fechaDevolucion ? fmtFecha(prestamo.fechaDevolucion) : 'Pendiente'}</strong></li>
            </ul>
          </Card>

          <Card title="Detalles adicionales">
            <ul className="detail-list">
              <li><FileText size={16} /><span>Días de préstamo</span><strong>{prestamo.dias} días</strong></li>
              <li><FileText size={16} /><span>Estado</span><strong>{prestamo.estado}</strong></li>
              <li><FileText size={16} /><span>Generado</span><strong>{fmtFechaHora(new Date().toISOString())}</strong></li>
            </ul>
          </Card>
        </div>

        <p className="comprobante-foot">
          Documento generado automáticamente por el Sistema de Gestión de Biblioteca Universitaria.
          Presente este comprobante al momento de la devolución.
        </p>
      </div>
    </>
  );
}
