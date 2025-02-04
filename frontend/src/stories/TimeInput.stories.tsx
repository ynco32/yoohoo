// components/TimeInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput } from '@/components/features/sharing/TimeInput';

const meta: Meta<typeof TimeInput> = {
  title: 'Features/Sharing/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TimeInput>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: '09:00',
    onChange: (value) => console.log('Time changed:', value),
  },
};

export const AfternoonTime: Story = {
  decorators: Default.decorators,
  args: {
    value: '14:30',
    onChange: (value) => console.log('Time changed:', value),
  },
};

export const WithError: Story = {
  decorators: Default.decorators,
  args: {
    value: '',
    onChange: (value) => console.log('Time changed:', value),
    error: '시작 시간을 선택해주세요',
  },
};
