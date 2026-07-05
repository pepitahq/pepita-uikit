<script lang="ts">
  import { tick } from 'svelte';
  import { Warning, Info, PencilSimple } from 'phosphor-svelte';
  import { dialog } from './dialog-store.svelte';

  const current = $derived(dialog.current);

  let cardEl: HTMLElement | undefined = $state();
  let primaryBtn: HTMLButtonElement | undefined = $state();
  let promptInput: HTMLInputElement | undefined = $state();
  let promptValue = $state('');

  const FOCUSABLE =
    'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

  // Keep Tab focus within the dialog card.
  function trapTab(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !cardEl) return;
    const items = [...cardEl.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Auto-focus the input (prompt) or the primary button (alert/confirm).
  $effect(() => {
    if (!current) return;
    if (current.kind === 'prompt') {
      promptValue = current.initialValue ?? '';
      tick().then(() => {
        promptInput?.focus();
        promptInput?.select();
      });
    } else {
      tick().then(() => primaryBtn?.focus());
    }
  });

  function onKey(e: KeyboardEvent) {
    if (!current) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && current.kind !== 'prompt') {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!current) return;
    if (current.kind === 'alert') dialog._resolve(undefined);
    else if (current.kind === 'confirm') dialog._resolve(true);
    else if (current.kind === 'prompt') dialog._resolve(promptValue);
  }

  function cancel() {
    if (!current) return;
    if (current.kind === 'alert') dialog._resolve(undefined);
    else if (current.kind === 'confirm') dialog._resolve(false);
    else if (current.kind === 'prompt') dialog._resolve(null);
  }
</script>

<svelte:window onkeydown={onKey} />

{#if current}
  <div class="dialog-backdrop" onclick={cancel} role="presentation">
    <div
      class="dialog-card"
      bind:this={cardEl}
      role="dialog"
      aria-modal="true"
      aria-label={current.title ?? (current.kind === 'alert' ? 'Notice' : 'Confirm')}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={trapTab}
    >
      <header class="dialog-head">
        {#if current.destructive}
          <Warning size={16} weight="fill" class="dlg-warn" />
        {:else if current.kind === 'prompt'}
          <PencilSimple size={16} weight="bold" />
        {:else}
          <Info size={16} weight="bold" />
        {/if}
        <h2>
          {current.title ??
            (current.kind === 'alert'
              ? 'Notice'
              : current.kind === 'prompt'
                ? 'Enter a value'
                : 'Confirm')}
        </h2>
      </header>

      <form
        class="dialog-body"
        onsubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <p>{current.message}</p>
        {#if current.kind === 'prompt'}
          <input
            bind:this={promptInput}
            bind:value={promptValue}
            placeholder={current.placeholder ?? ''}
            class="dialog-input"
            type="text"
            autocomplete="off"
            spellcheck="false"
          />
        {/if}
      </form>

      <div class="dialog-actions">
        {#if current.kind !== 'alert'}
          <button type="button" class="dialog-btn dialog-btn-ghost" onclick={cancel}>
            {current.cancelLabel ?? 'Cancel'}
          </button>
        {/if}
        <button
          bind:this={primaryBtn}
          type="button"
          class="dialog-btn"
          class:dialog-btn-destructive={current.destructive}
          class:dialog-btn-primary={!current.destructive}
          onclick={submit}
        >
          {current.confirmLabel ??
            (current.kind === 'alert' ? 'OK' : current.kind === 'prompt' ? 'Save' : 'Confirm')}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .dialog-card {
    width: 100%;
    max-width: 28rem;
    background: var(--bg);
    border: 1px solid var(--rule);
    border-radius: 6px;
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
  }
  .dialog-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid var(--rule);
  }
  .dialog-head :global(.dlg-warn) {
    color: oklch(0.55 0.18 20);
  }
  .dialog-head h2 {
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
  }
  .dialog-body {
    padding: 1rem 1.1rem;
  }
  .dialog-body p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: var(--ink);
    white-space: pre-wrap;
  }
  .dialog-input {
    margin-top: 0.75rem;
    width: 100%;
    padding: 0.45rem 0.65rem;
    font-family: var(--font);
    font-size: 13px;
    color: var(--ink);
    background: white;
    border: 1px solid var(--rule);
    border-radius: 4px;
  }
  .dialog-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.65rem 1.1rem 1rem;
  }
  .dialog-btn {
    font-family: var(--font);
    font-size: 12px;
    padding: 0.4rem 0.85rem;
    border-radius: 4px;
    border: 1px solid var(--rule);
    cursor: pointer;
    transition: background 120ms, border-color 120ms, color 120ms;
  }
  .dialog-btn-ghost {
    background: transparent;
    color: var(--ink-soft);
  }
  .dialog-btn-ghost:hover {
    color: var(--ink);
    border-color: var(--ink-faint);
  }
  .dialog-btn-primary {
    background: var(--ink);
    color: white;
    border-color: var(--ink);
  }
  .dialog-btn-primary:hover {
    background: color-mix(in oklch, var(--ink) 88%, white);
  }
  .dialog-btn-destructive {
    background: oklch(0.55 0.18 20);
    color: white;
    border-color: oklch(0.55 0.18 20);
  }
  .dialog-btn-destructive:hover {
    background: oklch(0.5 0.18 20);
  }
  .dialog-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
</style>
