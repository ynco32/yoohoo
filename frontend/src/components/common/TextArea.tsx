interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  rows?: number; // ✅ 줄 수 설정
}

export const TextArea = ({
  value,
  onChange,
  error,
  placeholder = '',
  className = '',
  rows = 4,
}: TextAreaProps) => (
  <div className={className}>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`text-m w-full resize-none rounded-lg border p-3`}
    />
    {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
  </div>
);
