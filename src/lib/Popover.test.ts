import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Popover from '$lib/Popover.svelte';
import { textSnippet } from '$lib/test-helpers';

const at = { x: 10, y: 10 };

test('renders the panel content when open', () => {
  render(Popover, { props: { open: true, anchor: at, content: textSnippet('PANEL') } });
  expect(screen.getByText('PANEL')).toBeInTheDocument();
});

test('renders nothing when closed', () => {
  render(Popover, { props: { open: false, anchor: at, content: textSnippet('PANEL') } });
  expect(screen.queryByText('PANEL')).toBeNull();
});

test('Escape closes the panel', async () => {
  render(Popover, { props: { open: true, anchor: at, content: textSnippet('PANEL') } });
  await fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByText('PANEL')).toBeNull();
});

test('an outside pointerdown closes the panel', async () => {
  render(Popover, { props: { open: true, anchor: at, content: textSnippet('PANEL') } });
  await fireEvent.pointerDown(document.body);
  expect(screen.queryByText('PANEL')).toBeNull();
});
