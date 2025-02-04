import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { userEvent } from '@storybook/testing-library';
import { ScrapMode } from '@/components/features/sight/ScrapMode';

const meta = {
  title: 'Features/Sight/ScrapMode',
  component: ScrapMode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '섹션을 선택하고 스크랩할 수 있는 컴포넌트입니다. 스크랩 모드를 활성화하면 섹션을 클릭하여 스크랩할 수 있습니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background h-[800px] w-[800px] p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ScrapMode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Active: Story = {
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const starButton = await canvas.findByRole('button', { name: /star/i });
    await userEvent.click(starButton);
  },
};

export const Scrapped: Story = {
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const starButton = await canvas.findByRole('button', { name: /star/i });
    await userEvent.click(starButton);
    const firstSection = await canvas.findByTestId('section-1');
    await userEvent.click(firstSection);
  },
};
