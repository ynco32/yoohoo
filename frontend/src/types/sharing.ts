/**
 * 나눔 상태 타입
 */
export type SharingStatus = 'UPCOMING' | 'ONGOING' | 'CLOSED';

/**
 * 나눔 뷰 모드 타입
 */
export type ViewMode = 'list' | 'map';

/**
 * 나눔 게시글 정보
 */
export interface SharingPost {
  sharingId: number;
  title: string;
  content: string;
  nickname: string;
  status: SharingStatus;
  startTime: string;
  photoUrl: string | null;
  latitude?: number;
  longitude?: number;
}

/**
 * 나눔 상태별 스타일과 텍스트 정보
 */
export const STATUS_INFO = {
  ONGOING: { color: 'bg-status-success', text: '진행중' },
  UPCOMING: { color: 'bg-status-caution', text: '준비중' },
  CLOSED: { color: 'bg-gray-400', text: '마감' },
} as const;

//DUMMY DATA
export const MOCK_POSTS: SharingPost[] = [
  {
    sharingId: 1,
    title: '베몬 포카 나눔합니다',
    content:
      '안녕하세요! 베몬 포토카드 나눔합니다. 총 5장이며 상태 좋습니다. 관심 있으신 분들 신청해주세요!',
    nickname: '닉네임',
    status: 'ONGOING',
    startTime: '2025-02-12T14:00',
    photoUrl: '/images/card.png',
    latitude: 37.518073, // 한얼광장
    longitude: 127.127244,
  },
  {
    sharingId: 2,
    title: '포카 나눔합니다22',
    content:
      '새로 받은 포토카드 중 중복된 카드 2장을 나눔합니다. 원하시는 분 계시면 연락주세요!',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '2025-02-12T15:30',
    photoUrl: '/images/card.png',
    latitude: 37.518851, // 88잔디마당
    longitude: 127.125405,
  },
  {
    sharingId: 3,
    title: '떴다 팔찌 나눔',
    content:
      '한 번 써본 팔찌 나눔합니다. 아직 상태 좋고 깨끗합니다. 가져가실 분 연락주세요!',
    nickname: '닉네임',
    status: 'CLOSED',
    startTime: '2025-02-12T13:00',
    photoUrl: '/images/card.png',
    latitude: 37.520402, // 꿈나무다리
    longitude: 127.128242,
  },
  {
    sharingId: 4,
    title: '포토카드 세트 나눔합니다',
    content:
      '최근에 구매한 포토카드 세트 중 일부를 나눔합니다. 관심 있는 콜렉터분들 환영합니다!',
    nickname: '닉네임',
    status: 'ONGOING',
    startTime: '2025-02-12T16:00',
    photoUrl: '/images/card.png',
    latitude: 37.518843, // 올림픽공원 주차장
    longitude: 127.128111,
  },
  {
    sharingId: 5,
    title: '부채 나눔합니다',
    content:
      '여름을 대비해 새 부채를 나눔합니다. 디자인 예쁘고 상태 좋습니다. 필요하신 분 연락주세요!',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.51795, // 편의점 앞
    longitude: 127.126744,
  },
  {
    sharingId: 6,
    title: '부채 나눔합니다22',
    content: '추가로 부채 한 개 더 나눔합니다. 관심 있으신 분들 신청해주세요!',
    nickname: '닉네임',
    status: 'UPCOMING',
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.517201, // 만남의 광장
    longitude: 127.129205,
  },
];

export interface Comment {
  commentId: number;
  writer: string; // 작성자
  content: string; // 댓글 내용
  modifyTime: string; // 작성 시간
}

export const MOCK_COMMENTS: Comment[] = [
  {
    commentId: 1,
    writer: '닉네임',
    content: '저 참여하고 싶어요!',
    modifyTime: '2025-02-12T14:00:00',
  },
  {
    commentId: 2,
    writer: '닉네임2',
    content: '혹시 아직 가능한가요?',
    modifyTime: '2025-02-12T14:30:00',
  },
];

export const getMockSharingDetail = (id: number) => {
  return MOCK_POSTS.find((post) => post.sharingId === id) || MOCK_POSTS[0];
};

// 등록 폼 인터페이스
export interface SharingFormData {
  title: string; // 제목
  content: string; // 내용
  latitude: number; // 위도
  longitude: number; // 경도
  startTime: string; // 시작 시간 (ISO8601 형식)
  concertId?: number; // 콘서트 ID
  image: File | undefined; // 업로드할 이미지 파일
}
