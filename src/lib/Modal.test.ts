import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import Modal from '$lib/Modal.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders title and body when open', () => {
  render(Modal, { props: { open: true, title: 'Settings', children: textSnippet('BODY') } });
  expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  expect(screen.getByText('BODY')).toBeInTheDocument();
});

test('renders nothing when closed', () => {
  render(Modal, { props: { open: false, title: 'Settings', children: textSnippet('BODY') } });
  expect(screen.queryByText('BODY')).toBeNull();
});

test('close button closes and calls onClose', async () => {
  const onClose = vi.fn();
  render(Modal, { props: { open: true, title: 'Settings', onClose, children: textSnippet('BODY') } });
  await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalledOnce();
  expect(screen.queryByText('BODY')).toBeNull();
});

test('Escape closes', async () => {
  render(Modal, { props: { open: true, title: 'Settings', children: textSnippet('BODY') } });
  await fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByText('BODY')).toBeNull();
});

test('backdrop click closes', async () => {
  const { container } = render(Modal, { props: { open: true, title: 'Settings', children: textSnippet('BODY') } });
  await fireEvent.click(container.querySelector('.modal-backdrop')!);
  expect(screen.queryByText('BODY')).toBeNull();
});
