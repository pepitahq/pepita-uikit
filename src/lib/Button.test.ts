import { render, screen } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import Button from '$lib/Button.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders a button with the cta class and the variant modifier', () => {
  render(Button, { props: { variant: 'google', children: textSnippet('Save') } });
  const btn = screen.getByRole('button');
  expect(btn).toHaveClass('cta', 'cta-google');
  expect(btn).toHaveTextContent('Save');
});

test('renders an anchor when href is provided', () => {
  render(Button, { props: { href: '/x', children: textSnippet('Go') } });
  const link = screen.getByRole('link');
  expect(link).toHaveClass('cta');
  expect(link).toHaveAttribute('href', '/x');
});

test('reflects disabled', () => {
  render(Button, { props: { disabled: true, children: textSnippet('X') } });
  expect(screen.getByRole('button')).toBeDisabled();
});

test('a disabled anchor is non-navigable and marked aria-disabled', () => {
  render(Button, { props: { href: '/x', disabled: true, children: textSnippet('Go') } });
  const link = screen.getByText('Go').closest('a')!;
  expect(link).toHaveAttribute('aria-disabled', 'true');
  expect(link).not.toHaveAttribute('href');
  expect(link).toHaveAttribute('tabindex', '-1');
});

test('fires onclick when an enabled button is clicked', () => {
  const onclick = vi.fn();
  render(Button, { props: { onclick, children: textSnippet('Go') } });
  screen.getByRole('button').click();
  expect(onclick).toHaveBeenCalledOnce();
});
