import type { Meta, StoryObj } from '@storybook/react';
import AreaPopup from '@/components/features/ticketing/AreaPopup';
// [Storybook] 메타데이터 설정
const meta = {
  title: 'Features/Ticketing/AreaPopup',
  component: AreaPopup,
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        height: '500px',
      },
    },
  },
  tags: ['autodocs'],

  // [TypeScript] ArgTypes 정의
  argTypes: {
    area: {
      description: '선택된 구역 정보',
      control: 'text',
      defaultValue: '2층 E 구역',
    },
    onClose: {
      description: '팝업 닫기 핸들러',
      action: 'clicked',
    },
    onMove: {
      description: '이동 버튼 핸들러',
      action: 'clicked',
    },
  },
} satisfies Meta<typeof AreaPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 기본 스토리 정의
export const Default: Story = {
  args: {
    area: '2층 E 구역',
  },
};

// [Storybook] 다른 구역 예시
export const DifferentArea: Story = {
  args: {
    area: '1층 A 구역',
  },
};

// [Storybook] 모바일 뷰 스토리
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    area: '2층 E 구역',
  },
};
