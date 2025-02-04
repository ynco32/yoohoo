// ui/TextInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from '@/components/ui/TextInput';
import React from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'ui/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const SingleLine: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const MultiLine: Story = {
  args: {
    placeholder: 'Enter long text here',
    multiline: true,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter text here',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const Controlled: Story = {
  render: function Controlled() {
    const [value, setValue] = React.useState<string>('');

    return (
      <div className="space-y-4">
        <TextInput
          value={value}
          onChange={setValue}
          placeholder="Type something..."
        />
        <div className="rounded bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Current value:</p>
          <p className="mt-2 text-sm">{value || '(No input yet)'}</p>
        </div>
      </div>
    );
  },
};
