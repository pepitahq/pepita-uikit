import { render, screen } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import IconButton from '$lib/IconButton.svelte';
import { textSnippet } from '$lib/test-helpers';

test('label drives the accessible name and the tooltip text', () => {
  render(IconButton, { props: { label: 'Reload preview', icon: textSnippet('R') } });
  const btn = screen.getByRole('button', { name: 'Reload preview' });
  expect(btn).toHaveClass('ib');
  // IconTip renders the same text as a role=tooltip sibling.
  expect(screen.getByRole('tooltip')).toHaveTextContent('Reload preview');
});

test('plain button has no aria-pressed; a toggle reflects its state', () => {
  const plain = render(IconButton, { props: { label: 'Print', icon: textSnippet('P') } });
  expect(plain.getByRole('button')).not.toHaveAttribute('aria-pressed');
  plain.unmount();

  render(IconButton, { props: { label: 'Inspect', icon: textSnippet('I'), active: true } });
  const toggle = screen.getByRole('button');
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(toggle).toHaveClass('is-active');
});

test('renders an anchor when href is set', () => {
  render(IconButton, {
    props: { label: 'Download', icon: textSnippet('D'), href: '/dl', download: true }
  });
  const link = screen.getByRole('link', { name: 'Download' });
  expect(link).toHaveAttribute('href', '/dl');
  expect(link).toHaveAttribute('download');
});

test('fires onclick when clicked', () => {
  const onclick = vi.fn();
  render(IconButton, { props: { label: 'Reload', icon: textSnippet('R'), onclick } });
  screen.getByRole('button').click();
  expect(onclick).toHaveBeenCalledOnce();
});

test('tip={false} drops the tooltip but keeps the accessible name', () => {
  render(IconButton, { props: { label: 'Reload', icon: textSnippet('R'), tip: false } });
  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
});
