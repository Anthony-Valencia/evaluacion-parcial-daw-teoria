import type { ReactNode } from 'react';
type Tone = 'blue' | 'green' | 'red' | 'amber' | 'slate' | 'violet';
export default function Badge({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
