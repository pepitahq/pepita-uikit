<script module lang="ts">
  export type SelectOption = {
    value: string;
    label: string;
    /** Secondary text shown dimmer below the label (e.g. "Sonnet 5 · recommended"). */
    description?: string;
    disabled?: boolean;
  };
</script>

<script lang="ts">
  import { CaretDown, Check } from 'phosphor-svelte';
  import Popover, { type Placement } from './Popover.svelte';

  let {
    options,
    value = $bindable(),
    onChange,
    disabled = false,
    placeholder = 'Select…',
    size = 'md',
    variant = 'field',
    placement = 'bottom-start',
    fullWidth = false,
    ariaLabel
  }: {
    options: SelectOption[];
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    /** 'sm' = 11px compact; 'md' = 13px default. */
    size?: 'sm' | 'md';
    /** 'field' = a bordered form control (default). 'pill' = a fully-rounded
     *  chip that hugs its value — for toolbars and composers, where a boxy form
     *  field reads as heavy furniture rather than an inline choice. */
    variant?: 'field' | 'pill';
    /** Where the list opens. Use a `top-*` placement for a trigger that sits at
     *  the bottom of its container (a composer row), so the list rises into the
     *  space that exists instead of being clamped against the edge. */
    placement?: Placement;
    /** Stretch the trigger to fill its container. */
    fullWidth?: boolean;
    ariaLabel?: string;
  } = $props();

  const uid = $props.id();

  let open = $state(false);
  let triggerEl: HTMLButtonElement | undefined = $state();
  let highlight = $state(-1);
  let panelWidth = $state(0);

  // Type-ahead buffer.
  let typed = '';
  let typedTimer: ReturnType<typeof setTimeout> | undefined;

  const selected = $derived(options.find((o) => o.value === value));

  function firstEnabled(): number {
    return options.findIndex((o) => !o.disabled);
  }
  function selectedIndex(): number {
    return options.findIndex((o) => o.value === value);
  }

  function openMenu() {
    if (disabled) return;
    panelWidth = triggerEl?.offsetWidth ?? 0;
    const s = selectedIndex();
    highlight = s >= 0 && !options[s]?.disabled ? s : firstEnabled();
    open = true;
  }
  function closeMenu(refocus = true) {
    open = false;
    if (refocus) triggerEl?.focus();
  }

  function commit(i: number) {
    const o = options[i];
    if (!o || o.disabled) return;
    value = o.value;
    onChange?.(o.value);
    closeMenu();
  }

  function move(delta: number) {
    const n = options.length;
    if (!n) return;
    let i = highlight;
    for (let step = 0; step < n; step++) {
      i = (i + delta + n) % n;
      if (!options[i]?.disabled) {
        highlight = i;
        return;
      }
    }
  }
  function moveEdge(toEnd: boolean) {
    const order = toEnd ? [...options.keys()].reverse() : [...options.keys()];
    const i = order.find((idx) => !options[idx]?.disabled);
    if (i !== undefined) highlight = i;
  }

  function typeahead(ch: string) {
    clearTimeout(typedTimer);
    typed += ch.toLowerCase();
    typedTimer = setTimeout(() => (typed = ''), 600);
    const match = options.findIndex(
      (o) => !o.disabled && o.label.toLowerCase().startsWith(typed)
    );
    if (match < 0) return;
    if (open) highlight = match;
    else commit(match);
  }

  function onTriggerKeydown(e: KeyboardEvent) {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        open ? move(1) : openMenu();
        break;
      case 'ArrowUp':
        e.preventDefault();
        open ? move(-1) : openMenu();
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          moveEdge(false);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          moveEdge(true);
        }
        break;
      case 'Enter':
        e.preventDefault();
        open ? commit(highlight) : openMenu();
        break;
      case ' ':
        // Space opens when closed; when open, let type-ahead handle it below only
        // if it's a real space in a label — otherwise open/commit.
        e.preventDefault();
        open ? commit(highlight) : openMenu();
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          closeMenu();
        }
        break;
      case 'Tab':
        if (open) closeMenu(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          typeahead(e.key);
        }
    }
  }
</script>

<button
  bind:this={triggerEl}
  type="button"
  class="ps-select-trigger"
  class:sm={size === 'sm'}
  class:pill={variant === 'pill'}
  class:full={fullWidth}
  class:open
  {disabled}
  role="combobox"
  aria-haspopup="listbox"
  aria-expanded={open}
  aria-controls="{uid}-listbox"
  aria-activedescendant={open && highlight >= 0 ? `${uid}-opt-${highlight}` : undefined}
  aria-label={ariaLabel}
  onclick={() => (open ? closeMenu() : openMenu())}
  onkeydown={onTriggerKeydown}
>
  <span class="ps-select-value" class:placeholder={!selected}>
    {selected?.label ?? placeholder}
  </span>
  <span class="ps-select-caret"><CaretDown size={size === 'sm' ? 11 : 13} weight="bold" /></span>
</button>

<Popover bind:open anchorEl={triggerEl} {placement} offset={4}>
  {#snippet content()}
    <ul
      id="{uid}-listbox"
      class="ps-select-list"
      class:sm={size === 'sm'}
      role="listbox"
      style:min-width="{panelWidth}px"
      aria-label={ariaLabel}
    >
      {#each options as o, i (o.value)}
        <!-- Combobox/listbox pattern: keyboard is handled on the trigger via
             aria-activedescendant, so options are mouse click targets only. -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          id="{uid}-opt-{i}"
          class="ps-select-opt"
          class:hl={i === highlight}
          class:selected={o.value === value}
          class:disabled={o.disabled}
          role="option"
          aria-selected={o.value === value}
          aria-disabled={o.disabled}
          onclick={() => commit(i)}
          onmousemove={() => {
            if (!o.disabled) highlight = i;
          }}
        >
          <span class="ps-select-check">
            {#if o.value === value}<Check size={size === 'sm' ? 11 : 13} weight="bold" />{/if}
          </span>
          <span class="ps-select-text">
            <span class="ps-select-label">{o.label}</span>
            {#if o.description}<span class="ps-select-desc">{o.description}</span>{/if}
          </span>
        </li>
      {/each}
    </ul>
  {/snippet}
</Popover>

<style>
  /* ── Trigger ─────────────────────────────────────────────── */
  .ps-select-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 0.42rem 0.55rem 0.42rem 0.7rem;
    cursor: pointer;
    text-align: left;
    transition: border-color 140ms, box-shadow 140ms;
    max-width: 100%;
  }
  .ps-select-trigger.full {
    display: flex;
    width: 100%;
  }
  .ps-select-trigger.sm {
    font-size: 11px;
    padding: 0.18rem 0.3rem 0.18rem 0.45rem;
    border-radius: 4px;
    gap: 0.3rem;
  }
  /* Pill: the same control, shaped as an inline chip rather than a form field —
     for toolbars and composers, where a boxy form field reads as heavy
     furniture rather than an inline choice.
     Deliberately identical to the app's pill idiom (the editor header's balance
     pill) but one size up: the family, --ink text, --surface fill and --rule
     hairline already come from the base rule above; these three are the only
     places the form-field default diverges from it. Keeps the base's 13px,
     which IS the step up from the balance pill's 11px. */
  .ps-select-trigger.pill {
    border-radius: 999px;
    font-weight: 400;
    line-height: 1.5;
    /* 13px × 1.5 + this padding + the hairline ≈ 30px — the same height as a
       composer send button, so the row's controls sit on one baseline. */
    padding: 0.25rem 0.45rem 0.25rem 0.75rem;
  }
  .ps-select-trigger:hover:not(:disabled) {
    border-color: color-mix(in oklch, var(--ink) 25%, var(--rule));
  }
  .ps-select-trigger:focus-visible,
  .ps-select-trigger.open {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 16%, transparent);
  }
  .ps-select-trigger:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .ps-select-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .ps-select-value.placeholder {
    color: var(--ink-faint);
    font-weight: 400;
  }
  .ps-select-caret {
    display: inline-flex;
    flex: 0 0 auto;
    color: var(--ink-faint);
    transition: transform 140ms, color 140ms;
  }
  .ps-select-trigger.open .ps-select-caret {
    transform: rotate(180deg);
    color: var(--accent);
  }

  /* ── List panel ──────────────────────────────────────────── */
  .ps-select-list {
    list-style: none;
    margin: 0;
    padding: 0.3rem;
    background: var(--surface-raised);
    border: 1px solid var(--rule);
    border-radius: 6px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    font-family: var(--font);
    max-height: 320px;
    overflow-y: auto;
  }
  .ps-select-opt {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border-radius: 4px;
    color: var(--ink);
    cursor: pointer;
    transition: color 100ms, background 100ms;
  }
  .ps-select-list.sm .ps-select-opt {
    padding: 0.3rem 0.4rem;
    gap: 0.35rem;
  }
  .ps-select-opt.hl:not(.disabled) {
    background: color-mix(in oklch, var(--accent) 12%, transparent);
    color: var(--accent);
  }
  .ps-select-opt.selected {
    color: var(--accent);
  }
  .ps-select-opt.disabled {
    color: var(--ink-faint);
    cursor: not-allowed;
  }
  .ps-select-check {
    display: inline-flex;
    width: 14px;
    flex: 0 0 auto;
    justify-content: center;
    color: var(--accent);
    padding-top: 1px;
  }
  .ps-select-list.sm .ps-select-check {
    width: 12px;
  }
  .ps-select-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .ps-select-label {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.25;
  }
  .ps-select-list.sm .ps-select-label {
    font-size: 11px;
  }
  .ps-select-desc {
    font-size: 11px;
    font-weight: 400;
    line-height: 1.25;
    color: var(--ink-soft);
  }
  .ps-select-opt.hl:not(.disabled) .ps-select-desc {
    color: color-mix(in oklch, var(--accent) 70%, var(--ink-soft));
  }
  .ps-select-list.sm .ps-select-desc {
    font-size: 10px;
  }
</style>
