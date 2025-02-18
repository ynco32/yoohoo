import Mode from '@/components/features/ticketing/ModeButtons';

export default function ModeSelect() {
  return (
    <div className="flex h-full flex-col bg-ticketing-bg">
      <div className="flex items-center justify-center px-4 pt-40">
        <span className="text-title-bold text-text-menu">
          모드를 선택해주세요
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Mode />
      </div>
    </div>
  );
}
