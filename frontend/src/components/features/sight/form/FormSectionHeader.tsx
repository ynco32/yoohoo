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
    <div className={`space-y-1 ${className}`}>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};
