import type { Meta, StoryObj } from '@storybook/react';
import SeatType from '@/components/ui/SeatType';

// [Storybook] 메타데이터 설정
const meta = {
  title: 'ui/SeatType', // 스토리북 사이드바에서의 경로
  component: SeatType,
  parameters: {
    layout: 'centered', // 컴포넌트를 중앙에 배치
  },
  tags: ['autodocs'], // 자동 문서 생성 활성화

  // [TypeScript] ArgTypes 정의
  argTypes: {
    seat_name: {
      description: '좌석 유형 이름',
      control: 'text',
    },
    seat_color: {
      description: '좌석 색상 유형',
      control: 'select',
      options: ['VIP', 'normal'],
    },
  },
} satisfies Meta<typeof SeatType>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 기본 스토리 정의
export const VIP: Story = {
  args: {
    seat_name: 'VIP석',
    seat_color: 'VIP',
  },
};

// [Storybook] VIP석 스토리 정의
export const normal: Story = {
  args: {
    seat_name: '일반석',
    seat_color: 'normal',
  },
};

// [Storybook] 다양한 상태를 한번에 보여주는 스토리
export const AllTypes: Story = {
  args: {
    seat_name: '일반석',
    seat_color: 'normal',
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <SeatType seat_name="VIP석" seat_color="VIP" />
      <SeatType seat_name="일반석" seat_color="normal" />
    </div>
  ),
};
