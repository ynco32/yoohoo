'use client';

export const MenuToggleButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    className="p-sm text-gray-900" 
    onClick={onClick} 
    aria-label="메뉴 열기"
  >
    ≡
  </button>
);