<script module lang="ts">
  let uid = 0;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    value = $bindable(''),
    label,
    placeholder = '',
    help,
    type = 'text',
    disabled = false,
    id,
    oninput,
    prefix
  }: {
    value?: string;
    label?: string;
    placeholder?: string;
    help?: string;
    type?: 'text';
    disabled?: boolean;
    id?: string;
    oninput?: (e: Event) => void;
    prefix?: Snippet;
  } = $props();

  const fallbackId = `pp-textinput-${(uid += 1)}`;
  const inputId = $derived(id ?? fallbackId);
</script>

<div class="field">
  {#if label}<label for={inputId}>{label}</label>{/if}
  <div class="input-wrap">
    {#if prefix}<span class="input-prefix">{@render prefix()}</span>{/if}
    <input
      id={inputId}
      {type}
      class:no-prefix={!prefix}
      bind:value
      {placeholder}
      {disabled}
      {oninput}
    />
  </div>
  {#if help}<p class="field-help">{help}</p>{/if}
</div>
