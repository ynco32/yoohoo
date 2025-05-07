// app/sight/[arenaId]/[sectionId]/SectionPageClient.tsx
'use client';
import { Suspense, useState } from 'react';
import styles from './page.module.scss';
import TagButton from '@/components/common/TagButton/TagButton';
import { useRouter } from 'next/navigation';

// props로 직접 값을 받습니다 (params 객체를 통해 받지 않음)
interface SectionPageClientProps {
  arenaId: string;
  sectionId: string;
}

export default function SectionPageClient({
  arenaId,
  sectionId,
}: SectionPageClientProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

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
