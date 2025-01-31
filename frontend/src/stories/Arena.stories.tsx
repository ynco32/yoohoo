import type { Meta, StoryObj } from '@storybook/react';
import { Arena } from '@/components/ui/Arena';

const meta = {
  title: 'ui/Arena',
  component: Arena,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Arena>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    arenaId: 1,
    arenaName: '올림픽체조경기장',
    engName: 'KSPO DOME',
    imageSrc: '/images/kspo.png',
    imageAlt: '올림픽 체조 경기장',
    onClick: () => console.log('Arena clicked'),
  },
};
