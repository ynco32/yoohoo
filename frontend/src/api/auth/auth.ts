import { apiRequest } from '@/api/api';
import { checkLoginResponse } from '@/types/auth';
import { UserInfo } from '@/types/user';

export const checkNickname = async (nickname: string) => {
  return apiRequest<boolean>('GET', `/api/v1/user/nickname/check`, undefined, {
    nickname,
  });
};

export const postNickname = async (nickname: string) => {
  return apiRequest<null>('POST', '/api/v1/user/nickname', { nickname });
};

export const checkLogin = async () => {
  return apiRequest<checkLoginResponse>('GET', '/api/v1/user/login/check');
};

export const getUserProfile = async () => {
  return apiRequest<UserInfo>('GET', '/api/v1/main/user-info');
};
