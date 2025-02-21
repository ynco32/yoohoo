import type { Meta, StoryObj } from '@storybook/react';
import { SharingList } from '@/components/features/sharing/SharingList';
import { SharingPost, SharingStatus } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { fn } from '@storybook/test';

const meta: Meta<typeof SharingList> = {
  title: 'Features/Sharing/SharingList',
  component: SharingList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 더미 데이터
const MOCK_POSTS: SharingPost[] = [
  {
    sharingId: 1,
    title: '베몬 포카 나눔합니다',
    content: '나눔 내용입니다',
    nickname: '닉네임',
    status: 'ONGOING' as SharingStatus,
    startTime: '2025-02-12T14:00',
    photoUrl: '/images/card.png',
  },
  {
    sharingId: 2,
    title: '포카 나눔합니다22',
    content: '나눔 내용입니다',
    nickname: '닉네임',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T15:30',
    photoUrl: '/images/card.png',
  },
  {
    sharingId: 3,
    title: '떴다 팔찌 나눔',
    content: '나눔 내용입니다',
    nickname: '닉네임',
    status: 'CLOSED' as SharingStatus,
    startTime: '2025-02-12T13:00',
    photoUrl: '/images/card.png',
  },
].map(post => ({
  ...post,
  startTime: formatDateTime(post.startTime)
}));


// 기본 목록 (모든 상태 포함)
export const Default: Story = {
  args: {
    posts: MOCK_POSTS,
    onMount: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', maxHeight: '600px', overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};
