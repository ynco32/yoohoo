import type { Meta, StoryObj } from '@storybook/react';
import TicketingBottomGreenButton from '@/components/ui/TicketingBottomGreenButton';

// [Storybook] 메타데이터 설정
const meta = {
  title: 'ui/TicketingBottomGreenButton', // 스토리북 사이드바에서의 경로
  component: TicketingBottomGreenButton,
  parameters: {
    layout: 'centered', // 컴포넌트를 중앙에 배치
  },
  tags: ['autodocs'], // 자동 문서 생성 활성화

  // [TypeScript] ArgTypes 정의
  argTypes: {
    children: {
      description: '버튼 내부 텍스트/컨텐츠',
      control: 'text',
    },
    type: {
      description: '버튼 상태 (활성화/비활성화)',
      control: 'select',
      options: ['active', 'nonActive'],
    },
  },
} satisfies Meta<typeof TicketingBottomGreenButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 활성화 상태 스토리 정의
export const Active: Story = {
  args: {
    children: '예매하기',
    type: 'active',
  },
};

// [Storybook] 비활성화 상태 스토리 정의
export const NonActive: Story = {
  args: {
    children: '예매하기',
    type: 'nonActive',
  },
};

// [Storybook] 다양한 상태를 한번에 보여주는 스토리
export const AllTypes: Story = {
  args: {
    children: '예매하기',
    type: 'active',
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <TicketingBottomGreenButton type="active">
        활성화 버튼
      </TicketingBottomGreenButton>
      <TicketingBottomGreenButton type="nonActive">
        비활성화 버튼
      </TicketingBottomGreenButton>
    </div>
  ),
};
