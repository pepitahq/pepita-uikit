import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import { createRawSnippet } from 'svelte';
import CollapsibleSection from '$lib/CollapsibleSection.svelte';
import { textSnippet } from '$lib/test-helpers';

/** A snippet rendering a real <button>, for the actions slot. */
const buttonSnippet = (text: string) =>
  createRawSnippet(() => ({
    render: () => `<button type="button" data-testid="action">${text}</button>`
  }));

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

test('renders the actions snippet in the header', () => {
  render(CollapsibleSection, {
    props: { label: 'Files', actions: buttonSnippet('New file'), children: textSnippet('x') }
  });
  expect(screen.getByTestId('action')).toHaveTextContent('New file');
});

test('clicking an action does not toggle the section', async () => {
  render(CollapsibleSection, {
    props: { label: 'Files', actions: buttonSnippet('New file'), children: textSnippet('inside') }
  });
  expect(screen.queryByText('inside')).not.toBeInTheDocument();
  await fireEvent.click(screen.getByTestId('action'));
  expect(screen.queryByText('inside')).not.toBeInTheDocument();
  // the toggle button still works
  await fireEvent.click(screen.getByRole('button', { name: /Files/ }));
  expect(screen.getByText('inside')).toBeInTheDocument();
});

test('actions render while the section is closed', () => {
  render(CollapsibleSection, {
    props: { label: 'Videos', actions: buttonSnippet('Add'), children: textSnippet('x') }
  });
  expect(screen.getByTestId('action')).toBeInTheDocument();
});
