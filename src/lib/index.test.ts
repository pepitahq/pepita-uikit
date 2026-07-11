import { test, expect } from 'vitest';
import * as uikit from '$lib/index';

test('barrel exports every public component', () => {
  for (const name of [
    'Button', 'AuthButton', 'HeaderButton', 'TogglePill',
    'TextInput', 'SplitActionButton', 'TabBar', 'Tab', 'InputBracket',
    'UnderlineTabBar', 'Popover', 'Menu', 'ContextMenu', 'Modal', 'Dialog', 'dialog',
    'Toaster', 'toast',
    'SegmentedControl', 'Select', 'Badge', 'Tooltip', 'ChartTooltip'
  ]) {
    expect(uikit[name as keyof typeof uikit], name).toBeTruthy();
  }
});
