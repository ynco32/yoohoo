// components/TextArea.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@/components/common/TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'common/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: '내용을 입력해주세요',
  },
};

export const WithLabel: Story = {
  decorators: Default.decorators,
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    label: '상세 내용',
    placeholder: '상세 내용을 입력해주세요',
  },
};

export const WithError: Story = {
  decorators: Default.decorators,
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    label: '상세 내용',
    placeholder: '상세 내용을 입력해주세요',
    error: '필수 입력 항목입니다.',
  },
};

export const WithValue: Story = {
  decorators: Default.decorators,
  args: {
    value: '이미 작성된 내용입니다.',
    onChange: (value) => console.log('Value changed:', value),
    label: '상세 내용',
  },
};

export const CustomHeight: Story = {
  decorators: Default.decorators,
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    label: '상세 내용',
    minHeight: 'min-h-[200px]',
  },
};
