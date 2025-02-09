// stories/TicketInfo.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TicketInfo } from '@/components/features/ticketing/TicketInfo';

const meta = {
  title: 'Features/Ticketing/TicketInfo',
  component: TicketInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TicketInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
