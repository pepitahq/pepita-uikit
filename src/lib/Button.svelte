<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'primary',
    disabled = false,
    type = 'button',
    href,
    title = '',
    onclick,
    children,
    icon
  }: {
    variant?: 'primary' | 'google' | 'new' | 'create';
    disabled?: boolean;
    type?: 'button' | 'submit';
    href?: string;
    title?: string;
    onclick?: () => void;
    children: Snippet;
    icon?: Snippet;
  } = $props();

  const cls = $derived(
    ['cta',
      variant === 'google' && 'cta-google',
      variant === 'new' && 'cta-new',
      variant === 'create' && 'cta-create'
    ].filter(Boolean).join(' ')
  );
</script>

{#if href}
  <a class={cls} {href} {title} aria-disabled={disabled}>
    {#if icon}{@render icon()}{/if}
    {@render children()}
  </a>
{:else}
  <button class={cls} {type} {disabled} {title} {onclick}>
    {#if icon}{@render icon()}{/if}
    {@render children()}
  </button>
{/if}
