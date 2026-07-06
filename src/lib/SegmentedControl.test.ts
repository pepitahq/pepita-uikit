import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import SegmentedControl from '$lib/SegmentedControl.svelte';

const options = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' }
];

test('renders options and marks the active one', () => {
  render(SegmentedControl, { props: { options, value: '7d' } });
  expect(screen.getByRole('tab', { name: '24h' })).toBeInTheDocument();
  const active = screen.getByRole('tab', { name: '7d' });
  expect(active).toHaveClass('seg-on');
  expect(active).toHaveAttribute('aria-selected', 'true');
});

test('clicking an option fires onChange with its value', async () => {
  const onChange = vi.fn();
  render(SegmentedControl, { props: { options, value: '24h', onChange } });
  await fireEvent.click(screen.getByRole('tab', { name: '30d' }));
  expect(onChange).toHaveBeenCalledWith('30d');
});
