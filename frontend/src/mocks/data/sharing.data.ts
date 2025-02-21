import { SharingPost, Comment, SharingStatus } from '@/types/sharing';
import { mockUserData } from '../handler/user.handler';

// 실제 데이터에는 concertId가 있어야 합니다
export interface ExtendedSharingPost extends SharingPost {
  concertId: number;
}

export const mockSharings: ExtendedSharingPost[] = [
  {
    sharingId: 1,
    concertId: 1,
    title: '베몬 포카 나눔합니다. 테스트용 엄청 긴 나눔 글 제목입니다. 더 길어질 시 줄바꿈 테스트용 제목입니다.',
    content:
      '안녕하세요! 베몬 포토카드 나눔합니다. 총 5장이며 상태 좋습니다. 관심 있으신 분들 신청해주세요!',
    writer: '닉네임',
    writerId: 1,
    writerLevel: '1',
    status: 'ONGOING' as SharingStatus,
    startTime: '2025-02-12T14:00',
    photoUrl: '/images/card.png',
    latitude: 37.518073,
    longitude: 127.127244,
  },
  {
    sharingId: 2,
    concertId: 1,
    title: '포카 나눔합니다22',
    content:
      '새로 받은 포토카드 중 중복된 카드 2장을 나눔합니다. 원하시는 분 계시면 연락주세요!',
    writer: '닉네임',
    writerId: 2,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T15:30',
    photoUrl: '/images/card.png',
    latitude: 37.518851,
    longitude: 127.125405,
  },
  {
    sharingId: 3,
    concertId: 1,
    title: '떴다 팔찌 나눔',
    content:
      '한 번 써본 팔찌 나눔합니다. 아직 상태 좋고 깨끗합니다. 가져가실 분 연락주세요!',
    writer: '닉네임',
    writerId: 3,
    writerLevel: '1',
    status: 'CLOSED' as SharingStatus,
    startTime: '2025-02-12T13:00',
    photoUrl: '/images/card.png',
    latitude: 37.520402,
    longitude: 127.128242,
  },
  {
    sharingId: 4,
    concertId: 1,
    title: '포토카드 세트 나눔합니다',
    content:
      '최근에 구매한 포토카드 세트 중 일부를 나눔합니다. 관심 있는 콜렉터분들 환영합니다!',
    writer: '닉네임',
    writerId: 4,
    writerLevel: '1',
    status: 'ONGOING' as SharingStatus,
    startTime: '2025-02-12T16:00',
    photoUrl: '/images/card.png',
    latitude: 37.518843,
    longitude: 127.128111,
  },
  {
    sharingId: 5,
    concertId: 1,
    title: '부채 나눔합니다',
    content:
      '여름을 대비해 새 부채를 나눔합니다. 디자인 예쁘고 상태 좋습니다. 필요하신 분 연락주세요!',
    writer: '닉네임',
    writerId: 5,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.51795,
    longitude: 127.126744,
  },
  {
    sharingId: 6,
    concertId: 1,
    title: '부채 나눔합니다22',
    content: '추가로 부채 한 개 더 나눔합니다. 관심 있으신 분들 신청해주세요!',
    writer: '닉네임',
    writerId: 6,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.517201,
    longitude: 127.129205,
  },
  {
    sharingId: 7,
    concertId: 1,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 7,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.519038,
    longitude: 127.127355,
  },
  {
    sharingId: 8,
    concertId: 1,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 8,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.519187,
    longitude: 127.126986,
  },
  {
    sharingId: 9,
    concertId: 1,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 9,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.519571,
    longitude: 127.129064,
  },
  {
    sharingId: 10,
    concertId: 1,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 10,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.520074,
    longitude: 127.127165,
  },
  {
    sharingId: 11,
    concertId: 1,
    title: '나눔 게시글22',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 11,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.518236,
    longitude: 127.126401,
  },
  {
    sharingId: 12,
    concertId: 2,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 12,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.518236,
    longitude: 127.126401,
  },
  {
    sharingId: 13,
    concertId: 2,
    title: '나눔 게시글',
    content: '나눔 내용',
    writer: '닉네임',
    writerId: 13,
    writerLevel: '1',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T17:30',
    photoUrl: '/images/card.png',
    latitude: 37.520074,
    longitude: 127.127165,
  },
];

export const mockComments: Comment[] = [
  {
    commentId: 1,
    writer: '닉네임',
    writerId: 1,
    writerLevel: '1',
    content: '저 참여하고 싶어요!',
    modifyTime: '2025-02-12T14:00:00',
  },
  {
    commentId: 2,
    writer: '닉네임2',
    writerId: 2,
    writerLevel: '1',
    content: '혹시 아직 가능한가요?',
    modifyTime: '2025-02-12T14:30:00',
  },
  {
    commentId: 3,
    writer: '닉네임3',
    writerId: 3,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 4,
    writer: '닉네임3',
    writerId: 4,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 5,
    writer: '닉네임3',
    writerId: 5,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 6,
    writer: '닉네임3',
    writerId: 6,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 7,
    writer: '닉네임3',
    writerId: 7,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 8,
    writer: '닉네임3',
    writerId: 8,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 9,
    writer: '닉네임3',
    writerId: 9,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 10,
    writer: '닉네임3',
    writerId: 10,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
  {
    commentId: 11,
    writer: '닉네임3',
    writerId: 11,
    writerLevel: '1',
    content: '감사합니다!',
    modifyTime: '2025-02-12T14:40:00',
  },
];

// 새로운 나눔 게시글을 추가하는 함수
export const addSharing = (
  newSharingData: Omit<ExtendedSharingPost, 'sharingId'>
): ExtendedSharingPost => {
  const newSharing = {
    sharingId: mockSharings.length + 1, // 새로운 ID 부여 (mock 데이터의 길이에 기반)
    ...newSharingData,
  };

  mockSharings.push(newSharing); // 데이터 추가
  console.log('새로운 나눔 게시글 추가:', newSharing);

  return newSharing;
};

// 특정 공연의 나눔 게시글만 필터링하는 헬퍼 함수
export const getSharingsByConcertId = (concertId: number): SharingPost[] => {
  return mockSharings
    .filter((sharing) => sharing.concertId === concertId)
    .map((sharing) => {
      const {
        sharingId,
        title,
        content,
        writer,
        writerId,
        writerLevel,
        status,
        startTime,
        photoUrl,
        latitude,
        longitude,
        concertId,
      } = sharing;
      return {
        sharingId,
        title,
        content,
        writer,
        writerId,
        writerLevel,
        status,
        startTime,
        photoUrl,
        latitude,
        longitude,
        concertId,
      };
    });
};

// 특정 나눔 게시글의 상세 정보를 가져오는 헬퍼 함수
export const getSharingById = (sharingId: number): SharingPost | undefined => {
  const sharing = mockSharings.find(
    (sharing) => sharing.sharingId === sharingId
  );
  if (sharing) {
    const {
      sharingId: id,
      title,
      content,
      writer,
      writerId,
      writerLevel,
      status,
      startTime,
      photoUrl,
      latitude,
      longitude,
      concertId,
    } = sharing;
    return {
      sharingId: id,
      title,
      content,
      writer,
      writerId,
      writerLevel,
      status,
      startTime,
      photoUrl,
      latitude,
      longitude,
      concertId,
    };
  }
  return undefined;
};

// 댓글 페이지네이션 가능한 함수
export const getCommentsByPage = (
  lastCommentId?: number,
  pageSize: number = 10
): { comments: Comment[]; lastPage: boolean } => {
  let filteredComments = [...mockComments];

  // lastCommentId가 있으면 해당 ID 이후의 댓글만 가져옴
  if (lastCommentId) {
    const startIndex = mockComments.findIndex(
      (comment) => comment.commentId === lastCommentId
    );
    filteredComments = mockComments.slice(startIndex + 1);
  }

  // 페이지 크기만큼 잘라서 반환
  const comments = filteredComments.slice(0, pageSize);
  const lastPage = filteredComments.length === 0 || comments.length < pageSize;

  return {
    comments,
    lastPage,
  };
};

// 스크랩한 게시글 목록 조회용 헬퍼 함수 추가
export const mockScrappedSharingIds = new Set([1, 3, 5]); // 임의로 몇 개의 게시글을 스크랩된 상태로 설정

export const getScrappedSharings = (
  lastSharingId?: number,
  pageSize: number = 10
): { sharings: SharingPost[]; lastPage: boolean } => {
  // mockSharings에서 스크랩된 게시글만 필터링
  const scrappedSharings = mockSharings
    .filter((sharing) => mockScrappedSharingIds.has(sharing.sharingId))
    .map((sharing) => ({
      sharingId: sharing.sharingId,
      title: sharing.title,
      content: sharing.content,
      writerId: sharing.writerId,
      writer: sharing.writer,
      writerLevel: sharing.writerLevel,
      status: sharing.status,
      startTime: sharing.startTime,
      photoUrl: sharing.photoUrl,
      latitude: sharing.latitude,
      longitude: sharing.longitude,
      concertId: sharing.concertId,
    }));

  let filteredSharings;
  if (lastSharingId) {
    const startIndex = scrappedSharings.findIndex(
      (sharing) => sharing.sharingId === lastSharingId
    );
    filteredSharings = scrappedSharings.slice(
      startIndex + 1,
      startIndex + 1 + pageSize
    );
  } else {
    filteredSharings = scrappedSharings.slice(0, pageSize);
  }

  return {
    sharings: filteredSharings,
    lastPage: filteredSharings.length < pageSize,
  };
};

// 내가 작성한 글 필터링 함수
export const getWroteSharings = (
  concertId: number,
  lastSharingId?: number,
  pageSize: number = 10
): { sharings: SharingPost[]; lastPage: boolean } => {
  // mockUserData의 userId와 일치하는 글만 필터링
  const wroteSharings = mockSharings
    .filter(
      (sharing) =>
        sharing.writerId === mockUserData.userId &&
        sharing.concertId === concertId
    )
    .map((sharing) => ({
      sharingId: sharing.sharingId,
      title: sharing.title,
      content: sharing.content,
      writer: sharing.writer,
      writerId: sharing.writerId,
      writerLevel: sharing.writerLevel,
      status: sharing.status,
      startTime: sharing.startTime,
      photoUrl: sharing.photoUrl,
      latitude: sharing.latitude,
      longitude: sharing.longitude,
      concertId: sharing.concertId,
    }));

  let filteredSharings;
  if (lastSharingId) {
    const startIndex = wroteSharings.findIndex(
      (sharing) => sharing.sharingId === lastSharingId
    );
    filteredSharings = wroteSharings.slice(
      startIndex + 1,
      startIndex + 1 + pageSize
    );
  } else {
    filteredSharings = wroteSharings.slice(0, pageSize);
  }

  return {
    sharings: filteredSharings,
    lastPage: filteredSharings.length < pageSize,
  };
};
