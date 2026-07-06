<script lang="ts">
  import { fly } from 'svelte/transition';
  import { X, CheckCircle, XCircle, Warning, Info } from 'phosphor-svelte';
  import { toast } from './toast-store.svelte';

  const ICON = { info: Info, success: CheckCircle, warning: Warning, error: XCircle };
</script>

<div class="toaster">
  {#each toast.items as t (t.id)}
    {@const Icon = ICON[t.variant]}
    <div
      class="toast toast-{t.variant}"
      role="status"
      aria-live="polite"
      transition:fly={{ y: -16, duration: 200 }}
    >
      <span class="toast-ico"><Icon size={16} weight="fill" /></span>
      <span class="toast-msg">{t.message}</span>
      {#if t.action}
        {@const act = t.action}
        <button
          type="button"
          class="toast-action"
          onclick={() => {
            act.onClick();
            toast.dismiss(t.id);
          }}
        >
          {act.label}
        </button>
      {/if}
      <button type="button" class="toast-close" onclick={() => toast.dismiss(t.id)} aria-label="Dismiss">
        <X size={12} weight="bold" />
      </button>
    </div>
  {/each}
</div>

<style>
  .toaster {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 110;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: min(calc(100vw - 2rem), 28rem);
    pointer-events: none;
  }
  .toast {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid;
    border-radius: 6px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
    font-family: var(--font);
    font-size: 13px;
    line-height: 1.4;
  }
  .toast-ico {
    flex: 0 0 auto;
    margin-top: 1px;
  }
  .toast-msg {
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }
  .toast-action {
    flex: 0 0 auto;
    border: 0;
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
    font-family: var(--font);
    font-size: 11px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.08);
    color: inherit;
  }
  .toast-action:hover {
    background: rgba(0, 0, 0, 0.14);
  }
  .toast-close {
    flex: 0 0 auto;
    display: inline-grid;
    place-items: center;
    width: 20px;
    height: 20px;
    margin: -1px -2px 0 0;
    border: 0;
    background: transparent;
    color: inherit;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.65;
  }
  .toast-close:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.06);
  }

  /* Variant tints (match pepita's editor toasts). */
  .toast-success {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
  }
  .toast-error {
    background: #fef2f2;
    border-color: #fecaca;
    color: #991b1b;
  }
  .toast-warning {
    background: #fffbeb;
    border-color: #fde68a;
    color: #78350f;
  }
  .toast-info {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
  }
  .toast-warning .toast-action {
    background: #fde68a;
  }
  .toast-warning .toast-action:hover {
    background: #fcd34d;
  }
</style>
