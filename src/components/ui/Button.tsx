import type { ButtonHTMLAttributes, ReactNode } from 'react';
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type Size = 'sm' | 'md' | 'lg';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; icon?: ReactNode; full?: boolean; }
export default function Button({ variant = 'primary', size = 'md', icon, full, children, className = '', ...rest }: Props) {
  return (<button className={`btn btn-${variant} btn-${size} ${full ? 'btn-full' : ''} ${className}`} {...rest}>{icon && <span className="btn-icon">{icon}</span>}{children}</button>);
}
