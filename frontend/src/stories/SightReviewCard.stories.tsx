import type { Meta, StoryObj } from '@storybook/react';
import { SightReviewCard } from '../components/features/sight/SightReviewCard';

const meta = {
  title: 'Features/Sight/SightReviewCard',
  component: SightReviewCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SightReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
  nickName: '닉네임닉네임',
  profilePicture: '/images/profile.png',
  seatInfo: '203구역 4열',
  images: ['/images/sight.png', '/images/sight.png', '/images/sight.png'],
  content:
    '소학교 때 책상을 같이 했던 아이들의 이름과 때, 경, 옥 이런 이국소녀들의 이름과 떠써 아기 어머니된 계집애들의 이름과, 가난한 이웃 사람들의 이름과, 비둘기, 강아지, 토끼, 노루, 노루, 프랑시스 잠 ...',
  viewQuality: '하나님석 잘 보여요',
  soundQuality: '음향 평범해요',
  seatQuality: '좌석 평범해요',
};

export const Default: Story = {
  args: defaultArgs,
};

export const ShortContent: Story = {
  args: {
    ...defaultArgs,
    content: '정말 가까워요!',
  },
};

export const SingleImage: Story = {
  args: {
    ...defaultArgs,
    images: ['/images/sight.png'],
  },
};

export const MultipleImages: Story = {
  args: {
    ...defaultArgs,
    images: [
      '/images/sight.png',
      '/images/sight.png',
      '/images/sight.png',
      '/images/sight.png',
    ],
  },
};

export const LongContent: Story = {
  args: {
    ...defaultArgs,
    content: `첫 번째 공연을 보러 갔을 때의 설렘이 아직도 생생합니다. 
    무대의 웅장한 조명과 함께 시작된 오프닝부터 마지막 앵콜까지, 
    모든 순간이 특별했죠. 특히 중간 부분에서 선보인 새로운 편곡 버전은 
    정말 인상적이었습니다. 아티스트들의 열정적인 퍼포먼스와 관객들의 
    호응이 어우러져 만들어낸 환상적인 분위기는 절대 잊을 수 없을 것 같아요. 
    음향도 좋았고, 특히 제가 앉았던 자리는 무대가 잘 보이는 최적의 위치였던 것 같아요. 
    다음 공연에도 꼭 다시 오고 싶습니다!`,
  },
};
