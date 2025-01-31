import type { Meta, StoryObj } from '@storybook/react';
import { StarButton } from '@/components/ui/StarButton';

const meta = {
  title: 'ui/StarButton',
  component: StarButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StarButton>;

export default meta;
type Story = StoryObj<typeof StarButton>;

export const Default: Story = {
  args: {
    onScrapModeChange: (isScrap) => console.log('Scrap mode:', isScrap),
  },
};
