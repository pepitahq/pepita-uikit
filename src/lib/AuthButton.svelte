<script lang="ts">
  import GoogleMark from './google-mark.svelte';

  let {
    href,
    label = 'Continue with Google',
    disabled = false,
    provider = 'google'
  }: {
    href: string;
    label?: string;
    disabled?: boolean;
    provider?: 'google';
  } = $props();
</script>

<a class="cta cta-google" {href} aria-disabled={disabled}>
  <span class="g-badge" aria-hidden="true"><GoogleMark /></span>
  {label}
</a>
