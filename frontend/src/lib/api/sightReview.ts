import type {
  ApiResponse,
  ApiReview,
  CreateSightReviewRequest,
} from '@/types/sightReviews';

interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

const SIGHT_REVIEW_API = {
  ARENA_REVIEWS: (arenaId: number) => `/api/v1/view/arenas/${arenaId}/reviews`,
  REVIEWS: '/api/v1/view/reviews',
  REVIEW_BY_ID: (reviewId: number) => `/api/v1/view/reviews/${reviewId}`,
} as const;

const TIMEOUT_MS = 10000;

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number = TIMEOUT_MS
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    const result = await promise;
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export async function submitSightReview(
  data: CreateSightReviewRequest,
  photo: File
): Promise<void> {
  try {
    if (!photo) {
      throw new Error('사진 파일은 필수입니다.');
    }
    if (!data) {
      throw new Error('리뷰 데이터는 필수입니다.');
    }

    // console.log('[Sight Review API] 제출 시작');
    // console.log('[Sight Review API] 요청 데이터:', {
    //   ...data,
    //   photo: {
    //     name: photo.name,
    //     size: photo.size,
    //     type: photo.type,
    //   },
    // });

    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    formData.append(
      'reviewRequestDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    // 이미지 파일 추가
    formData.append('file', photo, photo.name);
    // console.log(
    //   `[Sight Review API] 파일 추가: ${photo.name} (${photo.size} bytes)`
    // );

    // // FormData 내용 로깅
    // console.log('[Sight Review API] FormData 필드:');
    // for (const [key, value] of formData.entries()) {
    //   if (key === 'file') {
    //     console.log(`- ${key}: [File]`);
    //   } else {
    //     console.log(`- ${key}: ${value}`);
    //   }
    // }

    // console.log('[Sight Review API] 요청 시작:', SIGHT_REVIEW_API.REVIEWS);
    const response = await withTimeout(
      fetch(SIGHT_REVIEW_API.REVIEWS, {
        method: 'POST',
        body: formData,
      })
    );

    // console.log('[Sight Review API] 응답 상태:', response.status);
    // console.log(
    //   '[Sight Review API] 응답 헤더:',
    //   Object.fromEntries(response.headers.entries())
    // );

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;
      // console.error('[Sight Review API] 요청 실패:', errorData);
      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }
  } catch (error) {
    // console.error('제출 중 에러 발생:', error);
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
  data: CreateSightReviewRequest,
  photo: File
): Promise<void> {
  try {
    if (!photo) {
      throw new Error('사진 파일은 필수입니다.');
    }
    if (!data) {
      throw new Error('리뷰 데이터는 필수입니다.');
    }

    console.log('[Sight Review API UPDATE] 제출 시작');
    console.log('[Sight Review API UPDATE] 요청 데이터:', {
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
    formData.append('file', photo, photo.name);
    console.log(
      `[Sight Review API UPDATE] 파일 추가: ${photo.name} (${photo.size} bytes)`
    );

    // FormData 내용 로깅
    console.log('[Sight Review API UPDATE] FormData 필드:');
    for (const [key, value] of formData.entries()) {
      if (key === 'file') {
        console.log(`- ${key}: [File]`);
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }

    console.log(
      '[Sight Review API UPDATE] 요청 시작:',
      SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId)
    );

    const response = await withTimeout(
      fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
        method: 'PUT',
        body: formData,
      })
    );

    console.log('[Sight Review API UPDATE] 응답 상태:', response.status);
    console.log(
      '[Sight Review API UPDATE] 응답 헤더:',
      Object.fromEntries(response.headers.entries())
    );
    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;
      console.error('[Sight Review API UPDATE] 요청 실패:', errorData);

      throw new Error(errorData.message || `서버 에러: ${response.status}`);
    }
  } catch (error) {
    console.error('UPDATE 제출 중 에러 발생:', error);

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

    const response = await withTimeout(
      fetch(`${SIGHT_REVIEW_API.ARENA_REVIEWS(arenaId)}?${queryParams}`)
    );

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;
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
    const response = await withTimeout(
      fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId), {
        method: 'DELETE',
      })
    );

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;
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

export async function getReview(reviewId: number): Promise<ApiReview> {
  try {
    const response = await withTimeout(
      fetch(SIGHT_REVIEW_API.REVIEW_BY_ID(reviewId))
    );

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as ErrorResponse;
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
