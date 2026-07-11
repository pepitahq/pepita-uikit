// NOTE: the color theme (theme.css / the per-family CSS) is deliberately NOT
// imported here. Bundling it would force the default palette into every consumer
// and load it after any runtime-swapped <link>, breaking theme switching. The
// consumer loads the color layer itself: `@pepitahq/uikit/theme.css` (static
// default) or a swappable `/themes/{id}.css` link. tokens.css (typography) +
// primitives.css (classes) are theme-neutral, so they're fine to bundle.
import './styles/tokens.css';
import './styles/primitives.css';

// Buttons & inputs
export { default as Button } from './Button.svelte';
export { default as AuthButton } from './AuthButton.svelte';
export { default as HeaderButton } from './HeaderButton.svelte';
export { default as IconButton } from './IconButton.svelte';
export { default as TogglePill } from './TogglePill.svelte';
export { default as TextInput } from './TextInput.svelte';
export { default as SplitActionButton } from './SplitActionButton.svelte';

// Tabs
export { default as TabBar } from './TabBar.svelte';
export { default as Tab } from './Tab.svelte';
export { default as UnderlineTabBar } from './UnderlineTabBar.svelte';
export type { TabItem } from './TabBar.svelte';
export type { UnderlineTab } from './UnderlineTabBar.svelte';

// Input frame
export { default as InputBracket } from './InputBracket.svelte';

// Overlays & dialogs
export { default as Popover } from './Popover.svelte';
export type { Placement, Point } from './Popover.svelte';
export { default as Menu } from './Menu.svelte';
export type { MenuItem, MenuEntry } from './Menu.svelte';
export { default as ContextMenu } from './ContextMenu.svelte';
export { default as Modal } from './Modal.svelte';
export { default as Dialog } from './Dialog.svelte';
export { dialog } from './dialog-store.svelte';
export type { DialogRequest } from './dialog-store.svelte';
export { default as Toaster } from './Toaster.svelte';
export { toast } from './toast-store.svelte';
export type { ToastVariant, ToastItem } from './toast-store.svelte';

// Feedback & controls
export { default as SegmentedControl } from './SegmentedControl.svelte';
export type { SegOption } from './SegmentedControl.svelte';
export { default as Select } from './Select.svelte';
export type { SelectOption } from './Select.svelte';
export { default as Badge } from './Badge.svelte';
export type { BadgeVariant } from './Badge.svelte';
export { default as Tooltip } from './Tooltip.svelte';
export { default as IconTip } from './IconTip.svelte';
export { default as ChartTooltip } from './ChartTooltip.svelte';
