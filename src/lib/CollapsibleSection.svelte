<script lang="ts">
  /**
   * A collapsible section with an uppercase header row: rotating caret, label,
   * optional right-aligned count. Pattern extracted from the editor's Assets
   * panel ("Videos" section) so every expand/collapse group in the app reads
   * the same way. `open` is bindable; pass `open={true}` for
   * expanded-by-default sections.
   */
  import { CaretDown } from 'phosphor-svelte';
  import type { Snippet } from 'svelte';

  let {
    label,
    open = $bindable(false),
    count,
    children
  }: {
    label: string;
    /** Bindable expanded state. Defaults to closed. */
    open?: boolean;
    /** Optional right-aligned count badge (e.g. item count). */
    count?: number | string;
    children: Snippet;
  } = $props();
</script>

<button
  type="button"
  class="csec"
  onclick={() => (open = !open)}
  aria-expanded={open}
>
  <CaretDown size={12} weight="bold" class="csec-caret {open ? '' : 'closed'}" />
  <span>{label}</span>
  {#if count !== undefined}
    <span class="csec-count">{count}</span>
  {/if}
</button>
{#if open}
  {@render children()}
{/if}

<style>
  .csec {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 6px 4px;
    background: none;
    border: 0;
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .csec:hover {
    color: var(--ink);
  }
  .csec-count {
    margin-left: auto;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
  }
  :global(.csec-caret) {
    transition: transform 120ms;
  }
  :global(.csec-caret.closed) {
    transform: rotate(-90deg);
  }
</style>
