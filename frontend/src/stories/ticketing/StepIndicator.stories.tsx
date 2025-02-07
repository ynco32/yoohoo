// stories/StepIndicator.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { StepIndicator } from '@/components/features/ticketing/StepIndicator';

const meta = {
  title: 'Features/Ticketing/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      description: '현재 단계 (1-3)',
      control: { type: 'number', min: 1, max: 3 },
    },
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = {
  args: {
    currentStep: 1,
  },
};

export const Step2: Story = {
  args: {
    currentStep: 2,
  },
};

export const Step3: Story = {
  args: {
    currentStep: 3,
  },
};
