import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import Menu from '$lib/Menu.svelte';

const flush = () => new Promise((r) => setTimeout(r, 0));

test('renders items and a separator', () => {
  render(Menu, {
    props: {
      items: [
        { label: 'Rename', onSelect: () => {} },
        { separator: true },
        { label: 'Delete', danger: true, onSelect: () => {} }
      ]
    }
  });
  expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('danger');
  expect(screen.getByRole('separator')).toBeInTheDocument();
});

test('selecting an item fires onSelect and onClose', async () => {
  const onSelect = vi.fn();
  const onClose = vi.fn();
  render(Menu, { props: { items: [{ label: 'Rename', onSelect }], onClose } });
  await fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
  expect(onClose).toHaveBeenCalledOnce();
  await flush();
  expect(onSelect).toHaveBeenCalledOnce();
});

test('a disabled item does not fire onSelect', async () => {
  const onSelect = vi.fn();
  render(Menu, { props: { items: [{ label: 'Nope', disabled: true, onSelect }] } });
  const item = screen.getByRole('menuitem', { name: 'Nope' });
  expect(item).toBeDisabled();
  await fireEvent.click(item);
  await flush();
  expect(onSelect).not.toHaveBeenCalled();
});

test('a heading labels its group without becoming an item', () => {
  render(Menu, {
    props: {
      items: [
        { label: 'History', onSelect: () => {} },
        { separator: true },
        { heading: 'Tools' },
        { label: 'Health', onSelect: () => {} }
      ]
    }
  });
  expect(screen.getByText('Tools')).toBeInTheDocument();
  // The heading must NOT be selectable — it is a label, not an action.
  expect(screen.queryByRole('menuitem', { name: 'Tools' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('arrow keys skip the heading', async () => {
  const { container } = render(Menu, {
    props: {
      items: [
        { label: 'History', onSelect: () => {} },
        { heading: 'Tools' },
        { label: 'Health', onSelect: () => {} }
      ]
    }
  });
  const menu = container.querySelector('.menu') as HTMLElement;
  // Mount focuses the first item. ArrowDown must land on Health — if the
  // heading ever became focusable, keyboard users would arrow into a dead stop.
  expect(screen.getByRole('menuitem', { name: 'History' })).toHaveFocus();
  await fireEvent.keyDown(menu, { key: 'ArrowDown' });
  expect(screen.getByRole('menuitem', { name: 'Health' })).toHaveFocus();
});
