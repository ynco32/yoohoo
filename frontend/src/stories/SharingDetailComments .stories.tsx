import type { Meta, StoryObj } from '@storybook/react';
import { SharingDetailComments } from '@/components/features/sharing/SharingDetailComments';
import { MOCK_COMMENTS } from '@/types/sharing';

const meta: Meta<typeof SharingDetailComments> = {
  title: 'Features/Sharing/SharingDetailComments',
  component: SharingDetailComments,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingDetailComments>;

export default meta;
type Story = StoryObj<typeof meta>;

// 댓글 있는 경우
export const WithComments: Story = {
  args: {
    comments: MOCK_COMMENTS,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 댓글 없는 경우
export const NoComments: Story = {
  args: {
    comments: [],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};