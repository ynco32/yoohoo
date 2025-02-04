/**
 * @component DraggableReviewSheet
 * @description 드래그 가능한 리뷰 시트를 제공하는 컴포넌트. 모바일에서 바텀시트처럼 동작하며
 * 상/중/하 3단계 위치로 드래그하여 조절할 수 있습니다.
 *
 * @features
 * - 드래그로 시트 위치 조절 (상단/중단/하단)
 * - 터치 제스처 지원
 * - 부드러운 애니메이션 효과
 * - 리뷰 카드 리스트 표시
 *
 * @props
 * @prop {boolean} isOpen - 시트가 열려있는지 여부
 * @prop {function} onClose - 시트를 닫을 때 호출되는 콜백 함수
 * @prop {SightReviewData[]} reviewDataList - 표시할 리뷰 데이터 배열
 *
 * @states
 * @state {string} position - 현재 시트 위치 ('closed' | 'half' | 'full')
 * @state {number | null} dragStart - 드래그 시작 위치
 * @state {number} currentTranslate - 현재 Y축 변환값 (0-100%)
 *
 * @example
 * ```jsx
 * <DraggableReviewSheet
 *   isOpen={isSheetOpen}
 *   onClose={() => setIsSheetOpen(false)}
 *   reviewDataList={reviews}
 * />
 * ```
 *
 * @notes
 * - 모바일 환경에 최적화되어 있음
 * - 드래그 위치에 따라 자동으로 가까운 위치로 스냅됨
 * - 90vh 높이로 스크롤 가능한 컨텐츠 영역 제공
 *
 * @dependencies
 * - React
 * - @/types/sightReviews
 * - ./SightReviewCard
 */
import React, { useState, useEffect, useRef } from 'react';
import { SightReviewCard } from './SightReviewCard';
import type { SightReviewData } from '@/types/sightReviews';

// 드래그 가능한 리뷰 시트의 Props 인터페이스 정의
interface DraggableReviewSheetProps {
  isOpen: boolean; // 시트가 열려있는지 여부
  onClose: () => void; // 시트를 닫을 때 호출되는 함수
  reviewDataList: SightReviewData[]; // 리뷰 데이터 배열
}

export const DraggableReviewSheet = ({
  isOpen,
  onClose,
  reviewDataList,
}: DraggableReviewSheetProps) => {
  // 시트의 위치 상태 관리 (closed, half, full)
  const [position, setPosition] = useState('closed');
  // 드래그 시작 위치 저장
  const [dragStart, setDragStart] = useState<number | null>(null);
  // 현재 시트의 Y축 변환값 (0-100%)
  const [currentTranslate, setCurrentTranslate] = useState(100);
  // 시트 요소에 대한 ref
  const sheetRef = useRef<HTMLDivElement>(null);

  // 터치 시작 시 호출되는 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  };

  // 터치 이동 시 호출되는 핸들러
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;

    const currentPosition = e.touches[0].clientY;
    const diff = currentPosition - dragStart;

    // 윈도우 높이를 기준으로 이동 거리를 퍼센트로 변환
    const windowHeight = window.innerHeight;
    const percentage = (diff / windowHeight) * 100;

    // 새로운 변환값 계산 (0-100% 범위 내로 제한)
    let newTranslate = currentTranslate + percentage;
    newTranslate = Math.max(0, Math.min(100, newTranslate));

    setCurrentTranslate(newTranslate);
  };

  // 터치 종료 시 호출되는 핸들러
  const handleTouchEnd = () => {
    setDragStart(null);

    // 시트 위치 결정 (상단/중간/하단)
    if (currentTranslate < 25) {
      setPosition('full'); // 완전히 열린 상태
      setCurrentTranslate(0);
    } else if (currentTranslate < 75) {
      setPosition('half'); // 반만 열린 상태
      setCurrentTranslate(50);
    } else {
      setPosition('closed'); // 닫힌 상태
      setCurrentTranslate(100);
      onClose();
    }
  };

  // isOpen prop이 변경될 때 시트 위치 조정
  useEffect(() => {
    if (isOpen) {
      setPosition('half');
      setCurrentTranslate(50);
    } else {
      setPosition('closed');
      setCurrentTranslate(100);
    }
  }, [isOpen]);

  // 시트가 닫혀있을 때는 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 시트 컨테이너
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center">
      <div className="relative h-full w-full max-w-md">
        {/* 드래그 가능한 시트 */}
        <div
          className="pointer-events-auto absolute bottom-0 w-full transform transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${currentTranslate}%)`,
            touchAction: 'none', // 기본 터치 동작 비활성화
          }}
          ref={sheetRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full rounded-t-xl bg-white shadow-lg">
            {/* 드래그 핸들 (상단 바) */}
            <div className="absolute -top-4 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-300" />

            {/* 리뷰 카드 컨테이너 */}
            <div className="h-[90vh] overflow-y-auto">
              <div className="space-y-4 p-4">
                {/* 리뷰 데이터를 순회하며 카드 컴포넌트 렌더링 */}
                {reviewDataList.map((reviewData, index) => (
                  <SightReviewCard key={index} {...reviewData} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableReviewSheet;
