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
      <div aria-live="polite" className="toast-stack pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`pointer-events-auto w-full max-w-sm rounded-2xl border-2 px-4 py-3 text-sm font-bold shadow-[3px_3px_0_0_#111112] ${tone[t.kind]}`}>
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
  cancelLabel?: string;
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
      className="m-auto w-[min(92vw,440px)] rounded-3xl border-2 border-ink bg-white p-0 text-ink shadow-[5px_5px_0_0_#111112] backdrop:bg-ink/50"
    >
      <div className="p-6">
        <h2 className="font-display text-xl font-extrabold">{props.title}</h2>
        <div className="mt-2 text-sm text-muted">{props.description}</div>
        {props.children && <div className="mt-4">{props.children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={props.onCancel} disabled={props.busy}>{props.cancelLabel ?? 'Batal'}</button>
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
      <div className="mb-3 grid h-12 w-12 rotate-3 place-items-center rounded-2xl border-2 border-ink bg-lime text-xl" aria-hidden>✦</div>
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
      <div className="h-2.5 overflow-hidden rounded-full border border-ink/10 bg-paper-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-amber to-[#ff8a3d] transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`}>
      <img src="/genz-preneur-logo.png" alt="GenZ Preneur — Learn, Execute, Grow" width={1254} height={1254} />
    </span>
  );
}

/* ---------------------------- Extra helpers ---------------------------- */

export function CopyButton({ text, label = 'Salin', className = 'btn-ghost' }: { text: string; label?: string; className?: string }) {
  const toast = useToast();
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast('success', 'Tersalin ke clipboard.');
      setTimeout(() => setDone(false), 1800);
    } catch {
      toast('error', 'Gagal menyalin. Blok teksnya lalu salin manual.');
    }
  }
  return <button type="button" className={className} onClick={() => void copy()}>{done ? '✓ Tersalin' : label}</button>;
}

export function PageHeader({ eyebrow, title, desc, right }: { eyebrow: string; title: ReactNode; desc?: ReactNode; right?: ReactNode }) {
  return (
    <header className="workspace-page-header flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-page mt-1">{title}</h1>
        {desc && <p className="mt-2 text-muted">{desc}</p>}
      </div>
      {right ?? <span aria-hidden className="brand-sticker">IDE → AKSI ✦</span>}
    </header>
  );
}

export const TILE_BG: Record<string, string> = {
  lime: 'bg-lime', lilac: 'bg-lilac', sky: 'bg-sky', pink: 'bg-pink', 'amber-soft': 'bg-amber-soft', amber: 'bg-amber',
};
