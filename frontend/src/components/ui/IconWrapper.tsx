'use client';

interface IconWrapperProps {
  icon: string;
  label: string;
}

export const IconWrapper = ({ icon, label }: IconWrapperProps) => {
  return (
    <>
      <span className="mb-3 text-3xl" aria-label={label}>
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </>
  );
};
