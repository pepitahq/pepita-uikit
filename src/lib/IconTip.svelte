<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    text,
    tip,
    placement = 'bottom',
    delay = 300,
    children
  }: {
    /** Compact one-line label (the common case for icon buttons). */
    text?: string;
    /** Rich content (overrides `text`) — rare; kept for parity with Tooltip. */
    tip?: Snippet;
    placement?: 'top' | 'bottom';
    /** Hover show-delay in ms (keyboard focus shows immediately). */
    delay?: number;
    /** The trigger — must be focusable (a button/anchor) so the tip shows on
     *  keyboard focus as well as hover. */
    children: Snippet;
  } = $props();

  let wrapEl: HTMLElement | undefined = $state();
  let shown = $state(false);
  let x = $state(0);
  let y = $state(0);
  let timer: ReturnType<typeof setTimeout> | undefined;

  // Position the chip in the VIEWPORT (position: fixed), computed from the
  // trigger's rect — so no ancestor's `overflow` can clip it and no stacking
  // context can trap it. Same approach as Popover / ChartTooltip.
  function place() {
    if (!wrapEl) return;
    const r = wrapEl.getBoundingClientRect();
    x = r.left + r.width / 2; // centered on the trigger
    y = placement === 'top' ? r.top - 6 : r.bottom + 6;
  }

  function show(immediate = false) {
    clearTimeout(timer);
    const reveal = () => {
      place();
      shown = true;
    };
    if (immediate) reveal();
    else timer = setTimeout(reveal, delay);
  }
  function hide() {
    clearTimeout(timer);
    shown = false;
  }
  function onReflow() {
    if (shown) place();
  }
</script>

<svelte:window onscroll={onReflow} onresize={onReflow} />

<!--
  A compact control-label tooltip. Unlike `Tooltip` (a padded, wrappable rich
  hover panel) and `ChartTooltip` (cursor-following, for charts), IconTip is a
  single-line inverted chip meant to label an icon-only control.

  No native `title` — that hits the browser tooltip's flaws (the ~1s delay, the
  timer that resets every time the pointer crosses a sibling — fatal for a
  tight row of 22px icon buttons — suppression on disabled controls, no
  touch/focus support). This appears on hover/focus, glued to its own trigger,
  and — being position:fixed — is never clipped by an ancestor's overflow.
-->
<span
  class="it-wrap"
  bind:this={wrapEl}
  onmouseenter={() => show()}
  onmouseleave={hide}
  onfocusin={() => show(true)}
  onfocusout={hide}
  role="presentation"
>
  {@render children()}
  <span
    class="it it-{placement}"
    class:is-shown={shown}
    role="tooltip"
    style:left="{x}px"
    style:top="{y}px"
  >
    {#if tip}{@render tip()}{:else}{text}{/if}
  </span>
</span>

<style>
  .it-wrap {
    display: inline-flex;
    align-items: center;
  }
  .it {
    position: fixed;
    /* Inverted chip: --ink surface with --bg text reads as a distinct "hint"
       against the UI, and stays legible in both themes (both tokens flip). */
    background: var(--ink);
    color: var(--bg);
    padding: 0.25rem 0.45rem;
    border-radius: 4px;
    font-family: var(--font);
    font-size: 11px;
    line-height: 1.3;
    white-space: nowrap;
    box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.35);
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity 90ms ease, visibility 0s linear 90ms;
    z-index: 80;
  }
  /* Center horizontally on the trigger; `top` placement also lifts the chip
     fully above its anchor point. */
  .it-bottom {
    transform: translateX(-50%);
  }
  .it-top {
    transform: translate(-50%, -100%);
  }
  /* Arrow. */
  .it::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
  }
  .it-top::after {
    top: 100%;
    border-top-color: var(--ink);
  }
  .it-bottom::after {
    bottom: 100%;
    border-bottom-color: var(--ink);
  }
  .it.is-shown {
    visibility: visible;
    opacity: 1;
    transition: opacity 90ms ease;
  }
</style>
