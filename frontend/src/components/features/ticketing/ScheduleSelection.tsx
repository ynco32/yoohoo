// components/features/ticketing/ScheduleSelection.tsx
import SchedulePopup from '@/components/ui/SchedulePopup';

interface ScheduleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleSelect: () => void;
}

export function ScheduleSelection({
  isOpen,
  onClose,
  onScheduleSelect,
}: ScheduleSelectionProps) {
  return (
    <SchedulePopup
      isOpen={isOpen}
      onClose={onClose}
      title="공연 회차를 고르세요."
      width="md"
    >
      <div className="space-y-2">
        <button
          onClick={onScheduleSelect}
          className="w-full rounded-lg bg-white px-4 py-3 text-left hover:bg-gray-50"
        >
          2024.2.21(토) 20시 00분
        </button>
        <button
          onClick={onScheduleSelect}
          className="w-full rounded-lg bg-white px-4 py-3 text-left hover:bg-gray-50"
        >
          2024.2.22(일) 18시 00분
        </button>
      </div>
    </SchedulePopup>
  );
}
