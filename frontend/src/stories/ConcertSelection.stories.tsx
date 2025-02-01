// src/components/review/concert-select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ConcertSelect } from '@/components/features/sight/ConcertSelect';
import React from 'react';

const meta = {
  title: 'Features/sight/ConcertSelect',
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
    value: {
      description: '선택된 콘서트 ID',
      control: 'text',
    },
    onChange: {
      description: '콘서트 선택 시 호출되는 함수',
      action: 'changed',
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

// 선택된 값이 있는 상태
export const WithSelectedValue: Story = {
  args: {
    artist: 'BLACKPINK',
    value: '1', // WORLD TOUR [BORN PINK]
  },
};

// Controlled 컴포넌트 예시
export const Controlled: Story = {
  render: function Controlled() {
    const [selectedConcert, setSelectedConcert] = React.useState<string>('');

    return (
      <div className="space-y-4">
        <ConcertSelect
          artist="BLACKPINK"
          value={selectedConcert}
          onChange={setSelectedConcert}
        />
        <div className="rounded bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Selected Concert ID:</p>
          <p className="mt-1 font-mono">
            {selectedConcert || '(Not selected)'}
          </p>
        </div>
      </div>
    );
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
  render: () => {
    const [selections, setSelections] = React.useState<Record<string, string>>(
      {}
    );

    return (
      <div className="space-y-8">
        {['BLACKPINK', 'TWICE', 'NCT DREAM'].map((artist) => (
          <ConcertSelect
            key={artist}
            artist={artist}
            value={selections[artist]}
            onChange={(value) =>
              setSelections((prev) => ({ ...prev, [artist]: value }))
            }
          />
        ))}
        <div className="rounded bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Selected Concerts:</p>
          <pre className="mt-2 text-sm">
            {JSON.stringify(selections, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};
