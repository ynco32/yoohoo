import ArenaList from '@/components/features/sight/arena/ArenaList';
import { Meta, StoryObj } from '@storybook/react';
import { rest } from 'msw'; // msw v1에서는 rest 사용

const sampleArenas = [
  {
    arenaId: 1,
    arenaName: '올림픽체조경기장',
    photoUrl: '/images/kspo.png',
  },
  {
    arenaId: 2,
    arenaName: '고척스카이돔',
    photoUrl: '/images/kspo.png',
  },
  {
    arenaId: 3,
    arenaName: '잠실실내체육관',
    photoUrl: '/images/kspo.png',
  },
];

const meta: Meta<typeof ArenaList> = {
  title: 'Features/Sight/Arena/ArenaList',
  component: ArenaList,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
    msw: {
      handlers: [
        rest.get(/.*\/api\/v1\/view\/arenas/, (req, res, ctx) => {
          return res(
            ctx.delay(100), // 응답 지연 추가 (100ms)
            ctx.json({
              arenas: sampleArenas,
            })
          );
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-background-default">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(/.*\/api\/v1\/view\/arenas/, async (req, res, ctx) => {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 기존 1초 유지
          return res(
            ctx.json({
              arenas: sampleArenas,
            })
          );
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(/.*\/api\/v1\/view\/arenas/, (req, res, ctx) => {
          return res(
            // ctx.delay(100), // 지연 추가
            ctx.status(500),
            ctx.json({
              message: '공연장 정보를 불러오는데 실패했습니다.',
            })
          );
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(/.*\/api\/v1\/view\/arenas/, (req, res, ctx) => {
          return res(
            ctx.delay(100), // 지연 추가
            ctx.json({
              arenas: [],
            })
          );
        }),
      ],
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    msw: {
      handlers: [
        rest.get(/.*\/api\/v1\/view\/arenas/, (req, res, ctx) => {
          return res(
            ctx.delay(100), // 지연 추가
            ctx.json({
              arenas: sampleArenas,
            })
          );
        }),
      ],
    },
  },
};
