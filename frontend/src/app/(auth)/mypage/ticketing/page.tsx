'use client';
import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import EmptyState from '@/components/ui/EmptyState';

import React, { useEffect, useState } from 'react';
import MyProfile from '@/components/features/mypage/MyProfile';
import StatsSection from '@/components/features/mypage/MyTicketingState';
import TicketingRecord from '@/components/features/mypage/MyTicketingRecord';

interface recordProps {
  section: string;
  seat: string;
  ticketRank: number;
  processingTime: number;
  reserveTime: string;
}

const TicketingHistory = () => {
  const [records, setRecords] = useState<Array<recordProps>>([]);

  const getRecords = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/results`);
      setRecords(data);
      console.log('All records:', records);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('티켓팅 기록 못 가져옴', error);
      }
    }
  };

  const getRank = () => {
    if (!records?.length) return 0;
    const sum = records.reduce((total, record) => total + record.ticketRank, 0);
    return Number((sum / records.length).toFixed(1));
  };

  const getAverage = () => {
    if (!records?.length) return 0;
    const sum = records.reduce(
      (total, record) => total + record.processingTime,
      0
    );
    return Number((sum / records.length).toFixed(2));
  };

  const rank = getRank();
  const seconds = getAverage();
  const tries = records.length || 0;

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <div className="flex h-dvh flex-col items-center bg-white">
      <div className="sticky top-0 z-10 w-full bg-white">
        <MyProfile />
        <StatsSection rank={rank} seconds={seconds} tries={tries} />
      </div>

      <div className="mt-2 w-full px-6">
        <div className="flex flex-col items-center">
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
    </div>
  );
};

export default TicketingHistory;
