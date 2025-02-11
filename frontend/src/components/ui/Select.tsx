// [React] components/ui/Select.tsx
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder,
}: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-md border p-2"
  >
    <option value="">{placeholder}</option>
    {options.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);
