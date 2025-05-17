'use client';
import { useState, useEffect } from 'react';
import { notificationApi } from '@/api/notification/notification';
import { Notification } from '@/types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getAllNotification();

      // apiRequest가 undefined를 반환할 수 있으므로 안전하게 처리
      setNotifications(response || []);

      // 안 읽은 알림 확인
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
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.readNotification(notificationId);
      // 상태 업데이트 로직
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId.toString() === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // 읽지 않은 알림이 있는지 다시 확인
      const anyUnread = notifications.some(
        (notification) =>
          notification.notificationId.toString() !== notificationId &&
          !notification.isRead
      );
      setHasUnread(anyUnread);
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.readAllNotifications();
      // 모든 알림을 읽음 상태로 업데이트
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setHasUnread(false);
    } catch (err) {
      console.error('전체 알림 읽음 처리 실패:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    hasUnread,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
