import type { Meta, StoryObj } from '@storybook/react';
import { TextButton } from '@/components/ui/TextButton';

const meta: Meta<typeof TextButton> = {
  title: 'ui/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Primary: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    children: '확인',
    variant: 'primary',
  },
};

export const Outline: Story = {
  decorators: Primary.decorators,
  args: {
    children: '취소',
    variant: 'outline',
  },
};

export const Loading: Story = {
  decorators: Primary.decorators,
  args: {
    children: '저장하기',
    isLoading: true,
    loadingText: '저장 중...',
  },
};

export const Disabled: Story = {
  decorators: Primary.decorators,
  args: {
    children: '제출하기',
    disabled: true,
  },
};

export const CustomStyles: Story = {
  decorators: Primary.decorators,
  args: {
    children: '확인',
    className: 'bg-blue-500 hover:bg-blue-600',
  },
};

export const OutlineDisabled: Story = {
  decorators: Primary.decorators,
  args: {
    children: '취소',
    variant: 'outline',
    disabled: true,
  },
};
