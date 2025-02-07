import type { Meta, StoryObj } from '@storybook/react';
import AreaPopup from '@/components/features/ticketing/AreaPopup';

// [Storybook] 메타데이터 설정
const meta = {
  title: 'features/Ticketing/AreaPopup',
  component: AreaPopup,
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        height: '500px', // 스토리 높이 지정
      },
    },
  },
  tags: ['autodocs'],

  // [TypeScript] ArgTypes 정의
  argTypes: {
    onClose: {
      description: '팝업 닫기 핸들러',
    },
    onMove: {
      description: '구역 이동 핸들러',
    },
    isOpen: {
      description: '팝업 표시 여부',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof AreaPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 기본 스토리 정의
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('닫기 클릭'),
    onMove: () => console.log('이동 클릭'),
  },
};

// [Storybook] 팝업 닫힘 상태 스토리
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('닫기 클릭'),
    onMove: () => console.log('이동 클릭'),
  },
};

// [Storybook] 대화형 동작 스토리
export const Interactive: Story = {
  args: {
    isOpen: true,
    onClose: () => alert('팝업이 닫힙니다'),
    onMove: () => alert('선택한 구역으로 이동합니다'),
  },
};
