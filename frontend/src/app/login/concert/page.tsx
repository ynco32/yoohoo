'use client';
import ProgressBar from '@/components/common/ProgressBar/ProgressBar';
import styles from './page.module.scss';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import Button from '@/components/common/Button/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';
import { DateSelectionModal } from '@/components/auth/DateSelectionModal/DateSelectionModal';

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
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedConcertForDate, setSelectedConcertForDate] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [notifiedConcerts, setNotifiedConcerts] = useState<number[]>([]);
  const [selectedDatesMap, setSelectedDatesMap] = useState<
    Record<number, string[]>
  >({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [concertToDeselect, setConcertToDeselect] = useState<number | null>(
    null
  );

  const handleSelect = (id: number) => {
    if (selected.includes(id) && selectedDatesMap[id]?.length > 0) {
      setConcertToDeselect(id);
      setIsConfirmModalOpen(true);
      return;
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSeatInfoClick = (id: number) => {
    const concert = artists.find((a) => a.id === id);
    if (concert) {
      setSelectedConcertForDate(concert);
      setIsDateModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDateModalOpen(false);
      setIsClosing(false);
      setSelectedConcertForDate(null);
    }, 300);
  };

  const handleDateConfirm = (selectedDates: string[]) => {
    if (selectedConcertForDate) {
      setNotifiedConcerts((prev) => {
        if (!prev.includes(selectedConcertForDate.id)) {
          return [...prev, selectedConcertForDate.id];
        }
        return prev;
      });
      setSelectedDatesMap((prev) => ({
        ...prev,
        [selectedConcertForDate.id]: selectedDates,
      }));
    }
    handleCloseModal();
  };

  const handleReselect = (id: number) => {
    setNotifiedConcerts((prev) => prev.filter((concertId) => concertId !== id));
    setSelectedConcertForDate(
      artists.find((artist) => artist.id === id) || null
    );
    setIsDateModalOpen(true);
  };

  const handleConfirmDeselect = () => {
    if (concertToDeselect !== null) {
      setSelected((prev) => prev.filter((item) => item !== concertToDeselect));
      setSelectedDatesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[concertToDeselect];
        return newMap;
      });
      setConcertToDeselect(null);
    }
    setIsConfirmModalOpen(false);
  };

  const handleCancelDeselect = () => {
    setConcertToDeselect(null);
    setIsConfirmModalOpen(false);
  };

  const handleComplete = () => {
    // 선택 완료 버튼의 동작 제거
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
          <p className={styles.desc}>티케팅 일정 알림을 보내드려요!</p>
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
              isNotified={selectedDatesMap[artist.id]?.length > 0}
              onReselect={() => handleReselect(artist.id)}
            />
          ))}
        </div>
      </div>
      {isDateModalOpen && (
        <DateSelectionModal
          isClosing={isClosing}
          selectedConcert={selectedConcertForDate}
          initialSelectedDates={
            selectedConcertForDate
              ? selectedDatesMap[selectedConcertForDate.id] || []
              : []
          }
          onClose={handleCloseModal}
          onConfirm={handleDateConfirm}
        />
      )}
      {!isDateModalOpen && (
        <div
          className={`${styles.buttonContainer} ${selected.length > 0 ? styles.visible : ''}`}
        >
          <Button
            children={'티켓팅 알림받기'}
            className={styles.submitBtn}
            onClick={handleComplete}
            disabled={selected.length === 0}
          />
        </div>
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmDeselect}
          onCancel={handleCancelDeselect}
        />
      )}
    </div>
  );
}
