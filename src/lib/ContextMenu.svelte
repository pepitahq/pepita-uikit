<script lang="ts">
  import Popover from './Popover.svelte';
  import Menu from './Menu.svelte';
  import type { MenuEntry } from './Menu.svelte';

  let {
    open = $bindable(false),
    x = 0,
    y = 0,
    items
  }: {
    /** Controlled open state (bindable). */
    open?: boolean;
    /** Viewport coordinates to open at (e.g. from a contextmenu event). */
    x?: number;
    y?: number;
    items: MenuEntry[];
  } = $props();
</script>

<Popover bind:open anchor={{ x, y }} placement="bottom-start">
  {#snippet content()}
    <Menu {items} onClose={() => (open = false)} />
  {/snippet}
</Popover>
