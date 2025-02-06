import type { Meta, StoryObj } from '@storybook/react';
import { SharingWriteForm } from '../components/features/sharing/SharingWriteForm';

const meta: Meta<typeof SharingWriteForm> = {
  title: 'Features/Sharing/SharingWriteForm',
  component: SharingWriteForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SharingWriteForm>;

const mockLocation = {
  latitude: 37.5665,
  longitude: 126.978,
};

const createTestFile = () => {
  return new File(['test'], 'card.png', { type: 'image/png' });
};

const mockFormData = {
  title: '',
  startTime: '',
  content: '',
  image: undefined,
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <div
        style={{ width: '430px', height: '100vh', backgroundColor: 'white' }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    location: mockLocation,
    formData: mockFormData,
    onFormChange: (data) => console.log('Form data changed:', data),
    onSubmitComplete: () => console.log('Submit completed'),
    onLocationReset: () => console.log('Location reset'),
    concertId: 1,
  },
};

export const WithPrefilledData: Story = {
  decorators: Default.decorators,
  args: {
    ...Default.args,
    formData: {
      title: '포카 나눔합니다',
      startTime: '2025-02-04T14:00',
      content:
        '트레저 콘서트 포카 나눔합니다. 관심있으신 분은 댓글 남겨주세요!',
      image: createTestFile(),
    },
  },
};

export const WithErrors: Story = {
  decorators: Default.decorators,
  args: {
    ...Default.args,
    formData: {
      title: '',
      startTime: '',
      content: '',
      image: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form');
    form?.dispatchEvent(new Event('submit', { bubbles: true }));
  },
};
