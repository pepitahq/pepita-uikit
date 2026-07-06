import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Badge from '$lib/Badge.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders the label with the variant class', () => {
  render(Badge, { props: { variant: 'success', children: textSnippet('active') } });
  const el = screen.getByText('active').closest('.badge')!;
  expect(el).toHaveClass('badge-success');
});

test('defaults to the neutral variant', () => {
  render(Badge, { props: { children: textSnippet('draft') } });
  expect(screen.getByText('draft').closest('.badge')).toHaveClass('badge-neutral');
});
