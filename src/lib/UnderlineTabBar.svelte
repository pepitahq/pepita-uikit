<script module lang="ts">
  import type { Component } from 'svelte';

  export type UnderlineTab = {
    id: string;
    label: string;
    icon?: Component<{ size?: number; weight?: string }>;
  };
</script>

<script lang="ts">
  let {
    tabs,
    activeId,
    onSelect
  }: {
    tabs: UnderlineTab[];
    activeId: string;
    onSelect: (id: string) => void;
  } = $props();
</script>

<div class="utabs" role="tablist">
  {#each tabs as t (t.id)}
    {@const Icon = t.icon}
    <button
      type="button"
      role="tab"
      aria-selected={t.id === activeId}
      class="utab"
      class:is-active={t.id === activeId}
      onclick={() => onSelect(t.id)}
    >
      {#if Icon}<Icon size={13} weight="bold" />{/if}
      <span>{t.label}</span>
    </button>
  {/each}
</div>

<style>
  .utabs {
    display: flex;
    gap: 0.25rem;
  }
  .utab {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.85rem;
    font-family: var(--font);
    font-size: 12px;
    color: var(--ink-soft);
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 120ms, border-color 120ms;
  }
  .utab:hover:not(.is-active) {
    color: var(--ink);
  }
  .utab.is-active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
</style>
