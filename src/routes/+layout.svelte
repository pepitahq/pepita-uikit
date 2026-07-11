<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/primitives.css';
  import manifest from '$lib/styles/themes/themes.json';
  // Per-family theme CSS as served URLs (Vite ?url) so the active <link> can be
  // swapped at runtime — the same mechanism the app uses, previewed here across
  // every component. Each family file defines the [data-theme='light'|'dark']
  // blocks the gallery's frames rely on, so switching family re-themes both.
  import rosePineUrl from '$lib/styles/themes/rose-pine.css?url';
  import githubUrl from '$lib/styles/themes/github.css?url';
  import etherealUrl from '$lib/styles/themes/ethereal-lemons.css?url';

  const CSS_URL: Record<string, string> = {
    'rose-pine': rosePineUrl,
    github: githubUrl,
    'ethereal-lemons': etherealUrl
  };

  let { children } = $props();
  let themeId = $state(manifest.default);
</script>

<svelte:head>
  <link rel="stylesheet" href={CSS_URL[themeId] ?? CSS_URL['rose-pine']} />
</svelte:head>

<div class="theme-switcher">
  <label>
    theme
    <select bind:value={themeId}>
      {#each manifest.themes as t (t.id)}
        <option value={t.id}>{t.label}</option>
      {/each}
    </select>
  </label>
</div>

{@render children()}

<style>
  /* Dev-only preview control — pick which curated family the gallery renders in.
     Light/dark are shown side-by-side by the gallery's own [data-theme] frames. */
  .theme-switcher {
    position: fixed;
    top: 12px;
    right: 12px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--surface-raised);
    color: var(--ink);
    border: 1px solid var(--rule);
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
    font: 500 12px/1 var(--font, ui-monospace, monospace);
  }
  .theme-switcher select {
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 2px 6px;
    font: inherit;
  }
</style>
