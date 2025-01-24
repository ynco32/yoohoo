import type { Meta, StoryObj } from '@storybook/react';
import { SelectedArenaMenu } from './SelectedArenaMenu';

const meta = {
  title: 'Components/SelectedArenaMenu',
  component: SelectedArenaMenu,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectedArenaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    arenaId: 1,
  },
};
