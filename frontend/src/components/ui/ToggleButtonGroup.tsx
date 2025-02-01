import { ToggleButton } from './ToggleButton';

interface ToggleButtonGroupProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const ToggleButtonGroup = ({
  options,
  value,
  onChange,
  className = '',
}: ToggleButtonGroupProps) => {
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
