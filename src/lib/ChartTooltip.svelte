<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    x = 0,
    y = 0,
    visible = false,
    content
  }: {
    /** Viewport coordinates (e.g. from a pointer event) to anchor above. */
    x?: number;
    y?: number;
    visible?: boolean;
    content: Snippet;
  } = $props();
</script>

{#if visible}
  <div class="chart-tip" style:left="{x}px" style:top="{y}px" role="tooltip">
    {@render content()}
  </div>
{/if}

<style>
  .chart-tip {
    position: fixed;
    z-index: 60;
    pointer-events: none;
    white-space: nowrap;
    background: var(--ink);
    color: var(--bg);
    font-family: var(--font);
    font-size: 10px;
    line-height: 1.4;
    padding: 0.3rem 0.45rem;
    border-radius: 4px;
    /* anchor centered above the point */
    transform: translate(-50%, calc(-100% - 8px));
  }
</style>
