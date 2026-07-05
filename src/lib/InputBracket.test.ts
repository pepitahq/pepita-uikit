import { render } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import InputBracket from '$lib/InputBracket.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders the input/controls/action snippets inside the bracket', () => {
  const { container } = render(InputBracket, {
    props: { input: textSnippet('INPUT'), controls: textSnippet('CTRL'), action: textSnippet('SEND') }
  });
  const bracket = container.querySelector('.bracket');
  expect(bracket).toBeTruthy();
  expect(bracket?.textContent).toContain('INPUT');
  expect(bracket?.textContent).toContain('CTRL');
  expect(bracket?.textContent).toContain('SEND');
});

test('applies is-disabled when disabled', () => {
  const { container } = render(InputBracket, { props: { disabled: true, input: textSnippet('x') } });
  expect(container.querySelector('.bracket')).toHaveClass('is-disabled');
});
