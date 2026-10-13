import type { SelectHTMLAttributes, ReactNode } from 'react';
interface Props extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; icon?: ReactNode; options: { value: string; label: string }[]; placeholder?: string; }
export default function Select({ label, error, icon, options, placeholder, className = '', ...rest }: Props) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="field-control">
        {icon && <span className="field-icon">{icon}</span>}
        <select className={`input select ${icon ? 'input-with-icon' : ''} ${className}`} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      </div>
      {error && <span className="field-msg">{error}</span>}
    </div>
  );
}
