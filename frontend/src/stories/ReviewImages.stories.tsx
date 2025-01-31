import type { Meta, StoryObj } from '@storybook/react';
import { ReviewImages } from '../components/features/sight/ReviewImages';

const meta: Meta<typeof ReviewImages> = {
  title: 'Features/Sight/ReviewImages',
  component: ReviewImages,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ReviewImages>;

// 예시 이미지 URL들
const sampleImages = [
  '/images/sight.png',
  '/images/sight.png',
  '/images/sight.png',
  '/images/sight.png',
];

export const Default: Story = {
  args: {
    images: sampleImages,
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
  },
};

export const MultipleImages: Story = {
  args: {
    images: sampleImages,
  },
};
