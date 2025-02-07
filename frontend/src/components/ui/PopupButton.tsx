import React from 'react';

interface PopupButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function PopupButton({ children, onClick }: PopupButtonProps) {
  return (
    <button onClick={onClick} className="text-center text-primary-main">
      {children}
    </button>
  );
}
