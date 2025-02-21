// stories/DiscountSection.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DiscountSection } from '@/components/features/ticketing/DiscountSelection';

const meta = {
  title: 'Features/Ticketing/DiscountSection',
  component: DiscountSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DiscountSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
