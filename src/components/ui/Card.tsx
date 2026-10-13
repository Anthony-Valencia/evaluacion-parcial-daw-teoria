import type { ReactNode } from 'react';
interface Props { children: ReactNode; title?: string; actions?: ReactNode; className?: string; }
export default function Card({ children, title, actions, className = '' }: Props) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (<header className="card-header">{title && <h2 className="card-title">{title}</h2>}{actions && <div className="card-actions">{actions}</div>}</header>)}
      <div className="card-body">{children}</div>
    </section>
  );
}
