import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Features/sight/ToggleButtonGroup',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

export const Default: Story = {
  args: {
    options: ['옵션 1', '옵션 2', '옵션 3'],
  },
};

export const Selected: Story = {
  args: {
    options: ['옵션 1', '옵션 2', '옵션 3'],
    value: '옵션 2',
  },
};

export const LongOptioList: Story = {
  args: {
    options: ['매우 긴 옵션 1', '긴 옵션 2', '일반 옵션', '짧은 옵션'],
  },
};
