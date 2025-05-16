import { apiRequest } from '../api';
import { Notification } from '@/types/notification';


/**
 * 
 * @returns 전체 알림 조회
 */
export const getAllNotification = async () => {
  return apiRequest<Notification[]>('GET', '/api/v1/notifications');
};


/**
 * 
 * @returns 안 읽은 알림이 있는지 조회 
 */
export const hasUnreadNotification = async () => {
  return apiRequest<boolean>('GET', 'api/v1/notifications/unread');
};

/**
 * 
 * @returns 알림 권한 확인
 */
export const checkNotificationAccess = async () => {
  return apiRequest<boolean>('GET', '/api/v1/notifications/settings');
};

/**
 * 
 * @param notificationId 알림 아이디
 * @returns 읽음 처리
 */
export const readNotification = async (notificationId: string) => {
  return apiRequest<null>(
    'PATCH',
    `/api/v1/notifications/${notificationId}/read`
  );
};

/**
 * 
 * @returns 전체 알림 읽음 처리
 */
export const readAllNotificatios = async () => {
  return apiRequest<null>('PATCH', '/api/v1/notifications/read-all');
};
