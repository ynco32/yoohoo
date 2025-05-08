'use client';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar';
import styles from './page.module.scss';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';

export default function NicknamePage() {
  const artists = [
    { id: 1, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 2, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 3, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 4, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 5, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 6, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 7, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 8, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 9, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 10, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 11, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 12, name: '보안 문자', image: '/images/dummyConcert.jpg' },
    { id: 13, name: '보안 문자', image: '/images/dummyConcert.jpg' },
  ];

  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.container}>
      <ProgressBar
        current={3}
        total={3}
        currentDescription={'콘서트 선택'}
        className={styles.progressBar}
      />
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>콘서트에 갈 예정이 있나요?</h2>
          <p className={styles.desc}>콘서트 현장정보를 안내받을 수 있어요</p>
        </div>
        <div className={styles.form}>
          <SearchBar />
        </div>
        <div className={styles.concertContainer}>
          {artists.map((artist) => (
            <ConcertCard
              key={artist.id}
              className={styles.concertCard}
              title={artist.name}
              dateRange={'2025.05.08'}
              posterUrl={artist.image}
              onClick={() => handleSelect(artist.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
