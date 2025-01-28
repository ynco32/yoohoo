import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <svg viewBox="0 0 800 450" width="800" height="450">
        <Story />
      </svg>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    sectionId: 1,
    arenaId: 1,
    sectionName: '001',
    isScraped: false,
    startAngle: 145,
    endAngle: 170,
    innerRadius: 60,
    outerRadius: 100,
    onClick: () => console.log('Section clicked'),
  },
};

export const Scraped: Story = {
  args: {
    ...Default.args,
    isScraped: true,
  },
};

export const WithoutClickHandler: Story = {
  args: {
    ...Default.args,
    onClick: undefined,
  },
};

export const LargeSection: Story = {
  args: {
    ...Default.args,
    startAngle: 160,
    endAngle: 200,
    innerRadius: 80,
    outerRadius: 140,
    sectionName: 'VIP',
  },
};
