import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Tooltip from '$lib/Tooltip.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders the trigger and a text tooltip with role=tooltip', () => {
  render(Tooltip, { props: { text: 'Model help', children: textSnippet('?') } });
  expect(screen.getByText('?')).toBeInTheDocument();
  const tip = screen.getByRole('tooltip');
  expect(tip).toHaveTextContent('Model help');
});

test('rich tip content overrides text', () => {
  render(Tooltip, { props: { text: 'ignored', tip: textSnippet('RICH'), children: textSnippet('?') } });
  expect(screen.getByRole('tooltip')).toHaveTextContent('RICH');
});
