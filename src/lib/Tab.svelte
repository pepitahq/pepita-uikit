<script lang="ts">
  import { X } from 'phosphor-svelte';

  let {
    label,
    active = false,
    closable = false,
    onSelect,
    onClose
  }: {
    label: string;
    active?: boolean;
    closable?: boolean;
    onSelect?: () => void;
    onClose?: () => void;
  } = $props();
</script>

{#if closable}
  <div class="tab-wrap" class:is-active={active} title={label}>
    <button type="button" class="tab-btn-inner" onclick={onSelect}>
      <span>{label}</span>
    </button>
    <button type="button" class="tab-close" aria-label={`Close ${label}`} onclick={onClose}>
      <X size={10} weight="bold" />
    </button>
  </div>
{:else}
  <button
    type="button"
    class="tab-btn"
    class:is-active={active}
    title={label}
    aria-pressed={active}
    onclick={onSelect}
  >
    <span>{label}</span>
  </button>
{/if}

<style>
  .tab-btn,
  .tab-btn-inner {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--font);
    font-size: 0.75rem;
    color: var(--ink-soft);
    background: transparent;
    border: 0;
    height: 2.25rem;
    padding: 0 0.75rem;
    cursor: pointer;
    transition: color 120ms, background 120ms;
  }
  .tab-btn { border-right: 1px solid var(--rule); flex-shrink: 0; position: relative; }
  .tab-btn:hover:not(.is-active),
  .tab-wrap:hover:not(.is-active) {
    color: var(--ink);
    background: color-mix(in oklch, var(--ink) 4%, transparent);
  }
  .tab-btn.is-active {
    color: var(--accent);
    background: color-mix(in oklch, var(--accent) 12%, transparent);
    box-shadow: inset 0 2px 0 0 var(--accent);
  }
  .tab-wrap {
    display: inline-flex;
    align-items: stretch;
    border-right: 1px solid var(--rule);
    flex-shrink: 0;
    position: relative;
  }
  .tab-wrap.is-active {
    background: color-mix(in oklch, var(--accent) 12%, transparent);
    box-shadow: inset 0 2px 0 0 var(--accent);
  }
  .tab-wrap.is-active .tab-btn-inner { color: var(--accent); }
  .tab-wrap.is-active .tab-close { color: color-mix(in oklch, var(--accent) 70%, transparent); }
  .tab-wrap.is-active .tab-close:hover { color: var(--accent); }
  .tab-btn-inner { padding: 0 0.375rem 0 0.75rem; }
  .tab-close {
    display: inline-flex;
    align-items: center;
    padding: 0 0.625rem 0 0.25rem;
    color: var(--ink-faint);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .tab-close:hover { color: var(--ink); }
</style>
