'use client';

import React from 'react';
import Link from 'next/link';
import IconBox from '@/components/common/IconBox/IconBox';
import ConcertCard from '@/components/common/ConcertCard/ConcertCard';
import { UserConcert } from '@/api/auth/user';
import styles from './ConcertSection.module.scss';

interface ConcertSectionProps {
  concerts: UserConcert[];
}

export default function ConcertSection({ concerts }: ConcertSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name='calendar' size={24} color='#4986e8' />
          <h2 className={styles.title}>예정된 콘서트</h2>
        </div>
        <Link href='/mypage/concerts' className={styles.viewAll}>
          전체보기
        </Link>
      </div>

      {concerts.length > 0 ? (
        <div className={styles.scrollContainer}>
          <div className={styles.concertList}>
            {concerts.map((concert) => (
              <ConcertCard
                key={concert.id}
                title={concert.title}
                dateRange={concert.dateRange}
                posterUrl={concert.posterUrl}
                onClick={() => {}}
                className={styles.concertCard}
                width={140}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>예정된 콘서트가 없습니다</p>
          <Link href='/concerts' className={styles.addButton}>
            콘서트 찾아보기
          </Link>
        </div>
      )}
    </section>
  );
}
