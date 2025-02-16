import {} from '@heroicons/react/24/outline';

export const DataError = () => {
  return (
    <div className="relative flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden rounded-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mb-20 size-20 text-status-info"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <h2 className="text-2xl font-bold text-status-info">
        데이터를 불러올 수 없습니다
      </h2>
      <div className="absolute bottom-5 flex flex-col items-center justify-center">
        <div className="text-xs text-gray-500">같은 문제가 계속된다면</div>
        <div className="text-xs text-gray-500">
          관리자에게 문의 부탁드립니다
        </div>
      </div>
    </div>
  );
};
