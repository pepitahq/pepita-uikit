<script module lang="ts">
  export type SegOption = { value: string; label: string; disabled?: boolean };
</script>

<script lang="ts">
  let {
    options,
    value = $bindable(),
    onChange
  }: {
    options: SegOption[];
    value: string;
    onChange?: (value: string) => void;
  } = $props();

  function pick(v: string) {
    value = v;
    onChange?.(v);
  }
</script>

<div class="seg" role="tablist">
  {#each options as o (o.value)}
    <button
      type="button"
      role="tab"
      class="seg-btn"
      class:seg-on={value === o.value}
      aria-selected={value === o.value}
      disabled={o.disabled}
      onclick={() => pick(o.value)}
    >
      {o.label}
    </button>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px;
    border-radius: 6px;
    background: color-mix(in oklch, var(--ink) 5%, transparent);
  }
  .seg-btn {
    font-family: var(--font);
    font-size: 11px;
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
    border: 0;
    background: transparent;
    color: var(--ink-soft);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .seg-btn:hover:not(:disabled):not(.seg-on) {
    color: var(--ink);
  }
  .seg-on {
    background: color-mix(in oklch, var(--accent) 14%, transparent);
    color: var(--accent);
  }
  .seg-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }
</style>
