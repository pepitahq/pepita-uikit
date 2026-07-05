<script lang="ts">
  import Button from '$lib/Button.svelte';
  import AuthButton from '$lib/AuthButton.svelte';
  import HeaderButton from '$lib/HeaderButton.svelte';
  import TogglePill from '$lib/TogglePill.svelte';
  import TextInput from '$lib/TextInput.svelte';
  import SplitActionButton from '$lib/SplitActionButton.svelte';
  import TabBar from '$lib/TabBar.svelte';
  import InputBracket from '$lib/InputBracket.svelte';

  let galleryTab = $state('ai');
  const bgs = ['white', 'cream', 'black'] as const;
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
    <h2>InputBracket</h2>
    <div style="max-width:28rem;">
      <InputBracket>
        {#snippet input()}
          <textarea rows="3" placeholder="Describe the edit you want…"></textarea>
        {/snippet}
        {#snippet controls()}
          <TogglePill>{'Select'}</TogglePill>
        {/snippet}
        {#snippet action()}
          <Button variant="new">{'Send'}</Button>
        {/snippet}
      </InputBracket>
    </div>
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
</main>

<style>
  main { padding: 2rem; max-width: 60rem; margin: 0 auto; }
  h1 { font-size: 20px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; margin: 0 0 0.75rem; }
  section { margin: 1.5rem 0; }
  .row { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
  .col { display: flex; flex-direction: column; gap: 1rem; }
  .frame {
    background: var(--bg);
    color: var(--ink);
    padding: 1.5rem;
    margin: 1.5rem 0;
    border: 1px solid var(--rule);
    border-radius: 8px;
  }
  .frame-label { opacity: 0.6; font-size: 12px; margin: 0 0 1rem; }
</style>
