import React from 'react';

interface FormSectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const FormSectionHeader = ({
  title,
  description,
  className = '',
}: FormSectionHeaderProps) => {
  return (
    <div className={`space-y-xs ${className}`}>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="text-caption2-bold text-sight-button">{description}</p>
      )}
    </div>
  );
};
