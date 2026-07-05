import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import ContextMenu from '$lib/ContextMenu.svelte';

const flush = () => new Promise((r) => setTimeout(r, 0));

test('renders the menu items when open', () => {
  render(ContextMenu, {
    props: { open: true, x: 20, y: 20, items: [{ label: 'Rename', onSelect: () => {} }] }
  });
  expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
});

test('renders nothing when closed', () => {
  render(ContextMenu, {
    props: { open: false, x: 20, y: 20, items: [{ label: 'Rename', onSelect: () => {} }] }
  });
  expect(screen.queryByRole('menuitem')).toBeNull();
});

test('selecting an item fires onSelect', async () => {
  const onSelect = vi.fn();
  render(ContextMenu, { props: { open: true, x: 20, y: 20, items: [{ label: 'Rename', onSelect }] } });
  await fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
  await flush();
  expect(onSelect).toHaveBeenCalledOnce();
});
