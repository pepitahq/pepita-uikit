<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    text,
    tip,
    placement = 'bottom',
    children
  }: {
    /** Compact one-line label (the common case for icon buttons). */
    text?: string;
    /** Rich content (overrides `text`) — rare; kept for parity with Tooltip. */
    tip?: Snippet;
    placement?: 'top' | 'bottom';
    /** The trigger — must be focusable (a button/anchor) so the tip shows on
     *  keyboard focus as well as hover. */
    children: Snippet;
  } = $props();
</script>

<!--
  A compact control-label tooltip. Unlike `Tooltip` (a padded, wrappable rich
  hover panel) and `ChartTooltip` (cursor-following, for charts), IconTip is a
  single-line inverted chip meant to label an icon-only control.

  It's a pure CSS `:hover`/`:focus-within` tip — no native `title`, so it never
  hits the browser tooltip's flaws: the ~1s delay, the timer that resets every
  time the pointer crosses a sibling (fatal for a tight row of 22px icon
  buttons), the suppression on disabled controls, and the lack of touch/focus
  support. It appears instantly and stays glued to its own trigger.
-->
<span class="it-wrap">
  {@render children()}
  <span class="it it-{placement}" role="tooltip">
    {#if tip}{@render tip()}{:else}{text}{/if}
  </span>
</span>

<style>
  .it-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .it {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    /* Small show delay (matches a "hover intent" feel) but instant hide. */
    transition: opacity 90ms ease, visibility 0s linear 90ms;
    z-index: 80;
  }
  .it-top {
    bottom: calc(100% + 6px);
  }
  .it-bottom {
    top: calc(100% + 6px);
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
  .it-wrap:hover .it,
  .it-wrap:focus-within .it {
    visibility: visible;
    opacity: 1;
    transition: opacity 90ms ease 350ms, visibility 0s;
  }
</style>
