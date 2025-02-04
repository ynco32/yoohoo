// components/PhotoUpload.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PhotoUpload } from '@/components/common/PhotoUpload';

const meta: Meta<typeof PhotoUpload> = {
  title: 'common/PhotoUpload',
  component: PhotoUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PhotoUpload>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: (file) => console.log('File changed:', file),
  },
};

export const WithError: Story = {
  decorators: Default.decorators,
  args: {
    onChange: (file) => console.log('File changed:', file),
    error: '이미지 업로드에 실패했습니다.',
  },
};

export const CustomLabel: Story = {
  decorators: Default.decorators,
  args: {
    onChange: (file) => console.log('File changed:', file),
    label: '프로필 사진',
    placeholder: '프로필 사진을 업로드해주세요',
  },
};
