import type { Meta, StoryObj } from '@storybook/react';
import { ConcertItem } from '../components/features/sharing/ConcertItem';

const meta: Meta<typeof ConcertItem> = {
  title: 'Features/Sharing/ConcertItem',
  component: ConcertItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConcertItem>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '430px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    concertId: 1,
    concertName: '2025 TREASURE FAN CONCERT',
    artist: 'TREASURE',
    startTime: '2025.01.25',
  },
};
