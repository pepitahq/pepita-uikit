import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

test('tokens.css defines the core custom properties and variants', () => {
  const css = read('./tokens.css');
  for (const v of ['--bg', '--ink', '--ink-soft', '--ink-faint', '--rule', '--accent', '--f-mono', '--font']) {
    expect(css).toContain(v);
  }
  expect(css).toContain('[data-bg="cream"]');
  expect(css).toContain('[data-accent="terracotta"]');
  expect(css).toContain('oklch(0.55 0.09 45)');
});

test('primitives.css defines the canonical classes', () => {
  const css = read('./primitives.css');
  for (const sel of ['.cta', '.cta-google', '.cta-new', '.cta-create', '.g-badge', '.hdr-btn', '.pp-toggle', '.field', '.input-wrap', '.input-prefix']) {
    expect(css).toContain(sel);
  }
});
