// ToggleButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from '@/components/ui/ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Features/sight/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: {
    label: '버튼',
  },
};

export const Selected: Story = {
  args: {
    label: '버튼',
    selected: true,
  },
};

export const LongText: Story = {
  args: {
    label: '매우 긴 버튼 텍스트입니다',
  },
};
