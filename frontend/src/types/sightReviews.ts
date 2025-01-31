export interface SightReviewData {
  arenaId: number;
  sectionId: number;
  seatId: number;
  concertTitle: string;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
  images: string[];
  content: string;
  viewQuality: string;
  soundQuality: string;
  seatQuality: string;
}

export const mockReviewData: SightReviewData[] = [
  {
    arenaId: 1,
    sectionId: 1,
    seatId: 2,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '닉네임닉네임',
    profilePicture: '/images/profile.png',
    seatInfo: '1구역 1열 2번',
    images: ['/images/sight.png'],
    content:
      '소학교 때 책상을 같이 했던 아이들의 이름과 때, 경, 옥 이런 이국소녀들의 이름과 떠써 아기 어머니된 계집애들의 이름과, 가난한 이웃 사람들의 이름과, 비둘기, 강아지, 토끼, 노루, 노루, 프랑시스 잠 ...',
    viewQuality: '하나님석 잘 보여요',
    soundQuality: '음향 평범해요',
    seatQuality: '좌석 평범해요',
  },
  {
    arenaId: 1,
    sectionId: 102,
    seatId: 5,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '새벽리뷰어',
    profilePicture: '/images/profile.png',
    seatInfo: '102구역 1열 2번',
    images: ['/images/sight.png', '/images/sight.png'],
    content:
      '공연장 분위기가 정말 좋았어요. 특히 앵콜 무대에서 보여준 퍼포먼스는 잊을 수 없을 것 같아요!',
    viewQuality: '시야 좋아요',
    soundQuality: '음향 매우 좋음',
    seatQuality: '좌석 편해요',
  },
  {
    arenaId: 2,
    sectionId: 201,
    seatId: 7,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '콘서트매니아',
    profilePicture: '/images/profile.png',
    seatInfo: '201구역 1열 2번',
    images: [],
    content:
      '음향이 살짝 아쉬웠지만 무대는 정말 최고였습니다. 다음에도 꼭 보러 올게요!',
    viewQuality: '무대가 잘 보여요',
    soundQuality: '음향이 조금 아쉬워요',
    seatQuality: '좌석은 괜찮아요',
  },
];
