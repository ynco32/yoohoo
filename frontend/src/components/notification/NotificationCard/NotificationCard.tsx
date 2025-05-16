import React from 'react';
import { Notification, NotificationType } from '@/types/notification';
import styles from './NotificationCard.module.scss';

interface NotificationCardProps {
  notification: Notification;
  onActionClick?: () => void;
}

// 날짜 포맷팅 함수 (YYYY-MM-DD -> YYYY.MM.DD)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.substring(0, 10).split('-');
  if (parts.length === 3) {
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  }
  return dateString;
};

/**
 * 알림 카드 컴포넌트
 */
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onActionClick,
}) => {
  const { title, body, type, createdAt, concert } = notification;

  return (
    <div className={styles.notificationCard}>
      <div className={styles.header}>
        <div className={styles.date}>{formatDate(createdAt)}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <p className={styles.body}>{body}</p>

        {concert && (
          <div className={styles.concertInfo}>
            <div className={styles.concertImage}>
              {concert.photoUrl && (
                <img src={concert.photoUrl} alt={concert.concertName} />
              )}
            </div>
            <div className={styles.concertDetails}>
              <div className={styles.concertName}>{concert.concertName}</div>
              <div className={styles.artistName}>{concert.artistName}</div>
            </div>
          </div>
        )}

        {type === 'TICKETING_DAY' && (
          <button className={styles.actionButton} onClick={onActionClick}>
            예매하러 가기
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
