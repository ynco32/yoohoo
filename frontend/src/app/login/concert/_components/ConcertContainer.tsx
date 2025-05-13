'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import Button from '@/components/common/Button/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';
import { DateSelectionModal } from '@/components/auth/DateSelectionModal/DateSelectionModal';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import styles from './ConcertContainer.module.scss';
import { ConcertInfo } from '@/types/mypage';
import { useConcert } from '@/hooks/useConcert';

export default function ConcertContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const {
    concerts,
    selected,
    isLastPage,
    isLoading,
    loadMoreRef,
    selectedDatesMap,
    handleSearch,
    handleSelect,
    handleSubmit,
    updateSelectedDates,
  } = useConcert(search);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedConcertForDate, setSelectedConcertForDate] =
    useState<ConcertInfo | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [concertToDeselect, setConcertToDeselect] = useState<number | null>(
    null
  );

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  const handleConcertSelect = (id: number) => {
    if (selected.includes(id) && selectedDatesMap[id]?.length > 0) {
      setConcertToDeselect(id);
      setIsConfirmModalOpen(true);
      return;
    }

    handleSelect(id);
  };

  const handleSeatInfoClick = (id: number) => {
    const concert = concerts.find((c) => c.concertId === id);
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

  const handleDateConfirm = (
    selectedDates: { date: string; concertDetailId: number }[]
  ) => {
    if (selectedConcertForDate) {
      updateSelectedDates(selectedConcertForDate.concertId, selectedDates);
    }
    handleCloseModal();
  };

  const handleReselect = (id: number) => {
    const concert = concerts.find((c) => c.concertId === id);
    if (concert) {
      setSelectedConcertForDate(concert);
      setIsDateModalOpen(true);
    }
  };

  const handleConfirmDeselect = () => {
    if (concertToDeselect !== null) {
      updateSelectedDates(concertToDeselect, []);
      setConcertToDeselect(null);
    }
    setIsConfirmModalOpen(false);
  };

  const handleCancelDeselect = () => {
    setConcertToDeselect(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <div className={styles.form}>
        <SearchBar
          initialValue={search}
          onSearch={handleSearchChange}
          placeholder='공연을 검색해보세요'
        />
      </div>
      <div className={styles.concertContainer}>
        {concerts.map((concert) => (
          <ConcertCard
            key={concert.concertId}
            className={`${styles.concertCard} ${selected.includes(concert.concertId) ? styles.selected : ''}`}
            title={concert.concertName}
            dateRange={`${concert.sessions[0]?.startTime.split('T')[0] || ''} ~ ${concert.sessions[concert.sessions.length - 1]?.startTime.split('T')[0] || ''}`}
            posterUrl={concert.photoUrl}
            onClick={() => handleConcertSelect(concert.concertId)}
            isSelected={selected.includes(concert.concertId)}
            onSeatInfoClick={() => handleSeatInfoClick(concert.concertId)}
            isNotified={selectedDatesMap[concert.concertId]?.length > 0}
            onReselect={() => handleReselect(concert.concertId)}
          />
        ))}
        <div ref={loadMoreRef} className={styles.loadMore}>
          {isLoading && <div className={styles.loader}>로딩 중...</div>}
        </div>
      </div>
      {isDateModalOpen && (
        <DateSelectionModal
          isClosing={isClosing}
          selectedConcert={selectedConcertForDate}
          initialSelectedDates={
            selectedConcertForDate
              ? selectedDatesMap[selectedConcertForDate.concertId] || []
              : []
          }
          onClose={handleCloseModal}
          onConfirm={handleDateConfirm}
        />
      )}
      <div
        className={`${styles.buttonContainer} ${selected.length > 0 ? styles.visible : ''}`}
      >
        <Button
          children={'티켓팅 알림받기'}
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={selected.length === 0}
        />
      </div>
      {isConfirmModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmDeselect}
          onCancel={handleCancelDeselect}
        />
      )}
    </>
  );
}
