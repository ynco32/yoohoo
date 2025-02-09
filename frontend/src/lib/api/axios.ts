import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';

const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://i12b207.p.ssafy.io';
const USE_MSW: boolean = process.env.NEXT_PUBLIC_USE_MSW === 'true';

const api: AxiosInstance = axios.create({
  baseURL: USE_MSW ? '/' : BASE_URL,
  withCredentials: !USE_MSW,
});

let isRefreshing = false;
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: AxiosError) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null = null) => {
  console.log('📋 대기열 처리 중:', {
    대기요청수: failedQueue.length,
    에러발생: !!error,
  });

  failedQueue.forEach((prom) => {
    if (error) {
      console.log('❌ 대기 요청 실패:', error.message);
      prom.reject(error);
    } else {
      console.log('✅ 대기 요청 성공적으로 처리됨');
      prom.resolve();
    }
  });

  failedQueue = [];
};

interface RequestWithRetry extends InternalAxiosRequestConfig {
  hasRetried?: boolean;
  _retryCount?: number;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  console.log('📤 요청 전송:', {
    주소: config.url,
    토큰존재: !!token,
    메서드: config.method,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('📥 응답 수신:', {
      주소: response.config.url,
      상태: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestWithRetry;

    console.log('❌ 응답 에러 발생:', {
      주소: originalRequest.url,
      상태코드: error.response?.status,
      재시도여부: originalRequest.hasRetried,
      토큰갱신중: isRefreshing,
    });

    if (error.response?.status === 401 && !originalRequest.hasRetried) {
      if (isRefreshing) {
        console.log('⏳ 토큰 갱신 진행중 - 요청을 대기열에 추가합니다');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log('🔄 토큰 갱신 완료 - 원래 요청을 재시도합니다');
            return api(originalRequest);
          })
          .catch((err) => {
            console.log('❌ 대기열 처리 실패:', err.message);
            return Promise.reject(err);
          });
      }

      originalRequest.hasRetried = true;
      isRefreshing = true;

      try {
        console.log('🔑 토큰 갱신 시도 중...');
        const refreshToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('refresh_token='))
          ?.split('=')[1];

        if (!refreshToken) {
          console.log('❌ 리프레시 토큰을 찾을 수 없습니다');
          throw new Error('No refresh token found');
        }
        const refreshResponse = await api.post('/api/v1/auth/refresh', {
          refreshToken,
        });
        console.log('✅ 토큰 갱신 성공:', refreshResponse.status);

        processQueue();
        return api(originalRequest);
      } catch (e) {
        console.log('❌ 토큰 갱신 실패:', e);
        processQueue(e as AxiosError);

        console.log('🚪 로그인 페이지로 이동합니다');
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
