// // hooks/useSectionReviews.ts
// 'use client';

// import { useState, useEffect } from 'react';
// import { apiClient } from '@/api/api';

// interface Review {
//   reviewId: number;
//   seatId: number; // 좌석 ID 추가
//   content: string;
//   artistGrade?: number;
//   stageGrade?: number;
//   screenGrade?: number;
//   photos?: {
//     reviewPhotoId: number;
//     photoUrl: string;
//   }[];
//   createdAt: string;
//   updatedAt: string;
//   authorName: string;
//   authorProfileImage?: string;
// }

// export function useSectionReviews(arenaId: string, sectionId: string) {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setIsLoading(true);
//         // 구역 전체 리뷰를 한 번에 가져오는 API 호출
//         const response = await apiClient.get(
//           `/arenas/${arenaId}/sections/${sectionId}/reviews`
//         );

//         // API 응답 구조에 맞게 데이터 추출
//         const reviewsData = response.data.data || [];
//         setReviews(reviewsData);
//       } catch (err) {
//         console.error('구역 리뷰를 가져오는 중 오류 발생:', err);
//         setError(err as Error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (arenaId && sectionId) {
//       fetchReviews();
//     }
//   }, [arenaId, sectionId]);

//   return { reviews, isLoading, error };
// }
'use client';

import { useState, useEffect } from 'react';
import { Review, ArtistGrade, StageGrade, ScreenGrade } from '@/types/review';

// 더미 리뷰 데이터 정의
const dummyReviews: Review[] = [
  {
    reviewId: 1,
    nickname: '콘서트매니아',
    concertName: '아이유 콘서트 2025',
    arenaName: '고척스카이돔',
    seatId: 101,
    section: 'A',
    rowLine: 5,
    columnLine: 10,
    artistGrade: ArtistGrade.CLOSE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.CLEAR,
    content:
      '무대와 거리가 적당하고 시야가 좋았어요! 아이유의 표정까지 잘 보였습니다. 라이브도 CD급으로 너무 좋았어요. 다음에 또 이 자리에서 보고 싶습니다. 강력 추천합니다!',
    createdAt: '2025-04-15T10:30:00Z',
    photoUrls: ['/images/dummy.png'],
  },
  {
    reviewId: 2,
    nickname: '뮤직러버',
    concertName: '아이유 콘서트 2025',
    arenaName: '고척스카이돔',
    seatId: 102,
    section: 'A',
    rowLine: 5,
    columnLine: 11,
    artistGrade: ArtistGrade.CLOSE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.CLEAR,
    content: '음향이 정말 좋았고 아이유의 목소리가 생생하게 들렸어요!',
    createdAt: '2025-04-16T15:45:00Z',
    photoUrls: [],
  },
  {
    reviewId: 3,
    nickname: '콘서트홀릭',
    concertName: '아이유 콘서트 2025',
    arenaName: '고척스카이돔',
    seatId: 150,
    section: 'A',
    rowLine: 8,
    columnLine: 20,
    artistGrade: ArtistGrade.MODERATE,
    stageGrade: StageGrade.SIDE,
    screenGrade: ScreenGrade.CLEAR,
    content:
      '약간 측면이라 무대가 비스듬히 보였지만, 큰 스크린 덕분에 공연은 잘 볼 수 있었습니다.',
    cameraBrand: 'Canon',
    cameraModel: 'EOS R5',
    createdAt: '2025-04-17T18:20:00Z',
    photoUrls: ['/images/dummy.png', '/images/dummyArtist.jpg'],
  },
];

/**
 * 구역 리뷰를 가져오는 커스텀 훅
 * @param arenaId 공연장 ID
 * @param sectionId 구역 ID
 */
export function useSectionReviews(arenaId: string, sectionId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // API 서버가 준비될 때까지 더미 데이터 사용
    const useDummyData = true; // 테스트용 플래그

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (useDummyData) {
          // 더미 데이터 사용 시 약간의 지연 추가 (로딩 상태 확인용)
          await new Promise((resolve) => setTimeout(resolve, 500));
          setReviews(dummyReviews);
        } else {
          // 실제 API 요청 코드 (나중에 사용)
          // const response = await apiClient.get<ApiResponse<Review[]>>(
          //   `/arenas/${arenaId}/sections/${sectionId}/reviews`
          // );
          // setReviews(response.data.data);
        }
      } catch (err) {
        console.error('구역 리뷰를 가져오는 중 오류 발생:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('알 수 없는 오류가 발생했습니다.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [arenaId, sectionId]);

  return { reviews, isLoading, error };
}
