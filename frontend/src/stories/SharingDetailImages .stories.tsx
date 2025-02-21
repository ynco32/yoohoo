import type { Meta, StoryObj } from '@storybook/react';
import { SharingDetailImages } from '@/components/features/sharing/SharingDetailImages';

const meta: Meta<typeof SharingDetailImages> = {
  title: 'Features/Sharing/SharingDetailImages',
  component: SharingDetailImages,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingDetailImages>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 이미지
export const Default: Story = {
  args: {
    image: '/images/card.png',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 대체 이미지
export const FallbackImage: Story = {
  args: {
    image: '/images/card.png',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};