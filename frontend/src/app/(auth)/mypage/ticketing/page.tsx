'use client';
import MyProfile from '@/components/features/mypage/MyProfile';
import StatsSection from '@/components/features/mypage/MyTicketingState';
import TicketingRecord from '@/components/features/mypage/MyTicketingRecord';
import api from '@/lib/api/axios';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

interface recordProps {
  section: string;
  seat: string;
  rank: number;
  processingTime: number;
  reserveTime: string;
}

// [React] 메인 컴포넌트
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
    <div className="min-h-screen bg-white">
      {/* 프로필 섹션 */}
      {/* <ProfileSection /> */}
      <MyProfile />

      {/* 통계 섹션 */}
      <StatsSection rank={rank} seconds={seconds} tries={tries} />

      {/* 티켓팅 기록 리스트 */}
      <div className="mt-8 px-6">
        {records.map((record, index) => (
          <TicketingRecord
            key={index}
            date={record.reserveTime}
            section={record.section}
            seat={record.seat}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketingHistory;
