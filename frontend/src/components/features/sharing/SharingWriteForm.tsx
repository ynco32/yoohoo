interface SharingWriteFormProps {
  location: { latitude: number; longitude: number };
  onSubmitComplete: () => void;
  concertId: number;
}

export const SharingWriteForm = ({
  location,
  onSubmitComplete,
}: SharingWriteFormProps) => {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-4">
        <input
          type="text"
          placeholder="나눔할 물건을 입력해주세요"
          className="w-full rounded-lg border p-3"
        />
        <input type="time" className="w-full rounded-lg border p-3" />
        <input
          type="number"
          placeholder="나눔 수량"
          className="w-full rounded-lg border p-3"
        />
        <textarea
          placeholder="상세 내용을 입력해주세요"
          className="h-32 w-full rounded-lg border p-3"
        />
      </div>
      <button
        className="rounded-lg bg-primary-main py-4 text-white"
        onClick={onSubmitComplete}
      >
        나눔 등록하기
      </button>
    </div>
  );
};
