import { apiClient, apiRequest } from '../api';
import { Notification } from '@/types/notification';
import { ApiResponse } from '@/types/api';

export const getAllNotification = async () => {
  return apiRequest<Notification[]>('GET', '/api/v1/notifications');
};

export const hasUnreadNotification = async () => {
  return apiRequest<boolean>('GET', 'api/v1/notifications/unread');
};

export const checkNotificationAccess = async () => {
  return apiRequest<boolean>('GET', '/api/v1/notifications/settings');
};

export const readNotification = async (notificationId: string) => {
  return apiRequest<null>(
    'PATCH',
    `/api/v1/notifications/${notificationId}/read`
  );
};

export const readAllNotificatios = async () => {
  return apiRequest<null>('PATCH', '/api/v1/notifications/read-all');
};
