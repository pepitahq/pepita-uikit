<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    disabled = false,
    input,
    controls,
    action
  }: {
    disabled?: boolean;
    input: Snippet;
    controls?: Snippet;
    action?: Snippet;
  } = $props();
</script>

<div class="bracket" class:is-disabled={disabled}>
  <div class="bracket-input">
    {@render input()}
  </div>
  {#if controls || action}
    <div class="bracket-row">
      <div class="bracket-controls">{#if controls}{@render controls()}{/if}</div>
      <div class="bracket-action">{#if action}{@render action()}{/if}</div>
    </div>
  {/if}
</div>

<style>
  .bracket {
    border: 1px solid var(--rule);
    border-radius: 6px;
    background: var(--surface);
    transition: border-color 120ms;
  }
  .bracket:focus-within {
    border-color: color-mix(in oklch, var(--accent) 50%, var(--rule));
  }
  .bracket.is-disabled {
    opacity: 0.55;
    pointer-events: none;
  }
  .bracket-input { position: relative; }
  /* Reset any field rendered into the input slot so the frame owns the look. */
  .bracket-input :global(textarea),
  .bracket-input :global(input) {
    display: block;
    width: 100%;
    padding: 0.45rem 0.7rem 0.25rem;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-family: var(--font);
    font-size: 13px;
    line-height: 20px;
    resize: none;
    outline: none;
  }
  .bracket-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.2rem 0.45rem 0.4rem;
  }
  .bracket-controls { display: inline-flex; align-items: center; gap: 0.375rem; }
  .bracket-action { display: inline-flex; align-items: center; gap: 0.375rem; }
</style>
