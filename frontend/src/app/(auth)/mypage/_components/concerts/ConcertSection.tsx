'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import IconBox from '@/components/common/IconBox/IconBox';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import styles from './ConcertSection.module.scss';
import { ConcertInfo } from '@/types/mypage';
import { deleteConcert, getMyConcerts } from '@/api/mypage/mypage';

export default function ConcertSection() {
  const [concerts, setConcerts] = useState<ConcertInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditConcert = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteConcert = async (concertId: number) => {
    try {
      await deleteConcert(concertId);
      setConcerts(
        concerts.filter((concert) => concert.concertId !== concertId)
      );
    } catch (error) {
      console.error('콘서트 삭제 실패:', error);
    }
  };

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        const response = await getMyConcerts();
        setConcerts(response?.concerts || []);
      } catch (error) {
        console.error('콘서트 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <IconBox name='calendar' size={24} color='#4986e8' />
            <h2 className={styles.title}>예정된 콘서트</h2>
          </div>
        </div>
        <div>로딩 중...</div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name='calendar' size={24} color='#4986e8' />
          <h2 className={styles.title}>예정된 콘서트</h2>
        </div>
        <div className={styles.viewAll} onClick={handleEditConcert}>
          {isEditing ? '완료' : '편집'}
        </div>
      </div>

      {concerts.length > 0 ? (
        <div className={styles.scrollContainer}>
          <div className={styles.concertList}>
            {concerts.map((concert) => (
              <div key={concert.concertId} className={styles.concertCard}>
                {isEditing && (
                  <div
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConcert(concert.concertId);
                    }}
                  >
                    X
                  </div>
                )}
                <ConcertCard
                  title={concert.concertName}
                  // dateRange={`${concert.sessions[0].startTime.split('T')[0]} ~ ${concert.sessions[concert.sessions.length - 1].startTime.split('T')[0]}`}
                  dateRange={`${concert.arenaName}`}
                  posterUrl={concert.photoUrl}
                  onClick={() => {}}
                  width={140}
                />
              </div>
            ))}
            <Link href='/concerts/all' className={styles.addConcertItem}>
              <div className={styles.addConcertContainer}>
                <IconBox name='add' size={30} color='#666' />
              </div>
              <p className={styles.addText}></p>
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>예정된 콘서트가 없습니다</p>
          <Link href='/concerts/all' className={styles.addButton}>
            콘서트 찾아보기
          </Link>
        </div>
      )}
    </section>
  );
}
