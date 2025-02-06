import type { Meta, StoryObj } from '@storybook/react';
import { SelectedArenaMenu } from '@/components/features/sight/arena/SelectedArenaMenu';

const meta = {
  title: 'Features/Sight/Arena/SelectedArenaMenu',
  component: SelectedArenaMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    arenaId: {
      control: { type: 'number' },
      description: '공연장 ID',
      table: {
        type: { summary: 'number' },
      },
    },
  },
} satisfies Meta<typeof SelectedArenaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// 올림픽체조경기장 케이스
export const OlympicGymnasticsArena: Story = {
  args: {
    arenaId: 1,
  },
  name: '올림픽체조경기장',
  parameters: {
    docs: {
      description: {
        story:
          '올림픽체조경기장의 좌석 메뉴를 보여줍니다. 전체보기, 360도, 돌출형, 일반형 4가지 옵션을 제공합니다.',
      },
    },
  },
};

// 고척스카이돔 케이스
export const GocheokSkyDome: Story = {
  args: {
    arenaId: 2,
  },
  name: '고척스카이돔',
  parameters: {
    docs: {
      description: {
        story:
          '고척스카이돔의 좌석 메뉴를 보여줍니다. 일반형 1가지 옵션을 제공합니다.',
      },
    },
  },
};

// 잘못된 공연장 ID 케이스
export const InvalidArena: Story = {
  args: {
    arenaId: 999,
  },
  name: '잘못된 공연장 ID',
  parameters: {
    docs: {
      description: {
        story: '존재하지 않는 공연장 ID가 입력된 경우 빈 메뉴를 표시합니다.',
      },
    },
  },
};
