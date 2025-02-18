import { AxiosResponse } from 'axios';
import api from './axios';

export const logout = async (): Promise<AxiosResponse> => {
  try {
    const response = await api.post('/api/v1/auth/logout');
    console.log('👋 로그아웃 성공:', response.status);

    // 클라이언트 쿠키 제거
    document.cookie =
      'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // 로그인 페이지로 리다이렉트
    window.location.href = '/login';

    return response;
  } catch (error) {
    console.log('❌ 로그아웃 실패:', error);
    throw error;
  }
};

export default logout;
