// stories/PriceDetail.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PriceDetail } from '@/components/features/ticketing/PriceDetail';

const meta = {
  title: 'Features/Ticketing/PriceDetail',
  component: PriceDetail,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    quantity: {
      description: '선택된 티켓 수량',
      control: { type: 'number', min: 1, max: 4 },
    },
  },
} satisfies Meta<typeof PriceDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quantity: 1,
  },
};
