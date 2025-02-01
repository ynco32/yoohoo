// npm install axios
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useRouter } from 'next/navigation';

const router = useRouter();

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  baseURL: 'http://i12b207.p.ssafy.io:8080',
  withCredentials: true, // 모든 요청에 브라우저가 자동으로 액세스, 리프레시 토큰을 포함하여 전송하도록 함.
});

// 모든 요청 보내기 전에 실행
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
        router.push('/login');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
