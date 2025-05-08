'use client';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar';
import styles from './page.module.scss';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import Button from '@/components/common/Button/Button';

export default function NicknamePage() {
  const artists = [
    { id: 1, name: '보안 문자', image: '/images/dummy.png' },
    { id: 2, name: '보안 문자', image: '/images/dummy.png' },
    { id: 3, name: '보안 문자', image: '/images/dummy.png' },
    { id: 4, name: '보안 문자', image: '/images/dummy.png' },
    { id: 5, name: '보안 문자', image: '/images/dummy.png' },
    { id: 6, name: '보안 문자', image: '/images/dummy.png' },
    { id: 7, name: '보안 문자', image: '/images/dummy.png' },
    { id: 8, name: '보안 문자', image: '/images/dummy.png' },
    { id: 9, name: '보안 문자', image: '/images/dummy.png' },
    { id: 10, name: '보안 문자', image: '/images/dummy.png' },
    { id: 11, name: '보안 문자', image: '/images/dummy.png' },
    { id: 12, name: '보안 문자', image: '/images/dummy.png' },
    { id: 13, name: '보안 문자', image: '/images/dummy.png' },
    { id: 14, name: '보안 문자', image: '/images/dummy.png' },
    { id: 15, name: '보안 문자', image: '/images/dummy.png' },
    { id: 16, name: '보안 문자', image: '/images/dummy.png' },
    { id: 17, name: '보안 문자', image: '/images/dummy.png' },
    { id: 18, name: '보안 문자', image: '/images/dummy.png' },
    { id: 19, name: '보안 문자', image: '/images/dummy.png' },
    { id: 20, name: '보안 문자', image: '/images/dummy.png' },
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
        current={2}
        total={3}
        currentDescription={'아티스트 선택'}
        className={styles.progressBar}
      />
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>좋아하는 아티스트를 알려주세요!</h2>
          <p className={styles.desc}>공연일정을 안내받을 수 있어요.</p>
        </div>
        <div className={styles.form}>
          <SearchBar />
        </div>
        <div className={styles.artistContainer}>
          {artists.map((artist) => (
            <div
              key={artist.id}
              className={`${styles.artistItem} ${selected.includes(artist.id) ? styles.selected : ''}`}
              onClick={() => handleSelect(artist.id)}
            >
              <div className={styles.artistImage}>
                <img
                  src={artist.image}
                  alt={artist.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              {selected.includes(artist.id) && (
                <span className={styles.checkmark}>✔</span>
              )}
              <div className={styles.artistName}>{artist.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          children={'선택완료'}
          className={styles.submitBtn}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
