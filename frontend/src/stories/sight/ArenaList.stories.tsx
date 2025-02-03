import type { Meta, StoryObj } from '@storybook/react';
import ArenaList from '@/components/features/sight/ArenaList';
import { http, HttpResponse } from 'msw';

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

const meta = {
  title: 'Features/Sight/ArenaList',
  component: ArenaList,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
    msw: {
      handlers: [
        http.get(/.*\/api\/v1\/view\/arenas/, () => {
          return HttpResponse.json({
            arenas: sampleArenas, // data 객체 제거
          });
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
} satisfies Meta<typeof ArenaList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/.*\/api\/v1\/view\/arenas/, async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return HttpResponse.json({
            arenas: sampleArenas,
          });
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(/.*\/api\/v1\/view\/arenas/, () => {
          return new HttpResponse(
            JSON.stringify({
              message: '공연장 정보를 불러오는데 실패했습니다.',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
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
        http.get(/.*\/api\/v1\/view\/arenas/, () => {
          return HttpResponse.json({
            arenas: [], // data 객체 제거
          });
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
        http.get(/.*\/api\/v1\/view\/arenas/, () => {
          return HttpResponse.json({
            arenas: sampleArenas,
          });
        }),
      ],
    },
  },
};
