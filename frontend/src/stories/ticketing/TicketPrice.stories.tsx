// stories/TicketPrice.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TicketPrice } from '@/components/features/ticketing/TicketPrice';

const meta = {
  title: 'Features/Ticketing/TicketPrice',
  component: TicketPrice,
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
} satisfies Meta<typeof TicketPrice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quantity: 1,
    setQuantity: () => {},
  },
};
