import type { SightReviewData } from '@/types/sightReviews';

export const mockSightReviews: SightReviewData[] = [
  {
    arenaId: 1,
    sectionId: 1,
    seatId: 2,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '관람객1',
    profilePicture: '/images/profile.png',
    seatInfo: '1구역 1열 2번',
    images: ['/images/sight.png'],
    content: '시야가 정말 좋았습니다.',
    viewQuality: 5,
    soundQuality: '선명해요',
    seatQuality: '평범해요',
  },
  {
    arenaId: 1,
    sectionId: 102,
    seatId: 5,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '관람객2',
    profilePicture: '/images/profile.png',
    seatInfo: '102구역 1열 2번',
    images: ['/images/sight.png', '/images/sight.png'],
    content: '음향이 아주 좋았어요.',
    viewQuality: 4,
    soundQuality: '선명해요',
    seatQuality: '넓어요',
  },
];
