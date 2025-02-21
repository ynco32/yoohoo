'use client';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => (
  <button 
    className="p-sm text-gray-900" 
    onClick={onClick}
    aria-label="뒤로가기"
  >
    ←
  </button>
);