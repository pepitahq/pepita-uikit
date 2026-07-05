<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    active = false,
    disabled = false,
    title = '',
    onclick,
    children
  }: {
    active?: boolean;
    disabled?: boolean;
    title?: string;
    onclick?: () => void;
    children: Snippet;
  } = $props();
</script>

<button type="button" class="pp-toggle" class:is-active={active} {disabled} {title} {onclick}>
  {@render children()}
</button>
