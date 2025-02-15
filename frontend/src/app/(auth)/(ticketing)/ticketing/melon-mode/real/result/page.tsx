'use client';
import React from 'react';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { FaceSmileIcon, TicketIcon } from '@heroicons/react/24/outline';

export default function Result() {
  const { selectedSeatNumber } = useTicketingSeatStore();

  // 좌석 열 번호에 따른 메시지와 이모지 결정
  const getSeatMessage = (seatNumber: string | null) => {
    if (!seatNumber) return { message: '좌석을 선택해주세요', emoji: '🤔' };

    // 예: "A1", "B5" 등의 형식에서 알파벳을 숫자로 변환 (A=1, B=2, ...)
    const row = seatNumber.charCodeAt(0) - 64; // A=1, B=2, ...

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

  const seatResult = getSeatMessage(selectedSeatNumber);

  return (
    <div className="flex h-full flex-col items-center p-4">
      {/* 상단 타이틀 */}
      <div className="mb-8 w-full text-center">
        <h1 className="text-xl font-semibold">티켓팅</h1>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        {/* 성공 아이콘 */}
        <div className="mb-4 flex justify-center">
          <FaceSmileIcon className="h-16 w-16 text-green-500" />
        </div>

        {/* 성공 메시지 */}
        <h2 className="mb-8 text-center text-2xl font-bold text-green-500">
          티켓팅 성공!
        </h2>

        {/* 좌석 정보 */}
        <div className="mb-8">
          <p className="mb-2 text-center text-gray-600">선택하신 좌석</p>
          <p className="mb-4 text-center text-xl font-bold">
            {selectedSeatNumber || '선택된 좌석 없음'}
          </p>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium">
              {seatResult.emoji} {seatResult.message}
            </p>
            <p className="text-sm text-gray-600">{seatResult.description}</p>
          </div>
        </div>

        {/* 티켓팅 순서 */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <TicketIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-900">
              <span className="font-bold text-blue-500">00</span>번째 티켓팅
              성공
            </span>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-center text-sm text-gray-500">
          예매 상세 내역은 마이페이지에서 확인하실 수 있습니다
        </p>
      </div>
    </div>
  );
}
