import ScrapMode from '@/components/features/sight/ScrapMode';
import { SeatList } from '@/components/features/sight/SeatList';

export default function Sight() {
  return (
    <div className="pt-16">
      {/* 헤더 높이만큼 상단 여백 추가 */}
      <div className="container mx-auto flex min-h-screen justify-center">
        <ScrapMode />
      </div>
    </div>
  );
}
