"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info, RotateCcw, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export function Button({
  variant = "primary",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Shows a spinner, sets aria-busy and disables the button while true. */
  loading?: boolean;
}) {
  const styles = {
    primary:
      "bg-sen text-white enabled:hover:bg-sen-dark focus-visible:outline-sen",
    secondary:
      "bg-white text-sen border border-sen/30 enabled:hover:bg-sen-light focus-visible:outline-sen",
    danger:
      "bg-red-600 text-white enabled:hover:bg-red-700 focus-visible:outline-red-600",
    ghost:
      "text-slate-600 enabled:hover:bg-lotus-light focus-visible:outline-sen",
  };
  return (
    <button
      className={cx(
        // text-base + generous padding: >=44px target for elderly users
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-base font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
      {/* keep children mounted (invisible) so the width stays stable */}
      <span
        className={cx(
          "inline-flex items-center justify-center gap-2",
          loading && "invisible"
        )}
      >
        {children}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-base font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-base outline-none transition-colors focus:border-sen focus:ring-2 focus:ring-sen-light",
          error ? "border-red-400" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
}) {
  const autoId = React.useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-base font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-base outline-none transition-colors focus:border-sen focus:ring-2 focus:ring-sen-light",
          error ? "border-red-400" : "border-slate-300",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces & status                                                   */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-lotus-light bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  color,
  children,
}: {
  color: "green" | "gray" | "red" | "yellow";
  children: React.ReactNode;
}) {
  const styles = {
    green: "bg-leaf-light text-leaf-dark",
    gray: "bg-slate-100 text-slate-600",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium",
        styles[color]
      )}
    >
      {children}
    </span>
  );
}

export function Alert({
  kind = "error",
  className,
  children,
}: {
  kind?: "error" | "success" | "info";
  className?: string;
  children: React.ReactNode;
}) {
  const styles = {
    error: "bg-red-50 text-red-700 border border-red-200",
    success: "bg-leaf-light text-leaf-dark border border-leaf/40",
    info: "bg-sen-light text-sen-dark border border-sen/30",
  };
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? undefined : "polite"}
      className={cx("rounded-lg px-4 py-3 text-base", styles[kind], className)}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

function getFocusables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), audio[controls], video[controls], [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.getClientRects().length > 0);
}

export function Modal({
  open,
  ...props
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /**
   * When false, backdrop clicks and Escape are ignored (protects forms with
   * typed content from accidental data loss). The X button and any explicit
   * Cancel action still close. Default true.
   */
  dismissible?: boolean;
  /** Accessible label for the X close button; localized default. */
  closeLabel?: string;
}) {
  if (!open) return null;
  return <ModalContent {...props} />;
}

function ModalContent({
  onClose,
  title,
  children,
  dismissible = true,
  closeLabel,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  dismissible?: boolean;
  closeLabel?: string;
}) {
  const { t } = useI18n();
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mouseDownOnBackdrop = React.useRef(false);

  // Focus management + body scroll lock for the lifetime of the dialog.
  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first = getFocusables(panel)[0];
    (first ?? panel)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (dismissible) {
        e.stopPropagation();
        onClose();
      }
      return;
    }
    if (e.key !== "Tab") return;
    // Hand-rolled focus trap: loop Tab / Shift+Tab inside the panel.
    const focusables = getFocusables(panelRef.current);
    if (focusables.length === 0) {
      e.preventDefault();
      panelRef.current?.focus();
      return;
    }
    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === firstEl || active === panelRef.current)) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && active === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (dismissible && mouseDownOnBackdrop.current && e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl outline-none"
      >
        <h3
          id={titleId}
          className="mb-4 pr-10 text-xl font-semibold text-slate-900"
        >
          {title}
        </h3>
        {children}
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel ?? t("close")}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sen"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!busy) onCancel();
      }}
      title={title}
      dismissible={!busy}
    >
      <div className="text-base text-slate-700">{message}</div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          loading={busy}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Loading & placeholder states                                        */
/* ------------------------------------------------------------------ */

export function Spinner({
  size = "md",
  label,
  className,
}: {
  size?: "sm" | "md";
  /** Visually hidden, announced label; defaults to the localized "Loading". */
  label?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
  };
  return (
    <span role="status" className={cx("inline-flex", className)}>
      <span
        aria-hidden="true"
        className={cx(
          "animate-spin rounded-full border-lotus-light border-t-sen",
          sizes[size]
        )}
      />
      <span className="sr-only">{label ?? t("loading")}</span>
    </span>
  );
}

/** Centered page-level loader for route/data gates. */
export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <Spinner label={label} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("animate-pulse rounded-lg bg-slate-200/80", className)}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-1 text-slate-500" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {description && (
        <p className="max-w-sm text-base text-slate-600">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  retryLabel,
  className,
}: {
  message: string;
  onRetry?: () => void;
  /** Label for the retry button; localized default. */
  retryLabel?: string;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className={cx(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center",
        className
      )}
    >
      <AlertCircle size={32} className="mb-1 text-red-600" aria-hidden="true" />
      <p className="max-w-sm text-base font-semibold text-red-700">{message}</p>
      {onRetry && (
        <div className="mt-3">
          <Button variant="secondary" onClick={onRetry}>
            <RotateCcw size={18} aria-hidden="true" />
            {retryLabel ?? t("retry")}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

export type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

const TOAST_DURATION: Record<ToastKind, number> = {
  success: 5000,
  info: 5000,
  error: 8000, // errors linger longer — elderly users need reading time
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);
  const timersRef = React.useRef(
    new Map<number, ReturnType<typeof setTimeout>>()
  );

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = ++idRef.current;
      setToasts((current) => [...current, { id, message, kind }].slice(-4));
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), TOAST_DURATION[kind])
      );
    },
    [dismiss]
  );

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 px-4 pb-4 sm:items-end sm:pr-6">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const { t } = useI18n();
  const isError = item.kind === "error";
  const styles: Record<ToastKind, string> = {
    success: "border-leaf/40 bg-leaf-light text-leaf-dark",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-sen/30 bg-sen-light text-sen-dark",
  };
  const icons: Record<ToastKind, React.ReactNode> = {
    success: <CheckCircle2 size={22} aria-hidden="true" />,
    error: <AlertCircle size={22} aria-hidden="true" />,
    info: <Info size={22} aria-hidden="true" />,
  };
  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cx(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border p-4 text-base font-medium shadow-lg",
        styles[item.kind]
      )}
    >
      <span className="shrink-0">{icons[item.kind]}</span>
      <p className="flex-1">{item.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t("dismissNotification")}
        className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-current opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
