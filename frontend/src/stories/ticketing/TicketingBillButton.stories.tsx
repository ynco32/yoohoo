import type { Meta, StoryObj } from '@storybook/react';
import { TicketingBillButton } from '@/components/ui/TicketingBillButton';

const meta = {
  title: 'ui/TicketingBillButton',
  component: TicketingBillButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '버튼 텍스트',
      control: 'text',
    },
    className: {
      description: '추가 스타일 클래스',
      control: 'text',
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      action: 'clicked',
    },
  },
} satisfies Meta<typeof TicketingBillButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '다음',
    onClick: () => console.log('Button clicked'),
  },
};

export const WithCustomClass: Story = {
  args: {
    children: '다음',
    className: 'opacity-50',
    onClick: () => console.log('Button clicked'),
  },
};
