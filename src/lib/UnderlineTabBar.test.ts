import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import UnderlineTabBar from '$lib/UnderlineTabBar.svelte';

const tabs = [
  { id: 'headers', label: 'Headers & CSP' },
  { id: 'perf', label: 'Performance' }
];

test('renders tabs and marks the active one', () => {
  render(UnderlineTabBar, { props: { tabs, activeId: 'perf', onSelect: () => {} } });
  expect(screen.getByRole('tab', { name: 'Headers & CSP' })).toBeInTheDocument();
  const active = screen.getByRole('tab', { name: 'Performance' });
  expect(active).toHaveClass('is-active');
  expect(active).toHaveAttribute('aria-selected', 'true');
});

test('onSelect fires with the tab id', async () => {
  const onSelect = vi.fn();
  render(UnderlineTabBar, { props: { tabs, activeId: 'perf', onSelect } });
  await fireEvent.click(screen.getByRole('tab', { name: 'Headers & CSP' }));
  expect(onSelect).toHaveBeenCalledWith('headers');
});
