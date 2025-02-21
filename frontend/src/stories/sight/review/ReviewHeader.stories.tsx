import type { Meta, StoryObj } from '@storybook/react';
import { ReviewHeader } from '@/components/features/sight/review/ReviewHeader';
import catImage from '@/public/images/cat.png';

const meta = {
  title: 'Features/Sight/Review/ReviewHeader',
  component: ReviewHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewHeader>;

export default meta;
type Story = StoryObj<typeof ReviewHeader>;

// 기본 스토리
export const Default: Story = {
  args: {
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '넥네임넥네임',
    profilePicture: '/images/profile.png',
  },
};

// 프로필 이미지가 로드되지 않는 경우
export const BrokenImage: Story = {
  args: {
    concertTitle: '2025 BABYMONSTER WORLD TOUR',
    nickName: '넥네임넥네임',
    profilePicture: 'broken-image-url',
  },
};
