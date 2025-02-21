import { ToggleButton } from './ToggleButton';

interface ToggleButtonGroupProps<T extends string> {
  options: T[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
}

export const ToggleButtonGroup = <T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ToggleButtonGroupProps<T>) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <ToggleButton
          key={option}
          label={option}
          selected={option === value}
          onClick={() => onChange?.(option)}
        />
      ))}
    </div>
  );
};
