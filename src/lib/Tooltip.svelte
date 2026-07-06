<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    text,
    tip,
    placement = 'top',
    width,
    children
  }: {
    /** Simple text tooltip. */
    text?: string;
    /** Rich content (overrides `text`). */
    tip?: Snippet;
    placement?: 'top' | 'bottom';
    /** Optional fixed width (CSS length) for rich content. */
    width?: string;
    /** The trigger — must be focusable (e.g. a button) for the tooltip to
     *  show on keyboard focus as well as hover. */
    children: Snippet;
  } = $props();
</script>

<span class="tt-wrap">
  {@render children()}
  <span class="tt tt-{placement}" role="tooltip" style:width={width ?? 'max-content'}>
    {#if tip}{@render tip()}{:else}{text}{/if}
  </span>
</span>

<style>
  .tt-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .tt {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 90vw;
    padding: 0.55rem 0.7rem;
    border-radius: 5px;
    border: 1px solid var(--rule);
    background: var(--surface-raised);
    box-shadow: 0 6px 20px -8px rgba(0, 0, 0, 0.18);
    font-family: var(--font);
    font-size: 11.5px;
    line-height: 1.45;
    color: var(--ink);
    text-align: left;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms, visibility 0s linear 120ms;
    z-index: 70;
  }
  .tt-top {
    bottom: calc(100% + 8px);
  }
  .tt-bottom {
    top: calc(100% + 8px);
  }
  .tt-wrap:hover .tt,
  .tt-wrap:focus-within .tt {
    visibility: visible;
    opacity: 1;
    transition: opacity 120ms, visibility 0s;
  }
</style>
