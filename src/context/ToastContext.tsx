import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
type Tipo = 'success' | 'error' | 'info';
interface Toast { id: number; tipo: Tipo; mensaje: string; }
interface ToastCtx { push: (tipo: Tipo, mensaje: string) => void; }
const Ctx = createContext<ToastCtx | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((tipo: Tipo, mensaje: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);
  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const iconos = { success: <CheckCircle2 size={20} />, error: <AlertTriangle size={20} />, info: <Info size={20} /> };
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tipo}`}>
            <span className="toast-icon">{iconos[t.tipo]}</span>
            <span className="toast-msg">{t.mensaje}</span>
            <button className="toast-close" onClick={() => remove(t.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
