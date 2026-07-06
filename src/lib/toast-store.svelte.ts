/**
 * Transient notifications, matching pepita's editor toasts (top-center,
 * tinted by variant). Mount <Toaster /> once at the root, then anywhere:
 *
 *   toast.success('Saved.');                 // auto-dismisses
 *   toast.error('Publish failed.');          // sticky until dismissed
 *   toast.warning('Someone else saved.', { action: { label: 'Pull latest', onClick } });
 *   const id = toast.info('Working…', { duration: 0 }); toast.dismiss(id);
 */

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
}

export interface ToastOptions {
  /** ms before auto-dismiss; 0 = sticky. Defaults: info/success 4000, warning/error sticky. */
  duration?: number;
  action?: ToastAction;
}

// Matches pepita: success auto-dismisses; error/warning (conflict) stay put.
const DEFAULT_DURATION: Record<ToastVariant, number> = {
  info: 4000,
  success: 4000,
  warning: 0,
  error: 0
};

let items = $state<ToastItem[]>([]);
let seq = 0;

function push(message: string, variant: ToastVariant, opts: ToastOptions): number {
  const id = ++seq;
  items.push({ id, message, variant, action: opts.action });
  const ms = opts.duration ?? DEFAULT_DURATION[variant];
  if (ms > 0) setTimeout(() => dismiss(id), ms);
  return id;
}

function dismiss(id: number): void {
  items = items.filter((t) => t.id !== id);
}

export const toast = {
  get items(): ToastItem[] {
    return items;
  },
  info(message: string, opts: ToastOptions = {}): number {
    return push(message, 'info', opts);
  },
  success(message: string, opts: ToastOptions = {}): number {
    return push(message, 'success', opts);
  },
  warning(message: string, opts: ToastOptions = {}): number {
    return push(message, 'warning', opts);
  },
  error(message: string, opts: ToastOptions = {}): number {
    return push(message, 'error', opts);
  },
  dismiss
};
