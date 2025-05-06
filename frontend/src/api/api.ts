import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 서버 사이드에서만 사용할 API 클라이언트 (CORS 없음)
export const serverApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 10000,
});
