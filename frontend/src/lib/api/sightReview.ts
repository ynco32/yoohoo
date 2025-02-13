import type { ApiResponse, SightReviewFormData } from '@/types/sightReviews';

interface SubmitResponse extends ApiResponse {
  id: string;
}

const SIGHT_REVIEW_API = {
  ARENA_REVIEWS: (arenaId: number) => `/api/v1/view/arenas/${arenaId}/reviews`,
  REVIEWS: '/api/v1/view/reviews',
  REVIEW_BY_ID: (reviewId: number) => `/api/v1/view/reviews/${reviewId}`,
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
    console.log('Submit 시작: 원본 데이터', data);
    const formData = new FormData();

    // SightReviewFormData의 모든 필드를 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      console.log(`처리 중인 필드: ${key}, 값:`, value, '타입:', typeof value);

      // 이미지 파일들 처리
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image, index) => {
          console.log(`이미지 ${index} 추가:`, image);
          formData.append(`images`, image);
        });
      }
      // 숫자 타입 처리
      else if (typeof value === 'number') {
        console.log(`숫자 필드 ${key} 추가:`, value);
        formData.append(key, value.toString());
      }
      // 문자열 타입 처리
      else if (typeof value === 'string') {
        console.log(`문자열 필드 ${key} 추가:`, value);
        formData.append(key, value);
      }
      // null이나 undefined가 아닌 경우에만 추가
      else if (value != null) {
        console.log(`기타 필드 ${key} 추가:`, value);
        formData.append(key, JSON.stringify(value));
      }
    });

    // FormData 내용 확인
    console.log('최종 FormData 내용:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    console.log('API 요청 시작:', SIGHT_REVIEW_API.REVIEWS);
    const response = await fetch(SIGHT_REVIEW_API.REVIEWS, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('API 응답 상태:', response.status);
    console.log(
      'API 응답 헤더:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch((e) => {
        console.error('에러 응답 파싱 실패:', e);
        return {};
      });
      console.error('서버 에러 응답:', errorData);
      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }

    const result = await response.json();
    console.log('성공 응답:', result);
    return result;
  } catch (error) {
    console.error('제출 중 에러 발생:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('요청 타임아웃');
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw error;
    }
    throw new Error('알 수 없는 에러가 발생했습니다.');
  }
}

// 수정 함수
export async function updateSightReview(
  reviewId: number,
  data: SightReviewFormData
): Promise<ApiResponse> {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image) => {
          formData.append(`images`, image);
        });
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

// 삭제 함수
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

// 단일 리뷰 조회
export async function getReview(
  reviewId: number
): Promise<SightReviewFormData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
      method: 'GET',
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
