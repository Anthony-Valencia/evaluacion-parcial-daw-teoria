import type { ReactNode } from 'react';
interface Props { icon: ReactNode; title: string; subtitle?: string; actions?: ReactNode; }
export default function PageHeader({ icon, title, subtitle, actions }: Props) {
  return (
    <header className="page-header">
      <div className="page-header-info">
        <span className="page-header-icon">{icon}</span>
        <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}
