# @pepitahq/uikit

pepita's shared UI kit — design tokens, CSS primitives, and presentational Svelte 5 components,
extracted from the pepita editor chrome so the app, the marketing landing, and future surfaces
share one visual language.

Three CSS layers, each usable on its own, plus the component library:

1. **`tokens.css`** — **typography only**: the font custom properties (`--f-mono` / `--f-serif` /
   `--f-sans` and `--font`), the `data-font` variant blocks, and the base `body` + box-sizing
   reset. Colors are deliberately NOT here — they come from a theme (below).
2. **A theme** — the **color** layer: `--bg`, `--ink`, `--ink-soft`, `--ink-faint`, `--accent`,
   `--on-accent`, `--surface`, `--surface-raised`, `--code-bg`, `--rule`, `--widget-border`,
   `--success`, `--warning`, `--error`. Ships as a set of curated, runtime-swappable theme files.
3. **`primitives.css`** — reusable global classes: `.cta` (+ `.cta-google` / `.cta-new` /
   `.cta-create`), `.g-badge`, `.hdr-btn`, `.pp-toggle`, `.dialog-btn`, `.field` / `.input-wrap` /
   `.input-prefix`.
4. **Svelte 5 components** — presentational (props + snippets + callbacks; no app logic).

## Theming

Colors live in **curated theme files**, one per theme, listed in a registry:

| id | label |
|---|---|
| `rose-pine` | Rosé Pine (default) |
| `github` | GitHub |
| `ethereal-lemons` | Ethereal Lemons |

Each theme file sets the color tokens on `:root`, with a `@media (prefers-color-scheme: dark)`
block so the OS drives light/dark automatically; `[data-theme="light"]` / `[data-theme="dark"]`
on the root forces one. **Themes are runtime-swappable**: the host loads exactly one via a
`<link>` whose `href` it can swap at runtime (e.g. a Settings → theme picker). The component
barrel does **not** bundle any theme, so the loaded link is the single source of truth — nothing
overrides it.

```html
<!-- typography + the chosen theme; data-font optionally overrides the typeface -->
<link rel="stylesheet" href="/uikit/tokens.css" />
<link rel="stylesheet" href="/uikit/styles/themes/rose-pine.css" id="theme" /> <!-- swap href to re-theme -->
<html data-font="mono">
```

The registry (`default` + the list above) is published as JSON so you can build a picker:

```js
import registry from '@pepitahq/uikit/styles/themes/themes.json';
// { default: 'rose-pine', themes: [{ id, label }, …] }
```

Export paths:

- `@pepitahq/uikit/tokens.css` — typography layer
- `@pepitahq/uikit/primitives.css` — global classes
- `@pepitahq/uikit/theme.css` — the default theme (Rosé Pine) as a single file
- `@pepitahq/uikit/styles/themes/<id>.css` — an individual swappable theme file
- `@pepitahq/uikit/styles/themes/themes.json` — the theme registry

## Requirements

The kit assumes the **host** provides two things it deliberately does not bundle:

- **Fonts** — IBM Plex Mono / Serif / Sans (e.g. from Google Fonts). `tokens.css` references them but
  does not `@import` them, so the host controls loading (and there's no double-load).
- **Phosphor icons (CDN)** — the `ph-*` classes, for icon *snippets* you pass into primitives
  (Button / HeaderButton / TextInput). Components that own their icons (SplitActionButton, TabBar,
  IconButton) bundle them via the `phosphor-svelte` dependency, so those need nothing from the host.

## Usage

Importing the barrel pulls in the tokens + primitives CSS automatically — but **not** a theme;
load one yourself (see **Theming**):

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
import '@pepitahq/uikit/theme.css';        // or a specific styles/themes/<id>.css
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
| `IconButton` | `label` (feeds BOTH `aria-label` and the built-in tooltip), `icon` (snippet), `active?` (`undefined` = action button, boolean = toggle with pressed look), `disabled?`, `onclick?`, `type?`, anchor mode via `href?`/`download?`/`target?`/`rel?`, `size?` (22), `placement?`, `tip?` (`true`), `class?` — square icon control with a built-in `IconTip` |
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
| `Modal` | `open` (bindable), `title?`, `width?`, `height?`, `dismissable?` (default `true`; set `false` to veto Escape/backdrop close while an op is in flight), `onClose?` → `icon?`, `tabs?`, `children` (body), `footer?`. Focus-trap + Escape/backdrop close. |
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
| `Select` | `options: {value,label,description?,disabled?}[]`, `value` (bindable), `onChange?`, `disabled?`, `placeholder?`, `size: 'sm'\|'md'`, `variant: 'field'\|'pill'` (default `field`; `pill` is the chip shape, for an inline choice rather than a form row), `placement?` (default `'bottom-start'`; use a `top-*` value where the trigger sits near the bottom of its pane), `fullWidth?`, `ariaLabel?` — themeable `<select>` replacement (Popover + listbox, keyboard nav + type-ahead) |
| `Badge` | `variant: 'neutral'\|'success'\|'warning'\|'error'`, `icon?` → `children` — status pill |
| `Tooltip` | `text?` or `tip?` (snippet), `placement`, `width?` → `children` (focusable trigger); hover/focus reveal. **`width` is capped at `min(90vw, 22rem)`** — a wider value is silently clamped, so keep it under the cap. |
| `IconTip` | `text?` (compact one-line) or `tip?` (snippet), `placement: 'top'\|'bottom'`, `delay?` (300 ms) → `children` (focusable trigger) — a `position: fixed` tooltip that escapes ancestor `overflow`/clipping; what `IconButton` uses internally |
| `ChartTooltip` | `x`, `y`, `visible` → `content` — dark surface positioned at a point (chart hovers) |

## Development

```bash
pnpm -F @pepitahq/uikit dev       # preview gallery (all components × themes)
pnpm -F @pepitahq/uikit test      # vitest (@testing-library/svelte + jsdom)
pnpm -F @pepitahq/uikit check     # svelte-check
pnpm -F @pepitahq/uikit gen:theme # regenerate the theme CSS files from source
pnpm -F @pepitahq/uikit package   # svelte-package → dist/ (+ publint)
```

Built with `@sveltejs/package`. `dist/` (the publishable output) is generated, not committed.
