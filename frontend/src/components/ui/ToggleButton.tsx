import React from 'react';

interface ToggleButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ToggleButton = ({
  label,
  selected = false,
  onClick,
  className = '',
}: ToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        selected
          ? 'bg-sight-form border border-sight-button text-black'
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
      } ${className}`}
    >
      {label}
    </button>
  );
};
