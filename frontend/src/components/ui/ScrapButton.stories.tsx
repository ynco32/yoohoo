import type { Meta, StoryObj } from '@storybook/react';
import { ScrapButton } from './ScrapButton';

const meta = {
  title: 'Components/ScrapButton',
  component: ScrapButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrapButton>;

export default meta;
type Story = StoryObj<typeof ScrapButton>;

export const ScrapMode: Story = {
  args: {
    isScrapMode: true,
  },
};

export const NonScrapMode: Story = {
  args: {
    isScrapMode: false,
  },
};
