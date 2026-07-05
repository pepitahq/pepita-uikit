import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import AuthButton from '$lib/AuthButton.svelte';

test('renders the Google auth link with default label and inlined mark', () => {
  const { container } = render(AuthButton, { props: { href: '/auth/google' } });
  const link = screen.getByRole('link');
  expect(link).toHaveClass('cta', 'cta-google');
  expect(link).toHaveAttribute('href', '/auth/google');
  expect(link).toHaveTextContent('Continue with Google');
  expect(container.querySelector('.g-badge svg')).toBeTruthy();
});
