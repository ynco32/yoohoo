/**
 * 공연 정보를 표시하는 카드 컴포넌트
 * @description ContentCard를 기반으로 공연 제목, 장소, 날짜, 포스터를 표시
 */
import { ContentCard } from '../../ui/ContentCard';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/dateFormat';
import Image from 'next/image';

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
  const maxWidth = 380;
  const fontSize = 16;
  const charsToFit = Math.floor(maxWidth / (fontSize * 0.6));

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
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={photoUrl}
              alt={concertName}
              className="object-cover"
              fill
              sizes="(max-width: 64px) 100vw"
            />
          </div>
          <div className="min-w-0 flex-1 p-2">
            <h3 className="truncate text-sm font-bold">{truncatedTitle}</h3>
            <div className="mt-0.5">
              <p className="text-xs text-gray-600">{artist}</p>
              <p className="text-xs text-gray-500">{arena}</p>
              <p className="text-xs text-gray-500">{formattedDateTime}</p>
            </div>
          </div>
        </div>
      </ContentCard>
    </Link>
  );
};
