'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import { AxiosError } from 'axios';
import {
  TicketIcon,
  HomeIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/components/common/SuccessModal';
import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';

export default function Result() {
  const [section, setSection] = useState('');
  const [seat, setSeat] = useState('');
  const [ticketRank, setTicketRank] = useState<number | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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
    <div className="relative h-full min-h-screen w-full overflow-hidden">
      {/* 래디얼 그라데이션 배경 */}
      <div className="absolute left-1/2 top-10 h-[804px] w-[804px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(219,238,253,1)_0%,rgba(255,255,255,1)_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center p-4">
        <SuccessModal
          isOpen={isSuccessModalOpen}
          message="티켓팅 결과 저장 성공!"
          secondMessage="마이페이지에서 확인하세요!"
          onClose={() => setIsSuccessModalOpen(false)}
        />

        <div className="w-full px-4">
          <div className="w-full rounded-3xl bg-transparent">
            <div className="text-center">
              <h2 className="mb-8 text-center text-2xl font-bold text-[#4986E8]">
                티켓팅 성공!
              </h2>

              <div className="mb-8 flex justify-center">
                <Image
                  src={SVGIcons.TicketingConKiri}
                  alt="티켓팅성공끼리"
                  width={240}
                  height={240}
                  className="max-w-full h-auto scale-x-[-1]"
                  style={{ filter: 'none' }}
                />
              </div>
            </div>

            <div className="mb-12">
              <p className="mb-4 text-center text-xl font-bold text-[#515151]">
                {section} 구역 {seat || '선택된 좌석 없음'}
              </p>
              <div className="mb-12 space-y-1 text-center">
                <p className="text-lg font-medium text-[#515151]">
                  {seatResult.emoji} {seatResult.message}
                </p>
                <p className="text-sm text-[#949494]">
                  {seatResult.description}
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-5 w-5 text-[#4986E8]" />
                  <span className="text-lg text-[#515151]">
                    <span className="font-bold text-[#4986E8]">
                      {ticketRank}
                    </span>
                    번째로 티켓팅 성공
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-lg text-[#515151]">
                    소요 시간{' '}
                    <span className="font-bold text-[#4986E8]">
                      {processingTime}
                    </span>
                    초
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-1">
              <button
                onClick={handleSaveData}
                className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-white px-2 py-3 text-[#515151] shadow-[3px_3px_20px_0px_rgba(106,160,205,0.25)] transition-all hover:shadow-[3px_3px_25px_0px_rgba(106,160,205,0.35)]"
              >
                <BookmarkIcon className="h-5 w-5 fill-[#4986E8] text-[#4986E8]" />
                <span className="text-sm">기록 저장</span>
              </button>

              <button
                onClick={() => {
                  // document.cookie = 'ticketing-progress=6; path=/';
                  router.push('/ticketing');
                }}
                className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-white px-2 py-3 text-[#515151] shadow-[3px_3px_20px_0px_rgba(106,160,205,0.25)] transition-all hover:shadow-[3px_3px_25px_0px_rgba(106,160,205,0.35)]"
              >
                <HomeIcon className="h-5 w-5 fill-[#4986E8] text-[#4986E8]" />
                <span className="text-sm">홈으로</span>
              </button>

              <button
                onClick={() => router.push('/mypage/ticketing')}
                className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-white px-2 py-3 text-[#515151] shadow-[3px_3px_20px_0px_rgba(106,160,205,0.25)] transition-all hover:shadow-[3px_3px_25px_0px_rgba(106,160,205,0.35)]"
              >
                <UserIcon className="h-5 w-5 fill-[#4986E8] text-[#4986E8]" />
                <span className="text-sm">내 기록</span>
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-[#949494]">
              예매 상세 내역은 마이페이지에서 확인하실 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
