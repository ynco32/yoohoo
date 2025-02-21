import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ArrowPathButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded border p-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
    >
      <ArrowPathIcon className="h-5 w-5" />
    </button>
  );
}
