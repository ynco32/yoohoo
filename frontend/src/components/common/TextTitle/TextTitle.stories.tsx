import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TextTitle from './TextTitle';

const meta: Meta<typeof TextTitle> = {
  title: 'Components/Common/TextTitle',
  component: TextTitle,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    centered: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextTitle>;

export const Default: Story = {
  args: {
    title: '좋아하는 아티스트를 알려주세요!',
    description: '공연 정보, 티켓팅 오픈 알림을 받아볼 수 있어요.',
    size: 'medium',
    centered: false,
  },
};

export const Large: Story = {
  args: {
    title: '좋아하는 아티스트를 알려주세요!',
    description: '공연 정보, 티켓팅 오픈 알림을 받아볼 수 있어요.',
    size: 'large',
    centered: false,
  },
};

export const Small: Story = {
  args: {
    title: '좋아하는 아티스트를 알려주세요!',
    description: '공연 정보, 티켓팅 오픈 알림을 받아볼 수 있어요.',
    size: 'small',
    centered: false,
  },
};

export const Centered: Story = {
  args: {
    title: '좋아하는 아티스트를 알려주세요!',
    description: '공연 정보, 티켓팅 오픈 알림을 받아볼 수 있어요.',
    size: 'medium',
    centered: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    title: '좋아하는 아티스트를 알려주세요!',
    size: 'medium',
    centered: false,
  },
};
