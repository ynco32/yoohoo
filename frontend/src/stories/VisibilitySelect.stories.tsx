import type { Meta, StoryObj } from '@storybook/react';
import VisibilitySelect from '@/components/features/sight/VisibilitySelect';

const meta = {
  title: 'Features/sight/VisibilitySelect',
  component: VisibilitySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VisibilitySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0,
  },
};

export const Selected: Story = {
  args: {
    value: 3,
  },
};

export const WithOnChange: Story = {
  args: {
    value: 0,
    onChange: (value) => {
      console.log('Selected visibility:', value);
    },
  },
};
