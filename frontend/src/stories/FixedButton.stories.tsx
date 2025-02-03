import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// [React] 컴포넌트 정의
const FixedButton = ({
  onClick,
  children,
  disabled = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-0 w-full rounded-none py-4 text-center ${
        disabled ? 'bg-gray-300 text-white' : 'bg-[#00C73C] text-white'
      }`}
    >
      {children}
    </button>
  );
};

// [Storybook] 메타데이터 설정
const meta: Meta<typeof FixedButton> = {
  title: 'UI/FixedButton',
  component: FixedButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '200px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 기본 스토리
export const Default: Story = {
  args: {
    children: '다음',
    disabled: false,
  },
};

// [Storybook] 비활성화 상태
export const DisabledButton: Story = {
  args: {
    children: '다음',
    disabled: true,
  },
};

// [Storybook] 긴 텍스트
export const LongTextButton: Story = {
  args: {
    children: '매우 긴 버튼 텍스트를 넣었을 때의 모습입니다',
    disabled: false,
  },
};

// [Storybook] 모든 상태
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="mb-2 text-lg font-bold">활성화 버튼</h3>
        <FixedButton>활성화 버튼</FixedButton>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold">비활성화 버튼</h3>
        <FixedButton disabled>비활성화 버튼</FixedButton>
      </div>
    </div>
  ),
};
