import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import CollapsibleSection from '$lib/CollapsibleSection.svelte';
import { textSnippet } from '$lib/test-helpers';

test('renders the label and hides content while closed', () => {
  render(CollapsibleSection, {
    props: { label: 'Videos', children: textSnippet('the content') }
  });
  expect(screen.getByText('Videos')).toBeInTheDocument();
  expect(screen.queryByText('the content')).not.toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});

test('open=true shows the content and the expanded state', () => {
  render(CollapsibleSection, {
    props: { label: 'Videos', open: true, children: textSnippet('the content') }
  });
  expect(screen.getByText('the content')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
});

test('clicking the header toggles the content', async () => {
  render(CollapsibleSection, {
    props: { label: 'Advanced settings', children: textSnippet('inside') }
  });
  await fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('inside')).toBeInTheDocument();
  await fireEvent.click(screen.getByRole('button'));
  expect(screen.queryByText('inside')).not.toBeInTheDocument();
});

test('shows the optional count badge', () => {
  render(CollapsibleSection, {
    props: { label: 'Videos', count: 3, children: textSnippet('x') }
  });
  expect(screen.getByText('3')).toBeInTheDocument();
});
