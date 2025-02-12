import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SharingStatus, STATUS_INFO } from '@/types/sharing';

interface StatusDropdownProps {
  currentStatus: SharingStatus;
  onStatusChange: (status: SharingStatus) => void;
  isAuthor: boolean;
}

export const StatusDropdown = ({
  currentStatus,
  onStatusChange,
  isAuthor,
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusClick = (status: SharingStatus) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => isAuthor && setIsOpen(!isOpen)}
        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white ${
          STATUS_INFO[currentStatus].color
        } ${isAuthor ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
        disabled={!isAuthor}
      >
        <span>{STATUS_INFO[currentStatus].text}</span>
        {isAuthor && <ChevronDownIcon className="h-3 w-3" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-20 min-w-[100px] rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {Object.entries(STATUS_INFO).map(([status, info]) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status as SharingStatus)}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${currentStatus === status ? 'bg-gray-50 font-medium' : ''}`}
            >
              {info.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
