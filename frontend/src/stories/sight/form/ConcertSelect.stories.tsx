// src/components/review/concert-select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ConcertSelect } from '@/components/features/sight/form/ConcertSelect';

const meta = {
  title: 'Features/Sight/Form/ConcertSelect',
  component: ConcertSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      description: '특정 가수의 콘서트만 필터링하여 표시',
      control: 'text',
    },
    className: {
      description: '추가 스타일링을 위한 클래스',
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConcertSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태
export const Default: Story = {
  args: {},
};

// BLACKPINK 콘서트만 표시
export const BlackpinkConcerts: Story = {
  args: {
    artist: 'BLACKPINK',
  },
};

// TWICE 콘서트만 표시
export const TwiceConcerts: Story = {
  args: {
    artist: 'TWICE',
  },
};

// NCT DREAM 콘서트만 표시
export const NctDreamConcerts: Story = {
  args: {
    artist: 'NCT DREAM',
  },
};

// 커스텀 스타일 적용
export const WithCustomStyle: Story = {
  args: {
    className: 'p-4 bg-gray-100 rounded-lg',
  },
};

// 여러 ConcertSelect를 함께 표시
export const MultipleSelects: Story = {
  render: () => (
    <div className="space-y-8">
      <ConcertSelect artist="BLACKPINK" />
      <ConcertSelect artist="TWICE" />
      <ConcertSelect artist="NCT DREAM" />
    </div>
  ),
};
