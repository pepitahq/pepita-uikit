import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import Select from '$lib/Select.svelte';

const options = [
  { value: 'light', label: 'Light', description: 'Haiku 4.5' },
  { value: 'medium', label: 'Medium', description: 'Sonnet 5' },
  { value: 'deep', label: 'Deep', description: 'Opus 4.8' }
];

test('trigger shows the selected option label, list is closed by default', () => {
  render(Select, { props: { options, value: 'medium' } });
  const trigger = screen.getByRole('combobox');
  expect(trigger).toHaveTextContent('Medium');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('clicking the trigger opens the listbox and marks the selected option', async () => {
  render(Select, { props: { options, value: 'medium' } });
  await fireEvent.click(screen.getByRole('combobox'));
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  const selected = screen.getByRole('option', { selected: true });
  expect(selected).toHaveTextContent('Medium');
});

test('clicking an option fires onChange, updates the trigger, and closes', async () => {
  const onChange = vi.fn();
  render(Select, { props: { options, value: 'medium', onChange } });
  await fireEvent.click(screen.getByRole('combobox'));
  await fireEvent.click(screen.getByRole('option', { name: /Deep/ }));
  expect(onChange).toHaveBeenCalledWith('deep');
  expect(screen.getByRole('combobox')).toHaveTextContent('Deep');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('a disabled option cannot be selected', async () => {
  const onChange = vi.fn();
  render(Select, {
    props: {
      options: [
        { value: 'custom', label: 'Custom', disabled: true },
        { value: 'desktop', label: 'Desktop' }
      ],
      value: 'desktop',
      onChange
    }
  });
  await fireEvent.click(screen.getByRole('combobox'));
  await fireEvent.click(screen.getByRole('option', { name: 'Custom' }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('a disabled control does not open', async () => {
  render(Select, { props: { options, value: 'medium', disabled: true } });
  await fireEvent.click(screen.getByRole('combobox'));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('placeholder shows when no option matches the value', () => {
  render(Select, { props: { options, value: '', placeholder: 'Pick one…' } });
  expect(screen.getByRole('combobox')).toHaveTextContent('Pick one…');
});

test('ArrowDown opens and Enter commits the highlighted option', async () => {
  const onChange = vi.fn();
  render(Select, { props: { options, value: 'light', onChange } });
  const trigger = screen.getByRole('combobox');
  await fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // opens, highlight = selected (light)
  await fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // -> medium
  await fireEvent.keyDown(trigger, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith('medium');
});
