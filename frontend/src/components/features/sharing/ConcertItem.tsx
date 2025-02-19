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
    const calculateCharsToFit = () => {
      // 이미지 너비(64px) + gap(20px) 을 제외한 너비 계산
      const containerWidth = window.innerWidth - 84;
      const availableWidth = Math.min(containerWidth * 0.7, 260); // 최대 260px로 제한
      const fontSize = 16; // text-base 기준 font-size
      const charWidth = fontSize * 0.6; // 대략적인 한 글자 너비

      setCharsToFit(Math.floor(availableWidth / charWidth));
    };

    calculateCharsToFit();
    window.addEventListener('resize', calculateCharsToFit);
    return () => window.removeEventListener('resize', calculateCharsToFit);
  }, []);

  const truncateText = (text: string) => {
    // 한글 문자가 포함되어 있는지 확인
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

    // 영어 텍스트는 더 많은 글자 허용 (약 1.5배)
    const adjustedMaxLength = hasKorean
      ? charsToFit
      : Math.floor(charsToFit * 1.5);

    if (text.length > adjustedMaxLength) {
      return text.slice(0, adjustedMaxLength - 3) + '...';
    }
    return text;
  };

  // 날짜 포맷팅
  const formattedDateTime = formatDateTime(startTime);

  return (
    <Link href={`/sharing/${concertId}`} className="block">
      <ContentCard className="overflow-hidden rounded-xl border-none bg-white p-3 shadow-concert">
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
            <h3 className="truncate text-base font-bold">
              {truncateText(concertName)}
            </h3>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-base text-xs font-semibold">{artist}</p>
              <p className="text-base text-xs font-semibold">{arena}</p>
              <p className="text-xs text-gray-500">{formattedDateTime}</p>
            </div>
          </div>
        </div>
      </ContentCard>
    </Link>
  );
};
