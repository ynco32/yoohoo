'use client';
import TextInput from '@/components/common/TextInput/TextInput';
import ProgressBar from './ProgressBar';
import styles from './page.module.scss';
import { useState } from 'react';
import Button from '@/components/common/Button/Button';

export default function NicknamePage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const maxLength = 50;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    if (value === '눈사람') {
      setError('이미 있는 닉네임은 사용할 수 없어요.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || error) return;
    // 전달하기 동작 구현
    alert('닉네임 전달: ' + nickname);
  };

  return (
    <div className={styles.container}>
      <ProgressBar current={1} total={3} currentDescription={'닉네임 입력'} />
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>닉네임을 지어주세요!</h2>
          <p className={styles.desc}>좌석 후기 및 나눔글에서 사용돼요.</p>
        </div>
        <div className={styles.form}>
          <TextInput
            value={nickname}
            onChange={(value) => setNickname(value)}
            maxLength={maxLength}
            placeholder='닉네임을 입력해주세요'
            className={styles.input}
          />
          <Button
            children={'전달하기'}
            className={styles.submitBtn}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
