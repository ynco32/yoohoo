export const TitleInput = ({ value, onChange, error }: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }) => (
    <div>
      <label className="block text-sm mb-1">제목</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="나눔할 물건을 입력해주세요"
        className="w-full rounded-lg bg-gray-100 p-3"
      />
      {error && (
        <p className="text-sm text-status-warning mt-1">{error}</p>
      )}
    </div>
  );