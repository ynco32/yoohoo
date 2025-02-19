import { AxiosResponse } from 'axios';
import api from './axios';
export const logout = async (): Promise<AxiosResponse> => {
  try {
    const response = await api.post('/api/v1/auth/logout');
    console.log('👋 로그아웃 성공:', response.status);

    // 정확한 도메인과 속성으로 쿠키 삭제
    document.cookie =
      'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.i12b207.p.ssafy.io';
    document.cookie =
      'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.i12b207.p.ssafy.io';

    // 삭제 확인
    console.log('로그아웃 후 쿠키:', document.cookie);

    window.location.href = '/login';

    return response;
  } catch (error) {
    console.log('❌ 로그아웃 실패:', error);
    throw error;
  }
};

export default logout;
