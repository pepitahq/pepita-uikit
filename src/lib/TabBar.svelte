<script module lang="ts">
  export type TabItem = { id: string; label: string; closable?: boolean };
</script>

<script lang="ts">
  import Tab from './Tab.svelte';

  let {
    tabs,
    activeId,
    onSelect,
    onClose
  }: {
    tabs: TabItem[];
    activeId: string;
    onSelect: (id: string) => void;
    onClose?: (id: string) => void;
  } = $props();
</script>

<div class="tab-bar" style:background="var(--bg)">
  {#each tabs as t (t.id)}
    <Tab
      label={t.label}
      active={t.id === activeId}
      closable={t.closable}
      onSelect={() => onSelect(t.id)}
      onClose={() => onClose?.(t.id)}
    />
  {/each}
</div>

<style>
  .tab-bar {
    height: 2.25rem;
    border-bottom: 1px solid var(--rule);
    display: flex;
    align-items: flex-end;
    overflow-x: auto;
    flex-shrink: 0;
  }
</style>
