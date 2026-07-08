import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import IconTip from '$lib/IconTip.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders the trigger and a role=tooltip with the text', () => {
  render(IconTip, { props: { text: 'Delete', children: textSnippet('trigger') } });
  expect(screen.getByText('trigger')).toBeInTheDocument();
  expect(screen.getByRole('tooltip')).toHaveTextContent('Delete');
});

test('placement toggles the position class', () => {
  const bottom = render(IconTip, { props: { text: 'x', children: textSnippet('t') } });
  expect(bottom.getByRole('tooltip')).toHaveClass('it-bottom');
  bottom.unmount();

  render(IconTip, { props: { text: 'x', placement: 'top', children: textSnippet('t') } });
  expect(screen.getByRole('tooltip')).toHaveClass('it-top');
});
