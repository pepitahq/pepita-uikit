<script lang="ts">
  import Button from '$lib/Button.svelte';
  import AuthButton from '$lib/AuthButton.svelte';
  import HeaderButton from '$lib/HeaderButton.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import { ArrowsClockwise, Bug, DownloadSimple, Trash } from 'phosphor-svelte';
  import TogglePill from '$lib/TogglePill.svelte';
  import TextInput from '$lib/TextInput.svelte';
  import SplitActionButton from '$lib/SplitActionButton.svelte';
  import TabBar from '$lib/TabBar.svelte';
  import UnderlineTabBar from '$lib/UnderlineTabBar.svelte';
  import Popover from '$lib/Popover.svelte';
  import Menu from '$lib/Menu.svelte';
  import ContextMenu from '$lib/ContextMenu.svelte';
  import Modal from '$lib/Modal.svelte';
  import Dialog from '$lib/Dialog.svelte';
  import { dialog } from '$lib/dialog-store.svelte';
  import Toaster from '$lib/Toaster.svelte';
  import { toast } from '$lib/toast-store.svelte';
  import SegmentedControl from '$lib/SegmentedControl.svelte';
  import Select from '$lib/Select.svelte';
  import Badge from '$lib/Badge.svelte';
  import Tooltip from '$lib/Tooltip.svelte';
  import ChartTooltip from '$lib/ChartTooltip.svelte';

  let galleryTab = $state('ai');
  let healthTab = $state('headers');
  const themes = ['light', 'dark'] as const;

  // Overlay demo state
  let modalOpen = $state(false);
  let popOpen = $state(false);
  let popBtn = $state<HTMLElement>();
  let ctxOpen = $state(false);
  let ctxX = $state(0);
  let ctxY = $state(0);
  let segVal = $state('7d');

  // Select demo state — mirrors the three real app call sites.
  let themeSel = $state('rose-pine');
  let modelSel = $state('medium');
  let presetSel = $state('desktop');

  // ChartTooltip demo — a tiny bar chart; hovering a bar shows the tooltip at the cursor.
  const demoBars = [
    { label: 'Mon', v: 42 },
    { label: 'Tue', v: 30 },
    { label: 'Wed', v: 55 },
    { label: 'Thu', v: 18 },
    { label: 'Fri', v: 61 },
    { label: 'Sat', v: 12 },
    { label: 'Sun', v: 24 }
  ];
  const demoMax = Math.max(...demoBars.map((b) => b.v));
  let tip = $state({ x: 0, y: 0, visible: false, label: '', v: 0 });
  function overBar(e: PointerEvent, b: { label: string; v: number }) {
    tip = { x: e.clientX, y: e.clientY, visible: true, label: b.label, v: b.v };
  }
  function leaveBar() {
    tip = { ...tip, visible: false };
  }

  const menuItems = [
    { label: 'Rename', onSelect: () => {} },
    { label: 'Duplicate', onSelect: () => {} },
    { separator: true } as const,
    { label: 'Delete', danger: true, onSelect: () => {} }
  ];

  function openCtx(e: MouseEvent) {
    e.preventDefault();
    ctxX = e.clientX;
    ctxY = e.clientY;
    ctxOpen = true;
  }

  // ── Foundations: typography + color tokens ─────────────────
  const sample = 'The quick brown fox jumps over the lazy dog — 0123456789';

  // Text-style tokens: the three typeface vars from tokens.css. --f-mono is the
  // default (--font); a subtree switches typeface via [data-font="serif|sans"].
  const typefaces = [
    { token: '--f-mono', font: 'mono', label: 'IBM Plex Mono — default (--font)' },
    { token: '--f-serif', font: 'serif', label: 'IBM Plex Serif' },
    { token: '--f-sans', font: 'sans', label: 'IBM Plex Sans' }
  ];
  const weights = [300, 400, 500, 600, 700]; // loaded for all three families

  // Color tokens from theme.css (each has a light + dark value). The code shown
  // is read LIVE from the computed custom property inside each themed frame, so
  // it never drifts when theme.css is regenerated (pnpm gen:theme).
  const colorTokens = [
    { token: 'bg' },
    { token: 'surface' },
    { token: 'surface-raised' },
    { token: 'ink' },
    { token: 'ink-soft' },
    { token: 'ink-faint', note: 'derived' },
    { token: 'accent' },
    { token: 'on-accent' },
    { token: 'success' },
    { token: 'error' },
    { token: 'warning' },
    { token: 'rule', note: 'alpha' }
  ];

  // Fill the swatch's code slot with the token's resolved value in its current
  // (themed) context — light frame reads the light hex, dark frame the dark one.
  function showVar(node: HTMLElement, token: string) {
    const paint = () => {
      const v = getComputedStyle(node).getPropertyValue(`--${token}`).trim();
      const el = node.querySelector<HTMLElement>('[data-code]');
      if (el) el.textContent = v || '—';
    };
    paint();
    return { update: paint };
  }
</script>

{#snippet gallery()}
  <section>
    <h2>Typography — typefaces</h2>
    <div class="type-list">
      {#each typefaces as tf (tf.token)}
        <div class="type-row">
          <div class="type-meta">
            <code class="name">{tf.token}</code>
            <span class="type-hint">{tf.label} · data-font="{tf.font}"</span>
          </div>
          <p class="type-sample" style="font-family: var({tf.token});">{sample}</p>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2>Typography — weights (Plex Mono)</h2>
    <div class="type-list">
      {#each weights as w (w)}
        <div class="type-row">
          <code class="name">{w}</code>
          <p class="type-sample" style="font-weight: {w};">{sample}</p>
        </div>
      {/each}
    </div>
    <p class="frame-label">Base body text — 15px · line-height 1.55 · letter-spacing -0.005em · weight 400.</p>
  </section>

  <section>
    <h2>Colors — tokens</h2>
    <div class="swatch-grid">
      {#each colorTokens as c (c.token)}
        <div class="swatch" use:showVar={c.token}>
          <span class="chip" style="background: var(--{c.token});"></span>
          <span class="swatch-meta">
            <code class="name">--{c.token}</code>
            <code class="code" data-code>…</code>
            {#if c.note}<span class="type-hint">{c.note}</span>{/if}
          </span>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2>Button</h2>
    <div class="row">
      <Button>{'Primary'}</Button>
      <Button variant="new">{'New'}</Button>
      <Button variant="create">{'Create'}</Button>
      <Button disabled>{'Disabled'}</Button>
      <Button href="/x">{'Link'}</Button>
    </div>
  </section>

  <section>
    <h2>AuthButton</h2>
    <AuthButton href="/auth/google" />
  </section>

  <section>
    <h2>HeaderButton</h2>
    <div class="row">
      <HeaderButton>{'Discard'}</HeaderButton>
      <HeaderButton active>{'History'}</HeaderButton>
      <HeaderButton disabled>{'Settings'}</HeaderButton>
    </div>
  </section>

  <section>
    <h2>IconButton</h2>
    <p class="frame-label">Icon-only control with a built-in IconTip (hover / focus each one).</p>
    <div class="row">
      <IconButton label="Reload preview" onclick={() => {}}>
        {#snippet icon()}<ArrowsClockwise size={14} weight="bold" />{/snippet}
      </IconButton>
      <IconButton label="Download" href="/dl" download>
        {#snippet icon()}<DownloadSimple size={14} weight="bold" />{/snippet}
      </IconButton>
      <IconButton label="Inspect elements — hover to outline, click to pin" active={false}>
        {#snippet icon()}<Bug size={14} weight="bold" />{/snippet}
      </IconButton>
      <IconButton label="Turn inspector off" active={true}>
        {#snippet icon()}<Bug size={14} weight="bold" />{/snippet}
      </IconButton>
      <IconButton label="Delete preview" disabled>
        {#snippet icon()}<Trash size={14} weight="bold" />{/snippet}
      </IconButton>
      <IconButton label="Tip on top" placement="top">
        {#snippet icon()}<ArrowsClockwise size={14} weight="bold" />{/snippet}
      </IconButton>
    </div>
    <p class="frame-label" style="margin-top:1rem;">
      Inside an <code>overflow:auto</code> box — the tip (position:fixed) escapes the clip:
    </p>
    <div class="clip-box">
      <span style="font-size:12px;color:var(--ink-soft);">scrollable / clipped container</span>
      <IconButton label="I escape the overflow box" placement="bottom">
        {#snippet icon()}<Trash size={14} weight="bold" />{/snippet}
      </IconButton>
    </div>
  </section>

  <section>
    <h2>TogglePill</h2>
    <div class="row">
      <TogglePill>{'Select'}</TogglePill>
      <TogglePill active>{'Select (on)'}</TogglePill>
    </div>
  </section>

  <section>
    <h2>TextInput</h2>
    <div class="col" style="max-width:24rem;">
      <TextInput label="Site name" placeholder="my startup" help="Used for your URL." />
      <TextInput label="Disabled" placeholder="can't type" disabled />
    </div>
  </section>

  <section>
    <h2>SplitActionButton</h2>
    <div class="row" style="gap:2rem;">
      <SplitActionButton
        kind="draft"
        primaryLabel="Save"
        onPrimary={() => {}}
        downloadHref="/dl"
        downloadLabel="Download draft as .zip"
        urlsHeading="Draft URL"
        urls={['https://demo--draft.pepita.page']}
      />
      <SplitActionButton
        kind="live"
        primaryLabel="Publish"
        onPrimary={() => {}}
        downloadHref="/dl"
        downloadLabel="Download live site as .zip"
        urlsHeading="Live URLs"
        urls={['https://demo.pepita.page', 'https://demo.pepita.dev']}
      />
    </div>
  </section>

  <section>
    <h2>TabBar</h2>
    <TabBar
      tabs={[
        { id: 'metrics', label: 'Analytics' },
        { id: 'ai', label: 'AI' },
        { id: 'files', label: 'Files' },
        { id: 'index.html', label: 'index.html', closable: true }
      ]}
      activeId={galleryTab}
      onSelect={(id) => (galleryTab = id)}
      onClose={() => {}}
    />
  </section>

  <section>
    <h2>UnderlineTabBar</h2>
    <UnderlineTabBar
      tabs={[
        { id: 'headers', label: 'Headers & CSP' },
        { id: 'perf', label: 'Performance' }
      ]}
      activeId={healthTab}
      onSelect={(id) => (healthTab = id)}
    />
  </section>

  <section>
    <h2>Menu (standalone)</h2>
    <div style="display:inline-block;"><Menu items={menuItems} /></div>
  </section>

  <section>
    <h2>SegmentedControl</h2>
    <SegmentedControl
      options={[
        { value: '24h', label: '24h' },
        { value: '7d', label: '7d' },
        { value: '30d', label: '30d' }
      ]}
      bind:value={segVal}
    />
  </section>

  <section>
    <h2>Select</h2>
    <div class="select-demos">
      <div class="select-demo">
        <span class="frame-label">md · full-width · theme chooser (Settings → Visual)</span>
        <Select
          fullWidth
          ariaLabel="Theme"
          options={[
            { value: 'rose-pine', label: 'Rosé Pine' },
            { value: 'github', label: 'GitHub' },
            { value: 'ethereal-lemons', label: 'Ethereal Lemons' }
          ]}
          bind:value={themeSel}
        />
      </div>

      <div class="select-demo">
        <span class="frame-label">md · split label + description (AI model tier)</span>
        <Select
          ariaLabel="AI model"
          options={[
            { value: 'light', label: 'Light', description: 'Haiku 4.5' },
            { value: 'medium', label: 'Medium', description: 'Sonnet 5 · recommended' },
            { value: 'deep', label: 'Deep', description: 'Opus 4.8' },
            { value: 'deepest', label: 'Deepest', description: 'Opus 4.8 · max reasoning' }
          ]}
          bind:value={modelSel}
        />
      </div>

      <div class="select-demo">
        <span class="frame-label">sm · compact · with disabled sentinel (device preset)</span>
        <Select
          size="sm"
          ariaLabel="Device preset"
          options={[
            { value: 'custom', label: 'Custom (390×844)', disabled: true },
            { value: 'desktop', label: 'Desktop' },
            { value: 'laptop', label: 'Laptop' },
            { value: 'tablet', label: 'iPad' },
            { value: 'phone', label: 'iPhone 15' }
          ]}
          bind:value={presetSel}
        />
      </div>

      <div class="select-demo">
        <span class="frame-label">disabled control</span>
        <Select
          disabled
          ariaLabel="Disabled example"
          options={[{ value: 'a', label: 'Can’t open me' }]}
          value="a"
        />
      </div>
    </div>
  </section>

  <section>
    <h2>Badge</h2>
    <div class="row">
      <Badge>{'neutral'}</Badge>
      <Badge variant="success">{'active'}</Badge>
      <Badge variant="warning">{'pending'}</Badge>
      <Badge variant="error">{'failed'}</Badge>
    </div>
  </section>

  <section>
    <h2>Tooltip</h2>
    <Tooltip text="Balanced — Sonnet 5. What you want most of the time.">
      <button type="button" class="cta cta-new">Hover / focus me</button>
    </Tooltip>
  </section>
{/snippet}

<main>
  <h1>@pepitahq/uikit — preview gallery</h1>

  {#each themes as t (t)}
    <div class="frame" data-theme={t}>
      <p class="frame-label">{t} (Rosé Pine {t === 'light' ? 'Dawn' : 'Main'})</p>
      {@render gallery()}
    </div>
  {/each}

  <!-- Overlays — rendered once (they cover the screen). -->
  <div class="frame" data-theme="light">
    <p class="frame-label">Overlays</p>

    <section>
      <h2>Modal</h2>
      <Button variant="new" onclick={() => (modalOpen = true)}>{'Open modal'}</Button>
      <Modal bind:open={modalOpen} title="Settings" width="600px">
        {#snippet tabs()}
          <UnderlineTabBar
            tabs={[
              { id: 'headers', label: 'Headers' },
              { id: 'perf', label: 'Performance' }
            ]}
            activeId={healthTab}
            onSelect={(id) => (healthTab = id)}
          />
        {/snippet}
        {#snippet children()}
          <p>Modal body — active tab: {healthTab}. Close with Escape, the backdrop, or ×.</p>
        {/snippet}
      </Modal>
    </section>

    <section>
      <h2>Dialog</h2>
      <div class="row">
        <Button variant="new" onclick={() => dialog.alert('Saved.')}>{'alert'}</Button>
        <Button variant="new" onclick={() => dialog.confirm('Publish now?')}>{'confirm'}</Button>
        <Button
          variant="new"
          onclick={() => dialog.confirm('Delete this site?', { destructive: true, confirmLabel: 'Delete' })}
        >{'destructive'}</Button>
        <Button variant="new" onclick={() => dialog.prompt('Rename to:', { initialValue: 'my-site' })}>{'prompt'}</Button>
      </div>
    </section>

    <section>
      <h2>Popover</h2>
      <button bind:this={popBtn} type="button" class="cta cta-new" onclick={() => (popOpen = !popOpen)}>
        Toggle popover
      </button>
      <Popover bind:open={popOpen} anchorEl={popBtn} placement="bottom-start">
        {#snippet content()}
          <div class="pop-demo">Anchored popover content.</div>
        {/snippet}
      </Popover>
    </section>

    <section>
      <h2>ContextMenu</h2>
      <div
        class="ctx-target"
        role="application"
        aria-label="Right-click demo target"
        oncontextmenu={openCtx}
      >
        Right-click here
      </div>
      <ContextMenu bind:open={ctxOpen} x={ctxX} y={ctxY} items={menuItems} />
    </section>

    <section>
      <h2>Toast</h2>
      <div class="row">
        <Button variant="new" onclick={() => toast.info('Working…')}>{'info'}</Button>
        <Button variant="new" onclick={() => toast.success('Saved.')}>{'success'}</Button>
        <Button variant="new" onclick={() => toast.error('Publish failed.')}>{'error'}</Button>
      </div>
    </section>

    <section>
      <h2>ChartTooltip</h2>
      <p class="frame-label">Hover the bars.</p>
      <div class="demo-chart">
        {#each demoBars as b (b.label)}
          <div
            class="demo-bar"
            style:height="{Math.round((b.v / demoMax) * 100)}%"
            role="img"
            aria-label="{b.label}: {b.v} visitors"
            onpointerenter={(e) => overBar(e, b)}
            onpointermove={(e) => overBar(e, b)}
            onpointerleave={leaveBar}
          ></div>
        {/each}
      </div>
      <ChartTooltip x={tip.x} y={tip.y} visible={tip.visible}>
        {#snippet content()}<strong>{tip.label}</strong> · {tip.v} visitors{/snippet}
      </ChartTooltip>
    </section>
  </div>
</main>

<Dialog />
<Toaster />

<style>
  main {
    padding: 2rem;
    max-width: 60rem;
    margin: 0 auto;
  }
  h1 {
    font-size: 20px;
  }
  h2 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
    margin: 0 0 0.75rem;
  }
  section {
    margin: 1.5rem 0;
  }
  .row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .select-demos {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-start;
  }
  .select-demo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 220px;
  }
  .select-demo .frame-label {
    margin: 0;
  }
  .frame {
    background: var(--bg);
    color: var(--ink);
    padding: 1.5rem;
    margin: 1.5rem 0;
    border: 1px solid var(--rule);
    border-radius: 8px;
  }
  /* Each frame forces a theme via data-theme="light|dark" (theme.css defines
     those blocks), so both themes show regardless of the OS setting. */
  .frame-label {
    opacity: 0.6;
    font-size: 12px;
    margin: 0 0 1rem;
  }
  .pop-demo {
    background: var(--bg);
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    font-size: 13px;
  }
  .demo-chart {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 8rem;
    padding: 0.5rem;
    border: 1px solid var(--rule);
    border-radius: 6px;
  }
  .demo-bar {
    flex: 1;
    min-height: 4px;
    background: color-mix(in oklch, var(--accent) 55%, var(--bg));
    border-radius: 3px 3px 0 0;
    transition: background 120ms;
  }
  .demo-bar:hover {
    background: var(--accent);
  }
  .ctx-target {
    display: grid;
    place-items: center;
    height: 5rem;
    border: 1px dashed var(--rule);
    border-radius: 6px;
    color: var(--ink-soft);
    font-size: 13px;
    user-select: none;
  }

  /* Foundations: typography + color tokens */
  .type-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .type-row {
    display: grid;
    grid-template-columns: 14rem 1fr;
    gap: 1rem;
    align-items: baseline;
  }
  .type-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .type-hint {
    font-size: 11px;
    color: var(--ink-faint);
  }
  .type-sample {
    margin: 0;
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  .name {
    font-size: 12px;
    color: var(--ink-soft);
  }

  .swatch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: 0.85rem;
  }
  .swatch {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .chip {
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 auto;
    border: 1px solid var(--rule);
    border-radius: 6px;
  }
  .swatch-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .code {
    font-size: 12px;
    color: var(--ink);
  }
  .clip-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    overflow: auto;
    border: 1px dashed var(--rule);
    border-radius: 6px;
  }
</style>
