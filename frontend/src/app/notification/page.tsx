'use client';
import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotification';
import NotificationCard from '@/components/notification/NotificationCard/NotificationCard';
import NotificationModal from '@/components/notification/NotificationModal/NotificationModal';
import styles from './page.module.scss';
import { NotificationType } from '@/types/notification';
import SettingIcon from '@/assets/icons/setting.svg';
import Link from 'next/link';

export default function NotificationPage() {
  const {
    notifications,
    loading,
    error,
    hasUnread,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 컴포넌트 마운트 시 알림 목록 가져오기
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 모달 열기/닫기 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: NotificationType) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.isRead) {
      markAsRead(notification.notificationId.toString());
    }

    // 알림 타입에 따라 다른 동작 수행
    if (notification.type === 'TICKETING_DAY' && notification.concert) {
      // 티켓팅 페이지로 이동
      console.log(`티켓팅 페이지로 이동: ${notification.concert.concertId}`);
      // 실제 구현에서는 라우터 사용: router.push(`/concerts/${notification.concert.concertId}/ticketing`);
    } else if (notification.type === 'CONCERT_DAY' && notification.concert) {
      // 공연 상세 페이지로 이동
      console.log(`공연 상세 페이지로 이동: ${notification.concert.concertId}`);
      // 실제 구현에서는 라우터 사용: router.push(`/concerts/${notification.concert.concertId}`);
    }
  };

  // 예매하러 가기 버튼 클릭 핸들러
  const handleTicketingClick = (notification: NotificationType) => {
    if (notification.concert) {
      console.log(`티켓팅 페이지로 이동: ${notification.concert.concertId}`);
      // 실제 구현에서는 라우터 사용: router.push(`/concerts/${notification.concert.concertId}/ticketing`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>알림</div>
        <div className={styles.actions}>
          {notifications.length > 0 && (
            <button
              className={styles.readAllButton}
              onClick={deleteAllNotifications}
            >
              알림함 비우기
            </button>
          )}
          <button
            className={styles.settingsButton}
            onClick={openModal}
            aria-label='알림 설정'
          >
            <SettingIcon className={styles.icon} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <p>알림을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error.message}</p>
          <button className={styles.retryButton} onClick={fetchNotifications}>
            다시 시도
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>알림이 없습니다</p>
          <p className={styles.emptyDescription}>
            새로운 알림이 도착하면 이곳에 표시됩니다
          </p>
        </div>
      ) : (
        <div className={styles.notificationList}>
          {notifications.map((notification) => (
            <div
              key={notification.notificationId}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationCard
                notification={notification}
                onActionClick={() => handleTicketingClick(notification)}
              />
            </div>
          ))}
        </div>
      )}
      {/* <Link href='/notification/setting'>디버깅 페이지로 가기 </Link> */}

      {/* 알림 설정 모달 */}
      <NotificationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
