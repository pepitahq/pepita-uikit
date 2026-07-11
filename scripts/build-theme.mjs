// Generate the per-family theme CSS + manifest (and a back-compat theme.css)
// from the vendored VSCode theme JSONs. Run: node scripts/build-theme.mjs
// (or `pnpm gen:theme`). Compiler core: scripts/lib/build-themes.mjs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildThemes } from './lib/build-themes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const themesSrc = join(root, 'src/lib/themes');
const stylesDir = join(root, 'src/lib/styles');
const outDir = join(stylesDir, 'themes');

// The curated set. Order = manifest order; the first is the default.
const THEMES = [
  { id: 'rose-pine', label: 'Rosé Pine', light: 'rose-pine-dawn.json', dark: 'rose-pine.json' },
  { id: 'github', label: 'GitHub', light: 'github-light.json', dark: 'github-dark.json' },
  { id: 'ethereal-lemons', label: 'Ethereal Lemons', light: 'ethereal-angelical-light.json', dark: 'ethereal-windows7.json' }
];

// VS Code Modern defaults — the fallback theme for any token a curated theme omits.
const DEFAULTS = { light: '_defaults/vscode-light.json', dark: '_defaults/vscode-dark.json' };

const load = (f) => JSON.parse(readFileSync(join(themesSrc, f), 'utf8'));
const { files, manifest, info } = buildThemes({ themes: THEMES, defaults: DEFAULTS, load });

mkdirSync(outDir, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  const dest = name === 'theme.css' ? join(stylesDir, name) : join(outDir, name);
  writeFileSync(dest, content);
}
console.log(`✓ ${manifest.themes.length} themes → src/lib/styles/themes/ (+ back-compat theme.css)`);
for (const line of info) console.log('  · ' + line);
