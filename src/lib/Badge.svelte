<script module lang="ts">
  import type { Component } from 'svelte';
  export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'neutral',
    icon,
    children
  }: {
    variant?: BadgeVariant;
    icon?: Component<{ size?: number; weight?: string }>;
    children: Snippet;
  } = $props();
</script>

<span class="badge badge-{variant}">
  {#if icon}
    {@const Icon = icon}
    <Icon size={10} weight="fill" />
  {/if}
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--font);
    font-size: 11px;
    line-height: 1.4;
    padding: 0.1rem 0.4rem;
    border: 1px solid;
    border-radius: 4px;
    white-space: nowrap;
  }
  .badge-neutral {
    background: color-mix(in oklch, var(--ink) 5%, var(--bg));
    border-color: var(--rule);
    color: var(--ink-soft);
  }
  .badge-success {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #15803d;
  }
  .badge-warning {
    background: #fffbeb;
    border-color: #fde68a;
    color: #b45309;
  }
  .badge-error {
    background: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
  }
</style>
