import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

test('theme.css (back-compat = default family) defines the active palette + system switch', () => {
  const css = read('./theme.css');
  // Active tokens, set directly per scope (no --light-*/--dark-* intermediates anymore —
  // theme.css is now one self-contained family file; families live in ./themes/*.css).
  for (const v of ['--bg', '--ink', '--accent', '--on-accent', '--surface', '--surface-raised', '--code-bg', '--rule', '--widget-border', '--success', '--error', '--warning']) {
    expect(css).toContain(v);
  }
  // ink-soft is keyed; ink-faint/code-bg are derived from other vars
  for (const v of ['--ink-soft', '--ink-faint']) {
    expect(css).toContain(v);
  }
  // OS follows the scheme; [data-theme] forces a subtree.
  expect(css).toContain('prefers-color-scheme: dark');
  expect(css).toContain("[data-theme='light']");
  expect(css).toContain("[data-theme='dark']");
  // the old intermediate vars are gone
  expect(css).not.toContain('--light-bg');
  expect(css).not.toContain('--dark-bg');
  // generated from a named-key mapping, not hand-authored hex
  expect(css).toContain('GENERATED');
  // Rosé Pine identity values (base bg light/dark)
  expect(css).toContain('#faf4ed');
  expect(css).toContain('#191724');
});

test('tokens.css defines the typography tokens (no colors)', () => {
  const css = read('./tokens.css');
  for (const v of ['--f-mono', '--f-serif', '--f-sans', '--font']) {
    expect(css).toContain(v);
  }
  expect(css).toContain('[data-font="mono"]');
  // colors moved to theme.css — tokens.css must not define the palette
  expect(css).not.toContain('--light-bg');
  expect(css).not.toContain('[data-accent=');
});

test('primitives.css defines the canonical classes', () => {
  const css = read('./primitives.css');
  for (const sel of ['.cta', '.cta-google', '.cta-new', '.cta-create', '.g-badge', '.hdr-btn', '.pp-toggle', '.field', '.input-wrap', '.input-prefix']) {
    expect(css).toContain(sel);
  }
});

test('the barrel does NOT force-bundle the color theme (it would override runtime theme-switching)', () => {
  // theme.css defines :root color vars; if the index barrel imports it, every
  // consumer that imports a component transitively bundles it, and it loads
  // AFTER a runtime-swapped <link> — pinning the default theme. Consumers must
  // load the color theme themselves (static @pepitahq/uikit/theme.css, or a
  // swappable link). tokens.css (typography) + primitives.css (classes) are
  // theme-neutral and fine to bundle.
  const idx = read('../index.ts');
  expect(idx).not.toMatch(/import\s+['"]\.\/styles\/theme\.css['"]/);
});
