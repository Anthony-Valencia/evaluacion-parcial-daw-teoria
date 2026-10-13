export const fmtFecha = (iso: string | null): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
export const fmtFechaHora = (iso: string | null): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
export const diasRestantes = (fechaLimite: string): number =>
  Math.ceil((new Date(fechaLimite).getTime() - Date.now()) / 86_400_000);
export const iniciales = (nombres: string, apellidos: string): string =>
  `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
