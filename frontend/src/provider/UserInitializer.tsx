// 유저정보를 한번만 가져오기 위한 컴포넌트트
'use client';
import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/useUserStore';

export function UserInitializer() {
  const { fetchUserInfo } = useUserStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      fetchUserInfo();
      initialized.current = true;
    }
  }, [fetchUserInfo]);

  return null;
}
