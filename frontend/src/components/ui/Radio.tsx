// [React] components/ui/Radio.tsx
interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}

export const Radio = ({
  name,
  value,
  checked,
  onChange,
  label,
}: RadioProps) => (
  <label className="flex items-center gap-2">
    <div className="relative">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5"
      />
    </div>
    <span>{label}</span>
  </label>
);
