import type { Meta, StoryObj } from '@storybook/react';
import { SharingDetailHeader } from '@/components/features/sharing/SharingDetailHeader';

const meta: Meta<typeof SharingDetailHeader> = {
  title: 'Features/Sharing/SharingDetailHeader',
  component: SharingDetailHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingDetailHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// 진행중인 나눔 헤더
export const OngoingSharing: Story = {
  args: {
    title: '베몬 포카 나눔합니다',
    nickname: '나눔러',
    status: 'ONGOING',
    startTime: '14:00',
    profileImage: '/images/profile.png',
  },
};

// 준비중인 나눔 헤더
export const UpcomingSharing: Story = {
  args: {
    title: '포카 나눔합니다',
    nickname: '나눔러',
    status: 'UPCOMING',
    startTime: '15:30',
    profileImage: '/images/profile.png',
  },
};

// 마감된 나눔 헤더
export const ClosedSharing: Story = {
  args: {
    title: '나눔 마감',
    nickname: '나눔러',
    status: 'CLOSED',
    startTime: '13:00',
    profileImage: '/images/profile.png',
  },
};