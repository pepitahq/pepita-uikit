import { render, screen } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import SplitActionButton from '$lib/SplitActionButton.svelte';

const base = {
  kind: 'draft' as const,
  primaryLabel: 'Save',
  onPrimary: () => {},
  downloadHref: '/dl',
  downloadLabel: 'Download draft',
  urlsHeading: 'Draft URL',
  urls: ['https://x--draft.pepita.page']
};

test('fires onPrimary when the primary button is clicked', async () => {
  const onPrimary = vi.fn();
  render(SplitActionButton, { props: { ...base, onPrimary } });
  screen.getByRole('button', { name: 'Save' }).click();
  expect(onPrimary).toHaveBeenCalledOnce();
});

test('caret toggles the dropdown, which lists the download + urls', async () => {
  render(SplitActionButton, { props: base });
  expect(screen.queryByText('Download draft')).toBeNull();
  screen.getByRole('button', { name: 'Save options' }).click();
  expect(await screen.findByText('Download draft')).toBeInTheDocument();
  expect(screen.getByText('Draft URL')).toBeInTheDocument();
  expect(screen.getByText('https://x--draft.pepita.page')).toBeInTheDocument();
});

test('disables the primary button while busy', () => {
  render(SplitActionButton, { props: { ...base, busy: true } });
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
});
