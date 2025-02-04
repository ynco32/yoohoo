// ui/TextInput.tsx
import React from 'react';

type TextInputBaseProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
};

type SingleLineInputProps = TextInputBaseProps & {
  multiline?: false;
  rows?: never;
};

type MultiLineInputProps = TextInputBaseProps & {
  multiline: true;
  rows?: number;
};

type TextInputProps = SingleLineInputProps | MultiLineInputProps;

export const TextInput = ({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  error,
  multiline = false,
  rows = 3,
}: TextInputProps) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(event.target.value);
  };

  const baseClassName = `
    w-full rounded-lg bg-primary-50 p-4 text-sm
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary-main
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    ${error ? 'ring-2 ring-status-warning' : ''}
    ${className}
  `;

  if (multiline) {
    return (
      <div className="space-y-1">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${baseClassName} min-h-[100px] resize-none`}
        />
        {error && <p className="text-sm text-status-warning">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClassName}
      />
      {error && <p className="text-sm text-status-warning">{error}</p>}
    </div>
  );
};
