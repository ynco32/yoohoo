import type { Meta, StoryObj } from '@storybook/react';
import TextBox from '@/components/ui/TextBox';

const meta = {
  title: 'ui/TextBox',
  component: TextBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 컨테이너 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    headText: {
      description: '제목 영역에 표시될 컨텐츠',
      control: 'text',
    },
    bodyText: {
      description: '본문 영역에 표시될 컨텐츠',
      control: 'text',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headText: '제목 영역입니다',
    bodyText: '본문 영역입니다',
  },
};

export const WithHtmlTags: Story = {
  args: {
    headText: <strong>강조된 제목</strong>,
    bodyText: (
      <>
        <strong>강조된 텍스트</strong>와 <em>기울임꼴 텍스트</em>가 포함된
        예시입니다.
      </>
    ),
  },
};
