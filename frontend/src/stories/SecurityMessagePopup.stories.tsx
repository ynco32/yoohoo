import type { Meta, StoryObj } from '@storybook/react';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';

// [Storybook] 메타데이터 설정
const meta = {
  title: 'features/ticketing/SecurityMessagePopup',
  component: SecurityMessagePopup,
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
    isOpen: {
      description: '팝업 표시 여부',
      control: 'boolean',
    },
    onPostpone: {
      description: '나중에 입력하기 버튼 클릭 핸들러',
      control: { type: 'object' },
    },
    onSuccess: {
      description: '인증 성공 시 호출되는 핸들러',
      control: { type: 'object' },
    },
  },
} satisfies Meta<typeof SecurityMessagePopup>;

export default meta;
type Story = StoryObj<typeof meta>;

// [Storybook] 기본 스토리 정의
export const Default: Story = {
  args: {
    isOpen: true,
    onPostpone: () => console.log('나중에 입력하기 클릭'),
    onSuccess: () => console.log('인증 성공'),
  },
};

// [Storybook] 닫힌 상태 스토리
export const Closed: Story = {
  args: {
    isOpen: false,
    onPostpone: () => console.log('나중에 입력하기 클릭'),
    onSuccess: () => console.log('인증 성공'),
  },
};

// [Storybook] 에러 상태를 보여주는 스토리
export const WithError: Story = {
  args: {
    isOpen: true,
    onPostpone: () => console.log('나중에 입력하기 클릭'),
    onSuccess: () => console.log('인증 성공'),
  },
  render: (
    args: typeof meta.component extends React.ComponentType<infer P> ? P : never
  ) => {
    return <SecurityMessagePopup {...args} />;
  },
};
