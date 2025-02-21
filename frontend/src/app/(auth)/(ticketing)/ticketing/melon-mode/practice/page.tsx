import PracticeMenu from '@/components/features/ticketing/PracticeMenu';

export default function Practice() {
  return (
    <div className="flex h-full flex-col bg-ticketing-bg">
      <div className="flex items-center justify-center px-4 pt-40">
        <span className="text-title-bold text-text-menu">
          연습 유형을 선택하세요
        </span>
      </div>
      <div className="mt-8 flex justify-center">
        <PracticeMenu />
      </div>
    </div>
  );
}
