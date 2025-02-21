import React from 'react';

export const CongestionInfo = () => {
  return (
    <div className="md:right-4 absolute bottom-2 right-2 z-50 flex h-[200px] w-[80px] items-center justify-center rounded-xl bg-white bg-opacity-60 p-3 shadow-lg">
      <div className="flex h-full w-full flex-col items-center">
        <div className="flex h-1/4 w-full items-center">
          <div
            className="h-full w-3 rounded-t-full bg-congestion-customRed"
            style={{ flex: 'none' }}
          />
          <span className="ml-2 text-xs">매우 혼잡</span>
        </div>
        <div className="flex h-1/4 w-full items-center">
          <div
            className="h-full w-3 bg-congestion-customOrange"
            style={{ flex: 'none' }}
          />
          <span className="ml-2 text-xs">혼잡</span>
        </div>
        <div className="flex h-1/4 w-full items-center">
          <div
            className="h-full w-3 bg-congestion-customYellow"
            style={{ flex: 'none' }}
          />
          <span className="ml-2 text-xs">보통</span>
        </div>
        <div className="flex h-1/4 w-full items-center">
          <div
            className="h-full w-3 rounded-b-full bg-congestion-customGreen"
            style={{ flex: 'none' }}
          />
          <span className="ml-2 text-xs">여유</span>
        </div>
      </div>
    </div>
  );
};
