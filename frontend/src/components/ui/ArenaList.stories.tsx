import type { Meta, StoryObj } from '@storybook/react';
import ArenaList from './ArenaList';

const meta = {
  title: 'Components/ArenaList',
  component: ArenaList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArenaList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
