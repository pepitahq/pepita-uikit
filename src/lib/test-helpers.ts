import { createRawSnippet } from 'svelte';

/** A snippet that renders `text` inside a <span>, for testing snippet props. */
export function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<span>${text}</span>`
  }));
}
