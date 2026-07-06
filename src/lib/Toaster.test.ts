import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { test, expect, vi, beforeEach } from 'vitest';
import Toaster from '$lib/Toaster.svelte';
import { toast } from '$lib/toast-store.svelte';

// The store is a module singleton — clear it between tests.
beforeEach(() => {
  for (const t of [...toast.items]) toast.dismiss(t.id);
});

test('shows a toast with its message and variant class', async () => {
  render(Toaster);
  toast.success('Saved.', { duration: 0 });
  const el = (await screen.findByText('Saved.')).closest('.toast')!;
  expect(el).toHaveClass('toast-success');
  expect(el).toHaveAttribute('role', 'status');
});

test('the dismiss button removes the toast', async () => {
  render(Toaster);
  toast.error('Boom');
  await screen.findByText('Boom');
  await fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  await waitFor(() => expect(screen.queryByText('Boom')).toBeNull());
});

test('a warning toast can carry an action that fires then dismisses', async () => {
  render(Toaster);
  const onClick = vi.fn();
  toast.warning('Conflict', { action: { label: 'Pull latest', onClick } });
  await screen.findByText('Conflict');
  await fireEvent.click(screen.getByRole('button', { name: 'Pull latest' }));
  expect(onClick).toHaveBeenCalledOnce();
  await waitFor(() => expect(screen.queryByText('Conflict')).toBeNull());
});
