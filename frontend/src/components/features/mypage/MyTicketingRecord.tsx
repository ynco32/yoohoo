import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface TicketingRecordProps {
  date: string;
  section: string;
  seat: string;
  isLast?: boolean;
}

const TicketingRecord = ({
  date,
  section,
  seat,
  isLast,
}: TicketingRecordProps) => {
  const formattedDate = new Date(date)
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/\. /g, '-')
    .replace('.', '');

  return (
    <div className="relative">
      <div className="flex items-center py-4">
        <div className="w-32 text-sm text-gray-500">{formattedDate}</div>
        <div className="flex flex-1 items-center">
          <div className="relative">
            <StarIcon className="mr-2 h-4 w-4 text-[#4986e8]" />
            {!isLast && (
              <div className="absolute left-[0.47rem] top-5 h-12 w-px bg-gray-200" />
            )}
          </div>
          <span className="mr-1 text-gray-500">구역 </span>
          <span className="mx-1 mr-1 text-[#4986e8]">{section}구역</span>
          <span className="mr-1 text-gray-500">좌석 </span>
          <span className="text-[#4986e8]">{seat} </span>
        </div>
      </div>
    </div>
  );
};

export default TicketingRecord;
