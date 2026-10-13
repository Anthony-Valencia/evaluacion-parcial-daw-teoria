const PREFIX = 'biblioteca_';
export const KEYS = {
  categorias: `${PREFIX}categorias`,
  libros: `${PREFIX}libros`,
  usuarios: `${PREFIX}usuarios`,
  prestamos: `${PREFIX}prestamos`,
  sesion: `${PREFIX}sesion`
} as const;
export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch { return fallback; }
}
export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
export function removeItem(key: string): void { localStorage.removeItem(key); }
export function uid(prefix = 'id_'): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
