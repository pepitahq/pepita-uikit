import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import ChartTooltip from '$lib/ChartTooltip.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders content when visible', () => {
  render(ChartTooltip, { props: { visible: true, x: 20, y: 30, content: textSnippet('42 visitors') } });
  const tip = screen.getByRole('tooltip');
  expect(tip).toHaveTextContent('42 visitors');
});

test('renders nothing when not visible', () => {
  render(ChartTooltip, { props: { visible: false, content: textSnippet('42 visitors') } });
  expect(screen.queryByRole('tooltip')).toBeNull();
});
