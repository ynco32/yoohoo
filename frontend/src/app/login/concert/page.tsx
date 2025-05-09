'use client';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar';
import styles from './page.module.scss';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import BottomSheet from '@/components/common/BottonSheet/BottomSheet';
import ConcertSeatForm from '@/app/login/concert/ConcertSeatForm';
import Button from '@/components/common/Button/Button';

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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // 선택 완료 버튼의 동작 제거
  };

  const handleSeatInfoClick = (id: number) => {
    const concert = artists.find((a) => a.id === id);
    if (concert) {
      setSelectedConcert(concert);
      setBottomSheetOpen(true);
    }
  };

  const handleCancel = () => {
    setBottomSheetOpen(false);
    setSelectedConcert(null);
  };

  const handleSave = (data: { section: string; row: string; seat: string }) => {
    // 저장 로직 (예: 서버 전송 또는 상태 저장)
    console.log('저장된 값:', {
      concert: selectedConcert?.name,
      ...data,
    });
    setBottomSheetOpen(false);
    setSelectedConcert(null);
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
              className={`${styles.concertCard} ${selected.includes(artist.id) ? styles.selected : ''}`}
              title={artist.name}
              dateRange={'2025.05.08'}
              posterUrl={artist.image}
              onClick={() => handleSelect(artist.id)}
              isSelected={selected.includes(artist.id)}
              onSeatInfoClick={() => handleSeatInfoClick(artist.id)}
            />
          ))}
        </div>
      </div>
      {!bottomSheetOpen && (
        <div
          className={`${styles.buttonContainer} ${selected.length > 0 ? styles.visible : ''}`}
        >
          <Button
            children={'선택완료'}
            className={styles.submitBtn}
            onClick={handleComplete}
            disabled={selected.length === 0}
          />
        </div>
      )}
      <BottomSheet isOpen={bottomSheetOpen} onClose={handleCancel}>
        {selectedConcert && (
          <ConcertSeatForm
            concertName={selectedConcert.name}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </BottomSheet>
    </div>
  );
}
