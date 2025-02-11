// stories/payment/PaymentMethodGroup.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PaymentMethodGroup } from '@/components/features/ticketing/PaymentMethodGroup';

const meta = {
  title: 'Features/Ticketing/PaymentMethodGroup',
  component: PaymentMethodGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedMethod: {
      control: 'select',
      options: ['credit', 'deposit', 'phone', 'kakao', 'kakaomini'],
      description: '선택된 결제 수단',
    },
    onSelect: {
      description: '결제 수단 선택 시 호출되는 함수',
    },
  },
} satisfies Meta<typeof PaymentMethodGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedMethod: 'credit',
    onSelect: (method) => console.log('Selected method:', method),
  },
};

export const WithDepositSelected: Story = {
  args: {
    selectedMethod: 'deposit',
    onSelect: (method) => console.log('Selected method:', method),
  },
};
