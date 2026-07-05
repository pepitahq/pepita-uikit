<script module lang="ts">
  export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  export type Point = { x: number; y: number };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';

  let {
    open = $bindable(false),
    placement = 'bottom-end',
    offset = 6,
    anchor = null,
    anchorEl = null,
    content
  }: {
    /** Controlled open state (bindable). The consumer renders its own trigger
     *  (a real button) and toggles this. */
    open?: boolean;
    placement?: Placement;
    /** Gap in px between anchor and panel. */
    offset?: number;
    /** Explicit point anchor (e.g. a right-click position). Takes precedence. */
    anchor?: Point | null;
    /** Element to anchor the panel to (e.g. the trigger button). */
    anchorEl?: HTMLElement | null;
    /** The floating panel's content. */
    content: Snippet;
  } = $props();

  let panelEl: HTMLElement | undefined = $state();
  let left = $state(0);
  let top = $state(0);

  function anchorRect(): { left: number; right: number; top: number; bottom: number } | null {
    if (anchor) return { left: anchor.x, right: anchor.x, top: anchor.y, bottom: anchor.y };
    if (anchorEl) {
      const r = anchorEl.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    }
    return null;
  }

  async function reposition() {
    if (!open) return;
    await tick();
    const r = anchorRect();
    if (!r || !panelEl) return;
    const pw = panelEl.offsetWidth;
    const ph = panelEl.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const l = placement.endsWith('end') ? r.right - pw : r.left;
    const t = placement.startsWith('top') ? r.top - ph - offset : r.bottom + offset;

    left = Math.max(8, Math.min(l, vw - pw - 8));
    top = Math.max(8, Math.min(t, vh - ph - 8));
  }

  // Reposition when it opens (and when placement/anchor change while open).
  $effect(() => {
    void open;
    void placement;
    void anchor;
    reposition();
  });

  function onWindowPointerDown(e: MouseEvent) {
    if (!open) return;
    const t = e.target as Node;
    if (panelEl?.contains(t)) return;
    if (anchorEl?.contains(t)) return;
    open = false;
  }
  function onKey(e: KeyboardEvent) {
    if (open && e.key === 'Escape') {
      e.preventDefault();
      open = false;
    }
  }
  function onReflow() {
    if (open) reposition();
  }
</script>

<svelte:window
  onpointerdown={onWindowPointerDown}
  onkeydown={onKey}
  onresize={onReflow}
  onscroll={onReflow}
/>

{#if open}
  <div class="pop-panel" bind:this={panelEl} style:left="{left}px" style:top="{top}px" role="presentation">
    {@render content()}
  </div>
{/if}

<style>
  .pop-panel {
    position: fixed;
    z-index: 60;
    /* the content supplies its own surface (background/border/shadow) */
  }
</style>
