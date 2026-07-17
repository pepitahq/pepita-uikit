import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Dialog from '$lib/Dialog.svelte';
import { dialog } from '$lib/dialog-store.svelte';

test('confirm resolves true on Confirm and false on Cancel', async () => {
  render(Dialog);

  const yes = dialog.confirm('Sure?');
  expect(await screen.findByText('Sure?')).toBeInTheDocument();
  await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(await yes).toBe(true);

  const no = dialog.confirm('Sure again?');
  await screen.findByText('Sure again?');
  await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(await no).toBe(false);
});

test('alert resolves on OK and shows only one button', async () => {
  render(Dialog);
  const done = dialog.alert('Heads up');
  await screen.findByText('Heads up');
  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  await fireEvent.click(screen.getByRole('button', { name: 'OK' }));
  await expect(done).resolves.toBeUndefined();
});

test('prompt resolves the typed value', async () => {
  render(Dialog);
  const result = dialog.prompt('Name?', { initialValue: 'a' });
  const input = (await screen.findByRole('textbox')) as HTMLInputElement;
  await fireEvent.input(input, { target: { value: 'hello' } });
  await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await result).toBe('hello');
});

test('destructive confirm renders a red primary button', async () => {
  render(Dialog);
  const p = dialog.confirm('Delete it?', { destructive: true, confirmLabel: 'Delete' });
  await screen.findByText('Delete it?');
  expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('dialog-btn-destructive');
  await fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  await p;
});

test('an optional link renders under the message and opens in a new tab', async () => {
  render(Dialog);
  const done = dialog.alert('Something failed.', {
    link: { href: 'https://status.pepita.dev', label: 'Check status.pepita.dev →' }
  });
  await screen.findByText('Something failed.');
  const a = screen.getByRole('link', { name: 'Check status.pepita.dev →' });
  expect(a.getAttribute('href')).toBe('https://status.pepita.dev');
  expect(a.getAttribute('target')).toBe('_blank');
  expect(a.getAttribute('rel')).toContain('noopener');
  await fireEvent.click(screen.getByRole('button', { name: 'OK' }));
  await done;
});

test('no link element renders when the option is absent', async () => {
  render(Dialog);
  const done = dialog.alert('Something failed.');
  await screen.findByText('Something failed.');
  expect(screen.queryByRole('link')).toBeNull();
  await fireEvent.click(screen.getByRole('button', { name: 'OK' }));
  await done;
});
