import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';

// MSW 초기화 체크를 위한 전역 타입 선언
declare global {
  interface Window {
    mswInitialized?: boolean;
  }
}

// 1️⃣ 기본 설정
const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://i12b207.p.ssafy.io';
const USE_MSW: boolean = process.env.NEXT_PUBLIC_USE_MSW === 'true';

// MSW 초기화 대기 함수
const waitForMSW = async () => {
  if (USE_MSW && typeof window !== 'undefined') {
    while (!window.mswInitialized) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// API 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: USE_MSW ? '/' : BASE_URL, // MSW 사용 시 상대경로, 아니면 실제 서버 URL
  withCredentials: !USE_MSW, // CORS 요청에 쿠키 포함 여부
});

// 2️⃣ 토큰 갱신 관련 상태 관리
let isRefreshing = false; // 현재 토큰 갱신 진행 중인지 여부

// 토큰 갱신 대기열에 들어갈 요청의 타입 정의
interface QueueItem {
  resolve: (value?: unknown) => void; // 요청 성공 시 실행할 함수
  reject: (reason?: AxiosError) => void; // 요청 실패 시 실행할 함수
}

let failedQueue: QueueItem[] = []; // 토큰 만료로 실패한 요청들의 대기열

// 3️⃣ 대기열 처리 함수
const processQueue = (error: AxiosError | null = null) => {
  // 대기 중인 모든 요청들을 순회하면서
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // 에러가 있다면 reject
    } else {
      prom.resolve(); // 성공했다면 resolve
    }
  });
  failedQueue = []; // 대기열 비우기
};

// 4️⃣ Request Interceptor (요청 전 실행)
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // MSW 초기화 대기
  if (USE_MSW) {
    await waitForMSW();
  }

  // 쿠키에서 access_token 찾기
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  // 토큰이 있다면 요청 헤더에 추가
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 5️⃣ 재시도 관련 설정을 추가한 요청 설정 타입
interface RequestWithRetry extends InternalAxiosRequestConfig {
  hasRetried?: boolean; // 토큰 만료로 재시도 했는지 여부
}

// 6️⃣ Response Interceptor (응답 처리)
api.interceptors.response.use(
  // 성공 응답은 그대로 반환
  (response: AxiosResponse) => response,

  // 에러 응답 처리
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestWithRetry;

    // 7️⃣ 토큰 만료(401) 에러 && 아직 재시도하지 않은 요청
    if (error.response?.status === 401 && !originalRequest.hasRetried) {
      // 8️⃣ 이미 다른 요청이 토큰 갱신 중이라면
      if (isRefreshing) {
        // 새로운 Promise를 만들어 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest)) // 토큰 갱신 성공 시 원래 요청 재시도
          .catch((err) => Promise.reject(err)); // 실패 시 에러 반환
      }

      // 9️⃣ 첫 토큰 만료 상황이라면
      originalRequest.hasRetried = true; // 재시도 표시
      isRefreshing = true; // 토큰 갱신 시작

      try {
        // 토큰 갱신 요청
        await api.post('/api/auth/refresh');

        // 갱신 성공 시
        processQueue(); // 대기 중인 요청들 실행
        return api(originalRequest); // 원래 요청도 재시도
      } catch (e) {
        // 토큰 갱신 실패 시
        processQueue(e as AxiosError); // 대기 중인 요청들에 에러 전파
        console.log('토큰 갱신 실패');
        window.location.href = '/login'; // 로그인 페이지로 이동
        return Promise.reject(error);
      } finally {
        isRefreshing = false; // 토큰 갱신 상태 초기화
      }
    }

    // 그 외 에러는 그대로 반환
    return Promise.reject(error);
  }
);

// 🔍 환경 변수 체크
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('⚠️ Warning: NEXT_PUBLIC_API_URL is not set in .env.local');
}

if (process.env.NEXT_PUBLIC_USE_MSW === undefined) {
  console.warn('⚠️ Warning: NEXT_PUBLIC_USE_MSW is not set in .env.local');
}

// 🔍 설정 디버깅 로그
console.log('API 설정:', {
  baseURL: USE_MSW ? '/' : BASE_URL,
  withCredentials: !USE_MSW,
  useMSW: USE_MSW,
});

export default api;
