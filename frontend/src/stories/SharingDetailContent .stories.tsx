import type { Meta, StoryObj } from '@storybook/react';
import { SharingDetailContent } from '@/components/features/sharing/SharingDetailContent';

const meta: Meta<typeof SharingDetailContent> = {
  title: 'Features/Sharing/SharingDetailContent',
  component: SharingDetailContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SharingDetailContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// 짧은 내용
export const ShortContent: Story = {
  args: {
    content: '나눔합니다.',
    startTime: '14:00',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 긴 내용
export const LongContent: Story = {
  args: {
    content: `안녕하세요! 
이번에 나눔할 물건이 많습니다. 
관심 있으신 분들은 연락 주세요.
감사합니다.`,
    startTime: '14:00',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '430px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};