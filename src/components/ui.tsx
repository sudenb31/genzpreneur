import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

/* ------------------------------ Toast ------------------------------ */

type ToastKind = 'success' | 'error' | 'info';
interface Toast { id: number; kind: ToastKind; message: string }

const ToastContext = createContext<(kind: ToastKind, message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  const tone: Record<ToastKind, string> = {
    success: 'border-ok/30 bg-ok-soft text-ok',
    error: 'border-danger/30 bg-danger-soft text-danger',
    info: 'border-line bg-white text-ink',
  };
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${tone[t.kind]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* -------------------------- Confirm dialog ------------------------- */

export function ConfirmDialog(props: {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); if (!props.busy) props.onCancel(); }}
      className="m-auto w-[min(92vw,440px)] rounded-2xl border border-line bg-white p-0 text-ink backdrop:bg-ink/40"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold">{props.title}</h2>
        <div className="mt-2 text-sm text-muted">{props.description}</div>
        {props.children && <div className="mt-4">{props.children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={props.onCancel} disabled={props.busy}>Batal</button>
          <button type="button" className={props.danger ? 'btn-danger' : 'btn-primary'} onClick={props.onConfirm} disabled={props.busy}>
            {props.busy ? 'Memproses…' : props.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------ States ----------------------------- */

export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat">
      <div className="skeleton h-8 w-1/3" />
      <div className="skeleton h-4 w-2/3" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="skeleton h-32" />
        <div className="skeleton h-32" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-amber-soft text-amber-ink" aria-hidden>○</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft p-5 text-sm text-danger">
      <p className="font-medium">{message}</p>
      {onRetry && <button type="button" className="btn-ghost mt-3" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-muted">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-amber transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden><rect width="32" height="32" rx="8" fill="currentColor" /><path d="M9 21V11h7a4 4 0 0 1 0 8h-4" stroke="#e08a1e" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>GenZ Preneur</span>
    </span>
  );
}
