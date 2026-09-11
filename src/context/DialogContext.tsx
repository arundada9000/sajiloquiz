import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Check, Info, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
};

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type PromptOptions = {
  title: string;
  label?: string;
  initial?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type DialogContextValue = {
  toast: (variant: ToastVariant, title: string, description?: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);
  const [promptState, setPromptState] = useState<{
    options: PromptOptions;
    resolve: (v: string | null) => void;
    id: string;
  } | null>(null);

  const toast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = Date.now() + Math.round(Math.random() * 1000);
      setToasts((prev) => [...prev.slice(-3), { id, variant, title, description }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setPromptState({
        options,
        resolve,
        id: `prompt-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      });
    });
  }, []);

  const resolveConfirm = useCallback(
    (value: boolean) => {
      confirmState?.resolve(value);
      setConfirmState(null);
    },
    [confirmState],
  );

  const resolvePrompt = useCallback(
    (value: string | null) => {
      promptState?.resolve(value);
      setPromptState(null);
    },
    [promptState],
  );

  // Esc closes the topmost dialog and rejects it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (promptState) resolvePrompt(null);
        else if (confirmState) resolveConfirm(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [promptState, confirmState, resolvePrompt, resolveConfirm]);

  // Lock body scroll while a modal is open.
  useEffect(() => {
    const open = !!(confirmState || promptState);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmState, promptState]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<DialogContextValue>(
    () => ({ toast, confirm, prompt }),
    [toast, confirm, prompt],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}

      {/* Custom toast stack */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[110] flex flex-col items-stretch sm:items-end gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastView key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>

      {/* Custom confirm dialog */}
      {confirmState && (
        <ConfirmDialog
          options={confirmState.options}
          onConfirm={() => resolveConfirm(true)}
          onCancel={() => resolveConfirm(false)}
          label={confirmState.options.confirmLabel ?? "OK"}
        />
      )}

      {/* Custom prompt dialog */}
      {promptState && (
        <PromptDialog
          key={promptState.id}
          options={promptState.options}
          onSubmit={(v) => resolvePrompt(v)}
          onCancel={() => resolvePrompt(null)}
        />
      )}
    </DialogContext.Provider>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const iconClass = { className: "w-5 h-5 shrink-0" };
  if (variant === "success")
    return <Check {...iconClass} className="w-5 h-5 shrink-0 text-[rgb(var(--success))]" />;
  if (variant === "error")
    return <XCircle {...iconClass} className="w-5 h-5 shrink-0 text-[rgb(var(--danger))]" />;
  if (variant === "warning")
    return <AlertTriangle {...iconClass} className="w-5 h-5 shrink-0 text-[rgb(var(--warning))]" />;
  return <Info {...iconClass} className="w-5 h-5 shrink-0 text-[rgb(var(--color-primary))]" />;
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  return (
    <div className="pointer-events-auto w-full sm:w-80 flex items-start gap-3 p-4 rounded-xl glass-panel shadow-xl animate-fade-in">
      <ToastIcon variant={toast.variant} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[rgb(var(--text-primary))]">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs text-[rgb(var(--text-secondary))] mt-0.5 break-words">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 -m-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] rounded"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmDialog({
  options,
  onConfirm,
  onCancel,
  label,
}: {
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
  label: string;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 overlay animate-fade-in" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-10 glass-panel rounded-2xl p-6 w-full max-w-sm animate-scale-in space-y-4"
      >
        <h3 id="dialog-title" className="text-lg font-black text-[rgb(var(--text-primary))]">
          {options.title}
        </h3>
        <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">
          {options.message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold text-[rgb(var(--text-primary))] bg-[var(--fill)] hover:bg-[var(--separator)] transition-colors"
          >
            {options.cancelLabel ?? "Cancel"}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-[rgb(var(--label-inverse))] transition-colors ${
              options.danger
                ? "bg-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/85"
                : "bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))]"
            }`}
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptDialog({
  options,
  onSubmit,
  onCancel,
}: {
  options: PromptOptions;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(options.initial ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const next = value.trim();
    if (next) onSubmit(next);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 overlay animate-fade-in" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
        className="relative z-10 glass-panel rounded-2xl p-6 w-full max-w-sm animate-scale-in space-y-4"
      >
        <h3 id="prompt-title" className="text-lg font-black text-[rgb(var(--text-primary))]">
          {options.title}
        </h3>
        <div className="space-y-1.5">
          {options.label && (
            <label className="text-xs uppercase tracking-wider text-[rgb(var(--text-secondary))] font-bold">
              {options.label}
            </label>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={options.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="w-full ios-input px-3 py-2.5"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold text-[rgb(var(--text-primary))] bg-[var(--fill)] hover:bg-[var(--separator)] transition-colors"
          >
            {options.cancelLabel ?? "Cancel"}
          </button>
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="px-4 py-2 rounded-lg text-sm font-bold text-[rgb(var(--label-inverse))] bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))] transition-colors disabled:opacity-40"
          >
            {options.confirmLabel ?? "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}