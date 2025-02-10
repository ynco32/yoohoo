import type { SightReviewFormData } from '@/types/sightReviews';

interface SightReviewResponse {
  id: string;
  // 다른 응답 필드들...
}

const SIGHT_REVIEW_API = {
  REVIEWS: '/api/sight-reviews',
} as const;

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
