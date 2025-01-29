import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@/components/ui/IconButton';
import {
  MusicalNoteIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: '버튼 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    showRightArrow: {
      control: 'boolean',
      description: '오른쪽 화살표 표시 여부',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 아이콘이 있는 버전을 Default로 설정
export const Default: Story = {
  args: {
    leftIcon: <MusicalNoteIcon className="h-4 w-4" />,
    children: '멜론 티켓',
    variant: 'primary',
    size: 'md',
  },
};

// [Storybook] 아이콘이 없는 기본 버튼
export const NoIcon: Story = {
  args: {
    children: '기본 버튼',
    variant: 'primary',
    size: 'md',
    showRightArrow: true,
  },
};

export const Variants: Story = {
  args: {
    children: 'Variants Button',
    variant: 'primary',
    size: 'md',
    showRightArrow: true,
  },
  render: (args) => (
    <div className="flex gap-4">
      <IconButton
        variant="primary"
        leftIcon={<HeartIcon className="h-4 w-4" />}
      >
        좋아요
      </IconButton>
      <IconButton
        variant="secondary"
        leftIcon={<ShareIcon className="h-4 w-4" />}
      >
        공유하기
      </IconButton>
      <IconButton variant="ghost">더보기</IconButton>
    </div>
  ),
};
