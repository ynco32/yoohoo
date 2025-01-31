// components/common/ReviewButton/ReviewButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { WriteButton } from './WriteButton';

const meta = {
  title: 'Components/WriteButton',
  component: WriteButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    path: '/sight/write',
  },
};

// 다양한 경로에서의 사용 예시
export const CustomPath: Story = {
  args: {
    path: '/sight/123/write',
  },
};

// 컨텍스트 내 예시
export const InContext: Story = {
  decorators: [
    (Story) => (
      <div className="relative h-[500px] w-[300px] bg-gray-100">
        <div className="p-4">
          <h1 className="text-xl font-bold">Concert View</h1>
          <p className="mt-2 text-gray-600">Some content here...</p>
        </div>
        <Story />
      </div>
    ),
  ],
  args: {
    path: '/sight/write',
  },
};
