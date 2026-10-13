export const requerido = (v: string): boolean => v.trim().length > 0;
export const minLen = (v: string, n: number): boolean => v.trim().length >= n;
export const esEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v.trim());
export const esISBN = (v: string): boolean => /^(?:\d{9}[\dXx]|\d{13})$/.test(v.replace(/[-\s]/g, ''));
export const esCodigo = (v: string): boolean => /^[A-Za-z0-9]{4,15}$/.test(v.trim());
export const esEnteroPositivo = (v: string | number): boolean => { const n = Number(v); return Number.isInteger(n) && n >= 0; };
export const soloLetras = (v: string): boolean => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.'-]+$/.test(v.trim());
