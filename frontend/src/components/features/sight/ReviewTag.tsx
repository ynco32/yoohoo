interface ReviewTagProps {
  label: string;
}

export const ReviewTag = ({ label }: ReviewTagProps) => (
  <span className="rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-700">
    {label}
  </span>
);
