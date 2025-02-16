/**
 * 공연 정보를 표시하는 카드 컴포넌트
 * @description ContentCard를 기반으로 공연 제목, 장소, 날짜, 포스터를 표시
 */
import { ContentCard } from '../../ui/ContentCard';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/dateFormat';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ConcertItemProps {
  concertId: number;
  concertName: string;
  artist: string;
  startTime: string;
  stageType: string;
  arena: string;
  photoUrl: string;
}
export const ConcertItem = ({
  concertId,
  concertName,
  artist,
  startTime,
  arena,
  photoUrl,
}: ConcertItemProps) => {
  // 이미지와 겹치지 않는 최대 텍스트 길이 계산
  const [charsToFit, setCharsToFit] = useState(0);

  useEffect(() => {
    // 화면 크기에 따른 텍스트 길이 계산 함수
    const calculateCharsToFit = () => {
      const fontSize = 16;
      // 모바일 화면에서는 더 작은 maxWidth 사용
      const maxWidth = window.innerWidth < 420 ? 210 : 260;
      setCharsToFit(Math.floor(maxWidth / (fontSize * 0.6)));
    };

    // 초기 계산
    calculateCharsToFit();

    // 화면 크기 변경 시 다시 계산
    window.addEventListener('resize', calculateCharsToFit);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', calculateCharsToFit);
  }, []);

  // 최대 길이를 초과하는 경우 말줄임표(...) 처리
  const truncatedTitle =
    concertName.length > charsToFit
      ? concertName.slice(0, charsToFit - 3) + '...'
      : concertName;

  // 날짜 포맷팅
  const formattedDateTime = formatDateTime(startTime);

  return (
    <Link href={`/sharing/${concertId}`} className="block">
      <ContentCard className="overflow-hidden rounded-xl p-0">
        <div className="flex items-center">
          <div className="relative -m-1 w-16 flex-shrink-0 overflow-hidden rounded-lg">
            <div style={{ paddingTop: '141.4%' }}>
              <Image
                src={photoUrl}
                alt={concertName}
                className="object-cover"
                fill
                sizes="(max-width: 80px) 100vw"
              />
            </div>
          </div>
          <div className="ml-5 min-w-0 flex-1">
            <h3 className="truncate text-base font-bold">{truncatedTitle}</h3>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-xs text-base font-semibold">{artist}</p>
              <p className="text-xs text-base font-semibold">{arena}</p>
              <p className="text-xs text-gray-500">{formattedDateTime}</p>
            </div>
          </div>
        </div>
      </ContentCard>
    </Link>
  );
};
