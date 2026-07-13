<script lang="ts">
  import { CaretDown } from 'phosphor-svelte';

  // A pill-shaped dropdown trigger: the user's circular avatar sits flush at
  // the left, with a caret to its right on a soft chip background — so it
  // reads as "click me for a menu" where a bare avatar didn't. Presentational
  // only: the consumer owns the Popover + Menu and toggles `open` from
  // `onclick`; `bind:ref` hands the button element back for the Popover anchor.
  let {
    label,
    src = null,
    open = false,
    size = 22,
    onclick,
    ref = $bindable(null),
    class: klass = ''
  }: {
    /** Accessible name — feeds both `aria-label` and the tooltip `title`. */
    label: string;
    /** Avatar image URL; `null` renders a filled-accent circle placeholder. */
    src?: string | null;
    /** Menu open state — drives `aria-expanded` and the caret rotation. */
    open?: boolean;
    /** Avatar diameter in px (also the pill's height). Default 22 (header). */
    size?: number;
    onclick?: (e: MouseEvent) => void;
    /** The root <button>, exposed so the consumer can anchor a Popover to it. */
    ref?: HTMLButtonElement | null;
    /** Extra class on the control (e.g. a view-transition-name hook). */
    class?: string;
  } = $props();
</script>

<button
  bind:this={ref}
  type="button"
  class="da {klass}"
  class:open
  style:--da-size="{size}px"
  aria-haspopup="menu"
  aria-expanded={open}
  title={label}
  aria-label={label}
  {onclick}
>
  {#if src}
    <img class="da-avatar" {src} alt="" referrerpolicy="no-referrer" />
  {:else}
    <span class="da-avatar da-placeholder" aria-hidden="true"></span>
  {/if}
  <span class="da-caret"><CaretDown size={12} weight="bold" /></span>
</button>

<style>
  /* Pill: fully-round ends ("round like the avatar, just wider"). The avatar
     is flush-left (no padding on that side, no border) and the caret gets a
     little room on the right. */
  .da {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: var(--da-size, 22px);
    padding: 0 6px 0 0;
    border: 0;
    border-radius: 999px;
    background: var(--rule);
    cursor: pointer;
    transition: background 120ms;
  }
  .da:hover {
    background: color-mix(in oklch, var(--ink) 8%, var(--rule));
  }
  .da:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .da-avatar {
    width: var(--da-size, 22px);
    height: var(--da-size, 22px);
    border-radius: 50%;
    object-fit: cover;
    flex: 0 0 auto;
  }
  .da-placeholder {
    background: var(--accent);
  }
  .da-caret {
    display: inline-flex;
    /* Primary ink, not --ink-soft: on the soft --rule chip the secondary
       tone was too faint to read as an affordance. */
    color: var(--ink);
    transition: transform 150ms ease;
  }
  .da.open .da-caret {
    transform: rotate(180deg);
  }
</style>
