import type { Meta, StoryObj } from '@storybook/react';
import { SharingCard } from './SharingCard';
import { SharingStatus } from '@/types/sharing';

const meta: Meta<typeof SharingCard> = {
  title: 'Features/Sharing/SharingCard',
  component: SharingCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[430px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SharingCard>;

export const Ongoing: Story = {
  args: {
    title: '베몬 포카 나눔합니다',
    nickname: '닉네임',
    status: 'ONGOING' as SharingStatus,
    start_time: '13:30',
    image: '/images/card.png',
  },
};

export const Upcoming: Story = {
  args: {
    title: '베몬 포카 나눔합니다',
    nickname: '닉네임',
    status: 'UPCOMING' as SharingStatus,
    start_time: '14:00',
    image: '/images/card.png',
  },
};

export const Closed: Story = {
  args: {
    title: '베몬 포카 나눔합니다',
    nickname: '닉네임',
    status: 'CLOSED' as SharingStatus,
    start_time: '13:00',
    image: '/images/card.png',
  },
};