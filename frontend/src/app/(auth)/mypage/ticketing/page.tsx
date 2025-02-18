'use client';
import React, { useEffect, useState } from 'react';
import MyProfile from '@/components/features/mypage/MyProfile';
import StatsSection from '@/components/features/mypage/MyTicketingState';
import TicketingRecord from '@/components/features/mypage/MyTicketingRecord';
import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import EmptyState from '@/components/ui/EmptyState';

interface recordProps {
  section: string;
  seat: string;
  rank: number;
  processingTime: number;
  reserveTime: string;
}

const TicketingHistory = () => {
  const [records, setRecords] = useState<Array<recordProps>>([]);

  const getRecords = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/results`);
      setRecords(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('티켓팅 기록 못 가져옴', error);
      }
      // 더미 데이터
      // setRecords([
      //   {
      //     section: 'A',
      //     seat: '1-1',
      //     rank: 1,
      //     processingTime: 10,
      //     reserveTime: '2025-02-16T16:30:24',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      //   {
      //     section: 'B',
      //     seat: '2-3',
      //     rank: 5,
      //     processingTime: 25,
      //     reserveTime: '2025-02-15T14:20:15',
      //   },
      // ]);
    }
  };

  const getRank = () => {
    if (!records?.length) return 0;
    const sum = records.reduce((total, record) => total + record.rank, 0);
    return sum / records.length;
  };
  const rank = getRank();

  const getAverage = () => {
    if (!records?.length) return 0;
    const sum = records.reduce(
      (total, record) => total + record.processingTime,
      0
    );
    return sum / records.length;
  };
  const seconds = getAverage();
  const tries = records.length || 0;

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <div className="h-dvh bg-white">
      {/* 고정될 상단 영역 */}
      <div className="sticky top-0 z-10 bg-white">
        {/* 프로필 섹션 */}
        <MyProfile />

        {/* 통계 섹션 */}
        <StatsSection rank={rank} seconds={seconds} tries={tries} />
      </div>

      {/* 티켓팅 기록 리스트 */}
      <div className="mt-8 px-6">
        {records.length > 0 ? (
          records.map((record, index) => (
            <TicketingRecord
              key={index}
              date={record.reserveTime}
              section={record.section}
              seat={record.seat}
              isLast={index === records.length - 1}
            />
          ))
        ) : (
          <EmptyState message="티켓팅 기록이 없습니다." />
        )}
      </div>
    </div>
  );
};

export default TicketingHistory;
