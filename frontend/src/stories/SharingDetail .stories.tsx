import type { Meta, StoryObj } from '@storybook/react';
import { SharingDetail } from '@/components/features/sharing/SharingDetail';

const meta: Meta<typeof SharingDetail> = {
  title: 'Features/Sharing/SharingDetail',
  component: SharingDetail,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상세 페이지 - 진행중인 나눔
export const OngoingSharing: Story = {
  args: {
    id: 1,
  },
  decorators: [
    (Story) => (
      <div
        style={{ width: '430px', height: '800px', border: '1px solid #ccc' }}
      >
        <Story />
      </div>
    ),
  ],
};

// 준비중인 나눔
export const UpcomingSharing: Story = {
  args: {
    id: 2,
  },
  decorators: [
    (Story) => (
      <div
        style={{ width: '430px', height: '800px', border: '1px solid #ccc' }}
      >
        <Story />
      </div>
    ),
  ],
};

// 마감된 나눔
export const ClosedSharing: Story = {
  args: {
    id: 3,
  },
  decorators: [
    (Story) => (
      <div
        style={{ width: '430px', height: '800px', border: '1px solid #ccc' }}
      >
        <Story />
      </div>
    ),
  ],
};
