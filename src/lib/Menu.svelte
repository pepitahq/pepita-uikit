<script module lang="ts">
  import type { Component } from 'svelte';

  export type MenuItem = {
    label: string;
    /** A Svelte icon component (e.g. a phosphor-svelte icon). */
    icon?: Component<{ size?: number; weight?: string }>;
    shortcut?: string;
    danger?: boolean;
    disabled?: boolean;
    onSelect: () => void;
  };
  export type MenuEntry = MenuItem | { separator: true };
</script>

<script lang="ts">
  let {
    items,
    onClose
  }: {
    items: MenuEntry[];
    /** Called right before an item's onSelect runs, so a wrapping Popover/
     *  ContextMenu can close. */
    onClose?: () => void;
  } = $props();

  let menuEl: HTMLElement | undefined = $state();

  function select(item: MenuItem) {
    if (item.disabled) return;
    onClose?.();
    // Defer so the menu closes cleanly before any dialog the item may open.
    queueMicrotask(() => item.onSelect());
  }

  function buttons(): HTMLButtonElement[] {
    return [...(menuEl?.querySelectorAll('button:not(:disabled)') ?? [])] as HTMLButtonElement[];
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const btns = buttons();
    if (!btns.length) return;
    e.preventDefault();
    const idx = btns.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'ArrowDown' ? (idx + 1) % btns.length : (idx - 1 + btns.length) % btns.length;
    btns[next]?.focus();
  }

  // Focus the first enabled item when the menu mounts.
  $effect(() => {
    buttons()[0]?.focus();
  });
</script>

<div class="menu" role="menu" tabindex="-1" bind:this={menuEl} onkeydown={onKeydown}>
  {#each items as entry, i (i)}
    {#if 'separator' in entry}
      <div class="menu-sep" role="separator"></div>
    {:else}
      {@const Icon = entry.icon}
      <button
        type="button"
        role="menuitem"
        class="menu-item"
        class:danger={entry.danger}
        disabled={entry.disabled}
        onclick={() => select(entry)}
      >
        {#if Icon}<span class="menu-ico"><Icon size={14} weight="bold" /></span>{/if}
        <span class="menu-label">{entry.label}</span>
        {#if entry.shortcut}<span class="menu-shortcut">{entry.shortcut}</span>{/if}
      </button>
    {/if}
  {/each}
</div>

<style>
  .menu {
    background: var(--surface-raised);
    border: 1px solid var(--rule);
    border-radius: 6px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    padding: 0.3rem;
    min-width: 180px;
    font-family: var(--font);
  }
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border: 0;
    background: transparent;
    border-radius: 4px;
    color: var(--ink);
    font-family: var(--font);
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    transition: color 100ms, background 100ms;
  }
  .menu-item:hover:not(:disabled),
  .menu-item:focus-visible {
    background: color-mix(in oklch, var(--accent) 12%, transparent);
    color: var(--accent);
    outline: none;
  }
  .menu-item:disabled {
    color: var(--ink-faint);
    cursor: not-allowed;
  }
  .menu-item.danger {
    color: color-mix(in srgb, var(--error) 82%, var(--ink));
  }
  .menu-item.danger:hover:not(:disabled),
  .menu-item.danger:focus-visible {
    background: color-mix(in srgb, var(--error) 14%, transparent);
    color: color-mix(in srgb, var(--error) 82%, var(--ink));
  }
  .menu-ico {
    display: inline-flex;
    width: 16px;
    justify-content: center;
    flex: 0 0 auto;
  }
  .menu-label {
    flex: 1;
  }
  .menu-shortcut {
    margin-left: auto;
    padding-left: 1rem;
    color: var(--ink-faint);
    font-size: 11px;
  }
  .menu-sep {
    height: 1px;
    background: var(--rule);
    margin: 0.3rem 0;
  }
</style>
