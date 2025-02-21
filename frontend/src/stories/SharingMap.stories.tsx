import type { Meta, StoryObj } from '@storybook/react';
import { SharingMap } from '@/components/features/sharing/SharingMap';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constants/venues';

const meta: Meta<typeof SharingMap> = {
  title: 'Features/Sharing/SharingMap',
  component: SharingMap,
  parameters: {
    layout: 'fullscreen', // 전체 화면으로 표시
    // 카카오맵 스크립트 로드
    head: [
      `<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false"></script>`,
    ],
  },
} satisfies Meta<typeof SharingMap>;

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_POSTS: SharingPost[] = [
  {
    sharingId: 1,
    title: 'KSPO DOME 앞 포카 나눔',
    content: '나눔 내용입니다',
    nickname: '닉네임1',
    status: 'ONGOING',
    startTime: '15:00',
    photoUrl: '/images/card.png',
    latitude: 37.5204,
    longitude: 127.1243,
  },
  {
    sharingId: 2,
    title: '올림픽공원역 부채 나눔',
    content: '나눔 내용입니다',
    nickname: '닉네임2',
    status: 'UPCOMING',
    startTime: '16:00',
    photoUrl: '/images/card.png',
    latitude: 37.5208,
    longitude: 127.1288,
  },
];

export const Default: Story = {
  args: {
    posts: MOCK_POSTS,
    venueLocation: {
      latitude: VENUE_COORDINATES.KSPO_DOME.latitude,
      longitude: VENUE_COORDINATES.KSPO_DOME.longitude,
    },
    concertId: 123, // 테스트용 concertId 추가
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    posts: [],
    venueLocation: {
      latitude: VENUE_COORDINATES.KSPO_DOME.latitude,
      longitude: VENUE_COORDINATES.KSPO_DOME.longitude,
    },
    concertId: 123, // 테스트용 concertId 추가 (빈 경우도 체크)
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
