import { render, screen } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import TabBar from '$lib/TabBar.svelte';

const tabs = [
  { id: 'metrics', label: 'Analytics' },
  { id: 'ai', label: 'AI' },
  { id: 'index.html', label: 'index.html', closable: true }
];

test('renders every tab label and marks the active one', () => {
  render(TabBar, { props: { tabs, activeId: 'ai', onSelect: () => {} } });
  expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'AI' })).toHaveClass('is-active');
});

test('onSelect fires with the tab id', () => {
  const onSelect = vi.fn();
  render(TabBar, { props: { tabs, activeId: 'ai', onSelect } });
  screen.getByRole('button', { name: 'Analytics' }).click();
  expect(onSelect).toHaveBeenCalledWith('metrics');
});

test('onClose fires for closable tabs', () => {
  const onClose = vi.fn();
  render(TabBar, { props: { tabs, activeId: 'ai', onSelect: () => {}, onClose } });
  screen.getByRole('button', { name: 'Close index.html' }).click();
  expect(onClose).toHaveBeenCalledWith('index.html');
});
