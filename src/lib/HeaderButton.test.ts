import { render, screen } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import HeaderButton from '$lib/HeaderButton.svelte';
import { textSnippet } from '$lib/test-helpers';

test('applies is-active when active', () => {
  render(HeaderButton, { props: { active: true, children: textSnippet('History') } });
  expect(screen.getByRole('button')).toHaveClass('hdr-btn', 'is-active');
});

test('fires onclick when clicked', async () => {
  const onclick = vi.fn();
  const { getByRole } = render(HeaderButton, { props: { onclick, children: textSnippet('Settings') } });
  getByRole('button').click();
  expect(onclick).toHaveBeenCalledOnce();
});
