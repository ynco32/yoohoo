'use client';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import Button from '@/components/common/Button/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';
import { DateSelectionModal } from '@/components/auth/DateSelectionModal/DateSelectionModal';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import styles from './ConcertContainer.module.scss';
import { useConcert } from '@/hooks/useConcert';
import { ConcertInfo } from '@/types/mypage';

export default function ConcertContainer() {
  const {
    concerts,
    selected,
    isLoading,
    search,
    loadMoreRef,
    selectedDatesMap,
    isDateModalOpen,
    selectedConcertForDate,
    isClosing,
    isConfirmModalOpen,
    handleSearchChange,
    handleConcertSelect,
    handleSeatInfoClick,
    handleCloseModal,
    handleDateConfirm,
    handleReselect,
    handleConfirmDeselect,
    handleCancelDeselect,
    handleSubmit,
  } = useConcert();

  return (
    <>
      <div className={styles.form}>
        <SearchBar
          initialValue={search}
          onSearch={handleSearchChange}
          placeholder='공연, 아티스트로 검색'
        />
      </div>
      <div className={styles.concertContainer}>
        {concerts.map((concert: ConcertInfo) => (
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
