import type { ApiResponse, SightReviewFormData } from '@/types/sightReviews';

interface SubmitResponse extends ApiResponse {
  id: string;
}

const SIGHT_REVIEW_API = {
  ARENA_REVIEWS: (arenaId: number) => `/api/v1/view/arenas/${arenaId}/reviews`,
  REVIEWS: '/api/v1/view/reviews',
  REVIEW_BY_ID: (reviewId: number) => `/api/v1/view/reviews/${reviewId}`,
} as const;

const TIMEOUT_MS = 10000;

export async function submitSightReview(
  data: SightReviewFormData
): Promise<SubmitResponse> {
  try {
    if (!data.photo) {
      throw new Error('사진은 필수입니다.');
    }

    console.log('[Sight Review API] 제출 시작');
    console.log('[Sight Review API] 요청 데이터:', {
      ...data,
      photo:
        data.photo instanceof File
          ? {
              name: data.photo.name,
              size: data.photo.size,
              type: data.photo.type,
            }
          : null,
    });

    const formData = new FormData();

    // 데이터 필드들을 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photo' && value instanceof File) {
        formData.append('photo', value);
        console.log(
          `[Sight Review API] 파일 추가: ${value.name} (${value.size} bytes)`
        );
      } else if (typeof value === 'number') {
        formData.append(key, value.toString());
      } else if (typeof value === 'string') {
        formData.append(key, value);
      } else if (value != null) {
        formData.append(key, JSON.stringify(value));
      }
    });

    // FormData 내용 로깅
    console.log('[Sight Review API] FormData 필드:');
    for (const [key, value] of formData.entries()) {
      if (key === 'photo') {
        console.log(`- ${key}: [File]`);
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    console.log('[Sight Review API] 요청 시작:', SIGHT_REVIEW_API.REVIEWS);
    const response = await fetch(SIGHT_REVIEW_API.REVIEWS, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[Sight Review API] 응답 상태:', response.status);
    console.log(
      '[Sight Review API] 응답 헤더:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Sight Review API] 요청 실패:', errorData);
      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }

    const result = await response.json();
    console.log('[Sight Review API] 성공 응답:', result);
    return result;
  } catch (error) {
    console.error('제출 중 에러 발생:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw error;
    }
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
}

export async function updateSightReview(
  reviewId: number,
  data: SightReviewFormData
): Promise<ApiResponse> {
  try {
    if (!data.photo) {
      throw new Error('사진은 필수입니다.');
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photo' && value instanceof File) {
        formData.append('photo', value);
      } else if (typeof value === 'number') {
        formData.append(key, value.toString());
      } else if (typeof value === 'string') {
        formData.append(key, value);
      } else if (value != null) {
        formData.append(key, JSON.stringify(value));
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
      method: 'PUT',
      body: formData,
      signal: controller.signal,
    });

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

export async function deleteSightReview(
  reviewId: number
): Promise<ApiResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
      method: 'DELETE',
      signal: controller.signal,
    });

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

export async function getReview(
  reviewId: number
): Promise<SightReviewFormData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
      signal: controller.signal,
    });

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
