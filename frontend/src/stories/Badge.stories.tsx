import type { Meta, StoryObj } from '@storybook/react';
import Badge from '@/components/ui/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['green', 'pink', 'grey'],
      description: '뱃지 스타일 (green: 초록색, pink: 분홍색, grey: 회색)',
    },
    children: {
      control: 'text',
      description: '뱃지 내부 콘텐츠',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'grey',
    children: '기본',
  },
};

export const StatusBadges: Story = {
  args: {
    type: 'green',
    children: '상태',
  },
  render: () => (
    <div className="flex space-x-2">
      <Badge type="green">신청가능</Badge>
      <Badge type="pink">마감</Badge>
      <Badge type="grey">대기중</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    type: 'green',
    children: '아이콘',
  },
  render: () => (
    <div className="flex space-x-2">
      <Badge type="green">
        <span className="flex items-center gap-1">✓ 완료</span>
      </Badge>
      <Badge type="pink">
        <span className="flex items-center gap-1">⊗ 실패</span>
      </Badge>
      <Badge type="grey">
        <span className="flex items-center gap-1">⋯ 진행중</span>
      </Badge>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    type: 'grey',
    children: '이것은 매우 긴 텍스트가 있는 뱃지입니다',
  },
};
