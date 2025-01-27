import type { Meta, StoryObj } from '@storybook/react';
import { SharingList } from './SharingList';

const meta: Meta<typeof SharingList> = {
  title: 'Features/Sharing/SharingList',
  component: SharingList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SharingList>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '430px' }}>
        <Story />
      </div>
    ),
  ],
};
