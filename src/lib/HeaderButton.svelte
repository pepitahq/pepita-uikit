<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    active = false,
    disabled = false,
    title = '',
    onclick,
    icon,
    children
  }: {
    active?: boolean;
    disabled?: boolean;
    title?: string;
    onclick?: () => void;
    icon?: Snippet;
    children: Snippet;
  } = $props();
</script>

<button type="button" class="hdr-btn" class:is-active={active} {disabled} {title} {onclick}>
  {#if icon}{@render icon()}{/if}
  <span>{@render children()}</span>
</button>
