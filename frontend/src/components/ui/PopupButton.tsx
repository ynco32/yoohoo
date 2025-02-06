import React from 'react';

interface PopupButtonProps {
  children: React.ReactNode;
}

export default function PopupButton({ children }: PopupButtonProps) {
  return (
    <button className="border-t text-center text-primary-main">
      {children}
    </button>
  );
}
