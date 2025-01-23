import type { Meta, StoryObj } from '@storybook/react';
import { Arena } from './Arena';

const meta = {
  title: 'Components/Arena',
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
    arenaName: '올림픽체조경기장',
    engName: 'KSPO DOME',
    href: '/sight/olympic',
    imageSrc: '/images/kspo.png',
    imageAlt: '올림픽 체조 경기장',
    onClick: () => console.log('Arena clicked'),
  },
};
