import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import TextInput from '$lib/TextInput.svelte';

test('renders label, help, and a text input', () => {
  render(TextInput, { props: { label: 'Slug', help: 'lowercase only', value: 'hi' } });
  expect(screen.getByText('Slug')).toBeInTheDocument();
  expect(screen.getByText('lowercase only')).toBeInTheDocument();
  const input = screen.getByRole('textbox') as HTMLInputElement;
  expect(input.value).toBe('hi');
});

test('adds no-prefix class when no prefix snippet is provided', () => {
  render(TextInput, { props: { value: '' } });
  expect(screen.getByRole('textbox')).toHaveClass('no-prefix');
});

test('associates the label with the input via for/id', () => {
  const { container } = render(TextInput, { props: { label: 'Slug', value: '' } });
  const label = container.querySelector('label')!;
  const input = screen.getByRole('textbox');
  expect(input.id).toBeTruthy();
  expect(label.getAttribute('for')).toBe(input.id);
});
