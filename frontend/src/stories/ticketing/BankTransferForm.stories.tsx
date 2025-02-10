// stories/payment/BankTransferForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BankTransferForm } from '@/components/features/ticketing/BankTransferForm';

const meta = {
  title: 'Features/Ticketing/BankTransferForm',
  component: BankTransferForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    bank: {
      control: 'select',
      options: ['', 'shinhan', 'woori', 'kb'],
      description: '선택된 은행',
    },
    onBankChange: {
      description: '은행 선택 시 호출되는 함수',
    },
    receiptType: {
      control: 'radio',
      options: ['income', 'expense', 'none'],
      description: '현금영수증 발행 유형',
    },
    onReceiptTypeChange: {
      description: '현금영수증 유형 선택 시 호출되는 함수',
    },
  },
} satisfies Meta<typeof BankTransferForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bank: '',
    onBankChange: (bank) => console.log('Selected bank:', bank),
    receiptType: 'none',
    onReceiptTypeChange: (type) => console.log('Selected receipt type:', type),
  },
};

export const WithBankSelected: Story = {
  args: {
    bank: 'shinhan',
    onBankChange: (bank) => console.log('Selected bank:', bank),
    receiptType: 'none',
    onReceiptTypeChange: (type) => console.log('Selected receipt type:', type),
  },
};

export const WithIncomeReceipt: Story = {
  args: {
    bank: 'shinhan',
    onBankChange: (bank) => console.log('Selected bank:', bank),
    receiptType: 'income',
    onReceiptTypeChange: (type) => console.log('Selected receipt type:', type),
  },
};
