/**
 * Imperative-API replacement for the browser's native alert() / confirm() /
 * prompt(). Mount <Dialog /> once at the root; then anywhere:
 *
 *   await dialog.alert('something happened');
 *   if (!await dialog.confirm('really?', { destructive: true })) return;
 *   const name = await dialog.prompt('Rename to:', { initialValue: cur });
 */

interface BaseRequest {
  title?: string;
  message: string;
  /** Renders the primary button in red — for destructive actions. */
  destructive?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Optional quiet footer link under the message (e.g. the status page on
   *  operation-failure alerts). Opens in a new tab. */
  link?: { href: string; label: string };
}

interface PromptOptions extends BaseRequest {
  initialValue?: string;
  placeholder?: string;
}

export type DialogRequest =
  | (BaseRequest & { kind: 'alert'; resolve: () => void })
  | (BaseRequest & { kind: 'confirm'; resolve: (ok: boolean) => void })
  | (PromptOptions & { kind: 'prompt'; resolve: (value: string | null) => void });

let current = $state<DialogRequest | null>(null);

export const dialog = {
  get current(): DialogRequest | null {
    return current;
  },

  alert(message: string, options: Partial<BaseRequest> = {}): Promise<void> {
    return new Promise((resolveOuter) => {
      current = {
        kind: 'alert',
        ...options,
        message,
        resolve: () => {
          current = null;
          resolveOuter();
        }
      };
    });
  },

  confirm(message: string, options: Partial<BaseRequest> = {}): Promise<boolean> {
    return new Promise((resolveOuter) => {
      current = {
        kind: 'confirm',
        ...options,
        message,
        resolve: (ok: boolean) => {
          current = null;
          resolveOuter(ok);
        }
      };
    });
  },

  prompt(message: string, options: Partial<PromptOptions> = {}): Promise<string | null> {
    return new Promise((resolveOuter) => {
      current = {
        kind: 'prompt',
        ...options,
        message,
        resolve: (value: string | null) => {
          current = null;
          resolveOuter(value);
        }
      };
    });
  },

  /** Internal — called by Dialog.svelte when the user picks an action. */
  _resolve(value: unknown): void {
    if (!current) return;
    (current.resolve as (v: unknown) => void)(value);
  }
};
