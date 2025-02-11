import type { ApiResponse, SightReviewFormData } from '@/types/sightReviews';

interface SubmitResponse extends ApiResponse {
  id: string;
}

const SIGHT_REVIEW_API = {
  ARENA_REVIEWS: (arenaId: number) => `/api/v1/view/arenas/${arenaId}/reviews`,
  REVIEWS: '/api/v1/view/reviews',
} as const;

const TIMEOUT_MS = 10000; // 10초

export async function getArenaReviews(
  arenaId: number,
  params: {
    stageType: number;
    section: number;
    seatId?: number;
  }
): Promise<ApiResponse> {
  try {
    const queryParams = new URLSearchParams({
      stageType: params.stageType.toString(),
      section: params.section.toString(),
      ...(params.seatId && { seatId: params.seatId.toString() }),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `${SIGHT_REVIEW_API.ARENA_REVIEWS(arenaId)}?${queryParams}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw error;
    }
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
}

export async function submitSightReview(
  data: SightReviewFormData
): Promise<SubmitResponse> {
  try {
    const formData = new FormData();

    // SightReviewFormData의 모든 필드를 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      // 이미지 파일들 처리
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image) => {
          formData.append(`images`, image);
        });
      }
      // 숫자 타입 처리
      else if (typeof value === 'number') {
        formData.append(key, value.toString());
      }
      // 문자열 타입 처리
      else if (typeof value === 'string') {
        formData.append(key, value);
      }
      // null이나 undefined가 아닌 경우에만 추가
      else if (value != null) {
        formData.append(key, JSON.stringify(value));
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SIGHT_REVIEW_API.REVIEWS, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw error;
    }
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
}
