export const ContentInput = ({ value, onChange, error }: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }) => (
    <div>
      <label className="block text-sm mb-1">상세 내용</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상세 내용을 입력해주세요"
        className="w-full rounded-lg bg-gray-100 p-3 min-h-[120px] resize-none"
      />
      {error && (
        <p className="text-sm text-status-warning mt-1">{error}</p>
      )}
    </div>
  );