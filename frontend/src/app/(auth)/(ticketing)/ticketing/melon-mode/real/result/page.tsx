'use client';
import React from 'react';
// import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import {
  FaceSmileIcon,
  TicketIcon,
  HomeIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/components/common/SuccessModal';

export default function Result() {
  const [section, setSection] = useState('');
  const [seat, setSeat] = useState('');
  const [ticketRank, setTicketRank] = useState<number | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // const { selectedSeatNumber } = useTicketingSeatStore();
  const router = useRouter();

  const getSeatMessage = (seat: string | null) => {
    if (!seat) return { message: '좌석을 선택해주세요', emoji: '🤔' };

    const row = parseInt(seat.split('-')[0]);

    if (row <= 3) {
      return {
        message: '최고의 자리를 잡으셨네요!',
        emoji: '🎯',
        description: '공연을 가장 생생하게 즐기실 수 있을 거예요.',
      };
    } else if (row <= 6) {
      return {
        message: '괜찮은 자리예요!',
        emoji: '👍',
        description: '무대가 잘 보이는 자리입니다.',
      };
    } else {
      return {
        message: '같은 공간에서 함께할 수 있어요',
        emoji: '🤝',
        description: '공연장의 분위기를 한껏 느끼실 수 있어요.',
      };
    }
  };

  const seatResult = getSeatMessage(seat);

  const handleSaveData = () => {
    if (isSaved) return;
    saveData(section, seat);
    setIsSaved(true);
    setIsSuccessModalOpen(true);
  };

  const saveData = async (section: string, seat: string) => {
    try {
      const response = await api.post(`/api/v1/ticketing/result`, {
        section,
        seat,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || '티켓팅 결과 저장 실패'
        );
      }
    }
  };

  const getResult = async () => {
    try {
      const { data } = await api.get(`/api/v1/ticketing/result`);
      setSeat(data.seat);
      setSection(data.section);
      setTicketRank(data.ticketRank);
      setProcessingTime(data.processingTime);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || '티켓팅 결과 저장 실패'
        );
      }
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  return (
    <div className="flex h-full flex-col items-center p-4">
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message="티켓팅 결과 저장 성공! \n 마이페이지에서 확인하세요!"
        onClose={() => setIsSuccessModalOpen(false)}
        style={{ whiteSpace: 'pre-line' }}
      />
      <div className="mb-8 w-full text-center">
        <h1 className="text-xl font-semibold">티켓팅</h1>
      </div>

      <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex justify-center">
          <FaceSmileIcon className="h-16 w-16 text-green-500" />
        </div>

        <h2 className="mb-8 text-center text-2xl font-bold text-green-500">
          티켓팅 성공!
        </h2>

        <div className="mb-8">
          <p className="mb-2 text-center text-gray-600">선택하신 좌석</p>
          <p className="mb-4 text-center text-xl font-bold">
            {section} 구역
            {seat || '선택된 좌석 없음'}
          </p>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium">
              {seatResult.emoji} {seatResult.message}
            </p>
            <p className="text-sm text-gray-600">{seatResult.description}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <TicketIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-900">
              <span className="font-bold text-blue-500">{ticketRank}</span>
              번째로 티켓팅 성공
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-900">
            <span className="font-bold text-blue-500">{processingTime}</span>초
            걸렸습니다
          </span>
        </div>

        <p className="text-center text-sm text-gray-500">
          예매 상세 내역은 마이페이지에서 확인하실 수 있습니다
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => {
              handleSaveData();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-white transition-colors hover:bg-blue-600"
          >
            <BookmarkIcon className="h-5 w-5" />
            <span>기록 저장하기</span>
          </button>

          <button
            onClick={() => {
              document.cookie = 'ticketing-progress=6; path=/';
              router.push('/ticketing');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <HomeIcon className="h-5 w-5" />
            <span>홈으로 가기</span>
          </button>

          <button
            onClick={() => router.push('/mypage')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <UserIcon className="h-5 w-5" />
            <span>내 기록 보러가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
