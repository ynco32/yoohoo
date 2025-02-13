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
  data: Omit<SightReviewFormData, 'photo'>,
  photo: File
): Promise<SubmitResponse> {
  try {
    console.log('[Sight Review API] 제출 시작');
    console.log('[Sight Review API] 요청 데이터:', {
      ...data,
      photo: {
        name: photo.name,
        size: photo.size,
        type: photo.type,
      },
    });

    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    formData.append(
      'reviewRequestDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    // 이미지 파일 추가
    formData.append('photo', photo, photo.name);
    console.log(
      `[Sight Review API] 파일 추가: ${photo.name} (${photo.size} bytes)`
    );

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
  data: Omit<SightReviewFormData, 'photo'>,
  photo: File
): Promise<ApiResponse> {
  try {
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    formData.append(
      'reviewRequestDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    // 이미지 파일 추가
    formData.append('photo', photo, photo.name);

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
