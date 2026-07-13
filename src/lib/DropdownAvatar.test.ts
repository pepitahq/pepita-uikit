import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, expect, vi } from 'vitest';
import DropdownAvatar from '$lib/DropdownAvatar.svelte';

test('label drives the accessible name and the title', () => {
  render(DropdownAvatar, { props: { label: 'Ada Lovelace' } });
  const btn = screen.getByRole('button', { name: 'Ada Lovelace' });
  expect(btn).toHaveClass('da');
  expect(btn).toHaveAttribute('title', 'Ada Lovelace');
  expect(btn).toHaveAttribute('aria-haspopup', 'menu');
});

test('renders the avatar image when src is set', () => {
  const { container } = render(DropdownAvatar, {
    props: { label: 'Ada', src: 'https://example.com/a.png' }
  });
  const img = container.querySelector('img.da-avatar');
  expect(img).not.toBeNull();
  expect(img).toHaveAttribute('src', 'https://example.com/a.png');
  expect(container.querySelector('.da-placeholder')).toBeNull();
});

test('renders a placeholder circle when src is null', () => {
  const { container } = render(DropdownAvatar, { props: { label: 'Ada', src: null } });
  expect(container.querySelector('img')).toBeNull();
  expect(container.querySelector('.da-avatar.da-placeholder')).not.toBeNull();
});

test('fires onclick when the pill is clicked', async () => {
  const onclick = vi.fn();
  render(DropdownAvatar, { props: { label: 'Ada', onclick } });
  await fireEvent.click(screen.getByRole('button'));
  expect(onclick).toHaveBeenCalledOnce();
});

test('aria-expanded and the open class track the open prop', () => {
  const closed = render(DropdownAvatar, { props: { label: 'Ada', open: false } });
  const btn = closed.getByRole('button');
  expect(btn).toHaveAttribute('aria-expanded', 'false');
  expect(btn).not.toHaveClass('open');
  closed.unmount();

  render(DropdownAvatar, { props: { label: 'Ada', open: true } });
  const openBtn = screen.getByRole('button');
  expect(openBtn).toHaveAttribute('aria-expanded', 'true');
  expect(openBtn).toHaveClass('open');
});
