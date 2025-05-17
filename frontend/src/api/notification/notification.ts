import { apiRequest } from '@/api/api';
import { Notification } from '@/types/notification';

export const notificationApi = {
  /**
   * 전체 알림 조회
   */
  getAllNotification: () =>
    apiRequest<Notification[]>('GET', '/api/v1/notifications'),

  /**
   * 안 읽은 알림이 있는지 조회
   */
  hasUnreadNotification: () =>
    apiRequest<boolean>('GET', '/api/v1/notifications/unread'),

  /**
   * 알림 권한 확인
   */
  checkNotificationAccess: () =>
    apiRequest<boolean>('GET', '/api/v1/notifications/settings'),

  /**
   * 특정 알림 읽음 처리
   * @param notificationId 알림 아이디
   */
  readNotification: (notificationId: string) =>
    apiRequest<null>('PATCH', `/api/v1/notifications/${notificationId}/read`),

  /**
   * 전체 알림 읽음 처리
   */
  readAllNotifications: () =>
    apiRequest<null>('PATCH', '/api/v1/notifications/read-all'),
};
