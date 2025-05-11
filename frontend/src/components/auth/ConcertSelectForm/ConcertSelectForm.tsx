import React, { useState, useEffect } from 'react';
import styles from './ConcertSelectForm.module.scss';
import Button from '@/components/common/Button/Button';

interface ConcertSelectFormProps {
  onConfirm: (selectedDates: string[]) => void;
  initialSelectedDates?: string[];
}

const ConcertSelectForm: React.FC<ConcertSelectFormProps> = ({
  onConfirm,
  initialSelectedDates = [],
}) => {
  const [selectedDates, setSelectedDates] =
    useState<string[]>(initialSelectedDates);

  // 예시 날짜 데이터
  const dates = [
    '2024-03-20',
    '2024-03-21',
    '2024-03-22',
    '2024-03-23',
    '2024-03-24',
  ];

  // initialSelectedDates가 변경될 때 selectedDates 업데이트
  useEffect(() => {
    setSelectedDates(initialSelectedDates);
  }, [initialSelectedDates]);

  const handleDateChange = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleConfirm = () => {
    if (selectedDates.length > 0) {
      onConfirm(selectedDates);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>공연 날짜 선택</h2>
      <p className={styles.subtitle}>선택한 날짜의 현장 알림을 보내드려요!</p>
      <div className={styles.dateList}>
        {dates.map((date) => (
          <label key={date} className={styles.dateItem}>
            <input
              type='checkbox'
              name='concertDate'
              value={date}
              checked={selectedDates.includes(date)}
              onChange={() => handleDateChange(date)}
            />
            <span>{date}</span>
          </label>
        ))}
      </div>
      <Button
        children={'확인'}
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={selectedDates.length === 0}
      />
    </div>
  );
};

export default ConcertSelectForm;
