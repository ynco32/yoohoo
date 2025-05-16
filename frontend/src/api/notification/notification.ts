// 전체 코드
import { apiClient } from '../api';
import { Notification } from '@/types/notification';

export const notificationApi = {
  /**
   * 전체 알림 조회
   */
  getAllNotification: () =>
    apiClient.get<Notification[]>('/api/v1/notifications'),

  /**
   * 안 읽은 알림이 있는지 조회
   */
  hasUnreadNotification: () =>
    apiClient.get<boolean>('/api/v1/notifications/unread'),

  /**
   * 알림 권한 확인
   */
  checkNotificationAccess: () =>
    apiClient.get<boolean>('/api/v1/notifications/settings'),

  /**
   * 특정 알림 읽음 처리
   * @param notificationId 알림 아이디
   */
  readNotification: (notificationId: string) =>
    apiClient.patch<null>(`/api/v1/notifications/${notificationId}/read`),

  /**
   * 전체 알림 읽음 처리
   */
  readAllNotifications: () =>
    apiClient.patch<null>('/api/v1/notifications/read-all'),
};
