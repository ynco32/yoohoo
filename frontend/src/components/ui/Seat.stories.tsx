import type { Meta, StoryObj } from '@storybook/react';
import { Seat } from './Seat';

const meta: Meta<typeof Seat> = {
  title: 'Components/Seat',
  component: Seat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <svg viewBox="0 0 800 450" width="800" height="450">
        <Story />
      </svg>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Seat>;

export const Default: Story = {
  args: {
    arenaId: 1,
    row: 10,
    col: 10,
    isScraped: false,
    isScrapMode: false,
    onClick: () => console.log('Seat clicked'),
  },
};

export const Scraped: Story = {
  args: {
    ...Default.args,
    isScraped: true,
    isScrapMode: true,
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const WithoutClickHandler: Story = {
  args: {
    ...Default.args,
    onClick: undefined,
  },
};
