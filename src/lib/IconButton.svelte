<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconTip from './IconTip.svelte';

  let {
    label,
    icon,
    active = undefined,
    disabled = false,
    onclick,
    type = 'button',
    href = undefined,
    download = false,
    target = undefined,
    rel = undefined,
    size = 22,
    placement = 'bottom',
    tip = true,
    class: klass = ''
  }: {
    /** Accessible name — feeds BOTH `aria-label` and the tooltip, so there's
     *  one source of truth (no more buttons that carry `aria-label` but forgot
     *  `title`, or vice-versa). */
    label: string;
    /** Icon content (pass a sized icon, e.g. `<Camera size={14} />`). */
    icon: Snippet;
    /** Toggle state. `undefined` (default) = plain action button (no
     *  `aria-pressed`). A boolean marks it a toggle: drives `aria-pressed` and
     *  the filled-accent pressed look. */
    active?: boolean | undefined;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    /** Button type — 'submit' lets an icon button drive a surrounding form
     *  (e.g. the sign-out POST). Ignored in anchor mode. */
    type?: 'button' | 'submit';
    /** When set, renders an `<a>` instead of a `<button>` (e.g. a download). */
    href?: string;
    download?: boolean;
    target?: string;
    rel?: string;
    /** Square box size in px (design default = 22, matching the header). */
    size?: number;
    /** Tooltip side. Header/preview toolbars sit at the top → 'bottom'. */
    placement?: 'top' | 'bottom';
    /** Set false to drop the tooltip (the icon still carries `aria-label`). */
    tip?: boolean;
    /** Extra class on the control itself (e.g. a view-transition-name hook). */
    class?: string;
  } = $props();

  const isToggle = $derived(active !== undefined);
</script>

{#snippet control()}
  {#if href}
    <a
      class="ib {klass}"
      class:is-active={active === true}
      style:--ib-size="{size}px"
      {href}
      download={download || undefined}
      {target}
      {rel}
      {onclick}
      aria-label={label}
    >
      {@render icon()}
    </a>
  {:else}
    <button
      {type}
      class="ib {klass}"
      class:is-active={active === true}
      style:--ib-size="{size}px"
      {disabled}
      {onclick}
      aria-label={label}
      aria-pressed={isToggle ? active : undefined}
    >
      {@render icon()}
    </button>
  {/if}
{/snippet}

{#if tip}
  <IconTip text={label} {placement}>
    {@render control()}
  </IconTip>
{:else}
  {@render control()}
{/if}

<style>
  /* Icon-only control — the design source is the header's .icon-btn-22 /
     .signout-sm (22px, grid-centered, ghost, ink-soft → accent on hover). */
  .ib {
    display: inline-grid;
    place-items: center;
    width: var(--ib-size, 22px);
    height: var(--ib-size, 22px);
    border-radius: 4px;
    color: var(--ink-soft);
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
    transition: color 120ms, background 120ms;
  }
  .ib:hover:not(:disabled) {
    color: var(--accent);
    background: color-mix(in oklch, var(--accent) 10%, transparent);
  }
  .ib:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  /* Toggle "on" — filled accent. Clearer than a faint tint at 22px, and
     preserves the look the inspect toggle had before the migration. */
  .ib.is-active {
    color: var(--on-accent);
    background: var(--accent);
  }
  .ib.is-active:hover {
    /* Re-assert the on-accent foreground: the base `.ib:hover` rule sets
       `color: var(--accent)` at higher specificity than `.ib.is-active`, so
       without this the icon would render accent-on-dark-accent (near-zero
       contrast). Same guard the annotate button's `.is-send:hover` uses. */
    color: var(--on-accent);
    background: color-mix(in oklch, var(--accent) 88%, black);
  }
</style>
