import { SharingFormData } from '@/types/sharing';

interface SharingWriteFormProps {
  location: { latitude: number; longitude: number };
  onSubmitComplete: () => void;
  formData: SharingFormData;
  onFormChange: (data: SharingFormData) => void;
  onLocationReset: () => void; // 위치 다시 선택하기 위한 콜백
  concertId: number;
}

export const SharingWriteForm = ({
  location,
  formData,
  onFormChange,
  onSubmitComplete,
  onLocationReset,
}: SharingWriteFormProps) => {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
          placeholder="나눔할 물건을 입력해주세요"
          className="w-full rounded-lg border p-3"
        />
        <input
          type="time"
          value={formData.startTime}
          onChange={(e) =>
            onFormChange({ ...formData, startTime: e.target.value })
          }
          className="w-full rounded-lg border p-3"
        />
        <textarea
          value={formData.content}
          onChange={(e) =>
            onFormChange({ ...formData, content: e.target.value })
          }
          placeholder="상세 내용을 입력해주세요"
          className="h-32 w-full rounded-lg border p-3"
        />
      </div>
      {/* 버튼 그룹 */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onLocationReset}
          className="w-full rounded-lg border border-primary-main py-4 text-primary-main"
        >
          위치 다시 선택하기
        </button>
        <button
          className="w-full rounded-lg bg-primary-main py-4 text-white"
          onClick={onSubmitComplete}
        >
          나눔 등록하기
        </button>
      </div>
    </div>
  );
};
