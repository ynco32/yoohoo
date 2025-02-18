import React from 'react';

type SeatGridProps = {
  seats: Array<{
    id: number;
    isActive: boolean;
    isSelected: boolean;
  }>;
  onSeatClick: (id: number) => void;
  disabled: boolean;
  showAll: boolean; // 모든 좌석을 보라색으로 표시할지 여부
};

const SeatGrid = ({ seats, onSeatClick, disabled, showAll }: SeatGridProps) => {
  return (
    <div className="max-w-3xl mx-auto w-full p-4">
      <div className="aspect-[4/3] w-full">
        <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(30,minmax(0,1fr))] gap-0.5">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => onSeatClick(seat.id)}
              disabled={disabled}
              className={`aspect-square w-full ${showAll ? 'bg-purple-500' : seat.isActive ? 'bg-purple-500' : 'bg-gray-300'} ${seat.isSelected ? 'ring-2 ring-black' : ''} transition-all duration-150 hover:opacity-80 disabled:cursor-not-allowed`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
