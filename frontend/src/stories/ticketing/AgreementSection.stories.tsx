// stories/payment/AgreementSection.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AgreementSection } from '@/components/features/ticketing/AgreementSection';

const meta = {
  title: 'Features/Ticketing/AgreementSection',
  component: AgreementSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    agreements: {
      description: '약관 동의 상태 객체',
      control: 'object',
    },
    onAgreementChange: {
      description: '개별 약관 동의 시 호출되는 함수',
    },
    onAllAgreementChange: {
      description: '전체 동의 체크박스 클릭 시 호출되는 함수',
    },
  },
} satisfies Meta<typeof AgreementSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agreements: {
      all: false,
      terms1: false,
      terms2: false,
      terms3: false,
      terms4: false,
    },
    onAgreementChange: (key, checked) =>
      console.log('Agreement changed:', key, checked),
    onAllAgreementChange: (checked) =>
      console.log('All agreements changed:', checked),
  },
};

export const PartiallyChecked: Story = {
  args: {
    agreements: {
      all: false,
      terms1: true,
      terms2: true,
      terms3: false,
      terms4: false,
    },
    onAgreementChange: (key, checked) =>
      console.log('Agreement changed:', key, checked),
    onAllAgreementChange: (checked) =>
      console.log('All agreements changed:', checked),
  },
};

export const AllChecked: Story = {
  args: {
    agreements: {
      all: true,
      terms1: true,
      terms2: true,
      terms3: true,
      terms4: true,
    },
    onAgreementChange: (key, checked) =>
      console.log('Agreement changed:', key, checked),
    onAllAgreementChange: (checked) =>
      console.log('All agreements changed:', checked),
  },
};
