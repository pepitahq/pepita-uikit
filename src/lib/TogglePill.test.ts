import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import TogglePill from '$lib/TogglePill.svelte';
import { textSnippet } from '$lib/test-helpers';

test('applies is-active when active', () => {
  render(TogglePill, { props: { active: true, children: textSnippet('Select') } });
  expect(screen.getByRole('button')).toHaveClass('pp-toggle', 'is-active');
});

test('reflects disabled', () => {
  render(TogglePill, { props: { disabled: true, children: textSnippet('Select') } });
  expect(screen.getByRole('button')).toBeDisabled();
});
