import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
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
