<script lang="ts">
  import {
    CaretDown,
    CircleNotch,
    DownloadSimple,
    ArrowUpRight,
    Copy,
    Check
  } from 'phosphor-svelte';
  import type { Snippet } from 'svelte';

  let {
    kind,
    primaryLabel,
    primaryIcon,
    onPrimary,
    busy = false,
    primaryTitle = '',
    downloadHref,
    downloadLabel,
    urlsHeading,
    urls = []
  }: {
    kind: 'draft' | 'live';
    primaryLabel: string;
    primaryIcon?: Snippet;
    onPrimary: () => void;
    busy?: boolean;
    primaryTitle?: string;
    downloadHref?: string;
    downloadLabel?: string;
    urlsHeading?: string;
    urls?: string[];
  } = $props();

  let open = $state(false);
  let copied = $state<string | null>(null);
  let root = $state<HTMLElement | null>(null);

  const hasMenu = $derived(Boolean(downloadHref || urls.length));

  async function copy(u: string) {
    try {
      await navigator.clipboard.writeText(u);
      copied = u;
      setTimeout(() => {
        if (copied === u) copied = null;
      }, 1200);
    } catch {
      /* clipboard unavailable */
    }
  }

  function onWindowClick(e: MouseEvent) {
    if (open && root && !root.contains(e.target as Node)) open = false;
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
  const envLabel = $derived(kind === 'draft' ? ['DRAFT', 'SITE'] : ['LIVE', 'SITE']);
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKey} />

<div class="sam" bind:this={root}>
  <div class="env-label" class:env-live={kind === 'live'} aria-hidden="true">
    <span>{envLabel[0]}</span><span>{envLabel[1]}</span>
  </div>

  <div class="split {kind}">
    <button type="button" class="split-primary" onclick={onPrimary} disabled={busy} title={primaryTitle}>
      {#if busy}
        <CircleNotch size={13} weight="bold" class="animate-spin" />
      {:else if primaryIcon}
        {@render primaryIcon()}
      {/if}
      <span>{primaryLabel}</span>
    </button>
    {#if hasMenu}
      <button
        type="button"
        class="split-caret"
        onclick={() => (open = !open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${primaryLabel} options`}
      >
        <CaretDown size={12} weight="bold" />
      </button>
    {/if}
  </div>

  {#if open && hasMenu}
    <div class="menu" role="menu">
      {#if downloadHref}
        <a class="menu-download" href={downloadHref} download role="menuitem">
          <DownloadSimple size={15} weight="bold" />
          <span>{downloadLabel}</span>
        </a>
      {/if}
      {#if urls.length}
        <div class="menu-div"></div>
        {#if urlsHeading}<div class="menu-heading">{urlsHeading}</div>{/if}
        <div class="url-box">
          {#each urls as u (u)}
            <div class="url-row">
              <a class="url-open" href={u} target="_blank" rel="noreferrer noopener" title={u}>
                <span class="u">{u}</span>
                <ArrowUpRight size={12} weight="bold" class="shrink-0" />
              </a>
              <button type="button" class="url-copy" onclick={() => copy(u)} aria-label="Copy URL">
                {#if copied === u}
                  <Check size={13} weight="bold" />
                {:else}
                  <Copy size={13} weight="bold" />
                {/if}
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .sam {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  /* phosphor icons render inside a child-component scope, so target them
     globally but only within this component's root (no Tailwind dependency). */
  .sam :global(.animate-spin) { animation: pp-spin 1s linear infinite; }
  .sam :global(.shrink-0) { flex-shrink: 0; }
  @keyframes pp-spin { to { transform: rotate(360deg); } }
  .env-label {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
    text-align: right;
    font-size: 9px;
    letter-spacing: 0.06em;
    color: var(--ink-faint);
    font-weight: 600;
  }
  .env-label.env-live { color: rgb(5 150 105); }

  .split { display: inline-flex; align-items: stretch; border-radius: 6px; overflow: hidden; }
  .split-primary,
  .split-caret {
    font: inherit;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    padding: 0.35rem 0.6rem;
  }
  .split-primary:disabled { opacity: 0.5; cursor: default; }
  .split-caret { padding: 0.35rem 0.4rem; }

  .split.draft { border: 1px solid var(--rule); }
  .split.draft .split-primary { background: #fff; color: var(--ink); }
  .split.draft .split-caret { background: #fff; color: var(--ink-soft); border-left: 1px solid var(--rule); }
  .split.draft .split-primary:hover:not(:disabled),
  .split.draft .split-caret:hover { background: color-mix(in oklch, var(--ink) 5%, #fff); }

  .split.live .split-primary { background: rgb(5 150 105); color: #fff; }
  .split.live .split-caret { background: rgb(5 150 105); color: #fff; border-left: 1px solid rgba(255, 255, 255, 0.28); }
  .split.live .split-primary:hover:not(:disabled),
  .split.live .split-caret:hover { background: rgb(4 120 87); }

  .menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: 300px;
    background: var(--bg);
    border: 1px solid var(--rule);
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    padding: 0.4rem;
    z-index: 60;
  }
  .menu-download {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    color: var(--ink);
    font-size: 13px;
    text-decoration: none;
  }
  .menu-download:hover { background: color-mix(in oklch, var(--ink) 6%, transparent); }
  .menu-div { height: 1px; background: var(--rule); margin: 0.35rem 0; }
  .menu-heading {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-faint);
    padding: 0.3rem 0.5rem;
  }
  .url-box { background: var(--ink); border-radius: 8px; overflow: hidden; }
  .url-row { display: flex; align-items: center; gap: 0.25rem; padding: 0.2rem; }
  .url-row + .url-row { border-top: 1px solid rgba(255, 255, 255, 0.09); }
  .url-open {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--bg);
    padding: 0.45rem 0.55rem;
    font-size: 11.5px;
    text-decoration: none;
  }
  .url-open:hover { opacity: 0.85; }
  .url-open .u { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .url-copy {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.1);
    color: var(--bg);
    border: 0;
    border-radius: 6px;
    padding: 0.4rem;
    margin-right: 0.15rem;
    cursor: pointer;
    display: inline-flex;
  }
  .url-copy:hover { background: rgba(255, 255, 255, 0.18); }
</style>
