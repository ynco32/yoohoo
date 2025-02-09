// components/features/ticketing/TicketInfo.tsx
export const TicketInfo = () => (
  <div className="bg-white px-4 py-3 text-sm">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-gray-600">날짜</span>
      <div className="flex items-center">
        <span>2025년 2월 22일(토) 18시00분</span>
        <button className="ml-2 rounded-full border px-3 py-1 text-xs">
          날짜변경
        </button>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-gray-600">좌석</span>
      <span>전체 H 열 120 번</span>
    </div>
  </div>
);
