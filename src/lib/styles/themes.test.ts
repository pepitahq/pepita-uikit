import { describe, it, expect } from 'vitest';
import { buildThemes } from '../../../scripts/lib/build-themes.mjs';

// A curated theme that defines every key itself.
const FULL = {
  'editor.background': '#ffffff', foreground: '#111111', 'button.background': '#cc0000',
  'input.background': '#eeeeee', 'dropdown.background': '#dddddd', 'button.foreground': '#ffffff',
  'input.border': '#cccccc', 'editorWidget.border': '#bbbbbb', descriptionForeground: '#888888',
  'terminal.ansiGreen': '#00aa00', 'editorError.foreground': '#ff0000', 'editorWarning.foreground': '#ffaa00'
};
// Sparse curated theme: has identity (bg/ink/accent) + surface/on-accent/rule/ink-soft,
// but NO status hues and NO descriptionForeground → must fill from the defaults.
const SPARSE = {
  'editor.background': '#000000', 'editor.foreground': '#dddddd', 'button.background': '#3366ff',
  'input.background': '#111111', 'editorWidget.background': '#0a0a0a', 'button.foreground': '#04080d',
  'input.border': '#4b607ad0', 'tab.inactiveForeground': '#777777'
};
// Stand-in for VS Code Modern (colors-only). success ← editorGutter.addedBackground; error ← errorForeground.
const DEF_LIGHT = {
  'editor.background': '#ffffff', foreground: '#3b3b3b', 'button.background': '#005fb8',
  'input.background': '#ffffff', 'dropdown.background': '#ffffff', 'button.foreground': '#ffffff',
  'input.border': '#cecece', 'panel.border': '#e5e5e5', descriptionForeground: '#9d9d9d',
  'editorGutter.addedBackground': '#2ea043', errorForeground: '#f85149'
};
const DEF_DARK = { ...DEF_LIGHT, 'editor.background': '#1f1f1f', foreground: '#cccccc', descriptionForeground: '#9d9d9d' };

const load = (f: string) => ({
  colors: f.startsWith('sparse') ? SPARSE : f === 'def-l' ? DEF_LIGHT : f === 'def-d' ? DEF_DARK : FULL
});
// build-themes.mjs is untyped JS, so TS infers `files` too narrowly (only the
// literal keys it sees assigned). Cast to the real shape for indexing in tests.
type BuildResult = {
  files: Record<string, string>;
  manifest: { default: string; themes: { id: string; label: string }[] };
  info: string[];
};
const withDefaults = (themes: any[]): BuildResult =>
  buildThemes({ themes, defaults: { light: 'def-l', dark: 'def-d' }, load }) as BuildResult;

describe('buildThemes', () => {
  it('emits a css file per theme, a manifest, and a back-compat theme.css', () => {
    const { files, manifest } = withDefaults([
      { id: 'a', label: 'A', light: 'a-l', dark: 'a-d' }, { id: 'b', label: 'B', light: 'b-l', dark: 'b-d' }
    ]);
    expect(manifest.default).toBe('a');
    expect(manifest.themes).toEqual([{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]);
    expect(files['a.css']).toBeTruthy();
    expect(files['b.css']).toBeTruthy();
    expect(files['theme.css']).toBe(files['a.css']); // back-compat = default family
    expect(files['themes.json']).toContain('"default": "a"');
  });

  it('defines all tokens in all four scopes', () => {
    const { files } = withDefaults([{ id: 'a', label: 'A', light: 'a-l', dark: 'a-d' }]);
    const css = files['a.css'];
    for (const scope of [':root', '@media (prefers-color-scheme: dark)', "[data-theme='light']", "[data-theme='dark']"])
      expect(css).toContain(scope);
    for (const tok of ['--bg:', '--ink:', '--ink-soft:', '--ink-faint:', '--accent:', '--on-accent:', '--surface:', '--surface-raised:', '--code-bg:', '--rule:', '--widget-border:', '--success:', '--error:', '--warning:'])
      expect(css).toContain(tok);
    // code-bg is a derived alias of surface-raised (a pepita token used by cards/code blocks).
    expect(css).toContain('--code-bg:        var(--surface-raised);');
  });

  it('fills missing tokens from the VS Code default + registry (and reports it)', () => {
    const { files, info } = withDefaults([{ id: 's', label: 'S', light: 'sparse-l', dark: 'sparse-d' }]);
    expect(info.join(' | ')).toMatch(/s (light|dark) filled:.*(success|error|warning)/);
    expect(files['s.css']).toContain('#2ea043'); // success from default (editorGutter.addedBackground)
    expect(files['s.css']).toContain('#f85149'); // error from default (errorForeground)
    expect(files['s.css']).toContain('#cca700'); // warning from registry backstop, dark
    expect(files['s.css']).toContain('#bf8803'); // warning from registry backstop, light
  });

  it('fills ink-soft from the VS Code default when the curated theme has no soft key', () => {
    const noSoft = (f: string) =>
      f === 'def-l' ? { colors: DEF_LIGHT } : f === 'def-d' ? { colors: DEF_DARK }
      : { colors: { ...FULL, descriptionForeground: undefined as any } };
    const { files } = buildThemes({ themes: [{ id: 'n', label: 'N', light: 'n', dark: 'n' }], defaults: { light: 'def-l', dark: 'def-d' }, load: noSoft }) as BuildResult;
    expect(files['n.css']).toContain('#9d9d9d'); // descriptionForeground from the default
  });

  it('keeps ink-faint derived (a pepita tone, not from any theme)', () => {
    const { files } = withDefaults([{ id: 'a', label: 'A', light: 'a-l', dark: 'a-d' }]);
    expect(files['a.css']).toContain('color-mix(in srgb, var(--ink) 40%, var(--bg))');
  });

  it('throws when a curated identity token (bg/ink/accent) is missing', () => {
    const noAccent = (f: string) =>
      f === 'def-l' ? { colors: DEF_LIGHT } : f === 'def-d' ? { colors: DEF_DARK }
      : { colors: { 'editor.background': '#fff', foreground: '#111' } }; // no button.background/textLink.foreground
    expect(() => buildThemes({ themes: [{ id: 'x', label: 'X', light: 'x', dark: 'x' }], defaults: { light: 'def-l', dark: 'def-d' }, load: noAccent })).toThrow(/identity token "accent"/);
  });
});
