import type { ReactNode } from 'react';
import { X } from 'lucide-react';
interface Props { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg'; }
export default function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
