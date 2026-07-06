<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';
  import { X } from 'phosphor-svelte';

  let {
    open = $bindable(false),
    title,
    width = '640px',
    height,
    onClose,
    icon,
    tabs,
    footer,
    children
  }: {
    open?: boolean;
    title?: string;
    /** Panel width (CSS length). Clamped to 92vw. */
    width?: string;
    /** Optional fixed panel height (CSS length). Clamped to 92vh. */
    height?: string;
    onClose?: () => void;
    icon?: Snippet;
    /** Optional strip between the header and the body (e.g. an UnderlineTabBar). */
    tabs?: Snippet;
    footer?: Snippet;
    children: Snippet;
  } = $props();

  const FOCUSABLE =
    'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

  let panelEl: HTMLElement | undefined = $state();

  function close() {
    open = false;
    onClose?.();
  }

  // Focus management: focus into the panel on open, restore focus on close.
  $effect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    tick().then(() => {
      const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelEl)?.focus();
    });
    return () => prev?.focus?.();
  });

  function onWindowKey(e: KeyboardEvent) {
    if (open && e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  // Trap Tab within the panel.
  function onPanelKey(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !panelEl) return;
    const items = [...panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null || el === panelEl
    );
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
</script>

<svelte:window onkeydown={onWindowKey} />

{#if open}
  <div class="modal-backdrop" onclick={close} role="presentation">
    <div
      class="modal-panel"
      bind:this={panelEl}
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Dialog'}
      style:width
      style:height={height ?? 'auto'}
      onclick={(e) => e.stopPropagation()}
      onkeydown={onPanelKey}
    >
      <header class="modal-head">
        {#if icon}{@render icon()}{/if}
        {#if title}<h2 class="modal-title">{title}</h2>{/if}
        <button type="button" class="modal-close" onclick={close} aria-label="Close">
          <X size={14} weight="bold" />
        </button>
      </header>

      {#if tabs}<div class="modal-tabs">{@render tabs()}</div>{/if}

      <div class="modal-body">{@render children()}</div>

      {#if footer}<div class="modal-foot">{@render footer()}</div>{/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .modal-panel {
    display: flex;
    flex-direction: column;
    background: var(--surface-raised);
    color: var(--ink);
    border: 1px solid var(--rule);
    border-radius: 8px;
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.35);
    max-width: 92vw;
    max-height: 92vh;
    outline: none;
  }
  .modal-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid var(--rule);
    flex-shrink: 0;
  }
  .modal-title {
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
  }
  .modal-close {
    margin-left: auto;
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    color: var(--ink-soft);
    border-radius: 4px;
    cursor: pointer;
    transition: color 120ms, background 120ms;
  }
  .modal-close:hover {
    color: var(--accent);
    background: color-mix(in oklch, var(--accent) 10%, transparent);
  }
  .modal-tabs {
    padding: 0.5rem 1.25rem 0;
    border-bottom: 1px solid var(--rule);
    flex-shrink: 0;
  }
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.25rem;
    min-height: 0;
  }
  .modal-foot {
    flex-shrink: 0;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--rule);
  }
</style>
