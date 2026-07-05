<script lang="ts">
  import GoogleMark from './google-mark.svelte';

  let {
    href,
    label = 'Continue with Google',
    disabled = false
  }: {
    href: string;
    label?: string;
    disabled?: boolean;
  } = $props();
</script>

<a
  class="cta cta-google"
  href={disabled ? undefined : href}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : undefined}
>
  <span class="g-badge" aria-hidden="true"><GoogleMark /></span>
  {label}
</a>
