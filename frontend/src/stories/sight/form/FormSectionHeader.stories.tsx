// src/components/ui/form-section-header.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

const meta = {
  title: 'Features/sight/Form/FormSectionHeader',
  component: FormSectionHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: '섹션의 제목',
      control: 'text',
    },
    description: {
      description: '섹션에 대한 부가 설명 (선택사항)',
      control: 'text',
    },
    className: {
      description: '추가 스타일링을 위한 클래스',
      control: 'text',
    },
  },
} satisfies Meta<typeof FormSectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    title: '시야',
  },
};

// 설명이 있는 스토리
export const WithDescription: Story = {
  args: {
    title: '시야',
    description: '시야를 확인할 수 있는 사진을 업로드해주세요',
  },
};

// 긴 텍스트 스토리
export const LongText: Story = {
  args: {
    title:
      '매우 긴 제목이 들어가는 경우 어떻게 보여지는지 테스트하기 위한 스토리입니다',
    description:
      '이것은 매우 긴 설명이 들어가는 경우를 테스트하기 위한 설명입니다. 설명이 길어지는 경우 줄바꿈이 제대로 동작하는지 확인할 수 있습니다.',
  },
};

// 추가 스타일이 적용된 스토리
export const WithCustomStyle: Story = {
  args: {
    title: '커스텀 스타일',
    description: '추가 스타일이 적용된 예시입니다',
    className: 'bg-gray-100 p-4 rounded-lg',
  },
};
