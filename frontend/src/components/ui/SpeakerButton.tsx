import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function SpeakerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded border p-2 hover:bg-gray-500"
      type="button"
    >
      <SpeakerWaveIcon className="h-5 w-5" />
    </button>
  );
}
