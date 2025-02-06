interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const TextArea = ({
  value,
  onChange,
  error,
  label,
  placeholder = '',
  className = '',
  minHeight = 'min-h-[120px]',
}: TextAreaProps) => (
  <div className={className}>
    {label && <label className="mb-1 block text-sm">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg bg-gray-100 p-3 ${minHeight} resize-none`}
    />
    {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
  </div>
);
