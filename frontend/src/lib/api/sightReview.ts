import type { ApiResponse } from '@/types/sightReviews';
import type { SightReviewFormData } from '@/types/sightReviews';

interface SightReviewResponse {
  id: string;
  // 다른 응답 필드들...
}

const SIGHT_REVIEW_API = {
  ARENA_REVIEWS: (arenaId: number) => `/api/v1/view/arenas/${arenaId}/reviews`,
  REVIEWS: '/api/v1/view/reviews',
} as const;

export async function getArenaReviews(
  arenaId: number,
  params: {
    stageType: string;
    section: number;
    seatId?: number;
  }
): Promise<ApiResponse> {
  const queryParams = new URLSearchParams({
    stageType: params.stageType,
    section: params.section.toString(),
    ...(params.seatId && { seatId: params.seatId.toString() }),
  });

  const response = await fetch(
    `${SIGHT_REVIEW_API.ARENA_REVIEWS(arenaId)}?${queryParams}`
  );

  if (!response.ok) {
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }

  return response.json();
}

export async function submitSightReview(
  data: SightReviewFormData
): Promise<SightReviewResponse> {
  const response = await fetch(SIGHT_REVIEW_API.REVIEWS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '리뷰 제출에 실패했습니다.');
  }

  return response.json();
}
