# @pepitahq/uikit

pepita's shared UI kit — design tokens, CSS primitives, and presentational Svelte 5 components,
extracted from the pepita editor chrome so the app, the marketing landing, and future surfaces
share one visual language.

Three layers, each usable on its own:

1. **`tokens.css`** — the color + typography CSS custom properties (`--bg`, `--ink`, `--accent`,
   `--font`, …) and the `data-bg` / `data-accent` / `data-font` variant blocks. Portable to any HTML.
2. **`primitives.css`** — reusable global classes: `.cta` (+ `.cta-google` / `.cta-new` /
   `.cta-create`), `.g-badge`, `.hdr-btn`, `.pp-toggle`, `.field` / `.input-wrap` / `.input-prefix`.
3. **Svelte 5 components** — presentational (props + snippets + callbacks; no app logic).

## Requirements

The kit assumes the **host** provides two things it deliberately does not bundle:

- **Fonts** — IBM Plex Mono / Serif / Sans (e.g. from Google Fonts). `tokens.css` references them but
  does not `@import` them, so the host controls loading (and there's no double-load).
- **Phosphor icons (CDN)** — the `ph-*` classes, for icon *snippets* you pass into primitives
  (Button/HeaderButton/TextInput). The composites that own their icons (SplitActionButton, TabBar)
  bundle them via the `phosphor-svelte` dependency, so those need nothing from the host.

Set the theme on the root element:

```html
<html data-bg="cream" data-font="mono" data-accent="terracotta">
```

`data-bg`: `white` | `cream` | `black` · `data-accent`: `terracotta` | `olive` | `slate` | `ink` ·
`data-font`: `mono` | `serif` | `sans`.

## Usage

Importing the barrel pulls in the tokens + primitives CSS automatically:

```svelte
<script>
  import { Button, AuthButton, SplitActionButton } from '@pepitahq/uikit';
</script>

<Button variant="primary" onclick={save}>Save</Button>
<AuthButton href="/auth/google" />
```

Plain-HTML surfaces (the landing, served user sites) can consume just the CSS layers:

```js
import '@pepitahq/uikit/tokens.css';
import '@pepitahq/uikit/primitives.css';
```
```html
<button class="cta">Save</button>
<button class="cta cta-google"><span class="g-badge"><!-- G mark --></span> Continue with Google</button>
```

## Components

All components are presentational — you pass data + callbacks; you wire the behavior.

| Component | Key props (→ snippets) |
|---|---|
| `Button` | `variant: 'primary'\|'google'\|'new'\|'create'`, `disabled`, `type`, `href`, `title`, `onclick` → `children`, `icon?` |
| `AuthButton` | `href`, `label?` (`'Continue with Google'`), `disabled?` — renders the branded Google button with an inlined mark |
| `HeaderButton` | `active?`, `disabled?`, `title?`, `onclick?` → `icon?`, `children` |
| `TogglePill` | `active?`, `disabled?`, `title?`, `onclick?` → `children` |
| `TextInput` | `value` (bindable), `label?`, `placeholder?`, `help?`, `disabled?`, `id?`, `oninput?` → `prefix?` |
| `SplitActionButton` | `kind: 'draft'\|'live'`, `primaryLabel`, `onPrimary`, `busy?`, `primaryTitle?`, `downloadHref?`, `downloadLabel?`, `urlsHeading?`, `urls?: string[]` → `primaryIcon?` |
| `TabBar` | `tabs: TabItem[]`, `activeId`, `onSelect(id)`, `onClose?(id)` |
| `Tab` | `label`, `active?`, `closable?`, `onSelect?`, `onClose?` (the single-tab primitive `TabBar` composes) |
| `InputBracket` | `disabled?` → `input`, `controls?`, `action?` — a focus-aware frame; any `<textarea>`/`<input>` in the `input` slot is reset borderless |

`TabItem` is `{ id: string; label: string; closable?: boolean }`.

### Example — InputBracket (chat-style composer frame)

```svelte
<script>
  import { InputBracket, TogglePill, Button } from '@pepitahq/uikit';
</script>

<InputBracket>
  {#snippet input()}<textarea rows="3" placeholder="Describe the edit…"></textarea>{/snippet}
  {#snippet controls()}<TogglePill>Select</TogglePill>{/snippet}
  {#snippet action()}<Button variant="new">Send</Button>{/snippet}
</InputBracket>
```

## Overlays & dialogs

| Component | Key props (→ snippets) |
|---|---|
| `Popover` | `open` (bindable), `placement`, `offset`, `anchor?: {x,y}`, `anchorEl?: HTMLElement` → `content`. Controlled floating panel; you render your own trigger. |
| `Menu` | `items: MenuEntry[]` (`{label, icon?, shortcut?, danger?, disabled?, onSelect}` \| `{separator:true}`), `onClose?` — arrow-key nav |
| `ContextMenu` | `open` (bindable), `x`, `y`, `items` — a `Menu` in a `Popover` at a point |
| `Modal` | `open` (bindable), `title?`, `width?`, `height?`, `onClose?` → `icon?`, `tabs?`, `children` (body), `footer?`. Focus-trap + Escape/backdrop close. |
| `UnderlineTabBar` | `tabs: {id,label,icon?}[]`, `activeId`, `onSelect(id)` — the modal-style tabs |
| `Dialog` + `dialog` | imperative `dialog.alert/confirm/prompt`; mount `<Dialog />` once at the root |
| `Toaster` + `toast` | transient notifications: `toast.info/success/error(msg, { duration? })`; mount `<Toaster />` once |

Layering: `Modal` (z 50) < `Popover`/`Menu` (z 60) < `Dialog`/`ContextMenu` (z 100).

### Example — Dialog

Mount `<Dialog />` once at the root, then call it imperatively anywhere:

```svelte
<script>
  import { Dialog, dialog } from '@pepitahq/uikit';
</script>

<Dialog />
```
```js
await dialog.alert('Saved.');
if (!(await dialog.confirm('Delete site?', { destructive: true }))) return;
const name = await dialog.prompt('Rename to:', { initialValue: current });
```

### Example — Popover (controlled)

```svelte
<script>
  import { Popover } from '@pepitahq/uikit';
  let open = $state(false);
  let btn = $state<HTMLElement>();
</script>

<button bind:this={btn} onclick={() => (open = !open)}>Menu</button>
<Popover bind:open anchorEl={btn} placement="bottom-end">
  {#snippet content()}<div class="my-panel">…</div>{/snippet}
</Popover>
```

## Feedback & controls

| Component | Key props (→ snippets) |
|---|---|
| `SegmentedControl` | `options: {value,label,disabled?}[]`, `value` (bindable), `onChange?` — pill-group toggle |
| `Badge` | `variant: 'neutral'\|'success'\|'warning'\|'error'`, `icon?` → `children` — status pill |
| `Tooltip` | `text?` or `tip?` (snippet), `placement`, `width?` → `children` (focusable trigger); hover/focus reveal |
| `ChartTooltip` | `x`, `y`, `visible` → `content` — dark surface positioned at a point (chart hovers) |

## Development

```bash
pnpm -F @pepitahq/uikit dev       # preview gallery (all components × bg/accent variants)
pnpm -F @pepitahq/uikit test      # vitest (@testing-library/svelte + jsdom)
pnpm -F @pepitahq/uikit check     # svelte-check
pnpm -F @pepitahq/uikit package   # svelte-package → dist/ (+ publint)
```

Built with `@sveltejs/package`. `dist/` (the publishable output) is generated, not committed.
