import type { Meta, StoryObj } from '@storybook/react';
import { SightReviewForm } from '@/components/features/sight/SightReviewForm';
import React from 'react';

const meta = {
  title: 'Features/sight/ReviewForm',
  component: SightReviewForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    artist: {
      description: '특정 아티스트의 콘서트만 표시',
      control: 'text',
    },
    onSubmit: {
      description: '폼 제출 시 호출되는 함수',
      action: 'submitted',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SightReviewForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSubmit = async () => {
  return { id: 'mock-review-id' };
};

// 기본 폼
export const Default: Story = {
  args: {
    onSubmit: mockSubmit,
  },
};

// 특정 아티스트의 콘서트만 표시
export const WithArtist: Story = {
  args: {
    artist: 'BLACKPINK',
    onSubmit: mockSubmit,
  },
};

// 제출 핸들링 예시
export const WithSubmitHandler: Story = {
  parameters: {
    docs: {
      description: {
        story: '폼 제출 시 콘솔에 데이터가 출력되고 화면에 표시됩니다.',
      },
    },
  },
  render: function WithSubmitHandler() {
    const [lastSubmittedData, setLastSubmittedData] = React.useState<any>(null);

    const handleSubmit = async (data: any) => {
      console.log('Form submitted:', data);
      setLastSubmittedData(data);
      return { id: 'mock-review-id' };
    };

    return (
      <div className="space-y-6">
        <SightReviewForm onSubmit={handleSubmit} />
        {lastSubmittedData && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              마지막 제출 데이터:
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-600">
              {JSON.stringify(lastSubmittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};
