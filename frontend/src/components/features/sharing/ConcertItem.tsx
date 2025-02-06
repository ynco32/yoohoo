/**
 * 공연 정보를 표시하는 카드 컴포넌트
 * @description ContentCard를 기반으로 공연 제목, 장소, 날짜, 포스터를 표시
 */
import { ContentCard } from '../../ui/ContentCard';
import Link from 'next/link';

interface ConcertItemProps {
  concertId: number;
  concertName: string;
  artist: string;
  startTime: string;
  stageType: string;
  arena: string;
}
export const ConcertItem = ({
  concertId,
  concertName,
  artist,
  startTime,
  arena,
}: ConcertItemProps) => {
  // 이미지와 겹치지 않는 최대 텍스트 길이 계산
  const maxWidth = 380;
  const fontSize = 16;
  const charsToFit = Math.floor(maxWidth / (fontSize * 0.6));

  // 최대 길이를 초과하는 경우 말줄임표(...) 처리
  const truncatedTitle =
    concertName.length > charsToFit
      ? concertName.slice(0, charsToFit - 3) + '...'
      : concertName;

  return (
    <Link href={`/sharing/${concertId}`} className="block">
      <ContentCard>
        {/* 왼쪽: 공연 정보 */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{truncatedTitle}</h3>
          <p className="text-sm text-gray-600">{artist}</p>
          <p className="mt-2 text-sm text-gray-500">{startTime}</p>
          <p className="text-sm text-gray-500">{arena}</p>
        </div>
      </ContentCard>
    </Link>
  );
};
