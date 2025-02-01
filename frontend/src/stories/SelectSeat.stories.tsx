import type { Meta, StoryObj } from '@storybook/react';
import { SeatSelect } from '@/components/features/sight/SeatSelect';

const meta = {
  title: 'Features/sight/SeatSelect',
  component: SeatSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeatSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    value: {
      section: '',
      row: '',
      number: '',
    },
  },
};

// 값이 입력된 상태
export const WithValues: Story = {
  args: {
    value: {
      section: '1',
      row: '3',
      number: '15',
    },
  },
};

// 콜백 함수를 보여주는 스토리
export const WithCallback: Story = {
  args: {
    value: {
      section: '',
      row: '',
      number: '',
    },
    onChange: (value: any) => {
      console.log('Seat info changed:', value);
    },
  },
};

// 커스텀 스타일이 적용된 스토리
export const WithCustomStyle: Story = {
  args: {
    value: {
      section: '2',
      row: '5',
      number: '7',
    },
    className: 'bg-gray-50 p-4 rounded-lg',
  },
};

// Playground 스토리 - 모든 props를 조작할 수 있는 버전
export const Playground: Story = {
  args: {
    value: {
      section: '',
      row: '',
      number: '',
    },
    className: '',
    onChange: (value: any) => {
      console.log('Seat info changed:', value);
    },
  },
};
