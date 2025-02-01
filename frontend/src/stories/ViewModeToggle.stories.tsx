// src/stories/ViewModeToggle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ViewModeToggle } from '@/components/features/sharing/ViewModeToggle';
import { useState } from 'react';

const meta = {
  title: 'Features/Sharing/ViewModeToggle',
  component: ViewModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ViewModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 - 지도 모드
export const MapMode: Story = {
  args: {
    viewMode: 'map',
    onModeChange: () => {},
  },
};

// 목록 모드
export const ListMode: Story = {
  args: {
    viewMode: 'list',
    onModeChange: () => {},
  },
};

// 인터랙티브 토글
export const Interactive = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  return (
    <div className="p-4">
      <h3 className="mb-2">현재 모드: {viewMode}</h3>
      <ViewModeToggle viewMode={viewMode} onModeChange={setViewMode} />
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story:
        '지도/목록 뷰를 전환할 수 있는 토글 버튼입니다. 클릭하여 모드를 변경해보세요.',
    },
  },
};
