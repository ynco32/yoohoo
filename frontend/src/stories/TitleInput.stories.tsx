// components/TitleInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TitleInput } from '@/components/features/sharing/TitleInput';

const meta: Meta<typeof TitleInput> = {
  title: 'Features/Sharing/TitleInput',
  component: TitleInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TitleInput>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    onChange: (value) => console.log('Title changed:', value),
  },
};

export const WithValue: Story = {
  decorators: Default.decorators,
  args: {
    value: '포카 나눔합니다',
    onChange: (value) => console.log('Title changed:', value),
  },
};

export const WithError: Story = {
  decorators: Default.decorators,
  args: {
    value: '',
    onChange: (value) => console.log('Title changed:', value),
    error: '나눔할 물건을 입력해주세요',
  },
};

export const Typing: Story = {
  decorators: Default.decorators,
  args: {
    value: '포카',
    onChange: (value) => console.log('Title changed:', value),
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input) {
      input.focus();
      input.value = '포카 나눔';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};
