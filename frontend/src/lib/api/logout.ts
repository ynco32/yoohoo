import { AxiosResponse } from 'axios';
import api from './axios';

export const logout = async (): Promise<AxiosResponse> => {
  try {
    const response = await api.post('/api/v1/auth/logout');
    console.log('👋 로그아웃 성공:', response.status);
    return response;
  } catch (error) {
    console.log('❌ 로그아웃 실패:', error);
    throw error;
  }
};

export default logout;
