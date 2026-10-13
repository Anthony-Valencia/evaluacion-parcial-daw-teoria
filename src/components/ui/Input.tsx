import type { InputHTMLAttributes, ReactNode } from 'react';
interface Props extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: ReactNode; hint?: string; }
export default function Input({ label, error, icon, hint, className = '', ...rest }: Props) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="field-control">
        {icon && <span className="field-icon">{icon}</span>}
        <input className={`input ${icon ? 'input-with-icon' : ''} ${className}`} {...rest} />
      </div>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-msg">{error}</span>}
    </div>
  );
}
