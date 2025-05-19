// src/hooks/useNotification.ts
import { useState, useCallback } from 'react';
import { NotificationType } from '@/types/notification';
import { notificationApi } from '@/api/notification/notification';

/**
 * 알림 상태와 기본 CRUD 작업을 관리하는 훅
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  /**
   * 알림 목록 가져오기
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getAllNotification();
      setNotifications(response || []);

      // 안 읽은 알림이 있는지 API 호출로 확인
      const unreadResponse = await notificationApi.hasUnreadNotification();
      setHasUnread(unreadResponse || false);

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알림을 불러오는데 실패했습니다.')
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 특정 알림 읽음 처리
   */
  const markAsRead = useCallback(async (notificationId: number | string) => {
    try {
      const idAsString = notificationId.toString();

      await notificationApi.readNotification(idAsString);

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId.toString() === idAsString
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // 읽음 처리 후 안 읽은 알림이 있는지 확인
      const unreadResponse = await notificationApi.hasUnreadNotification();
      setHasUnread(unreadResponse || false);
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
      throw err;
    }
  }, []);

  /**
   * 모든 알림 읽음 처리
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.readAllNotifications();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setHasUnread(false);
    } catch (err) {
      console.error('전체 알림 읽음 처리 실패:', err);
      throw err;
    }
  }, []);

  /**
   * 새로운 알림 추가
   */
  const addNotification = useCallback((notification: NotificationType) => {
    setNotifications((prev) => [notification, ...prev]);
    setHasUnread(true);
  }, []);

  /**
   * 특정 알림 삭제
   */
  const deleteNotification = useCallback(
    async (notificationId: number | string) => {
      try {
        const idAsString = notificationId.toString();

        await notificationApi.deleteNotification(idAsString);

        // 삭제 후 상태 업데이트
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) =>
              notification.notificationId.toString() !== idAsString
          )
        );

        // 삭제 후 안 읽은 알림이 있는지 확인
        const unreadResponse = await notificationApi.hasUnreadNotification();
        setHasUnread(unreadResponse || false);

        return true;
      } catch (err) {
        console.error('알림 삭제 실패:', err);
        throw err;
      }
    },
    []
  );

  /**
   * 모든 알림 삭제
   */
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications();

      // 모든 알림 삭제 후 상태 업데이트
      setNotifications([]);
      setHasUnread(false);

      return true;
    } catch (err) {
      console.error('모든 알림 삭제 실패:', err);
      throw err;
    }
  }, []);

  /**
   * 알림 권한 확인
   */
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const checkNotificationAccess = useCallback(async () => {
    try {
      const hasPermission = await notificationApi.checkNotificationAccess();
      setHasAccess(hasPermission || false);
      return hasPermission;
    } catch (err) {
      console.error('알림 권한 확인 실패:', err);
      setHasAccess(false);
      return false;
    }
  }, []);

  /**
   * 알림 권한 변경
   */
  const changeNotificationAccess = useCallback(async () => {
    try {
      await notificationApi.changeNotificationAccess();
      return true;
    } catch (err) {
      console.error('알림 권한 변경 실패:', err);
      throw err;
    }
  }, []);

  return {
    // 상태
    notifications,
    loading,
    error,
    hasUnread,
    hasAccess,
    // 작업
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification, // 추가된 삭제 기능
    deleteAllNotifications, // 추가된 전체 삭제 기능
    setNotifications,
    checkNotificationAccess,
    changeNotificationAccess,
  };
};
