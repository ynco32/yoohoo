// src/components/notification/PushNotificationManager.tsx
import React, { useEffect, useState } from 'react';
import {
  messagingInstance,
  requestFCMToken,
  onMessageListener,
  registerServiceWorker,
} from '@/firebase';
import { apiRequest } from '@/api/api';

interface PushNotificationProps {
  onTokenReceived?: (token: string) => void;
}

interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    icon?: string;
    click_action?: string;
  };
  data?: Record<string, string>;
}

const PushNotificationManager: React.FC<PushNotificationProps> = ({
  onTokenReceived,
}) => {
  const [notification, setNotification] = useState<NotificationPayload | null>(
    null
  );
  const [isTokenFound, setIsTokenFound] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | ''
  >('');

  useEffect(() => {
    // 서비스 워커 등록
    const registerSW = async () => {
      await registerServiceWorker();
    };

    registerSW();

    // 현재 알림 권한 상태 확인
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // FCM 토큰 요청 및 저장
    const getFcmToken = async () => {
      try {
        // 알림 권한이 허용되지 않았다면 먼저 권한 요청
        if (permissionStatus !== 'granted' && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          setPermissionStatus(permission);
          if (permission !== 'granted') {
            console.log('알림 권한이 거부되었습니다.');
            return;
          }
          console.log('알림 권한이 허용되었습니다.');
        }

        const token = await requestFCMToken();
        if (token) {
          setIsTokenFound(true);

          // 토큰을 서버에 등록
          try {
            await apiRequest('POST', '/api/notifications/register', { token });
            console.log('FCM 토큰이 서버에 성공적으로 등록되었습니다.');
          } catch (error) {
            console.error('서버에 FCM 토큰 등록 실패:', error);
          }

          // 콜백 실행
          if (onTokenReceived) {
            onTokenReceived(token);
          }
        }
      } catch (error) {
        console.error('FCM 토큰 초기화 오류:', error);
      }
    };

    if (permissionStatus === 'granted' || permissionStatus === '') {
      getFcmToken();
    }
  }, [onTokenReceived, permissionStatus]);

  useEffect(() => {
    // 포그라운드 메시지 리스너 설정
    if (permissionStatus !== 'granted') return;

    const unsubscribe = onMessageListener()
      .then((payload: NotificationPayload | null) => {
        if (!payload) return;

        console.log('포그라운드 메시지 수신:', payload);
        setNotification(payload);

        // 새 알림이 있을 때 브라우저 알림 표시
        if (payload && payload.notification) {
          const { title, body, icon } = payload.notification;
          new Notification(title, {
            body,
            icon: icon || '/icon-192x192.png',
          });
        }
      })
      .catch((err) => console.error('포그라운드 메시지 수신 오류:', err));

    // cleanup은 여기에서는 할 게 없으므로 빈 함수 반환
    return () => {};
  }, [permissionStatus]);

  // 알림 권한 요청 버튼 렌더링 함수
  const renderRequestPermissionButton = () => {
    if (permissionStatus === 'denied') {
      return (
        <div className='notification-permission-denied'>
          <p>
            알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 변경해주세요.
          </p>
        </div>
      );
    }

    if (permissionStatus !== 'granted') {
      return (
        <button
          className='request-notification-btn'
          onClick={async () => {
            if ('Notification' in window) {
              const permission = await Notification.requestPermission();
              setPermissionStatus(permission);
            }
          }}
        >
          알림 권한 허용하기
        </button>
      );
    }

    return null;
  };

  return (
    <div className='push-notification-manager'>
      {renderRequestPermissionButton()}

      {notification && (
        <div className='notification-popup'>
          <h3>{notification.notification.title}</h3>
          <p>{notification.notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default PushNotificationManager;
