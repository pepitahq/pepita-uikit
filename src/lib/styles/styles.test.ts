import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

test('theme.css defines the light/dark palette + system switch', () => {
  const css = read('./theme.css');
  // three identity colors per theme + the active tokens
  for (const v of ['--light-bg', '--dark-bg', '--light-ink', '--dark-ink', '--light-accent', '--dark-accent', '--bg', '--ink', '--accent']) {
    expect(css).toContain(v);
  }
  // ink-soft is keyed; ink-faint/rule are derived from --ink / --bg
  for (const v of ['--ink-soft', '--ink-faint', '--rule']) {
    expect(css).toContain(v);
  }
  expect(css).toContain('prefers-color-scheme: dark');
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
