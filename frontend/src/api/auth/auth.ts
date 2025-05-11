import { ApiResponse, ExceptionResponse } from '@/types/api';
import { apiClient } from '../api';
import { checkLoginResponse } from '@/types/auth';

export const checkNickname = async (nickname: string) => {
  try {
    const response = await apiClient.get<ApiResponse<boolean>>(
      `/api/v1/user/nickname/check?nickname=${nickname}`
    );
    return response.data.data;
  } catch (error: any) {
    const errorResponse = error.response?.data as ApiResponse<null>;
    if (errorResponse?.error) {
      throw errorResponse.error;
    }
  }
};

export const postNickname = async (nickname: string) => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      `/api/v1/user/nickname`,
      { nickname: nickname }
    );
    return response.data;
  } catch (error: any) {
    const errorResponse = error.response?.data as ApiResponse<null>;
    if (errorResponse?.error) {
      throw errorResponse.error;
    }
  }
};

export const checkLogin = async () => {
  try {
    const response = await apiClient.get<ApiResponse<checkLoginResponse>>(
      `/api/v1/user/login/check`
    );
    return response.data;
  } catch (error: any) {
    const errorResponse = error.response?.data as ApiResponse<null>;
    if (errorResponse?.error) {
      throw errorResponse.error;
    }
  }
};
