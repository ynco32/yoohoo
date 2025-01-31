import type { Meta, StoryObj } from '@storybook/react';
import { ConcertList } from '../components/features/sharing/ConcertList';

const meta: Meta<typeof ConcertList> = {
  title: 'Features/Sharing/ConcertList',
  component: ConcertList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConcertList>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '430px' }}>
        <Story />
      </div>
    ),
  ],
  args: {},
};
