<script lang="ts">
  import Button from '$lib/Button.svelte';
  import AuthButton from '$lib/AuthButton.svelte';
  import HeaderButton from '$lib/HeaderButton.svelte';
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
  import Badge from '$lib/Badge.svelte';
  import Tooltip from '$lib/Tooltip.svelte';
  import ChartTooltip from '$lib/ChartTooltip.svelte';

  let galleryTab = $state('ai');
  let healthTab = $state('headers');
  const bgs = ['white', 'cream', 'black'] as const;

  // Overlay demo state
  let modalOpen = $state(false);
  let popOpen = $state(false);
  let popBtn = $state<HTMLElement>();
  let ctxOpen = $state(false);
  let ctxX = $state(0);
  let ctxY = $state(0);
  let segVal = $state('7d');

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
</script>

{#snippet gallery()}
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

  {#each bgs as bg (bg)}
    <div class="frame" data-bg={bg}>
      <p class="frame-label">data-bg="{bg}"</p>
      {@render gallery()}
    </div>
  {/each}

  <!-- Overlays — rendered once (they cover the screen). -->
  <div class="frame" data-bg="cream">
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
  .frame {
    background: var(--bg);
    color: var(--ink);
    padding: 1.5rem;
    margin: 1.5rem 0;
    border: 1px solid var(--rule);
    border-radius: 8px;
  }
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
</style>
