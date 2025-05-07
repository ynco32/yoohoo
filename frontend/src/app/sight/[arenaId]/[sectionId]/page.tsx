// app/sight/[arenaId]/[sectionId]/page.tsx
'use client';
import { Suspense, useState, useEffect } from 'react';
import styles from './page.module.scss';
import TagButton from '@/components/common/TagButton/TagButton';
import { useRouter } from 'next/navigation';

interface SectionPageProps {
  params: { arenaId: string; sectionId: string };
}

export default function SectionPage({ params }: SectionPageProps) {
  const router = useRouter();
  const [arenaId, setArenaId] = useState<string>('');
  const [sectionId, setSectionId] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // params를 비동기적으로 처리하기 위한 useEffect 사용
  useEffect(() => {
    // 컴포넌트 마운트 시 params 값을 상태로 설정
    setArenaId(params.arenaId);
    setSectionId(params.sectionId);
  }, [params]);

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
      // 리뷰 바텀시트 열기
      router.push(
        `/seats/${seatId}/reviews?arenaId=${arenaId}&sectionId=${sectionId}`,
        { scroll: false }
      );
    }
  };

  const handleShowAllReviews = () => {
    // 전체 리뷰 바텀시트 열기
    router.push(
      `/seats/all/reviews?arenaId=${arenaId}&sectionId=${sectionId}`,
      { scroll: false }
    );
  };

  const handleResetSelection = () => {
    setSelectedSeats([]);
  };

  // params 값이 로드되기 전에는 로딩 상태를 표시
  if (!arenaId || !sectionId) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.seatMap}>
        <Suspense fallback={<div>좌석표 로딩 중...</div>}>
          {/* <SeatMap
            arenaId={arenaId}
            sectionId={sectionId}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          /> */}
        </Suspense>
      </div>

      <div className={styles.buttons}>
        <TagButton
          type='active'
          iconName='check-box'
          onClick={handleShowAllReviews}
        >
          전체 좌석 리뷰 보기
        </TagButton>
        <TagButton type='default' onClick={handleResetSelection}>
          초기화
        </TagButton>
      </div>
    </div>
  );
}
