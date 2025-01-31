import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageUpload } from '@/components/features/sight/ImageUpload';

const meta = {
  title: 'Features/sight/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCallback: Story = {
  args: {
    onChange: (file) => {
      console.log('Selected file:', file);
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [file, setFile] = React.useState<File>();

    return (
      <div className="space-y-4">
        <ImageUpload value={file} onChange={setFile} />
        {file && (
          <div className="text-sm text-gray-500">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>
    );
  },
};
