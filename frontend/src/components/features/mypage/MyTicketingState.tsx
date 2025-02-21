// [React] 통계 섹션 컴포넌트
interface StatsSectionProps {
  tries: number;
  rank: number;
  seconds: number;
}

const StatsSection = ({ tries, rank, seconds }: StatsSectionProps) => (
  <div className="mt-4 flex justify-between px-12 py-6">
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600">시도한 횟수</div>
      <div className="text-xl font-bold text-blue-500">{tries}회</div>
    </div>
    <div className="w-px bg-gray-200" />
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600">평균 티켓팅 순위</div>
      <div className="text-xl font-bold text-blue-500">{rank}위</div>
    </div>
    <div className="w-px bg-gray-200" />
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600">평균 시간</div>
      <div className="text-xl font-bold text-blue-500">{seconds}초</div>
    </div>
  </div>
);
export default StatsSection;
