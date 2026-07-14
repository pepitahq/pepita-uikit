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
    /** Rich content (overrides `text`). Multi-line is the point of this
     *  component — the panel wraps and left-aligns, unlike IconTip's
     *  single-line chip. */
    tip?: Snippet;
    placement?: 'top' | 'bottom';
    /** Optional fixed width (CSS length) for rich content. */
    width?: string;
    /** The trigger — must be focusable (e.g. a button) for the tooltip to
     *  show on keyboard focus as well as hover. */
    children: Snippet;
  } = $props();

  let wrapEl: HTMLElement | undefined = $state();
  let shown = $state(false);
  let x = $state(0);
  let y = $state(0);

  // Position in the VIEWPORT (position: fixed), computed from the trigger's
  // rect. This is the whole reason the panel is not `position: absolute`: an
  // absolutely-positioned tooltip is clipped by the first ancestor with
  // `overflow: hidden/auto`, which made this component unusable inside every
  // scrolling container we have (the file tree, a modal body, a list panel).
  // Same approach as IconTip / Popover / ChartTooltip.
  function place() {
    if (!wrapEl) return;
    const r = wrapEl.getBoundingClientRect();
    x = r.left + r.width / 2; // centered on the trigger
    y = placement === 'top' ? r.top - 8 : r.bottom + 8;
  }

  function show() {
    place();
    shown = true;
  }
  function hide() {
    shown = false;
  }
  function onReflow() {
    if (shown) place();
  }
</script>

<svelte:window onscroll={onReflow} onresize={onReflow} />

<!--
  A padded, WRAPPABLE rich hover panel — the multi-line tooltip. Use it when the
  content is more than a label: several lines, before/after figures, a path.
  (For a one-line label on an icon-only control, use IconTip — a compact
  inverted chip. For a cursor-following readout on a chart, ChartTooltip.)

  No native `title`: the browser tooltip has a ~1s delay, no touch/focus
  support, no styling, and it collapses newlines — so a multi-line string
  renders as one long line. That last one is exactly what this component exists
  to avoid.

  Being position:fixed, it is never clipped by an ancestor's overflow and never
  trapped by a stacking context.
-->
<span
  class="tt-wrap"
  bind:this={wrapEl}
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
  role="presentation"
>
  {@render children()}
  <span
    class="tt tt-{placement}"
    class:is-shown={shown}
    role="tooltip"
    style:left="{x}px"
    style:top="{y}px"
    style:width={width ?? 'max-content'}
  >
    {#if tip}{@render tip()}{:else}{text}{/if}
  </span>
</span>

<style>
  .tt-wrap {
    display: inline-flex;
    align-items: center;
  }
  .tt {
    position: fixed;
    max-width: min(90vw, 22rem);
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
    /* The point of this component: content WRAPS onto as many lines as it needs. */
    white-space: normal;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms, visibility 0s linear 120ms;
    z-index: 70;
  }
  /* Center horizontally on the trigger; `top` also lifts the panel fully above
     its anchor point. */
  .tt-bottom {
    transform: translateX(-50%);
  }
  .tt-top {
    transform: translate(-50%, -100%);
  }
  .tt.is-shown {
    visibility: visible;
    opacity: 1;
    transition: opacity 120ms, visibility 0s;
  }
</style>
