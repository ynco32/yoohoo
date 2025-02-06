// npm install axios
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';

const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://i12b207.p.ssafy.io:8080';
const USE_MSW: boolean = process.env.NEXT_PUBLIC_USE_MSW === 'true';

const api: AxiosInstance = axios.create({
  baseURL: USE_MSW ? '/' : BASE_URL,
  withCredentials: !USE_MSW,
});

// 모든 요청 보내기 전에 실행
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log('axios api 요청 전 확인 출력');
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  if (token != null) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('요청 헤더:', config.headers); // 헤더에 토큰이 포함되어 있는지 확인
  }
  return config;
});
// 응답을 받은 후에 실행
api.interceptors.response.use(
  // 응답이 정상일 경우
  (response: AxiosResponse) => response,
  // 응답이 에러일 경우
  async (error: AxiosError) => {
    //토큰 만료로 401 에러인 경우
    if (error.response?.status === 401 && error.config) {
      try {
        //백엔드에 토큰 갱신 요청하기
        await api.post('/api/auth/refresh');

        // 받은 새로운 토큰으로 다시 시도
        return api(error.config);
      } catch (e) {
        // 이것마저 실패하면 로그인 창으로 다시 가기
        console.log('토큰 갱신 실패');
        console.log(e);
        window.location.href = '/login'; // 설정 파일에서는 라우터를 사용하지 못함. 그래서 window.location.href로 대체
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
