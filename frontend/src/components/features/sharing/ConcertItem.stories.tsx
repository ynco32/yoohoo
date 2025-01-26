import type { Meta, StoryObj } from '@storybook/react';
import { ConcertItem } from './ConcertItem';

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
    title: '2025 TREASURE FAN CONCERT',
    venue: 'Grand Peace Palace, Kyung Hee Univ.',
    date: '2025.01.25',
    image: '/images/poster.png',
  },
};
