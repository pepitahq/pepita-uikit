import { render, screen, fireEvent } from '@testing-library/svelte';
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

// The panel is shown by JS state (not CSS :hover), because it is position:fixed
// and its coordinates have to be computed from the trigger's rect on every
// reveal. A regression here is silent — the tooltip simply never appears — so
// pin the hover cycle.
test('hover shows the panel and unhover hides it', async () => {
  const { container } = render(Tooltip, {
    props: { text: 'Hi', children: textSnippet('t') }
  });
  const wrap = container.querySelector('.tt-wrap') as HTMLElement;
  const tip = screen.getByRole('tooltip');

  expect(tip).not.toHaveClass('is-shown');
  await fireEvent.mouseEnter(wrap);
  expect(tip).toHaveClass('is-shown');
  await fireEvent.mouseLeave(wrap);
  expect(tip).not.toHaveClass('is-shown');
});

test('keyboard focus shows the panel', async () => {
  const { container } = render(Tooltip, {
    props: { text: 'Hi', children: textSnippet('t') }
  });
  const wrap = container.querySelector('.tt-wrap') as HTMLElement;
  await fireEvent.focusIn(wrap);
  expect(screen.getByRole('tooltip')).toHaveClass('is-shown');
});

test('placement toggles the position class', () => {
  const top = render(Tooltip, { props: { text: 'x', children: textSnippet('t') } });
  expect(top.getByRole('tooltip')).toHaveClass('tt-top');
  top.unmount();

  render(Tooltip, { props: { text: 'x', placement: 'bottom', children: textSnippet('t') } });
  expect(screen.getByRole('tooltip')).toHaveClass('tt-bottom');
});
