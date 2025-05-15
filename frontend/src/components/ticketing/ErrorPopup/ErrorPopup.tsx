'use client';
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '@/store/slices/errorSlice';
import styles from './ErrorPopup.module.scss';

interface ErrorPopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function ErrorPopup({ isOpen, children }: ErrorPopupProps) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className={styles.errorPopup}>
      <div className={styles.errorContent}>
        <p>{children}</p>
        <button onClick={() => dispatch(clearError())}>확인</button>
      </div>
    </div>
  );
}
